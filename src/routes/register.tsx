import { createFileRoute } from "@tanstack/react-router";
import { JoinCommunitySection } from "@/components/home/JoinCommunitySection";
import { RegistrationFlow } from "@/components/register/RegistrationFlow";
import { RegistrationHeroCollage } from "@/components/register/RegistrationHeroCollage";
import { WhatsWaitingSection } from "@/components/register/WhatsWaitingSection";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteNavbar } from "@/components/site/SiteNavbar";
import { EVENT_CONFIG } from "@/lib/event-config";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: `Register — ${EVENT_CONFIG.upcomingEvent.name} | UX 36गढ़` },
      {
        name: "description",
        content: `Register for ${EVENT_CONFIG.upcomingEvent.name} on ${EVENT_CONFIG.upcomingEvent.date} in ${EVENT_CONFIG.upcomingEvent.location}. Registration fee: ${EVENT_CONFIG.upcomingEvent.registrationFeeFormatted}.`,
      },
      {
        property: "og:title",
        content: `Register — ${EVENT_CONFIG.upcomingEvent.name} | UX 36गढ़`,
      },
      {
        property: "og:description",
        content: `Let's connect, learn and grow together at ${EVENT_CONFIG.upcomingEvent.name} in Raipur on Sunday, 29 November 2026.`,
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  return (
    <div className="min-h-screen overflow-x-clip">
      <SiteNavbar ctaHref="#registration-form" ctaLabel="Register Now" />
      <main>
        {/* 1. Photo collage hero */}
        <RegistrationHeroCollage />
        {/* 2. What's waiting for you? */}
        <WhatsWaitingSection />
        {/* 3. Personal details form, 4. UPI payment section, 5. Screenshot upload, 6. Submit */}
        <RegistrationFlow />
        {/* 7. Join Our Community */}
        <JoinCommunitySection />
      </main>
      <SiteFooter showRegistrationCta={false} />
    </div>
  );
}
