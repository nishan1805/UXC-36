import { Link } from "@tanstack/react-router";
import { AlertTriangle, ArrowLeft, KeyRound, Lock, ShieldAlert } from "lucide-react";
import { useState, type FormEvent } from "react";
import { EVENT_CONFIG } from "@/lib/event-config";
import { DEMO_ADMIN_PASSCODE } from "@/lib/registration-service";

interface AdminLoginGateProps {
  onUnlock: () => void;
}

export function AdminLoginGate({ onUnlock }: AdminLoginGateProps) {
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (passcode.trim() !== DEMO_ADMIN_PASSCODE) {
      setError(`Invalid demo passcode. Enter "${DEMO_ADMIN_PASSCODE}" to preview the dashboard.`);
      return;
    }

    onUnlock();
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-5 py-12">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-sm border-2 border-ink bg-cream px-3 py-1.5 font-display text-xs uppercase text-ink shadow-[3px_3px_0_var(--ink)] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Back to {EVENT_CONFIG.community.name}</span>
          </Link>
        </div>

        <div className="pop-card-static overflow-hidden bg-cream">
          {/* Header */}
          <div className="border-b-[3px] border-ink bg-primary px-6 py-6 text-center">
            <img
              src={EVENT_CONFIG.community.logoSrc}
              alt="UX 36गढ़ official logo"
              className="mx-auto h-10 w-auto object-contain sm:h-11"
            />
            <span className="mt-4 inline-flex items-center gap-1.5 rounded-sm border-2 border-ink bg-ink px-3 py-1 font-display text-[11px] uppercase tracking-wider text-cream">
              <Lock className="h-3 w-3 text-primary" aria-hidden="true" />
              Prototype Login
            </span>
            <h1 className="mt-3 font-display text-2xl text-cream retro-3d-cream sm:text-3xl">
              Organiser Dashboard
            </h1>
            <p className="mt-1 text-sm font-bold text-ink">{EVENT_CONFIG.upcomingEvent.name}</p>
          </div>

          <div className="p-6 sm:p-7">
            {/* Explicit Prototype Security Disclaimer */}
            <div className="flex items-start gap-2.5 rounded-sm border-2 border-ink bg-sand px-3.5 py-3 text-xs font-bold leading-relaxed text-ink">
              <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              <p>
                <strong>Frontend Prototype Only:</strong> This demo passcode gate is solely for
                previewing the organiser interface with sample data. It is not production security
                and will be replaced with real organiser authentication during backend integration.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
              <div>
                <label
                  htmlFor="admin-demo-passcode"
                  className="flex items-center gap-2 font-display text-xs uppercase tracking-wider text-ink"
                >
                  <KeyRound className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                  <span>Demo Preview Passcode</span>
                </label>
                <input
                  id="admin-demo-passcode"
                  name="passcode"
                  type="password"
                  value={passcode}
                  onChange={(e) => {
                    setPasscode(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="Enter demo passcode"
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? "admin-passcode-error" : "admin-passcode-hint"}
                  className={`mt-2 w-full rounded-sm border-[3px] bg-background px-4 py-3 font-mono text-base font-bold text-ink placeholder:font-sans placeholder:font-semibold placeholder:text-muted-foreground/70 focus:outline-none focus:ring-4 focus:ring-primary/40 ${
                    error ? "border-destructive" : "border-ink"
                  }`}
                />
                <div
                  id="admin-passcode-hint"
                  className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-muted-foreground"
                >
                  <span>
                    Documented demo passcode:{" "}
                    <code className="rounded-sm border border-ink/30 bg-sand px-1.5 py-0.5 font-mono font-bold text-ink">
                      {DEMO_ADMIN_PASSCODE}
                    </code>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setPasscode(DEMO_ADMIN_PASSCODE);
                      setError(null);
                    }}
                    className="font-bold text-ink underline underline-offset-2 hover:text-primary"
                  >
                    Auto-fill demo code
                  </button>
                </div>
                {error && (
                  <p
                    id="admin-passcode-error"
                    role="alert"
                    className="mt-2 flex items-start gap-1.5 text-xs font-bold text-destructive"
                  >
                    <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    <span>{error}</span>
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="pop-btn w-full justify-center bg-primary text-sm text-ink"
              >
                Open Admin Preview
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
