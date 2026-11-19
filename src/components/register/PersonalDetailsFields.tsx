import { MapPin, Phone, User } from "lucide-react";
import { normalizeIndianMobile } from "@/lib/registration-service";

export interface PersonalDetailsErrors {
  fullName?: string | null;
  mobileNumber?: string | null;
  city?: string | null;
}

interface PersonalDetailsFieldsProps {
  fullName: string;
  mobileNumber: string;
  city: string;
  errors: PersonalDetailsErrors;
  onFullNameChange: (value: string) => void;
  onFullNameBlur: () => void;
  onMobileChange: (value: string) => void;
  onMobileBlur: () => void;
  onCityChange: (value: string) => void;
  onCityBlur: () => void;
}

export function PersonalDetailsFields({
  fullName,
  mobileNumber,
  city,
  errors,
  onFullNameChange,
  onFullNameBlur,
  onMobileChange,
  onMobileBlur,
  onCityChange,
  onCityBlur,
}: PersonalDetailsFieldsProps) {
  return (
    <div className="pop-card-static bg-cream p-6 sm:p-8">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border-[3px] border-ink bg-primary font-display text-sm text-ink shadow-[2px_2px_0_var(--ink)]">
          01
        </span>
        <div>
          <h2 className="font-display text-2xl text-ink sm:text-3xl">
            Let&apos;s get to know you.
          </h2>
          <p className="mt-0.5 text-sm font-semibold text-muted-foreground sm:text-base">
            Just a few details to get your registration started.
          </p>
        </div>
      </div>

      {/* Strictly ONLY 3 fields: Full Name, Mobile Number (+91), City */}
      <div className="mt-7 space-y-5">
        {/* Field 1: Full Name */}
        <div>
          <label
            htmlFor="reg-full-name"
            className="flex items-center gap-2 font-display text-xs uppercase tracking-wider text-ink"
          >
            <User className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            <span>
              Full Name <span className="text-destructive">*</span>
            </span>
          </label>
          <input
            id="reg-full-name"
            name="fullName"
            type="text"
            autoComplete="name"
            required
            value={fullName}
            onChange={(e) => onFullNameChange(e.target.value)}
            onBlur={onFullNameBlur}
            placeholder="e.g. Ananya Verma"
            aria-invalid={Boolean(errors.fullName)}
            aria-describedby={errors.fullName ? "reg-full-name-error" : undefined}
            className={`mt-2 w-full rounded-sm border-[3px] bg-background px-4 py-3 text-base font-semibold text-ink placeholder:text-muted-foreground/70 focus:outline-none focus:ring-4 focus:ring-primary/40 ${
              errors.fullName ? "border-destructive" : "border-ink"
            }`}
          />
          {errors.fullName && (
            <p
              id="reg-full-name-error"
              role="alert"
              className="mt-1.5 text-sm font-bold text-destructive"
            >
              {errors.fullName}
            </p>
          )}
        </div>

        {/* Field 2: Mobile Number with fixed +91 prefix */}
        <div>
          <label
            htmlFor="reg-mobile"
            className="flex items-center gap-2 font-display text-xs uppercase tracking-wider text-ink"
          >
            <Phone className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            <span>
              Mobile Number <span className="text-destructive">*</span>
            </span>
          </label>
          <div className="mt-2 flex">
            <span
              aria-label="India country code +91"
              className={`inline-flex shrink-0 items-center rounded-l-sm border-[3px] border-r-0 bg-sand px-4 font-display text-sm text-ink select-none ${
                errors.mobileNumber ? "border-destructive" : "border-ink"
              }`}
            >
              +91
            </span>
            <input
              id="reg-mobile"
              name="mobileNumber"
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              maxLength={10}
              required
              value={mobileNumber}
              onChange={(e) => onMobileChange(normalizeIndianMobile(e.target.value))}
              onBlur={onMobileBlur}
              placeholder="9876543210"
              aria-invalid={Boolean(errors.mobileNumber)}
              aria-describedby={
                errors.mobileNumber ? "reg-mobile-error reg-mobile-hint" : "reg-mobile-hint"
              }
              className={`w-full rounded-r-sm border-[3px] bg-background px-4 py-3 text-base font-semibold tracking-wider text-ink placeholder:tracking-normal placeholder:text-muted-foreground/70 focus:outline-none focus:ring-4 focus:ring-primary/40 ${
                errors.mobileNumber ? "border-destructive" : "border-ink"
              }`}
            />
          </div>
          <p id="reg-mobile-hint" className="mt-1.5 text-xs font-semibold text-muted-foreground">
            Enter a valid 10-digit Indian mobile number (digits only).
          </p>
          {errors.mobileNumber && (
            <p
              id="reg-mobile-error"
              role="alert"
              className="mt-1 text-sm font-bold text-destructive"
            >
              {errors.mobileNumber}
            </p>
          )}
        </div>

        {/* Field 3: City */}
        <div>
          <label
            htmlFor="reg-city"
            className="flex items-center gap-2 font-display text-xs uppercase tracking-wider text-ink"
          >
            <MapPin className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            <span>
              City <span className="text-destructive">*</span>
            </span>
          </label>
          <input
            id="reg-city"
            name="city"
            type="text"
            autoComplete="address-level2"
            required
            value={city}
            onChange={(e) => onCityChange(e.target.value)}
            onBlur={onCityBlur}
            placeholder="e.g. Raipur, Bhilai, Bilaspur, Pune..."
            aria-invalid={Boolean(errors.city)}
            aria-describedby={errors.city ? "reg-city-error" : "reg-city-hint"}
            className={`mt-2 w-full rounded-sm border-[3px] bg-background px-4 py-3 text-base font-semibold text-ink placeholder:text-muted-foreground/70 focus:outline-none focus:ring-4 focus:ring-primary/40 ${
              errors.city ? "border-destructive" : "border-ink"
            }`}
          />
          <p id="reg-city-hint" className="mt-1.5 text-xs font-semibold text-muted-foreground">
            Open to participants joining from any city across India.
          </p>
          {errors.city && (
            <p id="reg-city-error" role="alert" className="mt-1 text-sm font-bold text-destructive">
              {errors.city}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
