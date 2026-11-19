import { ExternalLink } from "lucide-react";
import { SocialIcon } from "@/components/site/SocialIcons";
import { EVENT_CONFIG } from "@/lib/event-config";

const PLATFORM_STYLES = {
  whatsapp: "bg-cream text-ink",
  instagram: "bg-sand text-ink",
  linkedin: "bg-peach text-ink",
} as const;

export function JoinCommunitySection() {
  return (
    <section id="join-community" className="scroll-mt-20 border-b-[3px] border-ink bg-primary">
      <div className="mx-auto max-w-6xl px-5 py-16 md:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-4xl leading-none text-cream retro-3d-cream sm:text-6xl">
            Join Our Community
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base font-bold text-ink sm:text-lg">
            Stay connected with Chhattisgarh&apos;s design community through conversations, creative
            sessions and community updates.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {EVENT_CONFIG.socialLinks.map((social) => (
            <div
              key={social.id}
              className={`pop-card flex h-full flex-col justify-between p-6 sm:p-7 ${PLATFORM_STYLES[social.id]}`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-sm border-[3px] border-ink bg-primary text-ink shadow-[3px_3px_0_var(--ink)]">
                    <SocialIcon platform={social.id} className="h-6 w-6" />
                  </span>
                  <span className="font-display text-xs uppercase tracking-widest text-ink/70">
                    {social.name}
                  </span>
                </div>
                <h3 className="mt-5 text-xl text-ink">{social.heading}</h3>
                <p className="mt-2.5 text-sm font-semibold leading-relaxed text-ink/85 sm:text-base">
                  {social.description}
                </p>
              </div>

              <div className="mt-6">
                <a
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="pop-btn bg-ink px-5 py-3 text-xs text-cream"
                >
                  <span>{social.ctaLabel}</span>
                  <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
