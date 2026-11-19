import { Briefcase, GraduationCap, Laptop, Palette, Sparkles } from "lucide-react";
import { EVENT_CONFIG } from "@/lib/event-config";

const AUDIENCE_ICONS = [Palette, GraduationCap, Laptop, Briefcase, Sparkles];
const CARD_TONES = ["bg-cream", "bg-sand", "bg-peach", "bg-cream", "bg-sand"];

export function WhoShouldAttendSection() {
  return (
    <section
      aria-labelledby="who-should-attend-heading"
      className="border-b-[3px] border-ink bg-peach/50"
    >
      <div className="mx-auto max-w-6xl px-5 py-16 md:py-24">
        <div className="max-w-3xl">
          <span className="inline-block rounded-sm border-[3px] border-ink bg-cream px-3 py-1 font-display text-xs uppercase tracking-wider text-ink shadow-[3px_3px_0_var(--ink)]">
            Who Should Attend
          </span>
          <h2
            id="who-should-attend-heading"
            className="mt-4 font-display text-4xl leading-none text-ink retro-3d sm:text-5xl"
          >
            Built for everyone curious about design
          </h2>
          <p className="mt-5 text-base font-bold leading-relaxed text-ink/90 sm:text-lg">
            Whether you&apos;re just starting your design journey or already working in the
            industry, {EVENT_CONFIG.upcomingEvent.name} is an opportunity to meet people who share
            your curiosity about design.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {EVENT_CONFIG.whoShouldAttend.map((group, idx) => {
            const Icon = AUDIENCE_ICONS[idx % AUDIENCE_ICONS.length] ?? Sparkles;
            const tone = CARD_TONES[idx % CARD_TONES.length] ?? "bg-cream";
            return (
              <div
                key={group.title}
                className={`pop-card flex flex-col p-6 ${tone} ${
                  idx === 4 ? "sm:col-span-2 lg:col-span-1" : ""
                }`}
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-sm border-[3px] border-ink bg-primary text-ink shadow-[3px_3px_0_var(--ink)]">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-xl text-ink">{group.title}</h3>
                <p className="mt-2 text-sm font-semibold leading-relaxed text-muted-foreground sm:text-base">
                  {group.detail}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
