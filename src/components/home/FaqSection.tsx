import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { EVENT_CONFIG } from "@/lib/event-config";

export function FaqSection() {
  return (
    <section id="faq" className="scroll-mt-20 border-b-[3px] border-ink bg-background">
      <div className="mx-auto max-w-4xl px-5 py-16 md:py-24">
        <div className="text-center">
          <span className="inline-block rounded-sm border-[3px] border-ink bg-sand px-3 py-1 font-display text-xs uppercase tracking-wider text-ink shadow-[3px_3px_0_var(--ink)]">
            Got Questions?
          </span>
          <h2 className="mt-4 font-display text-4xl text-ink retro-3d sm:text-5xl">
            Frequently Asked Questions
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base font-semibold text-muted-foreground sm:text-lg">
            Everything you need to know about {EVENT_CONFIG.community.name} and{" "}
            {EVENT_CONFIG.upcomingEvent.name}.
          </p>
        </div>

        <Accordion type="single" collapsible defaultValue="faq-1" className="mt-10 space-y-4">
          {EVENT_CONFIG.faqs.map((faq, index) => (
            <AccordionItem
              key={faq.id}
              value={faq.id}
              className="pop-card-static overflow-hidden border-[3px] border-ink bg-cream px-5 sm:px-6"
            >
              <AccordionTrigger className="py-5 text-left font-display text-base uppercase tracking-tight text-ink hover:no-underline focus-visible:outline-none sm:text-lg [&>svg]:h-5 [&>svg]:w-5 [&>svg]:text-ink">
                <span className="flex items-start gap-3 pr-3">
                  <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-sm border-2 border-ink bg-primary font-display text-[11px] text-ink">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span>{faq.question}</span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="border-t-2 border-ink/15 pt-4 pb-5 text-base font-semibold leading-relaxed text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
