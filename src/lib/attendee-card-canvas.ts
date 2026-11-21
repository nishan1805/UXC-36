import logoUrl from "@/assets/uxc-logo.png";
import { EVENT_CONFIG } from "@/lib/event-config";

const CARD_DESIGN_WIDTH_PT = 768;
const CARD_WIDTH = 1536;
const CARD_HEIGHT = 2048;

/**
 * Left-column name geometry in 768×1024 reference points:
 * Left margin = 55pt, main vertical divider = 546pt, right safety gutter = 38pt.
 * Safe text-measurement width = 442pt (leaves crisp room for outer stroke bleed
 * so the final character never crosses the name area or touches the right artwork).
 */
export const CARD_NAME_SAFE_WIDTH_PT = 442;
export const CARD_NAME_BASE_FONT_PT = 98;
export const CARD_NAME_MIN_FONT_PT = 18;
export const CARD_NAME_MAX_WORDS_PER_LINE = 2;
const CARD_NAME_TRACKING_EM = 0.015;

const PIXEL_FONT_FAMILY = '"Jersey 15", "Noto Sans Devanagari", monospace';

const COLORS = {
  bg: EVENT_CONFIG.attendeeCard.brandBgColor, // #F83F28
  cream: EVENT_CONFIG.attendeeCard.creamColor, // #FFF7E2
  ink: EVENT_CONFIG.attendeeCard.inkColor, // #380701
  pillText: "#120401",
  divider: "#FFFFFF",
};

export interface AttendeeCardRenderData {
  nameLine1: string;
  nameLine2: string;
  city: string;
}

let cachedMeasureCtx: CanvasRenderingContext2D | null = null;

function getMeasureContext(): CanvasRenderingContext2D | null {
  if (typeof document === "undefined") return null;
  if (!cachedMeasureCtx) {
    const canvas = document.createElement("canvas");
    cachedMeasureCtx = canvas.getContext("2d");
  }
  return cachedMeasureCtx;
}

function measureJerseyTextWidth(
  ctx: CanvasRenderingContext2D,
  text: string,
  fontSizePx: number,
  trackingEm = 0,
): number {
  if (!text) return 0;
  ctx.font = `400 ${fontSizePx}px ${PIXEL_FONT_FAMILY}`;
  const rawWidth = ctx.measureText(text).width;
  const trackingExtra = Math.max(0, text.length - 1) * fontSizePx * trackingEm;
  return rawWidth + trackingExtra;
}

function computeNameFontSizeForContext(
  ctx: CanvasRenderingContext2D,
  line1: string,
  line2: string,
  maxWidthPx: number,
  baseFontPx: number,
  minFontPx: number,
): number {
  const candidates = [line1.toUpperCase(), line2.toUpperCase()].filter((line) => line.length > 0);
  if (candidates.length === 0) return baseFontPx;

  const sampleSize = 100;
  let widestAtSample = 0;
  for (const line of candidates) {
    const measured = measureJerseyTextWidth(ctx, line, sampleSize, CARD_NAME_TRACKING_EM);
    if (measured > widestAtSample) widestAtSample = measured;
  }

  if (widestAtSample <= 0) return baseFontPx;

  const fittedPx = (maxWidthPx * sampleSize) / widestAtSample;
  const smoothPx = Math.floor(fittedPx * 2) / 2;
  return Math.max(minFontPx, Math.min(baseFontPx, smoothPx));
}

/**
 * Estimates a safe initial Jersey 15 font size (in 768pt card space) before canvas
 * measurement runs (e.g. during SSR), then uses real Canvas 2D text-width measurement
 * in the browser so both lines fit cleanly inside the full left section without clipping.
 */
export function estimateCardNameFontSizePt(line1: string, line2: string): number {
  const longestLen = Math.max(line1.length, line2.length);
  if (longestLen === 0) return CARD_NAME_BASE_FONT_PT;
  const estimatedWidthAtBase = longestLen * CARD_NAME_BASE_FONT_PT * 0.45;
  if (estimatedWidthAtBase <= CARD_NAME_SAFE_WIDTH_PT) return CARD_NAME_BASE_FONT_PT;
  const scaled = (CARD_NAME_SAFE_WIDTH_PT / estimatedWidthAtBase) * CARD_NAME_BASE_FONT_PT;
  return Math.max(CARD_NAME_MIN_FONT_PT, Math.floor(scaled));
}

