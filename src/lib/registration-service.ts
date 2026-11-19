/**
 * Registration data access backed by Supabase.
 *
 * Participant numbers are assigned in Postgres. Payment status stays "pending"
 * until an organiser updates it. A database trigger records who verified it.
 */

import { supabase } from "@/lib/supabase";

export type PaymentStatus = "pending" | "verified" | "rejected";

export interface RegistrationInput {
  fullName: string;
  /** 10-digit Indian mobile number without the +91 prefix */
  mobileNumber: string;
  city: string;
  screenshotFile: File;
}

export interface RegistrationRecord {
  id: string;
  participantNumber: number;
  formattedParticipantNumber: string;
  fullName: string;
  /** Stored with +91 prefix for display, e.g. "+91 9876543210" */
  mobileNumber: string;
  city: string;
  screenshotUrl: string;
  screenshotLabel: string;
  paymentStatus: PaymentStatus;
  registeredAt: string;
}

export interface RegistrationSubmissionResult {
  registrationId: string;
  participantNumber: number;
  formattedParticipantNumber: string;
  submittedAt: string;
  paymentStatus: PaymentStatus;
  participant: {
    fullName: string;
    mobileNumberWithPrefix: string;
    city: string;
    screenshotFileName: string;
    screenshotFileSizeLabel: string;
  };
}

export interface RegistrationService {
  submitRegistration(input: RegistrationInput): Promise<RegistrationSubmissionResult>;
  listRegistrations(): Promise<RegistrationRecord[]>;
  updatePaymentStatus(id: string, status: PaymentStatus): Promise<void>;
}

export const ALLOWED_SCREENSHOT_TYPES = ["image/jpeg", "image/jpg", "image/png"] as const;

export const ALLOWED_SCREENSHOT_EXTENSIONS = [".jpg", ".jpeg", ".png"] as const;

export const MAX_SCREENSHOT_BYTES = 5 * 1024 * 1024; // 5 MB

const REGISTRATIONS_CLOSED_MESSAGE = "Registrations are closed";
const MOBILE_ALREADY_REGISTERED_MESSAGE =
  "This mobile number is already registered. Contact us on WhatsApp if you need help.";
const PAYMENT_PROOFS_BUCKET = "payment-proofs";
const SIGNED_URL_TTL_SECONDS = 3600;

export class AdminSessionError extends Error {
  constructor() {
    super("Your organiser session has expired. Please sign in again.");
    this.name = "AdminSessionError";
  }
}

type ScreenshotExt = "jpg" | "jpeg" | "png" | "webp";

interface QueryErrorLike {
  message?: string | null | undefined;
  details?: string | null | undefined;
  hint?: string | null | undefined;
  code?: string | null | undefined;
  status?: number | null | undefined;
  statusCode?: string | number | null | undefined;
}

export function validateFullName(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) {
    return "Please enter your full name.";
  }
  if (trimmed.length < 2) {
    return "Full name must be at least 2 characters long.";
  }
  if (trimmed.length > 80) {
    return "Full name must be 80 characters or fewer.";
  }
  if (!/^[\p{L}\s.'-]+$/u.test(trimmed)) {
    return "Please enter a valid name using letters and standard punctuation.";
  }
  return null;
}

export function normalizeIndianMobile(raw: string): string {
  return raw.replace(/\D/g, "").slice(0, 10);
}

export function validateIndianMobile(raw: string): string | null {
  const digits = raw.replace(/\D/g, "");
  if (!digits) {
    return "Please enter your 10-digit mobile number.";
  }
  if (digits.length !== 10) {
    return "Mobile number must be exactly 10 digits (excluding +91).";
  }
  if (!/^[6-9]\d{9}$/.test(digits)) {
    return "Please enter a valid Indian mobile number starting with 6, 7, 8, or 9.";
  }
  return null;
}

export function validateCity(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) {
    return "Please enter your city.";
  }
  if (trimmed.length < 2) {
    return "City name must be at least 2 characters long.";
  }
  if (trimmed.length > 60) {
    return "City name must be 60 characters or fewer.";
  }
  return null;
}

