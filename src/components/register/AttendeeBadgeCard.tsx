import { Link } from "@tanstack/react-router";
import { Check, Download, Home, Linkedin, Loader2, Pencil, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState, type ClipboardEvent, type KeyboardEvent } from "react";
import logo from "@/assets/uxc-logo.png";
import {
  buildAttendeeCardFilename,
  CARD_NAME_BASE_FONT_PT,
  CARD_NAME_MAX_WORDS_PER_LINE,
  clampCardNameLineToMaxWords,
  estimateCardNameFontSizePt,
  measureCardNameFontSizePt,
  ptToCardCqw,
  renderAttendeeCardToJpegBlob,
  sanitizeCardNameLineInput,
  splitNameIntoCardLines,
} from "@/lib/attendee-card-canvas";
import { EVENT_CONFIG } from "@/lib/event-config";

interface AttendeeBadgeCardProps {
  attendeeName: string;
  attendeeCity: string;
  participantNumber: string;
  onRegisterAnother: () => void;
}

function LocationPinGraphic({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 152 152" fill="none" aria-hidden="true" className={className}>
      {/* Dark brown flat trapezoid base */}
      <path
        d="M31 102H121C127 102 130 108 130 108L148 140C152 148 143 148 143 148H9C0 148 4 140 4 140L22 108C25 102 31 102 31 102Z"
        fill="#380701"
      />
      {/* Cream teardrop pin with dark brown outline */}
      <path
        d="M76 131C76 131 25 86 25 51C25 22.8335 47.8335 0 76 0C104.167 0 127 22.8335 127 51C127 86 76 131 76 131Z"
        fill="#FFF7E2"
        stroke="#380701"
        strokeWidth="4.5"
        strokeLinejoin="round"
      />
      {/* Center dark brown hole */}
      <circle cx="76" cy="51" r="16" fill="#380701" />
    </svg>
  );
}

function CalendarGraphic({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 152 152" fill="none" aria-hidden="true" className={className}>
      {/* Two top rounded rings/tabs */}
      <rect x="31" y="2" width="21" height="34" rx="10.5" fill="#380701" />
      <rect x="100" y="2" width="21" height="34" rx="10.5" fill="#380701" />
      {/* Main cream card body */}
      <rect x="3" y="21" width="146" height="128" rx="20" fill="#FFF7E2" />
      {/* Solid dark brown top bar clipped to rounded top corners */}
      <path
        d="M3 41C3 29.9543 11.9543 21 23 21H129C140.046 21 149 29.9543 149 41V60H3V41Z"
        fill="#380701"
      />
      {/* Crisp dark brown outer border */}
      <rect x="3" y="21" width="146" height="128" rx="20" stroke="#380701" strokeWidth="4.5" />
    </svg>
  );
}

