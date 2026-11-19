import { Link } from "@tanstack/react-router";
import { AlertTriangle, ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import { useRef, useState, type FormEvent } from "react";
import { EVENT_CONFIG } from "@/lib/event-config";
import { adminSignIn } from "@/lib/registration-service";

interface AdminLoginGateProps {
  onUnlock: () => void;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function AdminLoginGate({ onUnlock }: AdminLoginGateProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitLockRef = useRef(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitLockRef.current) return;

    const trimmedEmail = email.trim();
    let hasError = false;

    if (!trimmedEmail) {
      setEmailError("Please enter your admin email address.");
      hasError = true;
    } else if (!EMAIL_REGEX.test(trimmedEmail)) {
      setEmailError("Please enter a valid email address.");
      hasError = true;
    } else {
      setEmailError(null);
    }

    if (!password) {
      setPasswordError("Please enter your password.");
      hasError = true;
    } else {
      setPasswordError(null);
    }

    if (hasError) {
      return;
    }

    submitLockRef.current = true;
    setIsSubmitting(true);
    setFormError(null);
    try {
      await adminSignIn(trimmedEmail, password);
      onUnlock();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Unable to sign in. Please try again.");
    } finally {
      submitLockRef.current = false;
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center overflow-x-clip bg-background px-4 py-10 sm:px-6 sm:py-12">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-sm border-2 border-ink bg-cream px-3.5 py-2 font-display text-xs uppercase tracking-wide text-ink shadow-[3px_3px_0_var(--ink)] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
          >
            <ArrowLeft className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span>Back to {EVENT_CONFIG.community.name}</span>
          </Link>
        </div>

        <div className="pop-card-static overflow-hidden bg-cream">
          {/* Orange Brand Header */}
          <div className="border-b-[3px] border-ink bg-primary px-6 py-7 text-center sm:px-8 sm:py-8">
            <img
              src={EVENT_CONFIG.community.logoSrc}
              alt="UX 36गढ़ official logo"
              className="mx-auto h-10 w-auto object-contain sm:h-11"
            />
            <h1 className="mt-4 font-display text-2xl uppercase tracking-wide text-cream retro-3d-cream sm:text-3xl">
              Organiser Dashboard
            </h1>
          </div>

          {/* Login Form */}
          <div className="p-6 sm:p-8">
            <form
              onSubmit={(event) => {
                void handleSubmit(event);
              }}
              className="space-y-5"
              noValidate
            >
              <div>
                <label
                  htmlFor="admin-email"
                  className="block font-display text-xs uppercase tracking-wider text-ink"
                >
                  Email Address
                </label>
                <input
                  id="admin-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError(null);
                    if (formError) setFormError(null);
                  }}
                  placeholder="Enter your admin email"
                  aria-invalid={Boolean(emailError)}
                  aria-describedby={emailError ? "admin-email-error" : undefined}
                  className={`mt-2 w-full rounded-sm border-[3px] bg-background px-4 py-3 text-base font-semibold text-ink placeholder:font-medium placeholder:text-muted-foreground/70 focus:outline-none focus:ring-4 focus:ring-primary/40 ${
                    emailError ? "border-destructive" : "border-ink"
                  }`}
                />
                {emailError && (
                  <p
                    id="admin-email-error"
                    role="alert"
                    className="mt-2 flex items-start gap-1.5 text-xs font-bold text-destructive"
                  >
                    <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    <span>{emailError}</span>
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="admin-password"
                  className="block font-display text-xs uppercase tracking-wider text-ink"
                >
                  Password
                </label>
                <div className="relative mt-2">
                  <input
                    id="admin-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (passwordError) setPasswordError(null);
                      if (formError) setFormError(null);
                    }}
                    placeholder="Enter your password."
                    aria-invalid={Boolean(passwordError)}
                    aria-describedby={passwordError ? "admin-password-error" : undefined}
                    className={`w-full rounded-sm border-[3px] bg-background py-3 pr-12 pl-4 text-base font-semibold text-ink placeholder:font-medium placeholder:text-muted-foreground/70 focus:outline-none focus:ring-4 focus:ring-primary/40 ${
                      passwordError ? "border-destructive" : "border-ink"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    aria-pressed={showPassword}
                    className="absolute top-1/2 right-2 inline-flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-sm text-ink/75 transition-colors hover:bg-sand/70 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <Eye className="h-4 w-4" aria-hidden="true" />
                    )}
                  </button>
                </div>
                {passwordError && (
                  <p
                    id="admin-password-error"
                    role="alert"
                    className="mt-2 flex items-start gap-1.5 text-xs font-bold text-destructive"
                  >
                    <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    <span>{passwordError}</span>
                  </p>
                )}
              </div>

              {formError && (
                <p
                  role="alert"
                  className="flex items-start gap-1.5 text-xs font-bold text-destructive"
                >
                  <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  <span>{formError}</span>
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="pop-btn mt-1 w-full justify-center bg-primary py-3.5 text-sm uppercase tracking-wider text-ink disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                ) : null}
                <span>Login</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
