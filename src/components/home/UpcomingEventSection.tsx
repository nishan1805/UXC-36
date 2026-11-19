import { Link } from "@tanstack/react-router";
import { ArrowRight, Calendar, Clock, MapPin, Navigation } from "lucide-react";
import { EVENT_CONFIG } from "@/lib/event-config";

export function UpcomingEventSection() {
  const { upcomingEvent } = EVENT_CONFIG;

  const eventSpecs = [
    { icon: Calendar, label: "Date", value: upcomingEvent.date },
    { icon: Clock, label: "Time", value: upcomingEvent.confirmedTime },
    { icon: MapPin, label: "Location", value: upcomingEvent.location },
    { icon: Navigation, label: "Venue", value: upcomingEvent.venueStatus },
  ];

  return (
    <section id="upcoming-event" className="scroll-mt-20 border-b-[3px] border-ink bg-background">
      <div className="mx-auto max-w-6xl px-5 py-16 md:py-24">
        <div className="pop-card-static overflow-hidden bg-cream">
          {/* Top banner */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b-[3px] border-ink bg-primary px-6 py-4 sm:px-8">
            <span className="font-display text-sm uppercase tracking-wider text-ink sm:text-base">
              Upcoming Event
            </span>
            <span className="rounded-sm border-2 border-ink bg-sand px-3 py-1 font-display text-xs uppercase text-ink">
              Raipur · Nov 2026
            </span>
          </div>

          <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-12 lg:p-10">
            {/* Story & CTA */}
            <div className="lg:col-span-7">
              <h2 className="font-display text-3xl leading-[1.02] text-ink retro-3d sm:text-5xl">
                A bigger gathering. Stronger connections. More memories.
              </h2>

              <div className="mt-6 space-y-4 text-base font-semibold leading-relaxed text-muted-foreground sm:text-lg">
                <p>
                  After our first casual offline meetup, we&apos;re taking a bigger step forward.
                </p>
                <p>
                  This November, UX 36गढ़ is bringing together designers, aspiring professionals and
                  creative minds for a special in-person gathering.
                </p>
              </div>

              <div className="mt-8">
                <Link to="/register" className="pop-btn bg-primary text-sm text-ink sm:text-base">
                  <span>Register Now</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>

            {/* Event details card */}
            <div className="lg:col-span-5">
              <div className="rounded-sm border-[3px] border-ink bg-sand p-5 shadow-[4px_4px_0_var(--ink)] sm:p-6">
                <h3 className="font-display text-lg text-ink">{upcomingEvent.name}</h3>
                <ul className="mt-5 space-y-3.5">
                  {eventSpecs.map((spec) => {
                    const Icon = spec.icon;
                    return (
                      <li
                        key={spec.label}
                        className="flex items-start gap-3 rounded-sm border-2 border-ink bg-cream px-3.5 py-3"
                      >
                        <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-sm border-2 border-ink bg-primary text-ink">
                          <Icon className="h-4 w-4" aria-hidden="true" />
                        </span>
                        <div className="min-w-0">
                          <div className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
                            {spec.label}
                          </div>
                          <div className="mt-0.5 text-sm font-extrabold text-ink sm:text-base">
                            {spec.value}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
