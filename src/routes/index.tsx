import { createFileRoute } from "@tanstack/react-router";
import type { FormEvent } from "react";
import logo from "@/assets/uxc-logo.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "UXC 36गढ़ — Neo Retro Pop UI UX Community" },
      {
        name: "description",
        content:
          "Inviting all UI UX designers from Chhattisgarh. Meetups, design critiques, portfolio reviews and a loud, warm community. Join UXC 36गढ़.",
      },
      { property: "og:title", content: "UXC 36गढ़ — Neo Retro Pop UI UX Community" },
      {
        property: "og:description",
        content: "Join our community of UI UX designers from Chhattisgarh to grow together.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const marqueeWords = [
  "आ जाओ",
  "UI · UX",
  "CRITIQUE NIGHTS",
  "36गढ़",
  "PORTFOLIO REVIEWS",
  "TYPE & CRAFT",
  "MEETUPS",
];

const pillars = [
  {
    n: "01",
    title: "Critique Nights",
    body: "Bring the messy Figma file. Get honest, kind, specific feedback from people who actually ship.",
    tone: "bg-primary text-primary-foreground",
  },
  {
    n: "02",
    title: "Portfolio Rescue",
    body: "Case studies rewritten, screens re-cropped, stories tightened until recruiters stop scrolling.",
    tone: "bg-sand text-ink",
  },
  {
    n: "03",
    title: "Craft Jams",
    body: "Type, motion, illustration, prototyping — weekend jams where we build stuff for no reason.",
    tone: "bg-peach text-ink",
  },
  {
    n: "04",
    title: "Local First",
    body: "Raipur, Bilaspur, Bhilai, Durg. Rooted in Chhattisgarh, loud on the internet.",
    tone: "bg-cream text-ink",
  },
];

const stats = [
  { k: "480+", v: "Designers" },
  { k: "24", v: "Meetups" },
  { k: "9", v: "Cities" },
  { k: "100%", v: "Free" },
];

const events = [
  {
    name: "Iconography Challenge",
    date: "Till 16 Aug 2026",
    place: "Online",
    learnMoreUrl: "https://chat.whatsapp.com/BDE8i86MftbKAPOrsRpyzx",
    tone: "bg-cream text-ink",
  },
];

const socialLinks = [
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/company/ux-36%E0%A4%97%E0%A4%A2%E0%A4%BC/",
    path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zM7.119 20.452H3.555V9h3.564v11.452z",
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/ux36garh?utm_source=qr&igsh=MXQyeXlsOTNtd3d1Mw%3D%3D",
    path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z",
  },
  {
    name: "WhatsApp",
    href: "https://chat.whatsapp.com/BDE8i86MftbKAPOrsRpyzx",
    path: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z",
  },
];

const faqs = [
  {
    q: "Who can join?",
    a: "Anyone who designs interfaces — students, freelancers, in-house folks, developers who draw rectangles. Beginners very welcome.",
  },
  {
    q: "Do I need to be from Chhattisgarh?",
    a: "It helps, but no. If you love the craft and want to build with us, come in.",
  },
  {
    q: "What does it cost?",
    a: "Nothing. Meetups, reviews and jams are free. We pay in feedback.",
  },
];

function handleJoinSubmit(e: FormEvent<HTMLFormElement>) {
  e.preventDefault();
  const email = new FormData(e.currentTarget).get("email") as string;
  const subject = encodeURIComponent("Join UXC 36गढ़ community");
  const body = encodeURIComponent(
    `Hi,\n\nI'd like to join the UXC 36गढ़ community.\nMy email: ${email}\n`,
  );
  window.location.href = `mailto:uxchhattisgarh@gmail.com?subject=${subject}&body=${body}`;
}