export function AttendeeBadgeCard({
  attendeeName,
  attendeeCity,
  participantNumber,
  onRegisterAnother,
}: AttendeeBadgeCardProps) {
  const { attendeeCard, upcomingEvent } = EVENT_CONFIG;

  const [initialLine1, initialLine2] = splitNameIntoCardLines(attendeeName);
  const [nameLine1, setNameLine1] = useState(initialLine1);
  const [nameLine2, setNameLine2] = useState(initialLine2);
  const [nameFontPt, setNameFontPt] = useState(() =>
    estimateCardNameFontSizePt(initialLine1, initialLine2),
  );
  const [focusedLine, setFocusedLine] = useState<1 | 2 | null>(null);

  const line1Ref = useRef<HTMLInputElement | null>(null);
  const line2Ref = useRef<HTMLInputElement | null>(null);
  const sourceNameRef = useRef(attendeeName);

  const [isDownloading, setIsDownloading] = useState(false);
  const [isSharingLinkedIn, setIsSharingLinkedIn] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Only re-initialize editable lines when a brand-new registration submission arrives;
  // never overwrite the participant's manual edits during preview.
  useEffect(() => {
    if (sourceNameRef.current !== attendeeName) {
      sourceNameRef.current = attendeeName;
      const [next1, next2] = splitNameIntoCardLines(attendeeName);
      setNameLine1(next1);
      setNameLine2(next2);
    }
  }, [attendeeName]);

  // Dynamically measure real Jersey 15 text width for both lines whenever text edits
  // occur or once Jersey 15 finishes loading, keeping all text inside the left column.
  useEffect(() => {
    let active = true;
    const recompute = () => {
      if (!active) return;
      setNameFontPt(measureCardNameFontSizePt(nameLine1, nameLine2));
    };

    recompute();

    if (typeof document !== "undefined" && document.fonts) {
      void Promise.allSettled([
        document.fonts.load('400 98px "Jersey 15"'),
        document.fonts.ready,
      ]).then(() => {
        recompute();
      });
    }

    return () => {
      active = false;
    };
  }, [nameLine1, nameLine2]);

  const displayCity = (attendeeCity.trim() || "RAIPUR").toUpperCase();
  const nameFontCqw = ptToCardCqw(nameFontPt);
  const nameStrokeCqw = Number(((nameFontPt / CARD_NAME_BASE_FONT_PT) * 0.65).toFixed(3));

  function shouldBlockSpaceKey(input: HTMLInputElement): boolean {
    const start = input.selectionStart ?? input.value.length;
    const end = input.selectionEnd ?? input.value.length;
    const before = input.value.slice(0, start);
    const after = input.value.slice(end);
    const simulated = `${before} ${after}`;
    const simulatedWords = simulated.trim().split(/\s+/).filter(Boolean);

    if (before.trim().length === 0 || simulatedWords.length === 0) return true;
    if (before.endsWith(" ") || after.startsWith(" ")) return true;
    if (simulatedWords.length > CARD_NAME_MAX_WORDS_PER_LINE) return true;
    if (simulatedWords.length === CARD_NAME_MAX_WORDS_PER_LINE && /\s$/.test(simulated)) {
      return true;
    }

    return false;
  }

  function handleLine1KeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === " " && shouldBlockSpaceKey(event.currentTarget)) {
      event.preventDefault();
      return;
    }
    if (event.key === "Enter" || event.key === "ArrowDown") {
      event.preventDefault();
      line2Ref.current?.focus();
    }
  }

  function handleLine2KeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === " " && shouldBlockSpaceKey(event.currentTarget)) {
      event.preventDefault();
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      line1Ref.current?.focus();
      return;
    }
    if (event.key === "Backspace" && nameLine2.length === 0) {
      event.preventDefault();
      const input1 = line1Ref.current;
      if (input1) {
        input1.focus();
        const end = input1.value.length;
        input1.setSelectionRange(end, end);
      }
    }
  }

  function handleLine1Paste(event: ClipboardEvent<HTMLInputElement>) {
    const pasted = event.clipboardData.getData("text");
    if (pasted.includes("\n")) {
      event.preventDefault();
      const parts = pasted
        .split(/\r?\n/)
        .map((part) => part.trim())
        .filter(Boolean);
      setNameLine1(clampCardNameLineToMaxWords(parts[0] ?? ""));
      setNameLine2(clampCardNameLineToMaxWords(parts.slice(1).join(" ")));
    }
  }

  function triggerBlobDownload(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    window.setTimeout(() => URL.revokeObjectURL(url), 1500);
  }

  function openExternalLinkInNewTab(href: string) {
    const anchor = document.createElement("a");
    anchor.href = href;
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  }

  async function handleDownloadJpeg() {
    if (isDownloading) return;
    setIsDownloading(true);
    setStatusMessage(null);
    try {
      const blob = await renderAttendeeCardToJpegBlob({
        nameLine1,
        nameLine2,
        city: displayCity,
      });
      const filename = buildAttendeeCardFilename(nameLine1, nameLine2, participantNumber);
      triggerBlobDownload(blob, filename);
      setStatusMessage("High-quality JPEG attendance card downloaded.");
    } catch {
      setStatusMessage("Could not generate JPEG right now. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  }

  async function handleShareLinkedIn() {
    if (isSharingLinkedIn) return;
    setIsSharingLinkedIn(true);
    setStatusMessage(null);

    const shareCaption = `Excited to share that I'm attending ${upcomingEvent.name} on ${upcomingEvent.date} in ${upcomingEvent.location}! Looking forward to connecting with Chhattisgarh's UI/UX design community.\n\n#UX36garh #Milaap2026 #UIUXDesign #ChhattisgarhDesign`;

    try {
      const blob = await renderAttendeeCardToJpegBlob({
        nameLine1,
        nameLine2,
        city: displayCity,
      });
      const filename = buildAttendeeCardFilename(nameLine1, nameLine2, participantNumber);
      const file = new File([blob], filename, { type: "image/jpeg" });

      if (
        typeof navigator !== "undefined" &&
        typeof navigator.share === "function" &&
        typeof navigator.canShare === "function" &&
        navigator.canShare({ files: [file] })
      ) {
        await navigator.share({
          title: `${upcomingEvent.name} — Attendance Card`,
          text: shareCaption,
          files: [file],
        });
        setStatusMessage("Attendance card shared!");
        return;
      }

      triggerBlobDownload(blob, filename);

      let captionCopied = false;
      if (navigator.clipboard && window.isSecureContext) {
        try {
          await navigator.clipboard.writeText(shareCaption);
          captionCopied = true;
        } catch {
          captionCopied = false;
        }
      }

      const linkedInComposerUrl = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(shareCaption)}`;
      openExternalLinkInNewTab(linkedInComposerUrl);

      setStatusMessage(
        captionCopied
          ? "JPEG card downloaded, post text copied, and LinkedIn composer opened — attach your downloaded card image to publish!"
          : "JPEG card downloaded and LinkedIn composer opened — attach your downloaded card image to publish!",
      );
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }
      setStatusMessage(
        "Could not open LinkedIn share. Use Download Card (JPEG) and upload it directly on LinkedIn.",
      );
    } finally {
      setIsSharingLinkedIn(false);
    }
  }

  return (
    <div className="mt-7">
      {/* Helper text explaining direct inline name editing without any character-limit restriction */}
      <div className="mb-3 flex items-center justify-center gap-1.5 text-center text-xs font-bold text-ink/80 sm:text-sm">
        <Pencil className="h-3.5 w-3.5 shrink-0 text-[#F83F28]" aria-hidden="true" />
        <span>Click or tap your name directly on the card to arrange it across both lines.</span>
      </div>

      {/* Centered 3:4 Portrait Attendance Card (~14% more compact desktop preview, full-res JPEG on export) */}
      <div className="mx-auto w-full max-w-[465px] px-2 sm:px-0">
        <div
          className="@container relative aspect-[3/4] w-full overflow-hidden rounded-[2px] bg-[#F83F28] text-[#FFF7E2] shadow-[8px_8px_0_var(--ink)] select-none"
          aria-label="Personalized UX 36गढ़ MILAAP 2026 Attendance Card"
        >
          {/* Architectural White Grid Dividers matching exact 768×1024 proportions */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-[10.35%] left-0 z-20 h-px w-[71.09%] bg-white"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-0 bottom-0 left-[71.09%] z-20 w-px bg-white"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-[76.07%] right-0 left-0 z-20 h-px bg-white"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-[76.07%] bottom-0 left-[35.94%] z-20 w-px bg-white"
          />

          {/* 1. Top-Left Header Cell: Official 3D UXC Logo */}
          <div className="absolute top-0 left-0 flex h-[10.35%] w-[71.09%] items-center pl-[7cqw]">
            <img
              src={logo}
              alt="UXC official logo"
              draggable={false}
              className="h-[58%] w-auto object-contain"
            />
          </div>

          {/* 2. Right Decorative Artwork Column */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-0 right-0 flex h-[76.07%] w-[28.91%] items-center justify-center overflow-hidden bg-[#F83F28]"
          >
            <img
              src={attendeeCard.rightArtworkSrc}
              alt=""
              draggable={false}
              className="h-full w-full object-contain"
            />
          </div>

          {/* 3. Main Left Content Cell (full left-section horizontal width up to MILAAP's right margin) */}
          <div className="absolute top-[10.35%] left-0 flex h-[65.72%] w-[71.09%] flex-col justify-between overflow-hidden pt-[7.8cqw] pr-[4.85cqw] pb-[3.9cqw] pl-[7.15cqw]">
            {/* Top group: ATTENDING badge + MILAAP + UI UX Meetup */}
            <div>
              {/* Layered 3D "ATTENDING" Pill (Jersey 15) */}
              <div className="relative inline-block">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-[1.15cqw] bottom-[-1.15cqw] rounded-[1.45cqw] bg-[#380701]"
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-[0.65cqw] bottom-[-0.65cqw] rounded-[1.45cqw] bg-[#F83F28]"
                />
                <span
                  className="relative inline-flex items-center justify-center rounded-[1.45cqw] border-[0.22cqw] border-[#380701] bg-[#FFF7E2] px-[2.45cqw] py-[0.85cqw] text-[4.95cqw] leading-none font-normal tracking-[0.02em] text-[#120401] uppercase [font-synthesis-weight:none]"
                  style={{ fontFamily: "var(--font-pixel)" }}
                >
                  {attendeeCard.badgeLabel}
                </span>
              </div>

              {/* Large 3D MILAAP Wordmark */}
              <div className="mt-[4.8cqw]">
                <img
                  src={attendeeCard.milaapWordmarkSrc}
                  alt="MILAAP"
                  draggable={false}
                  className="w-[59.1cqw] max-w-full object-contain"
                />
              </div>

              {/* "UI UX Meetup" Subtitle (Jersey 15) */}
              <p
                className="card-pixel-text mt-[1.6cqw] text-[7.55cqw] leading-[0.92] tracking-[0.01em]"
                style={{ WebkitTextStroke: "0.52cqw #380701" }}
              >
                {attendeeCard.subtitle}
              </p>
            </div>

            {/* Bottom group inside main cell: Directly Editable 2-Line Name (Jersey 15) + Dynamic City */}
            <div className="w-full min-w-0">
              <div
                className="flex w-full min-w-0 flex-col gap-[0.55cqw]"
                role="group"
                aria-label="Editable participant name on attendance card"
              >
                <input
                  ref={line1Ref}
                  type="text"
                  size={1}
                  value={nameLine1}
                  spellCheck={false}
                  autoComplete="off"
                  autoCapitalize="characters"
                  aria-label="Participant name line 1 (click or tap to edit)"
                  placeholder={!nameLine1 && !nameLine2 ? "YOUR NAME" : ""}
                  onFocus={() => setFocusedLine(1)}
                  onBlur={() => {
                    setFocusedLine((prev) => (prev === 1 ? null : prev));
                    setNameLine1((prev) => clampCardNameLineToMaxWords(prev));
                  }}
                  onChange={(e) =>
                    setNameLine1((prev) => sanitizeCardNameLineInput(e.target.value, prev))
                  }
                  onKeyDown={handleLine1KeyDown}
                  onPaste={handleLine1Paste}
                  className={`card-pixel-text -mx-[0.45cqw] block min-w-0 w-[calc(100%+0.9cqw)] cursor-text border-0 bg-transparent px-[0.45cqw] py-0 leading-[0.76] tracking-[0.015em] uppercase caret-[#FFF7E2] outline-none placeholder:opacity-45 ${
                    focusedLine === 1
                      ? "rounded-[0.5cqw] bg-black/10 underline decoration-[#FFF7E2]/65 decoration-dashed decoration-[0.22cqw] underline-offset-[0.4cqw]"
                      : "hover:rounded-[0.5cqw] hover:bg-black/5"
                  }`}
                  style={{
                    fontSize: `${nameFontCqw}cqw`,
                    WebkitTextStroke: `${nameStrokeCqw}cqw #380701`,
                  }}
                />

                <input
                  ref={line2Ref}
                  type="text"
                  size={1}
                  value={nameLine2}
                  spellCheck={false}
                  autoComplete="off"
                  autoCapitalize="characters"
                  aria-label="Participant name line 2 (click or tap to edit)"
                  placeholder={focusedLine === 2 ? "LINE 2" : ""}
                  onFocus={() => setFocusedLine(2)}
                  onBlur={() => {
                    setFocusedLine((prev) => (prev === 2 ? null : prev));
                    setNameLine2((prev) => clampCardNameLineToMaxWords(prev));
                  }}
                  onChange={(e) =>
                    setNameLine2((prev) => sanitizeCardNameLineInput(e.target.value, prev))
                  }
                  onKeyDown={handleLine2KeyDown}
                  className={`card-pixel-text -mx-[0.45cqw] block min-h-[0.76em] min-w-0 w-[calc(100%+0.9cqw)] cursor-text border-0 bg-transparent px-[0.45cqw] py-0 leading-[0.76] tracking-[0.015em] uppercase caret-[#FFF7E2] outline-none placeholder:opacity-40 ${
                    focusedLine === 2
                      ? "rounded-[0.5cqw] bg-black/10 underline decoration-[#FFF7E2]/65 decoration-dashed decoration-[0.22cqw] underline-offset-[0.4cqw]"
                      : "hover:rounded-[0.5cqw] hover:bg-black/5"
                  }`}
                  style={{
                    fontSize: `${nameFontCqw}cqw`,
                    WebkitTextStroke: `${nameStrokeCqw}cqw #380701`,
                  }}
                />
              </div>

              {/* Dynamic Participant City directly below the two name lines */}
              <p
                className="mt-[1.35cqw] truncate text-[3.8cqw] leading-[1.15] font-medium tracking-[0.03em] text-[#FFF7E2] uppercase"
                style={{ fontFamily: "var(--font-body)" }}
                title={displayCity}
              >
                {displayCity}
              </p>
            </div>
          </div>

          {/* 4. Bottom Row (y=76.07%..100%) */}
          {/* Bottom-Left Cell: Location Pin + Venue (Jersey 15) */}
          <div className="absolute bottom-0 left-0 flex h-[23.93%] w-[35.94%] flex-col justify-between px-[5.85cqw] pt-[4.8cqw] pb-[4.2cqw]">
            <LocationPinGraphic className="h-[9.9cqw] w-[9.9cqw] shrink-0" />
            <div className="leading-[0.86]">
              <p
                className="card-pixel-text text-[5.08cqw] tracking-[0.015em] uppercase"
                style={{ WebkitTextStroke: "0.42cqw #380701" }}
              >
                {attendeeCard.venueLine1}
              </p>
              <p
                className="card-pixel-text text-[5.08cqw] tracking-[0.015em] uppercase"
                style={{ WebkitTextStroke: "0.42cqw #380701" }}
              >
                {attendeeCard.venueLine2}
              </p>
            </div>
          </div>

          {/* Bottom-Middle Cell: Calendar Icon + Date (Jersey 15) */}
          <div className="absolute bottom-0 left-[35.94%] flex h-[23.93%] w-[35.15%] flex-col justify-between px-[5cqw] pt-[4.5cqw] pb-[4.2cqw]">
            <CalendarGraphic className="h-[9.9cqw] w-[9.9cqw] shrink-0" />
            <div className="leading-[0.86]">
              <p
                className="card-pixel-text text-[5.08cqw] tracking-[0.015em] uppercase"
                style={{ WebkitTextStroke: "0.42cqw #380701" }}
              >
                {attendeeCard.dateLine1}
              </p>
              <p
                className="card-pixel-text text-[5.08cqw] tracking-[0.015em] uppercase"
                style={{ WebkitTextStroke: "0.42cqw #380701" }}
              >
                {attendeeCard.dateLine2}
              </p>
            </div>
          </div>

          {/* Bottom-Right Cell: Actual Unmodified White QR Code + "Scan and Explore" */}
          <div className="absolute right-0 bottom-0 flex h-[23.93%] w-[28.91%] flex-col items-center justify-between px-[2.4cqw] pt-[4.9cqw] pb-[3.7cqw]">
            <img
              src={attendeeCard.qrImageSrc}
              alt={attendeeCard.qrImageAlt}
              draggable={false}
              className="aspect-square w-[16.95cqw] object-contain"
            />
            <p
              className="text-center text-[2.42cqw] leading-none font-normal tracking-[0.01em] text-[#FFF7E2]"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {attendeeCard.qrLabel}
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons: High-Quality JPEG Download, Share on LinkedIn, Register Another, Back to Homepage */}
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={handleDownloadJpeg}
          disabled={isDownloading}
          className="pop-btn w-full justify-center bg-primary px-5 py-3.5 text-xs text-ink disabled:cursor-not-allowed disabled:opacity-70 sm:text-sm"
        >
          {isDownloading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              <span>Preparing JPEG...</span>
            </>
          ) : (
            <>
              <Download className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>Download Card (JPEG)</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleShareLinkedIn}
          disabled={isSharingLinkedIn}
          className="pop-btn w-full justify-center bg-cream px-5 py-3.5 text-xs text-ink disabled:cursor-not-allowed disabled:opacity-70 sm:text-sm"
        >
          {isSharingLinkedIn ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              <span>Preparing LinkedIn Share...</span>
            </>
          ) : (
            <>
              <Linkedin className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>Share on LinkedIn</span>
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
          className="mt-3 inline-flex items-start gap-1.5 text-xs font-extrabold text-ink sm:text-sm"
        >
          <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
          <span>{statusMessage}</span>
        </p>
      )}
    </div>
  );
}
