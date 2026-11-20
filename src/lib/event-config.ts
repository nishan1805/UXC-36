/**
 * Central configuration for UX 36गढ़ community and UX 36गढ़ MILAAP 2026.
 *
 * Update event details, official UPI ID, payment QR path, and genuine event
 * photographs in this single file to refresh content across the entire website.
 */

export interface SocialLink {
  id: "whatsapp" | "instagram" | "linkedin";
  name: string;
  heading: string;
  ctaLabel: string;
  href: string;
  description: string;
}

export interface CommunityStat {
  value: string;
  label: string;
  platform: "whatsapp" | "linkedin";
}

export interface ActivityPillar {
  number: string;
  title: string;
  description: string;
  toneClass: string;
}

export interface PastActivity {
  id: string;
  tag: string;
  title: string;
  date?: string;
  time?: string;
  duration?: string;
  venue?: string;
  platform?: string;
  description: string;
  accentClass: string;
}

export interface EventPhoto {
  id: string;
  src: string;
  alt: string;
  caption: string;
  activityLabel: string;
  isPlaceholder: boolean;
  objectPosition?: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const EVENT_CONFIG = {
  community: {
    name: "UX 36गढ़",
    shortMark: "36गढ़",
    logoSrc: "/assets/aistudio/UXC_6f84c107.png",
    tagline: "आ जाओ, let's design out loud",
    contactEmail: "uxchhattisgarh@gmail.com",
    region: "Chhattisgarh",
    copyrightYear: "2026",
  },

  upcomingEvent: {
    name: "UX 36गढ़ MILAAP 2026",
    shortTitle: "MILAAP 2026",
    tagline: "Where 36गढ़'s Design Community Connects.",
    eyebrow: "UX 36गढ़ PRESENTS",
    date: "Sunday, 29 November 2026",
    shortDate: "Sunday, 29 November 2026",
    location: "Raipur, Chhattisgarh",
    shortLocation: "Raipur",
    venueStatus: "To be announced",
    locationWithVenue: "Raipur, venue to be announced",
    confirmedTime: "11:00 AM – 5:00 PM",
    heroDuration: "4–5 hours",
    duration: "4–5 hours",
    expectedParticipants: "30+ expected participants",
    /** IMPORTANT: Display registrationFee ONLY on /register and /admin — never on the homepage. */
    registrationFeeAmount: 250,
    registrationFeeCurrency: "₹",
    registrationFeeFormatted: "₹250 per person",
    registrationFeeShort: "₹250",
  },

  /**
   * Official UPI payment configuration for UX 36गढ़ MILAAP 2026.
   */
  payment: {
    upiId: "8770454539-2@ybl",
    upiIdIsPlaceholder: false,
    qrImageSrc: "/assets/aistudio/WhatsApp_Image_2026-11-19_at_19.47.11_6c80f88c.jpeg",
    qrImageAlt: "Official PhonePe UPI QR code for UX 36गढ़ MILAAP 2026 — Nishan Kumar Mondal",
    qrIsPlaceholder: false,
    payeeName: "Nishan Kumar Mondal",
    instructions: [
      {
        number: "01",
        title: "Choose your payment method",
        description: "Scan the UPI QR code or use the official UPI ID.",
      },
      {
        number: "02",
        title: "Complete the payment",
        description: "Pay exactly ₹250 using your preferred UPI application.",
      },
      {
        number: "03",
        title: "Upload payment screenshot",
        description:
          "Return to the registration form and upload your payment confirmation screenshot.",
      },
    ],
  },

  /**
   * Subtle ambient instrumental background audio for the /register page only.
   */
  ambientAudio: {
    src: "/assets/aistudio/fatbunny-meeting-487113_1d6c5990.mp3",
    volume: 0.26,
  },

  /**
   * Personalized post-registration attendee card configuration.
   * Uses official UX 36गढ़ logo accent (#F83F28) and unmodified uploaded QR code asset.
   */
  attendeeCard: {
    accentColor: "#F83F28",
    accentSoftColor: "#FFB3A7",
    heading: "I'M ATTENDING!",
    message: "Excited to connect with the design community of Chhattisgarh.",
    qrImageSrc: "/assets/aistudio/adobe-express-qr-code__1__00a7b3db.png",
    qrImageAlt: "Official QR code to explore UX 36गढ़",
    qrLabel: "SCAN TO EXPLORE UXC",
    communityMark: "UXC 36गढ़",
    communitySublabel: "Chhattisgarh Design Community",
  },

  /** Display ONLY these two verified community statistics on the homepage. */
  communityStats: [
    {
      value: "150+",
      label: "WhatsApp Community Members",
      platform: "whatsapp",
    },
    {
      value: "120+",
      label: "LinkedIn Followers",
      platform: "linkedin",
    },
  ] satisfies CommunityStat[],

  /** Preserved exact destination URLs from the existing UXC-36 repository. */
  socialLinks: [
    {
      id: "whatsapp",
      name: "WhatsApp",
      heading: "Join our WhatsApp Community",
      ctaLabel: "Join us on WhatsApp",
      href: "https://chat.whatsapp.com/BDE8i86MftbKAPOrsRpyzx",
      description:
        "Be part of daily design conversations, discover shared resources, explore opportunities and stay updated with our meetups and events.",
    },
    {
      id: "instagram",
      name: "Instagram",
      heading: "Follow us on Instagram",
      ctaLabel: "Follow us",
      href: "https://www.instagram.com/ux36garh?utm_source=qr&igsh=MXQyeXlsOTNtd3d1Mw%3D%3D",
      description:
        "Explore community moments, meetup highlights, design updates and announcements from UX 36गढ़.",
    },
    {
      id: "linkedin",
      name: "LinkedIn",
      heading: "Connect with us on LinkedIn",
      ctaLabel: "Connect with us",
      href: "https://www.linkedin.com/company/ux-36%E0%A4%97%E0%A4%A2%E0%A4%BC/",
      description:
        "Stay connected with the growing design community, discover professional updates and follow our community journey.",
    },
  ] satisfies SocialLink[],

  homepageNavItems: [
    { id: "about", label: "About", href: "#about" },
    { id: "our-journey", label: "Our Journey", href: "#our-journey" },
    { id: "gallery", label: "Gallery", href: "#gallery" },
    { id: "upcoming-event", label: "Upcoming Event", href: "#upcoming-event" },
    { id: "join-community", label: "Join Community", href: "#join-community" },
  ],

  whatWeDoPillars: [
    {
      number: "01",
      title: "Resources",
      description:
        "Access useful design resources, learning materials, references and curated content to support your growth as a designer.",
      toneClass: "bg-cream text-ink",
    },
    {
      number: "02",
      title: "Meetups & Events",
      description:
        "Be part of virtual sessions, offline meetups, community gatherings and interactive learning experiences.",
      toneClass: "bg-sand text-ink",
    },
    {
      number: "03",
      title: "Career & Work Opportunities",
      description:
        "Discover design jobs, internships, freelance projects and collaboration opportunities shared within our community.",
      toneClass: "bg-peach text-ink",
    },
    {
      number: "04",
      title: "Career Guidance & Collaboration",
      description:
        "Learn from fellow designers, exchange feedback, share experiences and help each other grow professionally.",
      toneClass: "bg-cream text-ink",
    },
  ] satisfies ActivityPillar[],

  /** Chronological community journey timeline: Community Started through Upcoming Event. */
  pastActivities: [
    {
      id: "community-started",
      tag: "Community Milestone",
      title: "The Beginning of UX 36गढ़",
      date: "29 July 2026",
      description:
        "UX 36गढ़ started with a simple idea: bringing together designers, creative minds and aspiring professionals from across Chhattisgarh to learn, share and grow together.",
      accentClass: "bg-cream",
    },
    {
      id: "first-virtual-community-meetup",
      tag: "Virtual Meetup",
      title: "First Virtual Community Meetup",
      date: "1 August 2026",
      time: "4:00 PM – 5:00 PM",
      platform: "Google Meet",
      description:
        "Our first virtual gathering brought community members together to introduce themselves, exchange experiences and take the first steps towards building the UX 36गढ़ community.",
      accentClass: "bg-sand",
    },
    {
      id: "portfolio-upgrade-session",
      tag: "Online Session",
      title: "Portfolio Upgrade Session",
      date: "16 August 2026",
      time: "6:00 PM – 8:00 PM",
      platform: "Google Meet",
      description:
        "An online learning session focused on helping designers improve their portfolios, present projects effectively and communicate their design decisions.",
      accentClass: "bg-peach",
    },
    {
      id: "first-offline-meetup",
      tag: "Offline Meetup",
      title: "First Offline Meetup",
      date: "23 August 2026",
      time: "3:00 PM – 5:30 PM",
      venue: "Nukkad Cafe & Co-working, New Rajendra Nagar, Raipur",
      description:
        "Our first casual offline gathering brought together community members from Raipur, Bhilai and Baloda Bazar. It was an important step towards building meaningful in-person connections across Chhattisgarh.",
      accentClass: "bg-cream",
    },
    {
      id: "ux-36garh-milaap-2026",
      tag: "Upcoming Event",
      title: "UX 36गढ़ MILAAP 2026",
      date: "Sunday, 29 November 2026",
      time: "11:00 AM – 5:00 PM",
      duration: "4–5 hours",
      venue: "Raipur, Chhattisgarh · Venue to be announced",
      description:
        "Our next big gathering brings together designers, creative minds and aspiring professionals from across Chhattisgarh for meaningful conversations, shared experiences and new connections.",
      accentClass: "bg-primary",
    },
  ] satisfies PastActivity[],

  /**
   * Real UX 36गढ़ community photographs from First Offline Meetup, Portfolio Upgrade Session,
   * and First Virtual Community Meetup arranged in a stable, visually balanced mixed order.
   * Add new entries here to expand the homepage gallery automatically.
   */
  eventPhotos: [
    {
      id: "offline-seated-group",
      src: "/assets/aistudio/1_0c2b7cc9.jpeg",
      alt: "UX 36गढ़ members seated together around the table at the First Offline Meetup in Raipur",
      caption: "First Offline Meetup — 23 August 2026 at Nukkad Cafe & Co-working, Raipur",
      activityLabel: "First Offline Meetup",
      isPlaceholder: false,
      objectPosition: "object-center",
    },
    {
      id: "portfolio-upgrade-session",
      src: "/assets/aistudio/Portfolio_Session_d557a9b4.png",
      alt: "UX 36गढ़ Online Portfolio Upgrade Session on Google Meet",
      caption: "Portfolio Upgrade Session — 16 August 2026 on Google Meet",
      activityLabel: "Portfolio Upgrade Session",
      isPlaceholder: false,
      objectPosition: "object-center",
    },
    {
      id: "offline-table-discussion",
      src: "/assets/aistudio/3_1862659f.jpeg",
      alt: "Candid design conversation and sketching during the First Offline Meetup in Raipur",
      caption: "Design discussions during the First Offline Meetup",
      activityLabel: "First Offline Meetup",
      isPlaceholder: false,
      objectPosition: "object-center",
    },
    {
      id: "offline-group-selfie-1",
      src: "/assets/aistudio/edited-photo__1__7f822755.png",
      alt: "UX 36गढ़ community group selfie at Nukkad Cafe & Co-working, Raipur",
      caption: "Community group selfie from the First Offline Meetup",
      activityLabel: "First Offline Meetup",
      isPlaceholder: false,
      objectPosition: "object-top",
    },
    {
      id: "first-virtual-meetup",
      src: "/assets/aistudio/1st_Virtual_Meetup_1883c82f.png",
      alt: "UX 36गढ़ First Virtual Community Meetup on Google Meet",
      caption: "First Virtual Community Meetup — 1 August 2026 on Google Meet",
      activityLabel: "First Virtual Community Meetup",
      isPlaceholder: false,
      objectPosition: "object-center",
    },
    {
      id: "offline-wireframe-sketch",
      src: "/assets/aistudio/4_512400e6.jpeg",
      alt: "Mobile wireframe sketching sheet and pencil on the table at the First Offline Meetup",
      caption: "Hands-on wireframing exercise at the First Offline Meetup",
      activityLabel: "First Offline Meetup",
      isPlaceholder: false,
      objectPosition: "object-center",
    },
    {
      id: "offline-group-selfie-2",
      src: "/assets/aistudio/edited-photo_160a15bd.png",
      alt: "UX 36गढ़ designers smiling together for a group photo at the First Offline Meetup",
      caption: "Designers from Raipur, Bhilai and Baloda Bazar at the First Offline Meetup",
      activityLabel: "First Offline Meetup",
      isPlaceholder: false,
      objectPosition: "object-top",
    },
    {
      id: "offline-wireframe-presentation",
      src: "/assets/aistudio/2_07b4357a.jpeg",
      alt: "Community member presenting a mobile wireframe concept during the First Offline Meetup",
      caption: "Presenting design ideas during the First Offline Meetup",
      activityLabel: "First Offline Meetup",
      isPlaceholder: false,
      objectPosition: "object-top",
    },
  ] satisfies EventPhoto[],

  whoShouldAttend: [
    {
      title: "UI/UX and Product Designers",
      detail: "Share craft, compare workflows and connect with peers shaping digital products.",
    },
    {
      title: "Students and aspiring designers",
      detail: "Learn from real design journeys, ask questions and meet mentors and peers.",
    },
    {
      title: "Freelancers",
      detail: "Step away from solo screens, trade stories and build a local creative circle.",
    },
    {
      title: "Working professionals",
      detail: "Exchange perspectives on product thinking, systems and real-world shipping.",
    },
    {
      title: "Creative professionals and design enthusiasts",
      detail: "Anyone curious about user experience, visual craft and thoughtful problem-solving.",
    },
  ],

  /** Homepage FAQs — strictly grounded in provided information and never displaying ₹250 on the homepage. */
  faqs: [
    {
      id: "faq-1",
      question: "What is UX 36गढ़?",
      answer:
        "UX 36गढ़ is a growing community bringing together UI/UX designers, product designers, creative minds and design enthusiasts across Chhattisgarh through virtual meetups, portfolio sessions and offline gatherings.",
    },
    {
      id: "faq-2",
      question: "Who can join the community?",
      answer:
        "Whether you're a student exploring design, a freelancer, a working professional or simply curious about UX, there's a place for you in UX 36गढ़.",
    },
    {
      id: "faq-3",
      question: "Who can attend UX 36गढ़ MILAAP 2026?",
      answer:
        "UI/UX and Product Designers, students and aspiring designers, freelancers, working professionals, and creative professionals or design enthusiasts are all welcome to attend UX 36गढ़ MILAAP 2026.",
    },
    {
      id: "faq-4",
      question: "When is the event?",
      answer:
        "UX 36गढ़ MILAAP 2026 is scheduled for Sunday, 29 November 2026, from 11:00 AM to 5:00 PM.",
    },
    {
      id: "faq-5",
      question: "Where will the event take place?",
      answer:
        "The event will take place in Raipur, Chhattisgarh. The final venue will be announced soon.",
    },
    {
      id: "faq-6",
      question: "How long will the event be?",
      answer:
        "The event is scheduled between 11:00 AM and 5:00 PM, with an expected duration of around 4–5 hours.",
    },
    {
      id: "faq-7",
      question: "How can I register?",
      answer:
        "Click the Register Now button to visit the dedicated registration page, enter your full name, mobile number and city, complete the UPI payment and upload your payment screenshot.",
    },
    {
      id: "faq-8",
      question: "How do I complete the payment?",
      answer:
        "All payment details and UPI instructions are provided on the dedicated registration page. You can scan the UPI QR code using apps like Google Pay, PhonePe, Paytm or BHIM, then upload your payment screenshot on the registration page.",
    },
    {
      id: "faq-9",
      question: "When will my payment be verified?",
      answer:
        "Once live registration is enabled, the UX 36गढ़ organising team will manually verify uploaded payment screenshots and update your registration status through the organiser review process.",
    },
    {
      id: "faq-10",
      question: "Will the venue be announced later?",
      answer:
        "Yes. The event will be held in Raipur, Chhattisgarh, and the exact venue details will be announced once finalised through our community channels.",
    },
  ] satisfies FaqItem[],
} as const;
