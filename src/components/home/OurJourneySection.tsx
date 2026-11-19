import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Calendar,
  Clock,
  Flag,
  Hourglass,
  MapPin,
  Monitor,
  Sparkles,
} from "lucide-react";
import { EVENT_CONFIG } from "@/lib/event-config";

export function OurJourneySection() {
  return (
    <section id="our-journey" className="scroll-mt-20 border-b-[3px] border-ink bg-background">
      <div className="mx-auto max-w-6xl px-5 py-16 md:py-24">
        <div className="max-w-2xl">
          <span className="inline-block rounded-sm border-[3px] border-ink bg-peach px-3 py-1 font-display text-xs uppercase tracking-wider text-ink shadow-[3px_3px_0_var(--ink)]">
            Our Journey So Far
          </span>
          <h2 className="mt-4 font-display text-4xl leading-none text-ink retro-3d sm:text-5xl">
            Where we started
          </h2>
          <p className="mt-4 text-base font-semibold text-muted-foreground sm:text-lg">
            From our very first idea and online sessions to offline gatherings and our upcoming
            flagship meetup — every milestone brought Chhattisgarh&apos;s design community closer.
          </p>
        </div>

        {/* Chronological Timeline Cards with Circular Dot Markers */}
        <div className="relative mt-12 space-y-6 before:absolute before:top-7 before:bottom-7 before:left-5 before:hidden before:w-[3px] before:bg-ink md:before:block">
          {EVENT_CONFIG.pastActivities.map((activity) => {
            const isMilestone = activity.id === "community-started";
            const isUpcoming = activity.id === "ux-36garh-milaap-2026";
            const isOffline = activity.id === "first-offline-meetup";

            return (
              <div key={activity.id} className="relative md:pl-14">
                {/* Simple Circular Timeline Dot */}
                <div
                  aria-hidden="true"
                  className={`absolute top-7 left-[21.5px] hidden h-4 w-4 -translate-x-1/2 rounded-full border-[3px] border-ink md:block ${
                    isUpcoming ? "bg-primary ring-4 ring-primary/30" : "bg-cream"
                  }`}
                />

                <article className={`pop-card p-6 sm:p-8 ${activity.accentClass}`}>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-sm border-2 border-ink px-3 py-1 font-display text-[11px] uppercase tracking-wider ${
                        isUpcoming ? "bg-ink text-cream" : "bg-cream text-ink"
                      }`}
                    >
                      {isUpcoming ? (
                        <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                      ) : isMilestone ? (
                        <Flag className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                      ) : isOffline ? (
                        <MapPin className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                      ) : (
                        <Monitor className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                      )}
                      {activity.tag}
                    </span>

                    {activity.date && (
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-sm border-2 border-ink px-3 py-1 font-display text-[11px] uppercase tracking-wider ${
                          isUpcoming ? "bg-cream text-ink" : "bg-ink text-cream"
                        }`}
                      >
                        <Calendar className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                        {activity.date}
                      </span>
                    )}
                  </div>

                  <h3 className="mt-4 text-2xl text-ink sm:text-3xl">{activity.title}</h3>

                  {(activity.platform || activity.venue || activity.time || activity.duration) && (
                    <div className="mt-4 flex flex-wrap gap-3">
                      {activity.platform && (
                        <span className="inline-flex items-center gap-2 rounded-sm border-2 border-ink bg-cream px-3 py-1.5 text-xs font-bold text-ink sm:text-sm">
                          <Monitor className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                          {activity.platform}
                        </span>
                      )}
                      {activity.venue && (
                        <span className="inline-flex items-center gap-2 rounded-sm border-2 border-ink bg-cream px-3 py-1.5 text-xs font-bold text-ink sm:text-sm">
                          <MapPin className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                          {activity.venue}
                        </span>
                      )}
                      {activity.time && (
                        <span className="inline-flex items-center gap-2 rounded-sm border-2 border-ink bg-cream px-3 py-1.5 text-xs font-bold text-ink sm:text-sm">
                          <Clock className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                          {activity.time}
                        </span>
                      )}
                      {activity.duration && (
                        <span className="inline-flex items-center gap-2 rounded-sm border-2 border-ink bg-cream px-3 py-1.5 text-xs font-bold text-ink sm:text-sm">
                          <Hourglass className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                          Expected duration: {activity.duration}
                        </span>
                      )}
                    </div>
                  )}

                  <p className="mt-4 max-w-3xl text-base font-semibold leading-relaxed text-ink/90">
                    {activity.description}
                  </p>

                  {isUpcoming && (
                    <div className="mt-6">
                      <Link to="/register" className="pop-btn bg-ink text-xs text-cream sm:text-sm">
                        <span>Register Now</span>
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </Link>
                    </div>
                  )}
                </article>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