function Index() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* NAV */}
      <header className="sticky top-0 z-50 border-b-[3px] border-ink bg-primary">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
          <a href="#top" className="flex items-center gap-3">
            <img src={logo} alt="UXC 36गढ़ community logo" className="h-8 w-auto" />
            <span className="font-display text-lg text-cream">36गढ़</span>
          </a>
          <div className="hidden items-center gap-7 font-display text-sm text-cream md:flex">
            <a href="#about" className="hover:text-sand">
              About
            </a>
            <a href="#what" className="hover:text-sand">
              What we do
            </a>
            <a href="#events" className="hover:text-sand">
              Events
            </a>
            <a href="#faq" className="hover:text-sand">
              FAQ
            </a>
          </div>
          <a href="#join" className="pop-btn bg-cream text-ink text-xs">
            Join us
          </a>
        </nav>
      </header>

      {/* HERO */}
      <section id="top" className="relative border-b-[3px] border-ink bg-primary">
        <div className="mx-auto max-w-5xl px-5 py-20 text-center md:py-28">
          <span className="pop-btn bg-sand text-ink text-xs">Inviting all UI UX designers</span>
          <h1 className="mt-8 font-display text-6xl leading-[0.9] text-cream retro-3d-cream sm:text-7xl md:text-8xl">
            आ जाओ,
            <br />
            let's design
            <br />
            out loud.
          </h1>
          <p className="mx-auto mt-8 max-w-xl text-lg font-semibold text-cream/90">
            UXC 36गढ़ is a designer community from Chhattisgarh — bold critiques, warm people, zero
            gatekeeping.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a href="#join" className="pop-btn bg-cream text-ink">
              Join the community
            </a>
            <a href="#what" className="pop-btn bg-primary text-cream">
              See what we do
            </a>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="overflow-hidden border-b-[3px] border-ink bg-cream py-3">
        <div className="marquee-track">
          {[...marqueeWords, ...marqueeWords].map((w, i) => (
            <span key={i} className="font-display text-xl text-ink">
              {w} <span className="text-primary">★</span>
            </span>
          ))}
        </div>
      </div>

      {/* ABOUT */}
      <section id="about" className="border-b-[3px] border-ink bg-background">
        <div className="mx-auto max-w-4xl px-5 py-16 md:py-24">
          <h2 className="font-display text-4xl leading-none text-ink retro-3d md:text-6xl">
            A community,
            <br />
            not a channel.
          </h2>
          <p className="mt-8 max-w-2xl text-lg font-semibold text-muted-foreground">
            We started as five designers arguing about button radii in a Raipur cafe. Today we are
            hundreds — students, freelancers and product folks who believe good design happens in
            public, with friends, in our own accent.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.v} className="pop-card px-4 py-5 text-center">
                <div className="font-display text-3xl text-primary">{s.k}</div>
                <div className="mt-1 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  {s.v}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT WE DO */}
      <section id="what" className="border-b-[3px] border-ink bg-brick">
        <div className="mx-auto max-w-6xl px-5 py-16 md:py-24">
          <h2 className="font-display text-4xl text-cream retro-3d-cream md:text-5xl">
            What we do
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {pillars.map((p) => (
              <article key={p.n} className={`pop-card p-7 ${p.tone}`}>
                <div className="font-display text-5xl opacity-40">{p.n}</div>
                <h3 className="mt-3 text-2xl">{p.title}</h3>
                <p className="mt-3 text-base font-semibold opacity-90">{p.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* EVENTS */}
      <section id="events" className="border-b-[3px] border-ink bg-background">
        <div className="mx-auto max-w-6xl px-5 py-16 md:py-24">
          <h2 className="font-display text-4xl text-ink retro-3d md:text-5xl">
            Upcoming & Ongoing
            <br />
            Events
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((e) => (
              <article key={e.name} className={`pop-card p-7 flex flex-col ${e.tone}`}>
                <div className="text-xs font-bold uppercase tracking-widest text-primary">
                  Event
                </div>
                <h3 className="mt-2 text-2xl">{e.name}</h3>
                <div className="mt-4 space-y-2 text-base font-semibold">
                  <p className="flex items-center gap-2">
                    <span className="inline-block h-2 w-2 rounded-full bg-primary" />
                    {e.date}
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="inline-block h-2 w-2 rounded-full bg-primary" />
                    {e.place}
                  </p>
                </div>
                <a
                  href={e.learnMoreUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="pop-btn bg-sand text-ink mt-auto justify-center text-sm self-start"
                >
                  Learn more
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* JOIN */}
      <section id="join" className="border-b-[3px] border-ink bg-primary">
        <div className="mx-auto max-w-3xl px-5 py-16 text-center md:py-24">
          <img src={logo} alt="UXC logo" className="mx-auto h-14 w-auto" />
          <h2 className="mt-6 font-display text-4xl text-cream retro-3d-cream md:text-6xl">
            Join our community
            <br />
            to grow together
          </h2>
          <form
            className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
            onSubmit={handleJoinSubmit}
          >
            <label htmlFor="email" className="sr-only">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="you@studio.com"
              className="w-full rounded-sm border-[3px] border-ink bg-cream px-4 py-3 font-semibold text-ink placeholder:text-muted-foreground focus:outline-none focus:ring-4 focus:ring-sand"
            />
            <button type="submit" className="pop-btn bg-sand text-ink justify-center">
              Count me in
            </button>
          </form>
          <p className="mt-4 text-sm font-bold uppercase tracking-wide text-cream/80">
            Free forever · No spam · Only good noise
          </p>
          {/* SOCIAL LINKS */}
          <div className="mt-8 flex justify-center gap-4">
            {socialLinks.map((s) => (
              <a
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.name}
                title={s.name}
                className="pop-btn bg-cream text-ink p-3"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
                  <path d={s.path} />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-b-[3px] border-ink bg-background">
        <div className="mx-auto max-w-3xl px-5 py-16 md:py-24">
          <h2 className="font-display text-4xl text-ink retro-3d md:text-5xl">FAQ</h2>
          <div className="mt-8 space-y-5">
            {faqs.map((f) => (
              <div key={f.q} className="pop-card p-6">
                <h3 className="text-xl">{f.q}</h3>
                <p className="mt-2 font-semibold text-muted-foreground">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-ink">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-5 py-10 text-center">
          <span className="font-display text-2xl text-cream">UXC 36गढ़</span>
          <p className="text-sm font-bold uppercase tracking-widest text-peach">
            Made in Chhattisgarh · For designers, by designers
          </p>
        </div>
      </footer>
    </div>
  );
}
