/**
 * Registration Service backed by server-side `/api/registrations`.
 *
 * - Sequential, unique participant registration numbers (#001, #002, ...) are generated
 *   atomically on the server — never via client-side counting.
 * - Payment verification always defaults to "pending" until manually verified by an admin.
 */

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

/**
 * Organiser access passcode for /admin dashboard.
 */
export const DEMO_ADMIN_PASSCODE = "UXC2026-DEMO";

export const ALLOWED_SCREENSHOT_TYPES = ["image/jpeg", "image/jpg", "image/png"] as const;

export const ALLOWED_SCREENSHOT_EXTENSIONS = [".jpg", ".jpeg", ".png"] as const;

export const MAX_SCREENSHOT_BYTES = 5 * 1024 * 1024; // 5 MB

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

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Could not read payment screenshot."));
      }
    };
    reader.onerror = () => reject(new Error("Could not read payment screenshot."));
    reader.readAsDataURL(file);
  });
}

export const registrationService: RegistrationService = {
  async submitRegistration(input: RegistrationInput): Promise<RegistrationSubmissionResult> {
    const trimmedName = input.fullName.trim();
    const cleanDigits = normalizeIndianMobile(input.mobileNumber);
    const trimmedCity = input.city.trim();
    const screenshotDataUrl = await readFileAsDataUrl(input.screenshotFile);
    const screenshotSizeLabel = formatFileSize(input.screenshotFile.size);

    const response = await fetch("/api/registrations", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        fullName: trimmedName,
        mobileNumber: cleanDigits,
        city: trimmedCity,
        screenshotDataUrl,
        screenshotFileName: input.screenshotFile.name,
        screenshotSizeLabel,
      }),
    });

    const payload = (await response.json()) as {
      record?: RegistrationRecord;
      error?: string;
    };

    if (!response.ok || !payload.record) {
      throw new Error(payload.error || "Unable to complete registration. Please try again.");
    }

    const { record } = payload;

    return {
      registrationId: record.id,
      participantNumber: record.participantNumber,
      formattedParticipantNumber: record.formattedParticipantNumber,
      submittedAt: record.registeredAt,
      paymentStatus: record.paymentStatus,
      participant: {
        fullName: record.fullName,
        mobileNumberWithPrefix: record.mobileNumber,
        city: record.city,
        screenshotFileName: record.screenshotLabel,
        screenshotFileSizeLabel: screenshotSizeLabel,
      },
    };
  },

  async listRegistrations(): Promise<RegistrationRecord[]> {
    const response = await fetch("/api/registrations", {
      method: "GET",
      headers: { accept: "application/json" },
    });
    if (!response.ok) {
      throw new Error("Could not load registrations.");
    }
    const payload = (await response.json()) as { records?: RegistrationRecord[] };
    return payload.records ?? [];
  },

  async updatePaymentStatus(id: string, status: PaymentStatus): Promise<void> {
    const response = await fetch(`/api/registrations/${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ paymentStatus: status }),
    });
    if (!response.ok) {
      const payload = (await response.json().catch(() => ({}))) as { error?: string };
      throw new Error(payload.error || "Could not update payment status.");
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
