import { createFileRoute } from "@tanstack/react-router";
import { AboutAndStatsSection } from "@/components/home/AboutAndStatsSection";
import { FaqSection } from "@/components/home/FaqSection";
import { HeroSection } from "@/components/home/HeroSection";
import { JoinCommunitySection } from "@/components/home/JoinCommunitySection";
import { OurJourneySection } from "@/components/home/OurJourneySection";
import { PhotoGallerySection } from "@/components/home/PhotoGallerySection";
import { UpcomingEventSection } from "@/components/home/UpcomingEventSection";
import { WhatWeDoSection } from "@/components/home/WhatWeDoSection";
import { WhoShouldAttendSection } from "@/components/home/WhoShouldAttendSection";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteNavbar } from "@/components/site/SiteNavbar";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "UX 36गढ़ — UI/UX Design Community & UX 36गढ़ MILAAP 2026" },
      {
        name: "description",
        content:
          "UX 36गढ़ is Chhattisgarh's growing UI/UX design community. Explore our journey, past meetups, and register for UX 36गढ़ MILAAP 2026 in Raipur on Sunday, 29 November 2026.",
      },
      {
        property: "og:title",
        content: "UX 36गढ़ — UI/UX Design Community & UX 36गढ़ MILAAP 2026",
      },
      {
        property: "og:description",
        content:
          "Where 36गढ़'s Design Community Connects. Join UX 36गढ़ MILAAP 2026 in Raipur on Sunday, 29 November 2026.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <div className="min-h-screen overflow-x-clip">
      <SiteNavbar isHomePage />
      <main>
        <HeroSection />
        <AboutAndStatsSection />
        <WhatWeDoSection />
        <OurJourneySection />
        <PhotoGallerySection />
        <UpcomingEventSection />
        <WhoShouldAttendSection />
        <FaqSection />
        <JoinCommunitySection />
      </main>
      <SiteFooter isHomePage />
    </div>
  );
}
