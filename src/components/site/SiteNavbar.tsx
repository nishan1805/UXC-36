import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { EVENT_CONFIG } from "@/lib/event-config";

interface SiteNavbarProps {
  /** True when rendered on the homepage so anchor links scroll directly */
  isHomePage?: boolean;
  /** Optional override for the primary CTA href/label (e.g. scrolling to form on /register) */
  ctaHref?: string;
  ctaLabel?: string;
}

export function SiteNavbar({
  isHomePage = false,
  ctaHref,
  ctaLabel = "Register for the Event",
}: SiteNavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile overlay on Escape key and lock background scrolling while open
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileMenuOpen(false);
    };
    const onResize = () => {
      if (window.innerWidth >= 1024) setMobileMenuOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
    };
  }, [mobileMenuOpen]);

  const brandMark = (
    <img
      src={EVENT_CONFIG.community.logoSrc}
      alt="UX 36गढ़ official logo"
      className="h-7 w-auto object-contain min-[380px]:h-8 sm:h-9 md:h-10"
    />
  );

  return (
    <>
      <header className="sticky top-0 z-50 border-b-[3px] border-ink bg-primary">
        <nav
          aria-label="Primary navigation"
          className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-3.5 py-3 sm:gap-3 sm:px-6"
        >
          {/* Brand mark (serves as Homepage link) */}
          {isHomePage ? (
            <a
              href="#home"
              aria-label="UX 36गढ़ Home"
              className="flex shrink-0 items-center gap-1.5 rounded-sm focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ink sm:gap-2"
            >
              {brandMark}
            </a>
          ) : (
            <Link
              to="/"
              aria-label="UX 36गढ़ Home"
              className="flex shrink-0 items-center gap-1.5 rounded-sm focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ink sm:gap-2"
            >
              {brandMark}
            </Link>
          )}

          {/* Desktop navigation links (uniform default styling, hover-only interaction) */}
          <div className="hidden items-center gap-1.5 lg:flex xl:gap-2.5">
            {EVENT_CONFIG.homepageNavItems.map((item) => (
              <a
                key={item.id}
                href={isHomePage ? item.href : `/${item.href}`}
                className="rounded-sm border-2 border-transparent px-3 py-1.5 font-display text-xs uppercase tracking-wide text-ink transition-colors hover:border-ink hover:bg-cream focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Right actions: Compact single-line Register CTA + Mobile Hamburger */}
          <div className="flex shrink-0 items-center gap-2 sm:gap-2.5">
            {ctaHref ? (
              <a
                href={ctaHref}
                className="pop-btn whitespace-nowrap bg-cream px-3 py-2 text-[11px] leading-none text-ink sm:px-4 sm:py-2.5 sm:text-xs"
              >
                <span className="sm:hidden">Register Now</span>
                <span className="hidden sm:inline">{ctaLabel}</span>
              </a>
            ) : (
              <Link
                to="/register"
                className="pop-btn whitespace-nowrap bg-cream px-3 py-2 text-[11px] leading-none text-ink sm:px-4 sm:py-2.5 sm:text-xs"
              >
                <span className="sm:hidden">Register Now</span>
                <span className="hidden sm:inline">{ctaLabel}</span>
              </Link>
            )}

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-primary-nav"
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              className="inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-sm border-[3px] border-ink bg-sand text-ink shadow-[3px_3px_0_var(--ink)] transition-transform active:translate-x-[2px] active:translate-y-[2px] active:shadow-none lg:hidden"
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </nav>
      </header>

      {/* Full-Screen Fixed Mobile Navigation Overlay (never pushes page content down) */}
      {mobileMenuOpen && (
        <div
          id="mobile-primary-nav"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation menu"
          className="fixed inset-0 z-[100] flex h-dvh w-screen flex-col overflow-hidden bg-cream lg:hidden"
        >
          {/* Fixed Overlay Top Bar with Logo + Close (X) Button */}
          <div className="flex shrink-0 items-center justify-between gap-3 border-b-[3px] border-ink bg-primary px-3.5 py-3 sm:px-6">
            {isHomePage ? (
              <a
                href="#home"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="UX 36गढ़ Home"
                className="flex shrink-0 items-center gap-1.5 rounded-sm focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ink sm:gap-2"
              >
                {brandMark}
              </a>
            ) : (
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="UX 36गढ़ Home"
                className="flex shrink-0 items-center gap-1.5 rounded-sm focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ink sm:gap-2"
              >
                {brandMark}
              </Link>
            )}

            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close navigation menu"
              className="inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-sm border-[3px] border-ink bg-sand text-ink shadow-[3px_3px_0_var(--ink)] transition-transform active:translate-x-[2px] active:translate-y-[2px] active:shadow-none focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ink"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          {/* Scrollable Overlay Menu Body */}
          <div className="flex flex-1 flex-col justify-between overflow-y-auto px-5 py-7">
            <div className="mx-auto flex w-full max-w-md flex-col gap-3">
              {EVENT_CONFIG.homepageNavItems.map((item) => (
                <a
                  key={item.id}
                  href={isHomePage ? item.href : `/${item.href}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-sm border-[3px] border-ink bg-background px-4 py-3.5 text-center font-display text-sm uppercase tracking-wide text-ink shadow-[3px_3px_0_var(--ink)] transition-colors hover:bg-sand active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                >
                  {item.label}
                </a>
              ))}
            </div>

            <div className="mx-auto mt-8 w-full max-w-md border-t-2 border-ink/20 pt-5">
              {ctaHref ? (
                <a
                  href={ctaHref}
                  onClick={() => setMobileMenuOpen(false)}
                  className="pop-btn w-full justify-center whitespace-nowrap bg-primary py-3.5 text-sm text-ink"
                >
                  Register Now
                </a>
              ) : (
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="pop-btn w-full justify-center whitespace-nowrap bg-primary py-3.5 text-sm text-ink"
                >
                  Register Now
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
