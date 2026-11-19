import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { AdminLoginGate } from "@/components/admin/AdminLoginGate";
import { EVENT_CONFIG } from "@/lib/event-config";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: `Organiser Dashboard — ${EVENT_CONFIG.upcomingEvent.name} | UX 36गढ़` },
      {
        name: "description",
        content: `Organiser dashboard login for ${EVENT_CONFIG.upcomingEvent.name}.`,
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminRoutePage,
});

function AdminRoutePage() {
  const [isPrototypeUnlocked, setIsPrototypeUnlocked] = useState(false);

  if (!isPrototypeUnlocked) {
    return <AdminLoginGate onUnlock={() => setIsPrototypeUnlocked(true)} />;
  }

  return <AdminDashboard onLogout={() => setIsPrototypeUnlocked(false)} />;
}