export function measureCardNameFontSizePt(line1: string, line2: string): number {
  const ctx = getMeasureContext();
  if (!ctx) return estimateCardNameFontSizePt(line1, line2);
  return computeNameFontSizeForContext(
    ctx,
    line1,
    line2,
    CARD_NAME_SAFE_WIDTH_PT,
    CARD_NAME_BASE_FONT_PT,
    CARD_NAME_MIN_FONT_PT,
  );
}

export function ptToCardCqw(pt: number): number {
  return Number(((pt / CARD_DESIGN_WIDTH_PT) * 100).toFixed(3));
}

/**
 * Clamps a single card name line to at most CARD_NAME_MAX_WORDS_PER_LINE (2) words.
 */
export function clampCardNameLineToMaxWords(rawLine: string): string {
  const words = rawLine.trim().toUpperCase().split(/\s+/).filter(Boolean);
  return words.slice(0, CARD_NAME_MAX_WORDS_PER_LINE).join(" ");
}

/**
 * Sanitizes live typing or pasting inside a single editable name line so participants
 * can freely type, delete, and edit up to 2 words per line while preventing a 3rd word
 * from being inserted and never auto-rearranging words across lines.
 */
export function sanitizeCardNameLineInput(nextRaw: string, prevValue: string): string {
  const collapsed = nextRaw
    .replace(/[\r\n\t]+/g, " ")
    .replace(/ {2,}/g, " ")
    .toUpperCase();
  const words = collapsed.trim().split(" ").filter(Boolean);

  if (words.length === 0) {
    return "";
  }

  if (words.length === 1) {
    const singleWord = words[0] ?? "";
    if (collapsed.endsWith(" ")) {
      return `${singleWord} `;
    }
    if (collapsed.startsWith(" ") && prevValue.includes(" ")) {
      return ` ${singleWord}`;
    }
    return singleWord;
  }

  if (words.length === 2) {
    return `${words[0] ?? ""} ${words[1] ?? ""}`;
  }

  // More than 2 words: if the user only inserted whitespace into an existing 2-word line
  // (e.g. via a mobile keyboard that bypasses keydown), preserve the previous value
  // intact instead of truncating the second word.
  const prevWords = prevValue.trim().split(/\s+/).filter(Boolean);
  const sameNonSpaceText =
    nextRaw.replace(/\s+/g, "").toUpperCase() === prevValue.replace(/\s+/g, "").toUpperCase();
  if (prevWords.length >= CARD_NAME_MAX_WORDS_PER_LINE && sameNonSpaceText) {
    return prevValue;
  }

  return words.slice(0, CARD_NAME_MAX_WORDS_PER_LINE).join(" ");
}

/**
 * Automatically distributes a participant's registered full name across two editable
 * card lines while respecting the maximum of two words per line:
 * - 1 word: [word1, ""]
 * - 2 words: [word1, word2]
 * - 3 words: [word1 + " " + word2, word3]
 * - 4+ words: [word1 + " " + word2, word3 + " " + word4] (participants can shorten/rearrange directly on the card)
 */
export function splitNameIntoCardLines(rawName: string): [string, string] {
  const normalized = rawName.trim().replace(/\s+/g, " ").toUpperCase();
  if (!normalized) return ["", ""];

  const words = normalized.split(" ").filter(Boolean);
  const firstWord = words[0];
  if (!firstWord) return ["", ""];

  if (words.length === 1) {
    return [firstWord, ""];
  }

  if (words.length === 2) {
    return [firstWord, words[1] ?? ""];
  }

  const line1 = words.slice(0, CARD_NAME_MAX_WORDS_PER_LINE).join(" ");
  const line2 = words
    .slice(CARD_NAME_MAX_WORDS_PER_LINE, CARD_NAME_MAX_WORDS_PER_LINE * 2)
    .join(" ");

  return [line1, line2];
}

export function buildAttendeeCardFilename(
  nameLine1: string,
  nameLine2: string,
  participantNumberLabel?: string,
): string {
  const numSlug = (participantNumberLabel ?? "").replace(/[^0-9]/g, "");
  const combinedName = `${nameLine1} ${nameLine2}`.trim();
  const nameSlug = combinedName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const parts = ["ux36garh-milaap-2026", numSlug, nameSlug || "attendee"].filter(Boolean);
  return `${parts.join("-")}.jpg`;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
}

function drawRoundedRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number | { tl: number; tr: number; br: number; bl: number },
) {
  const radii = typeof r === "number" ? { tl: r, tr: r, br: r, bl: r } : r;
  ctx.beginPath();
  ctx.moveTo(x + radii.tl, y);
  ctx.lineTo(x + w - radii.tr, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radii.tr);
  ctx.lineTo(x + w, y + h - radii.br);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radii.br, y + h);
  ctx.lineTo(x + radii.bl, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radii.bl);
  ctx.lineTo(x, y + radii.tl);
  ctx.quadraticCurveTo(x, y, x + radii.tl, y);
  ctx.closePath();
}

function drawTrackedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  trackingPx: number,
  mode: "stroke" | "fill",
) {
  if (!text) return;
  if (trackingPx <= 0) {
    if (mode === "stroke") ctx.strokeText(text, x, y);
    else ctx.fillText(text, x, y);
    return;
  }

  let cursorX = x;
  for (const ch of text) {
    if (mode === "stroke") ctx.strokeText(ch, cursorX, y);
    else ctx.fillText(ch, cursorX, y);
    cursorX += ctx.measureText(ch).width + trackingPx;
  }
}

function drawOutlinedJerseyText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  fontSize: number,
  strokeWidth: number,
  maxWidth?: number,
  trackingEm = 0,
) {
  if (!text) return;

  let activeSize = fontSize;
  if (maxWidth) {
    while (
      measureJerseyTextWidth(ctx, text, activeSize, trackingEm) > maxWidth &&
      activeSize > 24
    ) {
      activeSize -= 2;
    }
  }

  ctx.font = `400 ${activeSize}px ${PIXEL_FONT_FAMILY}`;
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.lineJoin = "round";
  ctx.miterLimit = 2;

  const trackingPx = activeSize * trackingEm;
  ctx.strokeStyle = COLORS.ink;
  ctx.lineWidth = strokeWidth * (activeSize / fontSize);
  drawTrackedText(ctx, text, x, y, trackingPx, "stroke");

  ctx.fillStyle = COLORS.cream;
  drawTrackedText(ctx, text, x, y, trackingPx, "fill");
}

function drawLocationPinIcon(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  const s = size / 152;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);

  // Dark brown trapezoid base shadow
  ctx.beginPath();
  ctx.moveTo(31, 102);
  ctx.lineTo(121, 102);
  ctx.quadraticCurveTo(127, 102, 130, 108);
  ctx.lineTo(148, 140);
  ctx.quadraticCurveTo(152, 148, 143, 148);
  ctx.lineTo(9, 148);
  ctx.quadraticCurveTo(0, 148, 4, 140);
  ctx.lineTo(22, 108);
  ctx.quadraticCurveTo(25, 102, 31, 102);
  ctx.closePath();
  ctx.fillStyle = COLORS.ink;
  ctx.fill();

  // Cream teardrop pin with dark brown outline
  ctx.beginPath();
  ctx.moveTo(76, 131);
  ctx.bezierCurveTo(76, 131, 25, 86, 25, 51);
  ctx.arc(76, 51, 51, Math.PI, 0, false);
  ctx.bezierCurveTo(127, 86, 76, 131, 76, 131);
  ctx.closePath();
  ctx.fillStyle = COLORS.cream;
  ctx.fill();
  ctx.lineWidth = 4.5;
  ctx.strokeStyle = COLORS.ink;
  ctx.stroke();

  // Inner dark brown hole
  ctx.beginPath();
  ctx.arc(76, 51, 16, 0, Math.PI * 2);
  ctx.fillStyle = COLORS.ink;
  ctx.fill();

  ctx.restore();
}

function drawCalendarIcon(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  const s = size / 152;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);

  // Two top rounded tabs
  ctx.fillStyle = COLORS.ink;
  drawRoundedRectPath(ctx, 31, 2, 21, 34, 10.5);
  ctx.fill();
  drawRoundedRectPath(ctx, 100, 2, 21, 34, 10.5);
  ctx.fill();

  // Main cream rounded body
  ctx.save();
  drawRoundedRectPath(ctx, 3, 21, 146, 128, 20);
  ctx.fillStyle = COLORS.cream;
  ctx.fill();
  ctx.clip();

  // Solid dark brown header bar
  ctx.fillStyle = COLORS.ink;
  ctx.fillRect(0, 18, 152, 42);
  ctx.restore();

  // Crisp dark brown border around calendar body
  drawRoundedRectPath(ctx, 3, 21, 146, 128, 20);
  ctx.lineWidth = 4.5;
  ctx.strokeStyle = COLORS.ink;
  ctx.stroke();

  ctx.restore();
}