export function validatePaymentScreenshot(file: File | null): string | null {
  if (!file) {
    return "Please upload your ₹250 payment screenshot before submitting.";
  }

  const lowerName = file.name.toLowerCase();
  const hasAllowedExtension = ALLOWED_SCREENSHOT_EXTENSIONS.some((ext) => lowerName.endsWith(ext));
  const hasAllowedMime = (ALLOWED_SCREENSHOT_TYPES as readonly string[]).includes(
    file.type.toLowerCase(),
  );

  if (!hasAllowedMime && !hasAllowedExtension) {
    return "Unsupported file format. Please upload a PNG, JPG, or JPEG image.";
  }

  if (file.type && !hasAllowedMime) {
    return "Unsupported file format. Please upload a PNG, JPG, or JPEG image.";
  }

  if (file.size > MAX_SCREENSHOT_BYTES) {
    return `File is too large (${formatFileSize(file.size)}). Maximum allowed size is 5 MB.`;
  }

  return null;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function isRegistrationsClosedError(error: unknown): boolean {
  return error instanceof Error && /registrations closed/i.test(error.message);
}

function errorText(error: QueryErrorLike): string {
  return [error.message, error.details, error.hint].filter(Boolean).join(" ");
}

function friendlyRegistrationError(error: QueryErrorLike): string {
  const blob = errorText(error);
  if (/registrations closed/i.test(blob)) return REGISTRATIONS_CLOSED_MESSAGE;
  if (/already registered/i.test(blob)) return MOBILE_ALREADY_REGISTERED_MESSAGE;
  const message = error.message?.trim();
  if (message) return message;
  return "Unable to complete registration. Please try again.";
}

function isAuthOrRlsError(error: QueryErrorLike): boolean {
  const code = `${error.code ?? ""} ${error.status ?? ""} ${error.statusCode ?? ""}`.toLowerCase();
  const message = (error.message ?? "").toLowerCase();
  return (
    code.includes("pgrst301") ||
    code.includes("pgrst302") ||
    code.includes("42501") ||
    code.includes("401") ||
    code.includes("403") ||
    message.includes("jwt") ||
    message.includes("row-level security") ||
    message.includes("permission denied") ||
    message.includes("not authorized") ||
    message.includes("unauthorized") ||
    message.includes("invalid claim")
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asRows(data: unknown): Record<string, unknown>[] {
  if (Array.isArray(data)) return data.filter(isRecord);
  if (isRecord(data)) return [data];
  return [];
}

function readString(row: Record<string, unknown>, key: string): string {
  const value = row[key];
  return typeof value === "string" ? value : "";
}

function readRequiredString(row: Record<string, unknown>, key: string): string {
  const value = readString(row, key).trim();
  if (!value) {
    throw new Error("Unable to complete registration. Please try again.");
  }
  return value;
}

function parseParticipantNo(value: unknown): number {
  const numeric =
    typeof value === "number" ? value : typeof value === "string" ? Number(value) : NaN;
  if (!Number.isSafeInteger(numeric) || numeric < 0) {
    throw new Error("Unable to complete registration. Please try again.");
  }
  return numeric;
}

function formatParticipantNumber(participantNo: number): string {
  return `#${String(participantNo).padStart(3, "0")}`;
}

function formatRegisteredAt(value: unknown): string {
  if (typeof value !== "string" || !value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function readPaymentStatus(value: unknown): PaymentStatus {
  if (value === "pending" || value === "verified" || value === "rejected") return value;
  return "pending";
}

function assertPaymentStatus(status: PaymentStatus): void {
  if (status !== "pending" && status !== "verified" && status !== "rejected") {
    throw new Error("Could not update payment status.");
  }
}

function resolveScreenshotExt(file: File): ScreenshotExt {
  const name = file.name.toLowerCase();
  const mime = file.type.toLowerCase();

  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
  if (mime === "image/jpeg" || mime === "image/jpg") {
    return name.endsWith(".jpeg") ? "jpeg" : "jpg";
  }

  if (name.endsWith(".png")) return "png";
  if (name.endsWith(".webp")) return "webp";
  if (name.endsWith(".jpeg")) return "jpeg";
  if (name.endsWith(".jpg")) return "jpg";

  throw new Error("Unsupported file format. Please upload a PNG, JPG, or JPEG image.");
}

function screenshotContentType(ext: ScreenshotExt): string {
  if (ext === "png") return "image/png";
  if (ext === "webp") return "image/webp";
  return "image/jpeg";
}

async function requireAdminSession(): Promise<void> {
  const allowed = await getAdminSession();
  if (!allowed) throw new AdminSessionError();
}

export async function isRegistrationOpen(): Promise<boolean> {
  const { data, error } = await supabase.rpc("registration_open");
  if (error) {
    if (/registrations closed/i.test(errorText(error))) return false;
    throw new Error("Could not check whether registrations are open.");
  }
  return data === true;
}

export async function adminSignIn(email: string, password: string): Promise<void> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (error || !data.user || !data.session) {
    throw new Error("Incorrect email or password.");
  }

  const { data: adminRow, error: adminError } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", data.user.id)
    .maybeSingle();

  if (adminError || !adminRow) {
    await supabase.auth.signOut();
    if (adminError && !isAuthOrRlsError(adminError)) {
      throw new Error("Unable to verify organiser access. Please try again.");
    }
    throw new Error("This account does not have organiser access.");
  }
}

export async function adminSignOut(): Promise<void> {
  await supabase.auth.signOut();
}

export async function getAdminSession(): Promise<boolean> {
  const { data, error } = await supabase.auth.getSession();
  const userId = data.session?.user.id;
  if (error || !userId) {
    await supabase.auth.signOut();
    return false;
  }

  const { data: adminRow, error: adminError } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();

  if (adminError || !adminRow) {
    await supabase.auth.signOut();
    return false;
  }

  return true;
}

export function subscribeToAdminSignOut(onSignOut: () => void): () => void {
  const { data } = supabase.auth.onAuthStateChange((event) => {
    if (event === "SIGNED_OUT") onSignOut();
  });
  return () => {
    data.subscription.unsubscribe();
  };
}

export const registrationService: RegistrationService = {
  async submitRegistration(input: RegistrationInput): Promise<RegistrationSubmissionResult> {
    const trimmedName = input.fullName.trim();
    const cleanDigits = normalizeIndianMobile(input.mobileNumber);
    const trimmedCity = input.city.trim();

    const nameError = validateFullName(trimmedName);
    const mobileError = validateIndianMobile(cleanDigits);
    const cityError = validateCity(trimmedCity);
    const fileError = validatePaymentScreenshot(input.screenshotFile);
    const validationError = nameError ?? mobileError ?? cityError ?? fileError;
    if (validationError) throw new Error(validationError);

    const ext = resolveScreenshotExt(input.screenshotFile);
    const objectPath = `${crypto.randomUUID()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from(PAYMENT_PROOFS_BUCKET)
      .upload(objectPath, input.screenshotFile, {
        contentType: screenshotContentType(ext),
        upsert: false,
      });

    if (uploadError) {
      throw new Error("Could not upload your payment screenshot. Please try again.");
    }

    const { data, error } = await supabase.rpc("register_participant", {
      p_full_name: trimmedName,
      p_mobile: cleanDigits,
      p_city: trimmedCity,
      p_payment_proof_path: objectPath,
    });

    if (error) {
      throw new Error(friendlyRegistrationError(error));
    }

    const row = asRows(data)[0];
    if (!row) {
      throw new Error("Unable to complete registration. Please try again.");
    }

    const participantNumber = parseParticipantNo(row["participant_no"]);
    const submittedAt = new Date().toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });

    return {
      registrationId: readRequiredString(row, "id"),
      participantNumber,
      formattedParticipantNumber: formatParticipantNumber(participantNumber),
      submittedAt,
      paymentStatus: "pending",
      participant: {
        fullName: readRequiredString(row, "full_name"),
        mobileNumberWithPrefix: `+91 ${cleanDigits}`,
        city: readRequiredString(row, "city"),
        screenshotFileName: input.screenshotFile.name,
        screenshotFileSizeLabel: formatFileSize(input.screenshotFile.size),
      },
    };
  },

  async listRegistrations(): Promise<RegistrationRecord[]> {
    await requireAdminSession();

    const { data, error } = await supabase
      .from("registrations")
      .select(
        "id, participant_no, full_name, mobile, city, payment_proof_path, payment_status, created_at",
      )
      .order("created_at", { ascending: false });

    if (error) {
      if (isAuthOrRlsError(error)) throw new AdminSessionError();
      throw new Error("Could not load registrations.");
    }

    const rows = asRows(data);
    const paths = [
      ...new Set(
        rows.map((row) => readString(row, "payment_proof_path")).filter((path) => path.length > 0),
      ),
    ];
    const signedByPath = new Map<string, string>();

    if (paths.length > 0) {
      const { data: signed, error: signedError } = await supabase.storage
        .from(PAYMENT_PROOFS_BUCKET)
        .createSignedUrls(paths, SIGNED_URL_TTL_SECONDS);

      if (signedError) {
        if (isAuthOrRlsError(signedError)) throw new AdminSessionError();
      } else {
        for (const item of signed) {
          if (item.path && item.signedUrl) {
            signedByPath.set(item.path, item.signedUrl);
          }
        }
      }
    }

    return rows.map((row) => {
      const participantNumber = parseParticipantNo(row["participant_no"]);
      const proofPath = readString(row, "payment_proof_path");
      const mobile = readString(row, "mobile");
      return {
        id: readRequiredString(row, "id"),
        participantNumber,
        formattedParticipantNumber: formatParticipantNumber(participantNumber),
        fullName: readRequiredString(row, "full_name"),
        mobileNumber: `+91 ${mobile}`,
        city: readRequiredString(row, "city"),
        screenshotUrl: proofPath ? (signedByPath.get(proofPath) ?? "") : "",
        screenshotLabel: proofPath,
        paymentStatus: readPaymentStatus(row["payment_status"]),
        registeredAt: formatRegisteredAt(row["created_at"]),
      };
    });
  },

  async updatePaymentStatus(id: string, status: PaymentStatus): Promise<void> {
    assertPaymentStatus(status);
    await requireAdminSession();

    const { data, error } = await supabase
      .from("registrations")
      .update({ payment_status: status })
      .eq("id", id)
      .select("id");

    if (error) {
      if (isAuthOrRlsError(error)) throw new AdminSessionError();
      throw new Error("Could not update payment status.");
    }

    if (!data || data.length === 0) {
      const stillAdmin = await getAdminSession();
      if (!stillAdmin) throw new AdminSessionError();
      throw new Error("Could not update payment status.");
    }
  },
};

export function exportRegistrationsToCsv(records: RegistrationRecord[]): void {
  const headers = [
    "Participant No.",
    "Registration ID",
    "Participant Name",
    "Mobile Number",
    "City",
    "Payment Status",
    "Registration Date",
    "Screenshot File",
  ];

  const escapeCsv = (value: string) => {
    const escaped = value.replace(/"/g, '""');
    return `"${escaped}"`;
  };

  const rows = records.map((r) =>
    [
      r.formattedParticipantNumber,
      r.id,
      r.fullName,
      r.mobileNumber,
      r.city,
      r.paymentStatus.toUpperCase(),
      r.registeredAt,
      r.screenshotLabel,
    ]
      .map(escapeCsv)
      .join(","),
  );

  const csvContent = [headers.map(escapeCsv).join(","), ...rows].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "ux36garh-milaap-2026-registrations.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
