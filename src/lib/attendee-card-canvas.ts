import logoUrl from "@/assets/uxc-logo.png";
import { EVENT_CONFIG } from "@/lib/event-config";

const CARD_WIDTH = 1600;
const CARD_HEIGHT = 900;

const COLORS = {
  white: "#FFFFFF",
  ink: "#380701",
  accent: EVENT_CONFIG.attendeeCard.accentColor, // #F83F28
  accentSoft: EVENT_CONFIG.attendeeCard.accentSoftColor, // #FFB3A7
  cream: "#FFF7E2",
};

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

function wrapTextLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.trim().split(/\s+/);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (ctx.measureText(candidate).width <= maxWidth || !current) {
      current = candidate;
    } else {
      lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

export function buildAttendeeCardFilename(
  attendeeName: string,
  participantNumberLabel?: string,
): string {
  const numSlug = (participantNumberLabel ?? "").replace(/[^0-9]/g, "");
  const nameSlug = attendeeName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const parts = ["ux36garh-milaap-2026", numSlug, nameSlug || "attendee"].filter(Boolean);
  return `${parts.join("-")}.png`;
}

/**
 * Renders the personalized UX 36गढ़ MILAAP 2026 Attendance Card as a crisp 1600×900 PNG Blob.
 * Uses the official #F83F28 logo accent color, dynamic participant name, unique sequential
 * registration number (#001, #002, ...), and the exact unmodified uploaded QR code asset.
 */
export async function renderAttendeeCardToBlob(
  attendeeName: string,
  participantNumberLabel: string,
): Promise<Blob> {
  if (typeof document === "undefined") {
    throw new Error("Canvas rendering requires a browser environment.");
  }

  if (document.fonts && typeof document.fonts.ready !== "undefined") {
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
  const displayName = attendeeName.trim() || "UX 36गढ़ Member";
  const badgeNumber = participantNumberLabel.trim();

  // 1. Crisp white card background
  ctx.fillStyle = COLORS.white;
  ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);

  // 2. Decorative corner geometric accents (#F83F28 & harmonious soft coral)
  // Top-right soft companion pill
  ctx.save();
  ctx.translate(1205, -25);
  ctx.rotate((30 * Math.PI) / 180);
  drawRoundedRectPath(ctx, -40, -10, 82, 230, 41);
  ctx.fillStyle = COLORS.accentSoft;
  ctx.fill();
  ctx.restore();

  // Top-right primary #F83F28 geometric wedge
  ctx.save();
  ctx.translate(1410, -45);
  ctx.rotate((-24 * Math.PI) / 180);
  drawRoundedRectPath(ctx, -180, -30, 440, 210, 48);
  ctx.fillStyle = COLORS.accent;
  ctx.fill();
  ctx.restore();

  // Bottom-left soft companion pill
  ctx.save();
  ctx.translate(295, 915);
  ctx.rotate((-32 * Math.PI) / 180);
  drawRoundedRectPath(ctx, -60, -125, 120, 250, 26);
  ctx.fillStyle = COLORS.accentSoft;
  ctx.fill();
  ctx.restore();

  // Bottom-left primary #F83F28 geometric wedge
  ctx.save();
  ctx.translate(75, 920);
  ctx.rotate((-24 * Math.PI) / 180);
  drawRoundedRectPath(ctx, -190, -145, 390, 230, 40);
  ctx.fillStyle = COLORS.accent;
  ctx.fill();
  ctx.restore();

  // Bottom-right 5x3 #F83F28 dot matrix
  ctx.fillStyle = COLORS.accent;
  const dotStartX = 1445;
  const dotStartY = 824;
  const dotGapX = 24;
  const dotGapY = 24;
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 5; col++) {
      ctx.beginPath();
      ctx.arc(dotStartX + col * dotGapX, dotStartY + row * dotGapY, 5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // 3. Top-Left Branding Lockup
  const badgeX = 84;
  const badgeY = 66;
  const badgeSize = 174;
  drawRoundedRectPath(ctx, badgeX, badgeY, badgeSize, badgeSize, 36);
  ctx.fillStyle = COLORS.accent;
  ctx.fill();

  try {
    const logoImg = await loadImage(logoUrl);
    const maxLogoW = 132;
    const maxLogoH = 92;
    const scale = Math.min(maxLogoW / logoImg.naturalWidth, maxLogoH / logoImg.naturalHeight);
    const drawW = logoImg.naturalWidth * scale;
    const drawH = logoImg.naturalHeight * scale;
    ctx.drawImage(
      logoImg,
      badgeX + (badgeSize - drawW) / 2,
      badgeY + 28 + (maxLogoH - drawH) / 2,
      drawW,
      drawH,
    );
  } catch {
    ctx.fillStyle = COLORS.white;
    ctx.font = '900 54px "Archivo Black", sans-serif';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("UXC", badgeX + badgeSize / 2, badgeY + 74);
  }

  // "36गढ़" inside #F83F28 icon badge
  ctx.fillStyle = COLORS.white;
  ctx.font = '900 28px "Barlow", "Noto Sans Devanagari", sans-serif';
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.fillText("36गढ़", badgeX + badgeSize / 2, badgeY + badgeSize - 22);

  // Vertical #F83F28 divider line
  drawRoundedRectPath(ctx, 296, 84, 10, 138, 5);
  ctx.fillStyle = COLORS.accent;
  ctx.fill();

  // Stacked event title: UX 36गढ़ / MILAAP 2026
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = COLORS.ink;
  ctx.font = '900 66px "Archivo Black", "Noto Sans Devanagari", sans-serif';
  ctx.fillText("UX 36गढ़", 342, 144);

  const milaapY = 216;
  ctx.fillStyle = COLORS.ink;
  ctx.font = '900 72px "Archivo Black", "Noto Sans Devanagari", sans-serif';
  const milaapText = "MILAAP ";
  ctx.fillText(milaapText, 342, milaapY);
  const milaapWidth = ctx.measureText(milaapText).width;
  ctx.fillStyle = COLORS.accent;
  ctx.fillText("2026", 342 + milaapWidth - 6, milaapY);

  // 4. Left Column — "I'M ATTENDING!" Slanted 3D Headline + Burst Rays
  const attendingX = 96;
  const attendingY = 392;
  ctx.save();
  ctx.translate(attendingX, attendingY);
  ctx.transform(1, 0, -0.16, 1, 0, 0);
  ctx.font = '900 84px "Archivo Black", sans-serif';
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.lineJoin = "round";

  // Outer #F83F28 hard shadow
  ctx.fillStyle = COLORS.accent;
  ctx.strokeStyle = COLORS.accent;
  ctx.lineWidth = 10;
  ctx.strokeText(attendeeCard.heading, 10, 14);
  ctx.fillText(attendeeCard.heading, 10, 14);

  // Mid dark brown hard shadow
  ctx.fillStyle = COLORS.ink;
  ctx.strokeStyle = COLORS.ink;
  ctx.lineWidth = 10;
  ctx.strokeText(attendeeCard.heading, 4, 6);
  ctx.fillText(attendeeCard.heading, 4, 6);

  // Cream foreground with crisp dark brown outline
  ctx.strokeStyle = COLORS.ink;
  ctx.lineWidth = 8;
  ctx.strokeText(attendeeCard.heading, 0, 0);
  ctx.fillStyle = COLORS.cream;
  ctx.fillText(attendeeCard.heading, 0, 0);
  ctx.restore();

  // Three #F83F28 comic burst rays above "!"
  const drawRay = (cx: number, cy: number, angleDeg: number, length: number, width: number) => {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate((angleDeg * Math.PI) / 180);
    drawRoundedRectPath(ctx, -width / 2, -length / 2, width, length, width / 2);
    ctx.fillStyle = COLORS.accent;
    ctx.fill();
    ctx.restore();
  };
  drawRay(898, 260, 4, 38, 13);
  drawRay(934, 272, 34, 42, 13);
  drawRay(954, 302, 68, 34, 13);

  // 5. Dynamic Sequential Participant Number Pill (#001, #002, ...) right above/beside attendee name
  let nameAreaTopY = 534;
  if (badgeNumber) {
    ctx.font = '900 32px "Archivo Black", "Barlow", sans-serif';
    const numTextWidth = ctx.measureText(badgeNumber).width;
    const pillW = Math.max(122, Math.ceil(numTextWidth + 44));
    const pillH = 52;
    const pillX = 94;
    const pillY = 434;

    // Dark brown crisp hard offset shadow under participant number badge
    drawRoundedRectPath(ctx, pillX + 5, pillY + 5, pillW, pillH, 12);
    ctx.fillStyle = COLORS.ink;
    ctx.fill();

    drawRoundedRectPath(ctx, pillX, pillY, pillW, pillH, 12);
    ctx.fillStyle = COLORS.accent;
    ctx.fill();
    ctx.strokeStyle = COLORS.ink;
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.fillStyle = COLORS.white;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(badgeNumber, pillX + pillW / 2, pillY + pillH / 2 + 1);
    nameAreaTopY = 574;
  }

  // 6. Dynamic Attendee Name (auto-scaled so long names never overflow into QR column)
  const maxNameWidth = 850;
  let nameFontSize = 90;
  ctx.font = `900 ${nameFontSize}px "Barlow", "Noto Sans Devanagari", sans-serif`;
  while (ctx.measureText(displayName).width > maxNameWidth && nameFontSize > 48) {
    nameFontSize -= 4;
    ctx.font = `900 ${nameFontSize}px "Barlow", "Noto Sans Devanagari", sans-serif`;
  }

  const nameLines = wrapTextLines(ctx, displayName, maxNameWidth).slice(0, 2);
  ctx.fillStyle = COLORS.ink;
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  const nameStartY = nameLines.length > 1 ? nameAreaTopY - 26 : nameAreaTopY;
  const nameLineHeight = Math.round(nameFontSize * 1.06);
  nameLines.forEach((line, idx) => {
    ctx.fillText(line, 92, nameStartY + idx * nameLineHeight);
  });

  // Horizontal #F83F28 accent pill bar directly under name
  const barY = nameStartY + (nameLines.length - 1) * nameLineHeight + 24;
  drawRoundedRectPath(ctx, 94, barY, 244, 13, 6.5);
  ctx.fillStyle = COLORS.accent;
  ctx.fill();

  // 7. Personalized Message with Vertical #F83F28 Bar
  const msgY = Math.max(barY + 46, 660);
  drawRoundedRectPath(ctx, 88, msgY, 11, 102, 5.5);
  ctx.fillStyle = COLORS.accent;
  ctx.fill();

  ctx.fillStyle = COLORS.ink;
  ctx.font = '700 38px "Barlow", "Noto Sans Devanagari", sans-serif';
  const msgLines = wrapTextLines(ctx, attendeeCard.message, 740);
  msgLines.forEach((line, idx) => {
    ctx.fillText(line, 128, msgY + 38 + idx * 50);
  });

  // 8. Right Column — Rounded QR Card Frame with Hard Dark Brown Shadow
  const qrCardX = 1032;
  const qrCardY = 192;
  const qrCardW = 446;
  const qrCardH = 468;
  const qrRadius = 34;

  // Hard offset dark brown shadow
  drawRoundedRectPath(ctx, qrCardX + 16, qrCardY + 18, qrCardW, qrCardH, qrRadius);
  ctx.fillStyle = COLORS.ink;
  ctx.fill();

  // Card body (clipped)
  ctx.save();
  drawRoundedRectPath(ctx, qrCardX, qrCardY, qrCardW, qrCardH, qrRadius);
  ctx.fillStyle = COLORS.white;
  ctx.fill();
  ctx.clip();

  // Bottom #F83F28 strip inside QR card
  const bannerH = 82;
  ctx.fillStyle = COLORS.accent;
  ctx.fillRect(qrCardX, qrCardY + qrCardH - bannerH, qrCardW, bannerH);

  // "SCAN TO EXPLORE UXC" label inside #F83F28 strip
  ctx.fillStyle = COLORS.white;
  ctx.font = '900 28px "Barlow", "Archivo Black", sans-serif';
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(attendeeCard.qrLabel, qrCardX + qrCardW / 2, qrCardY + qrCardH - bannerH / 2 + 1);

  // Unmodified uploaded QR code image (preserving exact original aspect ratio & scannability)
  const qrAreaTop = qrCardY + 20;
  const qrAreaHeight = qrCardH - bannerH - 40;
  const qrAreaWidth = qrCardW - 44;

  const qrImg = await loadImage(attendeeCard.qrImageSrc);
  const scale = Math.min(qrAreaWidth / qrImg.naturalWidth, qrAreaHeight / qrImg.naturalHeight);
  const drawW = qrImg.naturalWidth * scale;
  const drawH = qrImg.naturalHeight * scale;
  const drawX = qrCardX + (qrCardW - drawW) / 2;
  const drawY = qrAreaTop + (qrAreaHeight - drawH) / 2;
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(qrImg, drawX, drawY, drawW, drawH);
  ctx.imageSmoothingEnabled = true;

  ctx.restore();

  // Crisp dark brown outline around QR card
  drawRoundedRectPath(ctx, qrCardX, qrCardY, qrCardW, qrCardH, qrRadius);
  ctx.strokeStyle = COLORS.ink;
  ctx.lineWidth = 5;
  ctx.stroke();

  // 9. Community Caption Directly Below QR Card
  const captionCenterX = qrCardX + qrCardW / 2;
  ctx.fillStyle = COLORS.ink;
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.font = '900 44px "Archivo Black", "Noto Sans Devanagari", sans-serif';
  ctx.fillText(attendeeCard.communityMark, captionCenterX, 742);

  ctx.font = '600 24px "Barlow", sans-serif';
  ctx.fillText(attendeeCard.communitySublabel, captionCenterX, 780);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error("Could not export attendance card PNG."));
      }
    }, "image/png");
  });
}
