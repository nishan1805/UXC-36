import { ArrowRight, Loader2 } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  PersonalDetailsFields,
  type PersonalDetailsErrors,
} from "@/components/register/PersonalDetailsFields";
import { RegistrationConfirmationPreview } from "@/components/register/RegistrationConfirmationPreview";
import { ScreenshotUploadField } from "@/components/register/ScreenshotUploadField";
import { UpiPaymentSection } from "@/components/register/UpiPaymentSection";
import {
  registrationService,
  validateCity,
  validateFullName,
  validateIndianMobile,
  validatePaymentScreenshot,
  type RegistrationSubmissionResult,
} from "@/lib/registration-service";

export function RegistrationFlow() {
  const [fullName, setFullName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [city, setCity] = useState("");
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);

  const [fieldErrors, setFieldErrors] = useState<PersonalDetailsErrors>({});
  const [screenshotError, setScreenshotError] = useState<string | null>(null);
  const [submitSummaryError, setSubmitSummaryError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<RegistrationSubmissionResult | null>(
    null,
  );
  const submitLockRef = useRef(false);
  const sectionRef = useRef<HTMLElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);
  const pendingScrollRef = useRef<"confirmation" | "form" | null>(null);

  // Scroll accurately to the top of the confirmation card (after submit) or the start of
  // the registration form (after clicking "Register Another Participant"), accounting for
  // the sticky navbar height after React commits the new DOM layout.
  useEffect(() => {
    const targetMode = pendingScrollRef.current;
    if (!targetMode) return;
    pendingScrollRef.current = null;

    let raf1 = 0;
    let raf2 = 0;

    raf1 = window.requestAnimationFrame(() => {
      raf2 = window.requestAnimationFrame(() => {
        const targetEl =
          targetMode === "confirmation"
            ? (document.getElementById("registration-confirmation") ?? sectionRef.current)
            : (formRef.current ?? sectionRef.current);
        if (!targetEl) return;

        const headerHeight = document.querySelector("header")?.getBoundingClientRect().height ?? 72;
        const offset = headerHeight + 20;
        const targetTop = Math.max(
          0,
          targetEl.getBoundingClientRect().top + window.scrollY - offset,
        );
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        window.scrollTo({
          top: targetTop,
          behavior: prefersReducedMotion ? "auto" : "smooth",
        });
      });
    });

    return () => {
      window.cancelAnimationFrame(raf1);
      window.cancelAnimationFrame(raf2);
    };
  }, [submissionResult]);

  function handleFullNameBlur() {
    const trimmed = fullName.trim();
    if (trimmed !== fullName) setFullName(trimmed);
    setFieldErrors((prev) => ({ ...prev, fullName: validateFullName(trimmed) }));
  }

  function handleMobileBlur() {
    setFieldErrors((prev) => ({ ...prev, mobileNumber: validateIndianMobile(mobileNumber) }));
  }

  function handleCityBlur() {
    const trimmed = city.trim();
    if (trimmed !== city) setCity(trimmed);
    setFieldErrors((prev) => ({ ...prev, city: validateCity(trimmed) }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitLockRef.current || isSubmitting) return;
    setSubmitSummaryError(null);

    const trimmedName = fullName.trim();
    const trimmedCity = city.trim();
    setFullName(trimmedName);
    setCity(trimmedCity);

    const nameErr = validateFullName(trimmedName);
    const mobileErr = validateIndianMobile(mobileNumber);
    const cityErr = validateCity(trimmedCity);
    const fileErr = validatePaymentScreenshot(screenshotFile);

    setFieldErrors({
      fullName: nameErr,
      mobileNumber: mobileErr,
      city: cityErr,
    });
    setScreenshotError(fileErr);

    if (nameErr || mobileErr || cityErr || fileErr || !screenshotFile) {
      setSubmitSummaryError(
        "Please fix the highlighted fields and attach your ₹250 payment screenshot before submitting.",
      );
      return;
    }

    submitLockRef.current = true;
    setIsSubmitting(true);
    try {
      const result = await registrationService.submitRegistration({
        fullName: trimmedName,
        mobileNumber,
        city: trimmedCity,
        screenshotFile,
      });
      pendingScrollRef.current = "confirmation";
      setSubmissionResult(result);
    } catch (error) {
      setSubmitSummaryError(
        error instanceof Error
          ? error.message
          : "Unable to complete registration. Please try again.",
      );
    } finally {
      submitLockRef.current = false;
      setIsSubmitting(false);
    }
  }

  function handleReset() {
    setFullName("");
    setMobileNumber("");
    setCity("");
    setScreenshotFile(null);
    setFieldErrors({});
    setScreenshotError(null);
    setSubmitSummaryError(null);
    pendingScrollRef.current = "form";
    setSubmissionResult(null);
  }

  return (
    <section
      ref={sectionRef}
      id="registration-form"
      className="scroll-mt-24 border-b-[3px] border-ink bg-background py-14 [overflow-anchor:none] md:py-20"
      aria-label="Event registration form"
    >
      <div className="mx-auto max-w-4xl px-5">
        {submissionResult ? (
          <RegistrationConfirmationPreview result={submissionResult} onReset={handleReset} />
        ) : (
          <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-8">
            {/* Step 1: Personal Details Form (Strictly 3 fields) */}
            <PersonalDetailsFields
              fullName={fullName}
              mobileNumber={mobileNumber}
              city={city}
              errors={fieldErrors}
              onFullNameChange={(val) => {
                setFullName(val);
                if (fieldErrors.fullName) {
                  setFieldErrors((prev) => ({ ...prev, fullName: validateFullName(val) }));
                }
              }}
              onFullNameBlur={handleFullNameBlur}
              onMobileChange={(val) => {
                setMobileNumber(val);
                if (fieldErrors.mobileNumber) {
                  setFieldErrors((prev) => ({ ...prev, mobileNumber: validateIndianMobile(val) }));
                }
              }}
              onMobileBlur={handleMobileBlur}
              onCityChange={(val) => {
                setCity(val);
                if (fieldErrors.city) {
                  setFieldErrors((prev) => ({ ...prev, city: validateCity(val) }));
                }
              }}
              onCityBlur={handleCityBlur}
            />

            {/* Step 2: UPI Payment Section */}
            <UpiPaymentSection />

            {/* Step 3: Payment Screenshot Upload */}
            <ScreenshotUploadField
              file={screenshotFile}
              error={screenshotError}
              onFileSelect={(file, err) => {
                setScreenshotFile(file);
                setScreenshotError(err);
              }}
            />

            {/* Direct Prominent Submit Action */}
            <div className="pt-1">
              {submitSummaryError && (
                <div
                  role="alert"
                  className="mb-4 rounded-sm border-2 border-destructive bg-cream px-4 py-3 text-sm font-bold text-destructive"
                >
                  {submitSummaryError}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="pop-btn w-full justify-center bg-primary px-6 py-4 text-base text-ink disabled:cursor-not-allowed disabled:opacity-70 sm:text-lg"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                    <span>Submitting Registration...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Registration</span>
                    <ArrowRight className="h-5 w-5 shrink-0" aria-hidden="true" />
                  </>
                )}
              </button>

              <p className="mt-3 text-center text-xs font-semibold leading-relaxed text-muted-foreground sm:text-sm">
                Please double-check your name, 10-digit mobile number, city and uploaded payment
                screenshot before submitting.
              </p>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
