import { Link } from "@tanstack/react-router";
import { ArrowRight, Calendar, Clock, MapPin } from "lucide-react";
import { EVENT_CONFIG } from "@/lib/event-config";

const MARQUEE_WORDS = [
  "UX 36गढ़ MILAAP 2026",
  "SUNDAY, 29 NOVEMBER 2026 · RAIPUR",
  "RESOURCES",
  "MEETUPS & EVENTS",
  "CAREER & WORK OPPORTUNITIES",
  "CAREER GUIDANCE & COLLABORATION",
];

export function HeroSection() {
  const { upcomingEvent } = EVENT_CONFIG;

  const heroMetaItems = [
    { icon: Calendar, label: "Date", value: upcomingEvent.date },
    { icon: MapPin, label: "Location", value: upcomingEvent.location },
    { icon: Clock, label: "Duration", value: upcomingEvent.heroDuration },
  ];

  return (
    <>
      <section
        id="home"
        className="relative scroll-mt-20 overflow-hidden border-b-[3px] border-ink bg-primary"
      >
        {/* Subtle halftone decorative strips */}
        <div
          aria-hidden="true"
          className="halftone pointer-events-none absolute inset-x-0 top-0 h-8 opacity-15"
        />

        <div className="mx-auto max-w-6xl px-5 py-16 text-center md:py-24">
          {/* 1. Separate Eyebrow — Dark Brown Background, Orange Diamonds, Cream Text (No horizontal lines) */}
          <div className="flex justify-center">
            <p className="inline-flex items-center gap-2.5 rounded-sm bg-ink px-4 py-1.5 font-display text-xs uppercase tracking-[0.16em] text-cream">
              <span
                aria-hidden="true"
                className="inline-block h-2 w-2 shrink-0 rotate-45 bg-primary"
              />
              <span>Upcoming Event</span>
              <span
                aria-hidden="true"
                className="inline-block h-2 w-2 shrink-0 rotate-45 bg-primary"
              />
            </p>
          </div>

          {/* 2. Separate Prominent Event Title — MILAAP 2026 (Plain Dark Brown Typography, No Background Container) */}
          <p className="mt-5 font-display text-2xl tracking-wider text-ink sm:text-3xl md:text-4xl">
            {upcomingEvent.shortTitle}
          </p>

          {/* 3. Static Main Display Headline — Two Lines on Desktop */}
          <h1 className="mx-auto mt-5 max-w-5xl py-2 font-display text-4xl leading-[1.12] text-cream retro-3d-cream sm:text-5xl md:text-6xl lg:text-[4.25rem]">
            <span className="block sm:whitespace-nowrap">Where 36गढ़&apos;s design</span>
            <span className="mt-1.5 block sm:whitespace-nowrap">community connects.</span>
          </h1>

          {/* 4. Single Shared Horizontal Event Info Container (No registration fee on homepage) */}
          <div className="pop-card-static mx-auto mt-9 max-w-3xl bg-cream text-left">
            <div className="grid grid-cols-1 divide-y-2 divide-ink/20 sm:grid-cols-3 sm:divide-x-2 sm:divide-y-0">
              {heroMetaItems.map((item) => {
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

          {/* 5. Balanced Primary & Secondary CTAs (Single-line "Register Now" on mobile) */}
          <div className="mx-auto mt-10 flex w-full max-w-[290px] flex-col items-stretch justify-center gap-3.5 sm:max-w-none sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
            <Link
              to="/register"
              className="pop-btn w-full justify-center whitespace-nowrap bg-cream px-5 py-3.5 text-sm text-ink sm:w-auto sm:px-6 sm:text-base"
            >
              <span className="sm:hidden">Register Now</span>
              <span className="hidden sm:inline">Register for the Event Now</span>
              <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
            </Link>
            <a
              href="#about"
              className="pop-btn w-full justify-center whitespace-nowrap bg-peach px-5 py-3.5 text-sm text-ink sm:w-auto sm:px-6 sm:text-base"
            >
              Explore Our Community
            </a>
          </div>
        </div>
      </section>

      {/* Neo-retro Marquee */}
      <div
        aria-hidden="true"
        className="overflow-hidden border-b-[3px] border-ink bg-cream py-3 select-none"
      >
        <div className="marquee-track">
          {[...MARQUEE_WORDS, ...MARQUEE_WORDS].map((word, index) => (
            <span key={`${word}-${index}`} className="font-display text-lg text-ink sm:text-xl">
              {word} <span className="text-primary">★</span>
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
