import { ArrowRight } from "lucide-react";
import { SocialIcon } from "@/components/site/SocialIcons";
import { EVENT_CONFIG } from "@/lib/event-config";

export function AboutAndStatsSection() {
  return (
    <>
      {/* ABOUT UX 36गढ़ */}
      <section id="about" className="scroll-mt-20 border-b-[3px] border-ink bg-background">
        <div className="mx-auto max-w-6xl px-5 py-16 md:py-24">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-5">
              <span className="inline-block rounded-sm border-[3px] border-ink bg-sand px-3 py-1 font-display text-xs uppercase tracking-wider text-ink shadow-[3px_3px_0_var(--ink)]">
                About {EVENT_CONFIG.community.name}
              </span>
              <h2 className="mt-5 font-display text-3xl leading-[1.02] text-ink retro-3d sm:text-5xl">
                More than a community. A space to grow together.
              </h2>
              <a href="#join-community" className="pop-btn mt-6 bg-primary text-sm text-ink">
                <span>Join Our Community</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>

            <div className="lg:col-span-7">
              <div className="pop-card-static space-y-5 bg-cream p-6 sm:p-8">
                <p className="text-base font-semibold leading-relaxed text-ink sm:text-lg">
                  UX 36गढ़ is a growing community bringing together UI/UX designers, product
                  designers, creative minds and design enthusiasts across Chhattisgarh.
                </p>
                <p className="text-base font-semibold leading-relaxed text-muted-foreground sm:text-lg">
                  We believe great design communities grow through conversations, shared
                  experiences, constructive feedback and meaningful connections.
                </p>
                <p className="text-base font-semibold leading-relaxed text-muted-foreground sm:text-lg">
                  From virtual meetups and portfolio sessions to offline gatherings, we&apos;re
                  creating opportunities for people to learn, collaborate and grow together.
                </p>
                <p className="border-t-2 border-ink/15 pt-4 text-base font-bold leading-relaxed text-ink sm:text-lg">
                  Whether you&apos;re a student exploring design, a freelancer, a working
                  professional or simply curious about UX, there&apos;s a place for you here.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COMMUNITY STATISTICS — ONLY TWO VERIFIED STATS */}
      <section aria-label="Community statistics" className="border-b-[3px] border-ink bg-sand">
        <div className="mx-auto max-w-5xl px-5 py-12 md:py-16">
          <div className="text-center">
            <p className="font-display text-xs uppercase tracking-widest text-ink/75">
              Growing Across Chhattisgarh
            </p>
            <h2 className="mt-2 font-display text-2xl text-ink sm:text-3xl">Our Community Today</h2>
          </div>

          <div className="mx-auto mt-8 grid max-w-3xl grid-cols-1 gap-5 sm:grid-cols-2">
            {EVENT_CONFIG.communityStats.map((stat) => (
              <div
                key={stat.label}
                className="pop-card flex items-center gap-5 bg-cream px-6 py-6 sm:px-7"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-sm border-[3px] border-ink bg-primary text-ink shadow-[3px_3px_0_var(--ink)]">
                  <SocialIcon platform={stat.platform} className="h-7 w-7" />
                </div>
                <div>
                  <div className="font-display text-4xl leading-none text-ink sm:text-5xl">
                    {stat.value}
                  </div>
                  <div className="mt-1.5 text-sm font-extrabold uppercase tracking-wide text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
