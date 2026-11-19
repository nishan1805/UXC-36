import { ArrowDown, Calendar, Clock, MapPin } from "lucide-react";
import type { MouseEvent } from "react";
import { RegistrationMusicControl } from "@/components/register/RegistrationMusicControl";
import { EVENT_CONFIG } from "@/lib/event-config";

/**
 * Exact homepage wave text animation timing & word/character clusters for
 * "Let's connect, learn and grow together."
 */
const HERO_HEADLINE_LINES: string[][][] = [
  [
    ["L", "e", "t", "'", "s"],
    ["c", "o", "n", "n", "e", "c", "t", ","],
  ],
  [
    ["l", "e", "a", "r", "n"],
    ["a", "n", "d"],
    ["g", "r", "o", "w"],
  ],
  [["t", "o", "g", "e", "t", "h", "e", "r", "."]],
];

const WAVE_PERIOD_SECONDS = 4.8;
const WAVE_STEP_SECONDS = 0.42;

function getWaveDelay(charPosition: number): string {
  const delay = -(WAVE_PERIOD_SECONDS * 3 - charPosition * WAVE_STEP_SECONDS);
  return `${delay.toFixed(2)}s`;
}

interface CollageSlot {
  photoIndex: number;
  containerClass: string;
  aspectClass: string;
  eager?: boolean;
}

/**
 * Balanced scrapbook-style collage positions distributing all 8 real community photographs
 * across top, bottom, left, and right areas of the hero.
 * Hover effects are enabled on md+ viewports only so mobile stays clean and unobstructed.
 */
const COLLAGE_SLOTS: CollageSlot[] = [
  // Top-Left (First Offline Meetup seated group) — visible on mobile + desktop
  {
    photoIndex: 0,
    containerClass:
      "-top-4 -left-10 w-44 -rotate-6 sm:top-2 sm:-left-4 sm:w-56 md:top-5 md:left-4 md:w-60 lg:left-6 lg:w-72 md:hover:-rotate-2",
    aspectClass: "aspect-[16/10]",
    eager: true,
  },
  // Top-Right (Portfolio Upgrade Session) — visible on mobile + desktop
  {
    photoIndex: 1,
    containerClass:
      "-top-3 -right-10 w-44 rotate-5 sm:top-2 sm:-right-4 sm:w-56 md:top-5 md:right-4 md:w-60 lg:right-6 lg:w-72 md:hover:rotate-1",
    aspectClass: "aspect-[16/10]",
    eager: true,
  },
  // Mid-Left (First Virtual Community Meetup) — tablet + desktop
  {
    photoIndex: 4,
    containerClass:
      "hidden md:block md:top-[36%] md:-left-8 md:w-56 md:rotate-3 lg:-left-2 lg:w-64 xl:left-4 xl:w-72 md:hover:rotate-0",
    aspectClass: "aspect-[16/10]",
  },
  // Mid-Right (First Offline Meetup candid discussion) — tablet + desktop
  {
    photoIndex: 2,
    containerClass:
      "hidden md:block md:top-[37%] md:-right-8 md:w-56 md:-rotate-4 lg:-right-2 lg:w-64 xl:right-4 xl:w-72 md:hover:-rotate-1",
    aspectClass: "aspect-[16/10]",
  },
  // Bottom-Left (First Offline Meetup group selfie 1) — visible on mobile + desktop
  {
    photoIndex: 3,
    containerClass:
      "-bottom-4 -left-8 w-44 rotate-4 sm:bottom-2 sm:left-2 sm:w-52 md:bottom-5 md:left-6 md:w-60 lg:left-10 lg:w-68 md:hover:rotate-1",
    aspectClass: "aspect-[16/10]",
  },
  // Bottom-Right (First Offline Meetup group selfie 2) — clear of music button
  {
    photoIndex: 6,
    containerClass:
      "-bottom-4 -right-8 w-44 -rotate-5 sm:bottom-2 sm:right-14 sm:w-52 md:bottom-5 md:right-16 md:w-60 lg:right-20 lg:w-68 md:hover:-rotate-1",
    aspectClass: "aspect-[16/10]",
  },
  // Top-Inner-Left (First Offline Meetup wireframe sketching) — desktop
  {
    photoIndex: 5,
    containerClass:
      "hidden lg:block lg:-top-6 lg:left-[23%] lg:w-52 lg:rotate-3 xl:left-[24%] xl:w-56 md:hover:rotate-0",
    aspectClass: "aspect-[16/10]",
  },
  // Top-Inner-Right (First Offline Meetup wireframe presentation) — desktop
  {
    photoIndex: 7,
    containerClass:
      "hidden lg:block lg:-top-6 lg:right-[23%] lg:w-52 lg:-rotate-3 xl:right-[24%] xl:w-56 md:hover:rotate-0",
    aspectClass: "aspect-[16/10]",
  },
];

