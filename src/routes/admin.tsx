import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { AdminLoginGate } from "@/components/admin/AdminLoginGate";
import { EVENT_CONFIG } from "@/lib/event-config";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: `Admin Preview — ${EVENT_CONFIG.upcomingEvent.name} | UX 36गढ़` },
      {
        name: "description",
        content: `Frontend organiser dashboard prototype for ${EVENT_CONFIG.upcomingEvent.name} using sample demonstration data.`,
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
