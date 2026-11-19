import { Link } from "@tanstack/react-router";
import { Check, Download, Home, Loader2, RotateCcw, Share2 } from "lucide-react";
import { useState } from "react";
import logo from "@/assets/uxc-logo.png";
import { buildAttendeeCardFilename, renderAttendeeCardToBlob } from "@/lib/attendee-card-canvas";
import { EVENT_CONFIG } from "@/lib/event-config";

interface AttendeeBadgeCardProps {
  attendeeName: string;
  participantNumber: string;
  onRegisterAnother: () => void;
}

export function AttendeeBadgeCard({
  attendeeName,
  participantNumber,
  onRegisterAnother,
}: AttendeeBadgeCardProps) {
  const { attendeeCard, upcomingEvent } = EVENT_CONFIG;
  const displayName = attendeeName.trim() || "UX 36गढ़ Member";

  const [isDownloading, setIsDownloading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  function getNameSizeClass(name: string): string {
    if (name.length > 26) return "text-2xl sm:text-3xl md:text-4xl";
    if (name.length > 18) return "text-3xl sm:text-4xl md:text-[2.6rem]";
    return "text-3xl sm:text-4xl md:text-5xl";
  }

  async function handleDownloadPng() {
    if (isDownloading) return;
    setIsDownloading(true);
    setStatusMessage(null);
    try {
      const blob = await renderAttendeeCardToBlob(displayName, participantNumber);
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = buildAttendeeCardFilename(displayName, participantNumber);
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      window.setTimeout(() => URL.revokeObjectURL(url), 1500);
      setStatusMessage("Attendance card downloaded as PNG.");
    } catch {
      setStatusMessage("Could not generate PNG right now. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  }

  async function handleShareCard() {
    if (isSharing) return;
    setIsSharing(true);
    setStatusMessage(null);

    const shareText = `I'm attending ${upcomingEvent.name} (${participantNumber}) on ${upcomingEvent.date} in ${upcomingEvent.location}! Excited to connect with the design community of Chhattisgarh.`;

    try {
      const blob = await renderAttendeeCardToBlob(displayName, participantNumber);
      const filename = buildAttendeeCardFilename(displayName, participantNumber);
      const file = new File([blob], filename, { type: "image/png" });

      if (
        typeof navigator !== "undefined" &&
        typeof navigator.share === "function" &&
        typeof navigator.canShare === "function" &&
        navigator.canShare({ files: [file] })
      ) {
        await navigator.share({
          title: `${upcomingEvent.name} — Attendance Card (${participantNumber})`,
          text: shareText,
          files: [file],
        });
        setStatusMessage("Attendance card shared!");
        return;
      }

      if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
        await navigator.share({
          title: `${upcomingEvent.name} — Attendance Card (${participantNumber})`,
          text: shareText,
          url: window.location.origin,
        });
        setStatusMessage("Shared event details!");
        return;
      }

      // Desktop / iframe fallback: download crisp PNG & copy share caption
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = filename;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      window.setTimeout(() => URL.revokeObjectURL(url), 1500);

      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(`${shareText} ${window.location.origin}`);
        setStatusMessage("Attendance card PNG downloaded and share caption copied to clipboard!");
      } else {
        setStatusMessage(
          "Attendance card PNG downloaded — ready to share on WhatsApp or Instagram!",
        );
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }
      setStatusMessage(
        "Could not open share dialog. Use Download Attendance Card to save and share.",
      );
    } finally {
      setIsSharing(false);
    }
  }

  return (
    <div className="mt-7">
      {/* Live Dynamically Rendered Attendance Card using official #F83F28 logo accent */}
      <div className="relative overflow-hidden rounded-lg border-[3px] border-ink bg-white text-ink shadow-[6px_6px_0_var(--ink)]">
        {/* Decorative Top-Right Diagonal Coral & #F83F28 Accents */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-10 right-24 hidden h-32 w-10 rotate-[28deg] rounded-full bg-[#FFB3A7] sm:block md:right-36 md:h-40 md:w-12"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-10 -right-10 h-24 w-44 -rotate-[22deg] rounded-3xl bg-[#F83F28] sm:h-28 sm:w-56 md:h-32 md:w-64"
        />

        {/* Decorative Bottom-Left #F83F28 & Coral Accents */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-10 -left-10 h-24 w-40 -rotate-[22deg] rounded-3xl bg-[#F83F28] sm:h-28 sm:w-52"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-10 left-24 hidden h-28 w-12 -rotate-[28deg] rounded-2xl bg-[#FFB3A7] sm:block md:left-32 md:h-32 md:w-14"
        />

        {/* Decorative Bottom-Right 5x3 #F83F28 Dot Matrix */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-4 bottom-4 hidden grid-cols-5 gap-1.5 sm:grid"
        >
          {Array.from({ length: 15 }).map((_, idx) => (
            <span key={idx} className="h-1.5 w-1.5 rounded-full bg-[#F83F28]" />
          ))}
        </div>

        {/* Two-Column Card Body */}
        <div className="relative z-10 grid items-center gap-8 px-6 py-7 sm:px-9 sm:py-9 md:grid-cols-12 md:gap-6 md:px-10 md:py-10">
          {/* Left Column: Branding Lockup + I'M ATTENDING! + Sequential Number + Dynamic Name + Message */}
          <div className="md:col-span-7">
            {/* Top-Left Brand Lockup */}
            <div className="flex items-center gap-3.5 sm:gap-4">
              <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-2xl bg-[#F83F28] px-2 py-1.5 shadow-xs sm:h-20 sm:w-20">
                <img
                  src={logo}
                  alt="UXC official logo"
                  className="h-7 w-auto object-contain sm:h-9"
                />
                <span className="mt-0.5 font-display text-[11px] leading-none text-white sm:text-xs">
                  36गढ़
                </span>
              </div>

              <span
                aria-hidden="true"
                className="h-12 w-1.5 shrink-0 rounded-full bg-[#F83F28] sm:h-14"
              />

              <div className="min-w-0">
                <div className="font-display text-xl leading-[1.05] text-ink sm:text-2xl md:text-[1.75rem]">
                  UX 36गढ़
                </div>
                <div className="font-display text-2xl leading-[1.02] tracking-tight sm:text-3xl md:text-[2rem]">
                  <span className="text-ink">MILAAP</span>{" "}
                  <span className="text-[#F83F28]">2026</span>
                </div>
              </div>
            </div>

            {/* Slanted 3D "I'M ATTENDING!" Heading with #F83F28 Comic Burst Rays */}
            <div className="relative mt-7 inline-block sm:mt-8">
              <p
                className="inline-block -skew-x-10 font-display text-3xl leading-none tracking-tight text-cream sm:text-4xl md:text-[2.75rem]"
                style={{
                  WebkitTextStroke: "2px #380701",
                  textShadow: "2px 2px 0 #380701, 4px 4px 0 #380701, 6px 7px 0 #F83F28",
                }}
              >
                {attendeeCard.heading}
              </p>

              {/* 3 #F83F28 spark rays at top-right of exclamation mark */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -top-5 -right-5 hidden h-9 w-9 sm:block"
              >
                <svg viewBox="0 0 40 40" fill="none" className="h-full w-full">
                  <rect
                    x="10"
                    y="2"
                    width="5"
                    height="15"
                    rx="2.5"
                    transform="rotate(6 10 2)"
                    fill="#F83F28"
                  />
                  <rect
                    x="22"
                    y="6"
                    width="5"
                    height="17"
                    rx="2.5"
                    transform="rotate(36 22 6)"
                    fill="#F83F28"
                  />
                  <rect
                    x="29"
                    y="20"
                    width="5"
                    height="14"
                    rx="2.5"
                    transform="rotate(68 29 20)"
                    fill="#F83F28"
                  />
                </svg>
              </span>
            </div>

            {/* Unique Sequential Participant Registration Number + Dynamic Attendee Name */}
            <div className="mt-5">
              {participantNumber && (
                <div className="mb-2.5">
                  <span className="inline-flex items-center rounded-md border-2 border-ink bg-[#F83F28] px-3 py-1 font-display text-sm tracking-wider text-white shadow-[3px_3px_0_var(--ink)] sm:text-base">
                    {participantNumber}
                  </span>
                </div>
              )}

              <p
                className={`break-words font-body leading-[1.08] font-extrabold tracking-tight text-ink ${getNameSizeClass(displayName)}`}
              >
                {displayName}
              </p>
              <div aria-hidden="true" className="mt-3 h-2 w-28 rounded-full bg-[#F83F28] sm:w-36" />
            </div>

            {/* Short Personalized Message */}
            <div className="mt-5 flex items-stretch gap-3 sm:mt-6">
              <span aria-hidden="true" className="w-1.5 shrink-0 rounded-full bg-[#F83F28]" />
              <p className="max-w-md text-sm font-bold leading-snug text-ink sm:text-base md:text-lg">
                {attendeeCard.message}
              </p>
            </div>
          </div>

          {/* Right Column: Actual Uploaded Unmodified QR Code Card + Community Caption */}
          <div className="flex flex-col items-center md:col-span-5">
            <div className="w-full max-w-[230px] overflow-hidden rounded-2xl border-[3px] border-ink bg-white shadow-[8px_8px_0_var(--ink)] sm:max-w-[250px]">
              <div className="flex aspect-square items-center justify-center bg-white p-3.5">
                <img
                  src={attendeeCard.qrImageSrc}
                  alt={attendeeCard.qrImageAlt}
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="bg-[#F83F28] px-3 py-2.5 text-center font-display text-xs tracking-wide text-white sm:text-[13px]">
                {attendeeCard.qrLabel}
              </div>
            </div>

            <div className="mt-4 text-center">
              <div className="font-display text-xl leading-tight text-ink sm:text-2xl">
                {attendeeCard.communityMark}
              </div>
              <div className="mt-0.5 text-xs font-bold text-ink/80 sm:text-sm">
                {attendeeCard.communitySublabel}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons in Required Order: 1. Download, 2. Share, 3. Register Another, 4. Back to Homepage */}
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={handleDownloadPng}
          disabled={isDownloading}
          className="pop-btn w-full justify-center bg-primary px-5 py-3.5 text-xs text-ink disabled:cursor-not-allowed disabled:opacity-70 sm:text-sm"
        >
          {isDownloading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              <span>Preparing PNG...</span>
            </>
          ) : (
            <>
              <Download className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>Download Attendance Card</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleShareCard}
          disabled={isSharing}
          className="pop-btn w-full justify-center bg-cream px-5 py-3.5 text-xs text-ink disabled:cursor-not-allowed disabled:opacity-70 sm:text-sm"
        >
          {isSharing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              <span>Preparing Share...</span>
            </>
          ) : (
            <>
              <Share2 className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>Share Attendance Card</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onRegisterAnother}
          className="pop-btn w-full justify-center bg-sand px-5 py-3.5 text-xs text-ink sm:text-sm"
        >
          <RotateCcw className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>Register Another Participant</span>
        </button>

        <Link
          to="/"
          className="pop-btn w-full justify-center bg-cream px-5 py-3.5 text-xs text-ink sm:text-sm"
        >
          <Home className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>Back to Homepage</span>
        </Link>
      </div>

      {statusMessage && (
        <p
          role="status"
          aria-live="polite"
          className="mt-3 inline-flex items-center gap-1.5 text-xs font-extrabold text-ink sm:text-sm"
        >
          <Check className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
          <span>{statusMessage}</span>
        </p>
      )}
    </div>
  );
}