export function RegistrationHeroCollage() {
  const { upcomingEvent, eventPhotos } = EVENT_CONFIG;

  const eventInfoColumns = [
    { icon: Calendar, label: "Date", value: upcomingEvent.date },
    { icon: MapPin, label: "Location", value: upcomingEvent.location },
    { icon: Clock, label: "Duration", value: upcomingEvent.duration },
  ];

  function handleScrollToForm(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    const formSection = document.getElementById("registration-form");
    if (!formSection) return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    formSection.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    });
  }

  return (
    <section className="relative overflow-hidden border-b-[3px] border-ink bg-ink text-cream">
      {/* Scrapbook-Inspired Interactive Community Photo Collage Background */}
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden select-none">
        {COLLAGE_SLOTS.map((slot) => {
          const photo = eventPhotos[slot.photoIndex];
          if (!photo) return null;
          return (
            <div
              key={photo.id}
              className={`group pointer-events-none absolute z-0 rounded-sm border-[3px] border-cream/80 bg-cream p-1.5 shadow-[6px_6px_0_rgba(0,0,0,0.48)] transition-all duration-300 ease-out md:pointer-events-auto md:hover:z-[5] md:hover:-translate-y-1.5 md:hover:scale-[1.07] md:hover:border-cream md:hover:shadow-[8px_8px_0_rgba(255,122,26,0.55)] ${slot.containerClass}`}
            >
              <div className="relative overflow-hidden rounded-[2px]">
                <img
                  src={photo.src}
                  alt=""
                  loading={slot.eager ? "eager" : "lazy"}
                  className={`${slot.aspectClass} w-full object-cover transition-transform duration-300 ease-out md:group-hover:scale-[1.03] ${photo.objectPosition ?? "object-center"}`}
                />
                {/* Individual dark overlay that lightens smoothly on desktop hover */}
                <div className="absolute inset-0 bg-ink/45 transition-opacity duration-300 ease-out md:group-hover:opacity-10" />
              </div>
            </div>
          );
        })}

        {/* Central readability scrim (pointer-events-none so surrounding photos remain hoverable) */}
        <div className="pointer-events-none absolute inset-0 z-[6] bg-[radial-gradient(ellipse_78%_76%_at_50%_50%,rgba(56,7,1,0.92)_0%,rgba(56,7,1,0.78)_54%,rgba(56,7,1,0.38)_100%)] md:bg-[radial-gradient(ellipse_58%_72%_at_50%_50%,rgba(56,7,1,0.92)_0%,rgba(56,7,1,0.74)_56%,rgba(56,7,1,0.22)_100%)]" />
        <div className="halftone pointer-events-none absolute inset-0 z-[6] opacity-15" />
      </div>

      {/* Foreground Content (wrapper is pointer-events-none so edge collage frames receive hover) */}
      <div className="pointer-events-none relative z-10 mx-auto max-w-5xl px-5 pt-16 pb-20 text-center md:pt-24 md:pb-24">
        {/* Eyebrow + Event Title (No UX 36गढ़ repetition) */}
        <p className="pointer-events-auto inline-flex items-center gap-2.5 border-y-2 border-primary/90 bg-ink/70 px-4 py-1.5 font-display text-xs uppercase tracking-[0.16em] text-sand">
          <span aria-hidden="true" className="inline-block h-2 w-2 shrink-0 rotate-45 bg-primary" />
          <span>{upcomingEvent.eyebrow}</span>
          <span aria-hidden="true" className="inline-block h-2 w-2 shrink-0 rotate-45 bg-primary" />
        </p>

        <p className="pointer-events-auto mx-auto mt-5 w-fit font-display text-2xl tracking-wider text-primary sm:text-3xl md:text-4xl">
          {upcomingEvent.shortTitle}
        </p>

        {/* Main Hero Headline — Balanced 3-Line Layout with Exact Homepage Left-to-Right Wave Animation */}
        <h1 className="pointer-events-auto mx-auto mt-3 max-w-4xl py-2 font-display text-[1.75rem] leading-[1.12] tracking-tight text-cream retro-3d-cream min-[360px]:text-[2.05rem] sm:text-5xl md:text-6xl lg:text-7xl">
          <span className="sr-only">Let&apos;s connect, learn and grow together.</span>
          {HERO_HEADLINE_LINES.map((words, lineIdx) => {
            let cursor = lineIdx * 2;
            return (
              <span
                key={lineIdx}
                aria-hidden="true"
                className={`block whitespace-nowrap ${lineIdx > 0 ? "mt-1 sm:mt-1.5" : ""}`}
              >
                {words.map((chars, wordIdx) => {
                  const wordStart = cursor;
                  cursor += chars.length + 1;
                  return (
                    <span key={`${lineIdx}-${wordIdx}`}>
                      <span className="inline-block whitespace-nowrap">
                        {chars.map((char, charIdx) => (
                          <span
                            key={`${lineIdx}-${wordIdx}-${charIdx}`}
                            className="hero-wave-char"
                            style={{ animationDelay: getWaveDelay(wordStart + charIdx) }}
                          >
                            {char}
                          </span>
                        ))}
                      </span>
                      {wordIdx < words.length - 1 ? " " : ""}
                    </span>
                  );
                })}
              </span>
            );
          })}
        </h1>

        {/* Single Shared 3-Column Event Info Container */}
        <div className="pointer-events-auto mx-auto mt-9 max-w-3xl rounded-sm border-[3px] border-ink bg-cream text-left text-ink shadow-[5px_5px_0_var(--primary)]">
          <div className="grid grid-cols-1 divide-y-2 divide-ink/20 sm:grid-cols-3 sm:divide-x-2 sm:divide-y-0">
            {eventInfoColumns.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="flex items-center gap-3 px-5 py-4 sm:justify-center sm:px-4"
                >
                  <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-sm border-2 border-ink bg-sand text-ink">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <div className="text-[11px] font-extrabold uppercase tracking-wider text-ink/70">
                      {item.label}
                    </div>
                    <div className="mt-0.5 text-sm font-extrabold leading-snug text-ink">
                      {item.value}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tight Unified Cream Registration Fee + Register Now CTA Container */}
        <div className="pointer-events-auto mx-auto mt-7 inline-flex w-full max-w-md flex-col items-center gap-4 rounded-sm border-[3px] border-ink bg-cream px-6 py-4 text-ink shadow-[5px_5px_0_var(--primary)] sm:w-auto sm:max-w-none sm:flex-row sm:items-center sm:gap-6 sm:px-7 sm:py-4">
          <div className="text-center sm:text-left">
            <div className="text-[11px] font-extrabold uppercase tracking-widest text-ink/70">
              Registration Fee
            </div>
            <div className="mt-0.5 flex flex-wrap items-baseline justify-center gap-1.5 leading-snug sm:justify-start">
              <span className="whitespace-nowrap text-3xl font-black tracking-tight text-ink sm:text-4xl">
                <span className="font-sans">₹</span>
                <span className="font-display">{upcomingEvent.registrationFeeAmount}</span>
              </span>
              <span className="whitespace-nowrap font-display text-sm uppercase tracking-wide text-ink/80 sm:text-base">
                / person
              </span>
            </div>
          </div>

          <span aria-hidden="true" className="hidden h-12 w-[2px] shrink-0 bg-ink/20 sm:block" />

          <a
            href="#registration-form"
            onClick={handleScrollToForm}
            className="pop-btn w-full shrink-0 justify-center bg-primary px-6 py-3.5 text-sm text-ink sm:w-auto sm:text-base"
          >
            <span>Register Now</span>
            <ArrowDown className="h-4 w-4 shrink-0" aria-hidden="true" />
          </a>
        </div>
      </div>

      {/* Bottom-right Play/Pause Ambient Music Control */}
      <RegistrationMusicControl />
    </section>
  );
}
