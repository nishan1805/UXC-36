import { AlertCircle, Check, Copy, QrCode } from "lucide-react";
import { useState } from "react";
import { EVENT_CONFIG } from "@/lib/event-config";

export function UpiPaymentSection() {
  const { upcomingEvent, payment } = EVENT_CONFIG;
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">("idle");

  async function handleCopyUpiId() {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(payment.upiId);
        setCopyStatus("copied");
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = payment.upiId;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        const ok = document.execCommand("copy");
        document.body.removeChild(textarea);
        setCopyStatus(ok ? "copied" : "error");
      }
    } catch {
      setCopyStatus("error");
    }

    window.setTimeout(() => {
      setCopyStatus("idle");
    }, 3200);
  }

  return (
    <div className="pop-card-static bg-cream p-6 sm:p-8">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border-[3px] border-ink bg-primary font-display text-sm text-ink shadow-[2px_2px_0_var(--ink)]">
          02
        </span>
        <div>
          <h2 className="font-display text-2xl text-ink sm:text-3xl">Secure your spot.</h2>
          <p className="mt-0.5 text-sm font-semibold text-muted-foreground sm:text-base">
            Registration fee:{" "}
            <strong className="text-ink">{upcomingEvent.registrationFeeFormatted}.</strong>
          </p>
        </div>
      </div>

      {/* Placeholder warning banner if live QR/UPI ID not yet configured */}
      {(payment.qrIsPlaceholder || payment.upiIdIsPlaceholder) && (
        <div className="mt-5 flex items-start gap-3 rounded-sm border-2 border-ink bg-sand px-4 py-3 text-sm font-bold text-ink">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
          <p>
            Placeholder Payment Details: Official UPI QR and UPI ID are not yet supplied. Do not
            transfer funds yet — replace both values in{" "}
            <code className="rounded-sm border border-ink/30 bg-cream px-1.5 py-0.5 font-mono text-xs">
              src/lib/event-config.ts
            </code>{" "}
            before opening live registrations.
          </p>
        </div>
      )}

      <div className="mt-6 grid gap-6 md:grid-cols-12 md:items-start">
        {/* Left Column: UPI Payment QR */}
        <div className="md:col-span-5">
          <div className="rounded-sm border-[3px] border-ink bg-background p-4 text-center shadow-[4px_4px_0_var(--ink)]">
            <div className="mb-3 flex items-center justify-center gap-1.5 font-display text-xs uppercase tracking-wider text-ink">
              <QrCode className="h-4 w-4 text-primary" aria-hidden="true" />
              <span>UPI Payment QR</span>
            </div>
            <img
              src={payment.qrImageSrc}
              alt={payment.qrImageAlt}
              loading="lazy"
              className="mx-auto h-auto w-full max-w-[260px] rounded-sm border-2 border-ink bg-black object-contain"
            />
          </div>
        </div>

        {/* Right Column: Compact Official UPI ID + Simplified How to Pay */}
        <div className="space-y-5 md:col-span-7">
          {/* Compact Official UPI ID Box */}
          <div className="rounded-sm border-[3px] border-ink bg-sand px-4 py-3 shadow-[3px_3px_0_var(--ink)]">
            <div className="flex items-center justify-between gap-2">
              <span className="font-display text-xs uppercase tracking-wider text-ink">
                Official UPI ID
              </span>
              {payment.upiIdIsPlaceholder && (
                <span className="rounded-sm border border-ink bg-cream px-2 py-0.5 font-display text-[10px] uppercase text-ink">
                  Placeholder
                </span>
              )}
            </div>

            <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center">
              <code className="flex-1 overflow-x-auto rounded-sm border-2 border-ink bg-cream px-3 py-2 font-mono text-sm font-bold text-ink">
                {payment.upiId}
              </code>
              <button
                type="button"
                onClick={handleCopyUpiId}
                className="pop-btn shrink-0 justify-center bg-primary px-4 py-2 text-xs text-ink"
              >
                {copyStatus === "copied" ? (
                  <>
                    <Check className="h-4 w-4" aria-hidden="true" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" aria-hidden="true" />
                    <span>Copy UPI ID</span>
                  </>
                )}
              </button>
            </div>

            <div aria-live="polite" className="sr-only">
              {copyStatus === "copied" ? "UPI ID copied to clipboard." : ""}
            </div>
            {copyStatus === "error" && (
              <p role="alert" className="mt-2 text-xs font-extrabold text-destructive">
                Could not access clipboard automatically. Please select and copy the UPI ID above.
              </p>
            )}
          </div>

          {/* Simplified 3-Step Payment Instructions */}
          <div>
            <h3 className="font-display text-sm uppercase tracking-wider text-ink">How to pay</h3>
            <ol className="mt-2.5 space-y-2.5">
              {payment.instructions.map((step) => (
                <li
                  key={step.number}
                  className="flex items-start gap-3 rounded-sm border-2 border-ink bg-background px-3.5 py-2.5 text-ink"
                >
                  <span className="mt-0.5 inline-flex h-6 w-7 shrink-0 items-center justify-center rounded-sm border-2 border-ink bg-primary font-display text-[11px] text-ink">
                    {step.number}
                  </span>
                  <div className="min-w-0">
                    <p className="font-display text-xs uppercase tracking-wide text-ink sm:text-[13px]">
                      {step.title}
                    </p>
                    <p className="mt-0.5 text-xs font-semibold leading-snug text-ink/80 sm:text-sm">
                      {step.description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
