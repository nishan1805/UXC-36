import { EVENT_CONFIG } from "@/lib/event-config";

export function WhatWeDoSection() {
  return (
    <section id="what-we-do" className="scroll-mt-20 border-b-[3px] border-ink bg-primary">
      <div className="mx-auto max-w-6xl px-5 py-16 md:py-24">
        <div className="max-w-2xl">
          <span className="inline-block rounded-sm border-[3px] border-ink bg-cream px-3 py-1 font-display text-xs uppercase tracking-wider text-ink shadow-[3px_3px_0_var(--ink)]">
            Community Rituals
          </span>
          <h2 className="mt-4 font-display text-4xl text-cream retro-3d-cream sm:text-5xl">
            What We Do
          </h2>
          <p className="mt-3 text-base font-bold text-ink sm:text-lg">
            Practical, welcoming formats designed to sharpen craft and build real friendships.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {EVENT_CONFIG.whatWeDoPillars.map((pillar) => {
            const isDark = pillar.toneClass.includes("bg-ink");
            return (
              <article key={pillar.number} className={`pop-card h-full p-7 ${pillar.toneClass}`}>
                <div className="flex items-center justify-between">
                  <span
                    className={`font-display text-5xl leading-none ${
                      isDark ? "text-primary" : "opacity-35"
                    }`}
                  >
                    {pillar.number}
                  </span>
                  <span
                    className={`h-3 w-3 rounded-full border-2 ${
                      isDark ? "border-primary bg-primary" : "border-ink bg-ink"
                    }`}
                  />
                </div>
                <h3 className="mt-4 text-2xl">{pillar.title}</h3>
                <p className="mt-3 text-base font-semibold leading-relaxed opacity-95">
                  {pillar.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
