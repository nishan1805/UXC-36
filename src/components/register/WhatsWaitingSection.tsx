import { Coffee, Gift, HeartHandshake, Sparkles } from "lucide-react";
import { EVENT_CONFIG } from "@/lib/event-config";

const EXPERIENCES = [
  {
    icon: Coffee,
    title: "Snacks & Refreshments",
    description: "Enjoy refreshments while connecting and spending time with fellow designers.",
    tone: "bg-cream",
  },
  {
    icon: Gift,
    title: "Event Souvenirs",
    description: `Take home a little keepsake from ${EVENT_CONFIG.upcomingEvent.name}.`,
    tone: "bg-sand",
  },
  {
    icon: Sparkles,
    title: "Activities & Fun",
    description:
      "Participate in engaging community activities, creative interactions and fun experiences.",
    tone: "bg-peach",
  },
  {
    icon: HeartHandshake,
    title: "Connections & Memories",
    description: "Meet new people, exchange ideas, build connections and make memories together.",
    tone: "bg-cream",
  },
];

export function WhatsWaitingSection() {
  return (
    <section
      aria-labelledby="whats-waiting-heading"
      className="border-b-[3px] border-ink bg-background"
    >
      <div className="mx-auto max-w-6xl px-5 py-16 md:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-block rounded-sm border-[3px] border-ink bg-sand px-3.5 py-1 font-display text-xs uppercase tracking-wider text-ink shadow-[3px_3px_0_var(--ink)]">
            What&apos;s Waiting For You?
          </span>
          <h2
            id="whats-waiting-heading"
            className="mt-4 font-display text-3xl leading-[1.03] text-ink retro-3d sm:text-5xl"
          >
            More than just a meetup. An experience worth remembering.
          </h2>
          <p className="mt-5 text-base font-semibold leading-relaxed text-muted-foreground sm:text-lg">
            Your afternoon with UX 36गढ़ is about more than design. It&apos;s about meeting people,
            sharing ideas, enjoying the experience and creating memories together.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {EXPERIENCES.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className={`pop-card flex flex-col p-6 ${item.tone}`}>
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-sm border-[3px] border-ink bg-primary text-ink shadow-[3px_3px_0_var(--ink)]">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-xl text-ink">{item.title}</h3>
                <p className="mt-2.5 text-sm font-semibold leading-relaxed text-ink/85 sm:text-base">
                  {item.description}
                </p>
              </article>
            );
          })}
        </div>

        {/* Supporting ₹250 visual highlight */}
        <div className="pop-card-static mt-10 flex flex-col items-center justify-between gap-4 bg-primary px-6 py-6 text-center sm:flex-row sm:px-8 sm:text-left">
          <div>
            <p className="font-display text-2xl text-cream retro-3d-cream sm:text-3xl">
              All this for {EVENT_CONFIG.upcomingEvent.registrationFeeShort}.
            </p>
            <p className="mt-1 text-base font-extrabold text-ink sm:text-lg">
              One registration. A whole lot of experiences.
            </p>
          </div>
          <a
            href="#registration-form"
            className="pop-btn shrink-0 bg-cream text-xs text-ink sm:text-sm"
          >
            Continue to Form
          </a>
        </div>
      </div>
    </section>
  );
}
