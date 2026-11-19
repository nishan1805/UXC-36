export type PaymentStatus = "pending" | "verified" | "rejected";

export interface StoredRegistrationRecord {
  id: string;
  participantNumber: number;
  formattedParticipantNumber: string;
  fullName: string;
  mobileNumber: string;
  city: string;
  screenshotUrl: string;
  screenshotLabel: string;
  screenshotSizeLabel: string;
  paymentStatus: PaymentStatus;
  registeredAt: string;
}

export interface CreateRegistrationPayload {
  fullName: string;
  mobileNumber: string;
  city: string;
  screenshotDataUrl: string;
  screenshotFileName: string;
  screenshotSizeLabel: string;
}

interface RegistrationStoreState {
  nextParticipantNumber: number;
  records: StoredRegistrationRecord[];
  lock: Promise<void>;
}

const GLOBAL_STORE_KEY = "__UXC36_MILAAP_2026_REGISTRATION_STORE__";

function getGlobalStore(): RegistrationStoreState {
  const g = globalThis as unknown as Record<string, RegistrationStoreState | undefined>;
  if (!g[GLOBAL_STORE_KEY]) {
    g[GLOBAL_STORE_KEY] = {
      nextParticipantNumber: 1,
      records: [],
      lock: Promise.resolve(),
    };
  }
  return g[GLOBAL_STORE_KEY]!;
}

/**
 * Serializes all mutations so simultaneous registrations can NEVER receive
 * duplicate participant numbers.
 */
async function withStoreLock<T>(
  operation: (store: RegistrationStoreState) => T | Promise<T>,
): Promise<T> {
  const store = getGlobalStore();
  let releaseLock!: () => void;
  const nextLock = new Promise<void>((resolve) => {
    releaseLock = resolve;
  });

  const previousLock = store.lock;
  store.lock = previousLock.then(() => nextLock);

  await previousLock;
  try {
    return await operation(store);
  } finally {
    releaseLock();
  }
}

export function formatParticipantNumber(num: number): string {
  return `#${String(num).padStart(3, "0")}`;
}

export async function createServerRegistration(
  payload: CreateRegistrationPayload,
): Promise<StoredRegistrationRecord> {
  return withStoreLock((store) => {
    const trimmedName = payload.fullName.trim();
    const digits = payload.mobileNumber.replace(/\D/g, "");
    const trimmedCity = payload.city.trim();

    if (trimmedName.length < 2 || trimmedName.length > 80) {
      throw new Error("Please enter a valid full name (2 to 80 characters).");
    }
    if (!/^[6-9]\d{9}$/.test(digits)) {
      throw new Error("Please enter a valid 10-digit Indian mobile number.");
    }
    if (trimmedCity.length < 2 || trimmedCity.length > 60) {
      throw new Error("Please enter a valid city name.");
    }
    if (!payload.screenshotDataUrl || !payload.screenshotDataUrl.startsWith("data:image/")) {
      throw new Error("Please upload a valid payment screenshot image.");
    }

    const participantNumber = store.nextParticipantNumber;
    store.nextParticipantNumber += 1;

    const formattedParticipantNumber = formatParticipantNumber(participantNumber);
    const id = `UXC-2026-${String(participantNumber).padStart(3, "0")}`;
    const registeredAt = new Date().toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });

    const record: StoredRegistrationRecord = {
      id,
      participantNumber,
      formattedParticipantNumber,
      fullName: trimmedName,
      mobileNumber: `+91 ${digits}`,
      city: trimmedCity,
      screenshotUrl: payload.screenshotDataUrl,
      screenshotLabel: payload.screenshotFileName || "payment-screenshot.png",
      screenshotSizeLabel: payload.screenshotSizeLabel || "",
      // Payment verification MUST remain pending until manually reviewed by an administrator
      paymentStatus: "pending",
      registeredAt,
    };

    store.records.unshift(record);
    return record;
  });
}

export async function listServerRegistrations(): Promise<StoredRegistrationRecord[]> {
  return withStoreLock((store) => [...store.records]);
}

export async function updateServerRegistrationStatus(
  id: string,
  status: PaymentStatus,
): Promise<StoredRegistrationRecord | null> {
  if (status !== "pending" && status !== "verified" && status !== "rejected") {
    throw new Error("Invalid payment status.");
  }
  return withStoreLock((store) => {
    const record = store.records.find((item) => item.id === id);
    if (!record) return null;
    record.paymentStatus = status;
    return { ...record };
  });
}
