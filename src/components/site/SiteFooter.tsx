import { Link } from "@tanstack/react-router";
import { ArrowRight, Heart } from "lucide-react";
import { EVENT_CONFIG } from "@/lib/event-config";

export function SiteFooter({
  isHomePage: _isHomePage = false,
  showRegistrationCta = true,
}: {
  isHomePage?: boolean;
  showRegistrationCta?: boolean;
}) {
  return (
    <footer className="border-t-[3px] border-ink bg-ink text-cream">
      <div className="mx-auto max-w-6xl px-5 py-12 md:py-14">
        {/* Main Brand + Optional Registration CTA */}
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center">
          {/* Left Area — Brand */}
          <div className={showRegistrationCta ? "max-w-lg" : "max-w-xl"}>
            <div className="flex items-center">
              <img
                src={EVENT_CONFIG.community.logoSrc}
                alt="UX 36गढ़ official logo"
                className="h-9 w-auto object-contain sm:h-11"
              />
            </div>
            <p className="mt-4 text-base font-semibold leading-relaxed text-cream/85">
              A growing community bringing together UI/UX designers, product designers, creative
              minds and design enthusiasts across Chhattisgarh.
            </p>
            <p className="mt-3 font-display text-sm tracking-wide text-primary">
              {EVENT_CONFIG.community.tagline}
            </p>
          </div>

          {/* Right Area — Registration CTA (omitted on /register) */}
          {showRegistrationCta && (
            <div className="shrink-0">
              <Link
                to="/register"
                className="pop-btn bg-primary text-xs text-ink shadow-[4px_4px_0_var(--cream)] sm:text-sm"
              >
                <span>Register for {EVENT_CONFIG.upcomingEvent.name}</span>
                <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
              </Link>
            </div>
          )}
        </div>

        {/* Bottom Copyright Area */}
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-cream/20 pt-6 text-center text-xs font-bold uppercase tracking-widest md:flex-row md:text-left">
          <p className="text-peach">
            © {EVENT_CONFIG.community.copyrightYear} {EVENT_CONFIG.community.name}.
          </p>
          <p className="inline-flex items-center gap-1.5 font-semibold normal-case tracking-normal text-cream/85">
            <Heart className="h-3.5 w-3.5 fill-primary text-primary" aria-hidden="true" />
            <span>Made in Chhattisgarh with love.</span>
          </p>
          <p className="text-cream/75">For designers, by designers</p>
        </div>
      </div>
    </footer>
  );
}
