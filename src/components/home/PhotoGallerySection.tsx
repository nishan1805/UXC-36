import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { EVENT_CONFIG } from "@/lib/event-config";

const AUTO_ADVANCE_MS = 4500;

function getVisibleCount(width: number): number {
  if (width >= 1024) return 3;
  if (width >= 640) return 2;
  return 1;
}

export function PhotoGallerySection() {
  const photos = EVENT_CONFIG.eventPhotos;
  const [visibleCount, setVisibleCount] = useState(3);
  const [startIndex, setStartIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateVisibleCount = () => {
      setVisibleCount(getVisibleCount(window.innerWidth));
    };
    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(media.matches);
    const onMotionChange = (event: MediaQueryListEvent) => setPrefersReducedMotion(event.matches);
    media.addEventListener("change", onMotionChange);

    return () => {
      window.removeEventListener("resize", updateVisibleCount);
      media.removeEventListener("change", onMotionChange);
    };
  }, []);

  const effectiveVisible = Math.max(1, Math.min(visibleCount, photos.length));
  const maxStartIndex = Math.max(0, photos.length - effectiveVisible);
  const canSlide = photos.length > effectiveVisible;

  useEffect(() => {
    setStartIndex((prev) => Math.min(prev, maxStartIndex));
  }, [maxStartIndex]);

  const goNext = useCallback(() => {
    if (!canSlide) return;
    setStartIndex((prev) => (prev >= maxStartIndex ? 0 : prev + 1));
  }, [canSlide, maxStartIndex]);

  const goPrev = useCallback(() => {
    if (!canSlide) return;
    setStartIndex((prev) => (prev <= 0 ? maxStartIndex : prev - 1));
  }, [canSlide, maxStartIndex]);

  const isPaused = isHovered || prefersReducedMotion;

  useEffect(() => {
    if (!canSlide || isPaused) return;
    const timer = window.setInterval(goNext, AUTO_ADVANCE_MS);
    return () => window.clearInterval(timer);
  }, [canSlide, isPaused, goNext]);

  if (photos.length === 0) return null;

  const slideWidthPercent = 100 / effectiveVisible;

  return (
    <section id="gallery" className="scroll-mt-20 border-b-[3px] border-ink bg-sand">
      <div className="mx-auto max-w-6xl px-5 py-16 md:py-24">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="inline-block rounded-sm border-[3px] border-ink bg-cream px-3 py-1 font-display text-xs uppercase tracking-wider text-ink shadow-[3px_3px_0_var(--ink)]">
              Photo Gallery
            </span>
            <h2 className="mt-4 font-display text-4xl leading-none text-ink retro-3d sm:text-5xl">
              Moments from our journey
            </h2>
          </div>

          {canSlide && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={goPrev}
                aria-label="Previous photographs"
                className="inline-flex h-11 w-11 items-center justify-center rounded-sm border-[3px] border-ink bg-cream text-ink shadow-[3px_3px_0_var(--ink)] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ink"
              >
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={goNext}
                aria-label="Next photographs"
                className="inline-flex h-11 w-11 items-center justify-center rounded-sm border-[3px] border-ink bg-primary text-ink shadow-[3px_3px_0_var(--ink)] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ink"
              >
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          )}
        </div>

        {/* Clean Three-Image Horizontal Carousel (Photos Only) */}
        <div
          role="region"
          aria-roledescription="carousel"
          aria-label="UX 36गढ़ community photographs"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onFocusCapture={() => setIsHovered(true)}
          onBlurCapture={() => setIsHovered(false)}
          className="mt-8 -mx-2.5 overflow-hidden pb-2"
        >
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${startIndex * slideWidthPercent}%)` }}
          >
            {photos.map((photo, index) => {
              const isVisible = index >= startIndex && index < startIndex + effectiveVisible;
              return (
                <div
                  key={photo.id}
                  aria-hidden={!isVisible}
                  className="shrink-0 px-2.5"
                  style={{ width: `${slideWidthPercent}%` }}
                >
                  <div className="pop-card-static aspect-[4/3] overflow-hidden bg-cream">
                    <img
                      src={photo.src}
                      alt={photo.alt}
                      loading="lazy"
                      className={`h-full w-full object-cover ${photo.objectPosition ?? "object-center"}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