/**
 * Renders the finalized UX 36गढ़ MILAAP 2026 Attendance Card as a high-quality
 * 1536×2048 (3:4 portrait) JPEG Blob using the exact Jersey 15 typography and
 * real text-width measurement matching the uploaded Shareable Card reference.
 */
export async function renderAttendeeCardToJpegBlob(data: AttendeeCardRenderData): Promise<Blob> {
  if (typeof document === "undefined") {
    throw new Error("Canvas rendering requires a browser environment.");
  }

  if (document.fonts) {
    await Promise.allSettled([
      document.fonts.load('400 76px "Jersey 15"'),
      document.fonts.load('400 196px "Jersey 15"'),
      document.fonts.load('500 58px "Barlow"'),
      document.fonts.load('400 37px "Barlow"'),
    ]);
    await document.fonts.ready;
  }

  const canvas = document.createElement("canvas");
  canvas.width = CARD_WIDTH;
  canvas.height = CARD_HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Unable to acquire 2D canvas context.");
  }

  const { attendeeCard } = EVENT_CONFIG;
  const line1 = clampCardNameLineToMaxWords(data.nameLine1);
  const line2 = clampCardNameLineToMaxWords(data.nameLine2);
  const cityText = (data.city.trim() || "RAIPUR").toUpperCase();

  // Preload all visual assets in parallel
  const [uxcLogoImg, milaapImg, artworkImg, qrImg] = await Promise.all([
    loadImage(logoUrl).catch(() => null),
    loadImage(attendeeCard.milaapWordmarkSrc).catch(() => null),
    loadImage(attendeeCard.rightArtworkSrc).catch(() => null),
    loadImage(attendeeCard.qrImageSrc),
  ]);

  // 1. Official #F83F28 coral-red background
  ctx.fillStyle = COLORS.bg;
  ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);

  // 2. Right-column decorative stippled artwork (x=1094..1536, y=0..1556)
  if (artworkImg) {
    const targetX = 1094;
    const targetY = 2;
    const targetW = CARD_WIDTH - targetX;
    const targetH = 1554;
    const scale = Math.min(targetW / artworkImg.naturalWidth, targetH / artworkImg.naturalHeight);
    const drawW = artworkImg.naturalWidth * scale;
    const drawH = artworkImg.naturalHeight * scale;
    ctx.drawImage(
      artworkImg,
      targetX + (targetW - drawW) / 2,
      targetY + (targetH - drawH) / 2,
      drawW,
      drawH,
    );
  }

  // 3. Crisp white architectural grid dividers (exact PDF positions scaled 2x)
  ctx.fillStyle = COLORS.divider;
  ctx.fillRect(0, 211, 1093, 2.5);
  ctx.fillRect(1091, 0, 2.5, CARD_HEIGHT);
  ctx.fillRect(0, 1557, CARD_WIDTH, 2.5);
  ctx.fillRect(551, 1558, 2.5, CARD_HEIGHT - 1558);

  // 4. Top-left official UXC 3D logo
  if (uxcLogoImg) {
    const maxW = 148;
    const maxH = 122;
    const scale = Math.min(maxW / uxcLogoImg.naturalWidth, maxH / uxcLogoImg.naturalHeight);
    const drawW = uxcLogoImg.naturalWidth * scale;
    const drawH = uxcLogoImg.naturalHeight * scale;
    ctx.drawImage(uxcLogoImg, 108, 49 + (maxH - drawH) / 2, drawW, drawH);
  }

  // 5. "ATTENDING" 3D layered pill badge (Jersey 15)
  const pillX = 110;
  const pillY = 372;
  const pillW = 314;
  const pillH = 104;
  const pillR = 22;

  drawRoundedRectPath(ctx, pillX, pillY + 18, pillW, pillH, pillR);
  ctx.fillStyle = COLORS.ink;
  ctx.fill();

  drawRoundedRectPath(ctx, pillX, pillY + 10, pillW, pillH, pillR);
  ctx.fillStyle = COLORS.bg;
  ctx.fill();

  drawRoundedRectPath(ctx, pillX, pillY, pillW, pillH, pillR);
  ctx.fillStyle = COLORS.cream;
  ctx.fill();
  ctx.lineWidth = 3.5;
  ctx.strokeStyle = COLORS.ink;
  ctx.stroke();

  ctx.fillStyle = COLORS.pillText;
  ctx.font = `400 76px ${PIXEL_FONT_FAMILY}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(attendeeCard.badgeLabel, pillX + pillW / 2, pillY + pillH / 2 + 2);

  // 6. Large 3D "MILAAP" display wordmark
  if (milaapImg) {
    const targetW = 910;
    const targetH = (milaapImg.naturalHeight / milaapImg.naturalWidth) * targetW;
    ctx.drawImage(milaapImg, 108, 566, targetW, targetH);
  }

  // 7. "UI UX Meetup" subtitle (Jersey 15)
  drawOutlinedJerseyText(ctx, attendeeCard.subtitle, 112, 928, 116, 8, 900, 0.01);

  // 8. Dynamic Participant Name (2 editable lines, Jersey 15, full left-column width,
  // auto-fitted strictly inside the left section using real text-width measurement)
  const nameMaxWidthPx = CARD_NAME_SAFE_WIDTH_PT * 2; // 884px inside 1091px left column
  const baseNameFontPx = CARD_NAME_BASE_FONT_PT * 2; // 196px
  const minNameFontPx = CARD_NAME_MIN_FONT_PT * 2; // 36px

  const nameFontPx = computeNameFontSizeForContext(
    ctx,
    line1,
    line2,
    nameMaxWidthPx,
    baseNameFontPx,
    minNameFontPx,
  );
  const nameStrokePx = Math.max(4, Math.round(10 * (nameFontPx / baseNameFontPx)));
  const nameLineStepPx = Math.round(nameFontPx * 0.69);

  // Anchor bottom of the 2-line block cleanly above the participant city at y=1458
  const line2BaselineY = 1390;
  const line1BaselineY = line2BaselineY - nameLineStepPx;

  // Clip strictly to the left panel as a final guarantee against ever touching the right artwork
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 960, 1086, 594);
  ctx.clip();

  if (line1) {
    drawOutlinedJerseyText(
      ctx,
      line1,
      112,
      line1BaselineY,
      nameFontPx,
      nameStrokePx,
      nameMaxWidthPx,
      CARD_NAME_TRACKING_EM,
    );
  }
  if (line2) {
    drawOutlinedJerseyText(
      ctx,
      line2,
      112,
      line2BaselineY,
      nameFontPx,
      nameStrokePx,
      nameMaxWidthPx,
      CARD_NAME_TRACKING_EM,
    );
  }

  // 9. Dynamic Participant City directly below name
  let cityFontSize = 58;
  ctx.font = `500 ${cityFontSize}px "Barlow", "Noto Sans Devanagari", sans-serif`;
  while (ctx.measureText(cityText).width > nameMaxWidthPx && cityFontSize > 28) {
    cityFontSize -= 2;
    ctx.font = `500 ${cityFontSize}px "Barlow", "Noto Sans Devanagari", sans-serif`;
  }
  ctx.fillStyle = COLORS.cream;
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.fillText(cityText, 114, 1466);
  ctx.restore();

  // 10. Bottom-left cell: Location Pin icon + "KURSI, GE" / "ROAD, RAIPUR" (Jersey 15)
  drawLocationPinIcon(ctx, 90, 1632, 152);
  drawOutlinedJerseyText(ctx, attendeeCard.venueLine1, 91, 1898, 78, 6.5, 420, 0.015);
  drawOutlinedJerseyText(ctx, attendeeCard.venueLine2, 91, 1962, 78, 6.5, 420, 0.015);

  // 11. Bottom-middle cell: Calendar icon + "SUNDAY," / "29 NOV 2026" (Jersey 15)
  drawCalendarIcon(ctx, 628, 1628, 152);
  drawOutlinedJerseyText(ctx, attendeeCard.dateLine1, 629, 1898, 78, 6.5, 420, 0.015);
  drawOutlinedJerseyText(ctx, attendeeCard.dateLine2, 629, 1962, 78, 6.5, 420, 0.015);

  // 12. Bottom-right cell: Actual unmodified white QR code + "Scan and Explore"
  const qrSize = 260;
  const qrCenterX = 1316;
  const qrX = Math.round(qrCenterX - qrSize / 2);
  const qrY = 1632;
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);

  ctx.fillStyle = COLORS.cream;
  ctx.font = '400 37px "Barlow", sans-serif';
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.fillText(attendeeCard.qrLabel, qrCenterX, 1962);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Could not export attendance card JPEG."));
        }
      },
      "image/jpeg",
      0.95,
    );
  });
}
