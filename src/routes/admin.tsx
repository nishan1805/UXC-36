import { createFileRoute } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { AdminLoginGate } from "@/components/admin/AdminLoginGate";
import { EVENT_CONFIG } from "@/lib/event-config";
import { adminSignOut, getAdminSession, subscribeToAdminSignOut } from "@/lib/registration-service";

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

type AdminPhase = "loading" | "gate" | "dashboard";

function AdminRoutePage() {
  const [phase, setPhase] = useState<AdminPhase>("loading");

  const leaveDashboard = useCallback(() => {
    void adminSignOut().finally(() => {
      setPhase("gate");
    });
  }, []);

  useEffect(() => {
    let cancelled = false;
    void getAdminSession()
      .then((isAdmin) => {
        if (!cancelled) setPhase(isAdmin ? "dashboard" : "gate");
      })
      .catch(() => {
        if (!cancelled) setPhase("gate");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    return subscribeToAdminSignOut(() => {
      setPhase("gate");
    });
  }, []);

  if (phase === "loading") {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-background px-4">
        <div
          className="pop-card-static bg-cream px-8 py-6 text-center"
          role="status"
          aria-live="polite"
        >
          <Loader2 className="mx-auto h-6 w-6 animate-spin text-ink" aria-hidden="true" />
          <p className="mt-3 font-display text-sm uppercase tracking-wide text-ink">
            Loading organiser dashboard
          </p>
        </div>
      </div>
    );
  }

  if (phase === "gate") {
    return <AdminLoginGate onUnlock={() => setPhase("dashboard")} />;
  }

  return <AdminDashboard onLogout={leaveDashboard} onSessionExpired={leaveDashboard} />;
}
