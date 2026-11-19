import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";
import {
  createServerRegistration,
  listServerRegistrations,
  updateServerRegistrationStatus,
  type CreateRegistrationPayload,
  type PaymentStatus,
} from "./lib/server-registration-store";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

async function handleRegistrationsApi(request: Request): Promise<Response | null> {
  const url = new URL(request.url);
  const { pathname } = url;

  if (pathname === "/api/registrations") {
    if (request.method === "GET") {
      const records = await listServerRegistrations();
      return jsonResponse({ records });
    }

    if (request.method === "POST") {
      try {
        const body = (await request.json()) as Partial<CreateRegistrationPayload>;
        const record = await createServerRegistration({
          fullName: String(body.fullName ?? ""),
          mobileNumber: String(body.mobileNumber ?? ""),
          city: String(body.city ?? ""),
          screenshotDataUrl: String(body.screenshotDataUrl ?? ""),
          screenshotFileName: String(body.screenshotFileName ?? ""),
          screenshotSizeLabel: String(body.screenshotSizeLabel ?? ""),
        });
        return jsonResponse({ record }, 201);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Could not record registration. Please retry.";
        return jsonResponse({ error: message }, 400);
      }
    }

    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  const patchMatch = pathname.match(/^\/api\/registrations\/([^/]+)$/);
  const rawId = patchMatch?.[1];
  if (rawId && request.method === "PATCH") {
    try {
      const id = decodeURIComponent(rawId);
      const body = (await request.json()) as { paymentStatus?: PaymentStatus };
      const updated = await updateServerRegistrationStatus(id, body.paymentStatus as PaymentStatus);
      if (!updated) {
        return jsonResponse({ error: "Registration not found." }, 404);
      }
      return jsonResponse({ record: updated });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update payment status.";
      return jsonResponse({ error: message }, 400);
    }
  }

  return null;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const apiResponse = await handleRegistrationsApi(request);
      if (apiResponse) {
        return apiResponse;
      }

      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
