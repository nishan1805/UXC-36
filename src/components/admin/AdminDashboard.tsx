import { Link } from "@tanstack/react-router";
import {
  CheckCircle2,
  Clock,
  Download,
  Eye,
  Loader2,
  LogOut,
  RefreshCw,
  Search,
  Users,
  XCircle,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EVENT_CONFIG } from "@/lib/event-config";
import {
  exportRegistrationsToCsv,
  registrationService,
  type PaymentStatus,
  type RegistrationRecord,
} from "@/lib/registration-service";

interface AdminDashboardProps {
  onLogout: () => void;
}

type StatusFilter = "all" | PaymentStatus;

const STATUS_META: Record<PaymentStatus, { label: string; badgeClass: string }> = {
  pending: {
    label: "Pending",
    badgeClass: "bg-sand text-ink border-ink",
  },
  verified: {
    label: "Verified",
    badgeClass: "bg-emerald-200 text-ink border-ink",
  },
  rejected: {
    label: "Rejected",
    badgeClass: "bg-red-200 text-ink border-ink",
  },
};

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [records, setRecords] = useState<RegistrationRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selectedRecord, setSelectedRecord] = useState<RegistrationRecord | null>(null);
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);

  const showTemporaryNotice = useCallback((message: string) => {
    setNoticeMessage(message);
    window.setTimeout(() => {
      setNoticeMessage((current) => (current === message ? null : current));
    }, 3200);
  }, []);

  const loadRegistrations = useCallback(
    async (notify = false) => {
      setIsLoading(true);
      try {
        const list = await registrationService.listRegistrations();
        setRecords(list);
        if (notify) {
          showTemporaryNotice(`Loaded ${list.length} registration(s).`);
        }
      } catch {
        showTemporaryNotice("Unable to load registrations right now.");
      } finally {
        setIsLoading(false);
      }
    },
    [showTemporaryNotice],
  );

  useEffect(() => {
    void loadRegistrations(false);
  }, [loadRegistrations]);

  const summary = useMemo(() => {
    const total = records.length;
    const pending = records.filter((r) => r.paymentStatus === "pending").length;
    const verified = records.filter((r) => r.paymentStatus === "verified").length;
    const rejected = records.filter((r) => r.paymentStatus === "rejected").length;
    return { total, pending, verified, rejected };
  }, [records]);

  const filteredRecords = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return records.filter((record) => {
      const matchesStatus = statusFilter === "all" || record.paymentStatus === statusFilter;
      if (!matchesStatus) return false;
      if (!q) return true;
      return (
        record.fullName.toLowerCase().includes(q) ||
        record.mobileNumber.toLowerCase().includes(q) ||
        record.city.toLowerCase().includes(q) ||
        record.id.toLowerCase().includes(q) ||
        record.formattedParticipantNumber.toLowerCase().includes(q)
      );
    });
  }, [records, searchQuery, statusFilter]);

  async function handleStatusChange(id: string, nextStatus: PaymentStatus) {
    try {
      await registrationService.updatePaymentStatus(id, nextStatus);
      setRecords((prev) =>
        prev.map((record) =>
          record.id === id ? { ...record, paymentStatus: nextStatus } : record,
        ),
      );
      setSelectedRecord((prev) =>
        prev && prev.id === id ? { ...prev, paymentStatus: nextStatus } : prev,
      );
      showTemporaryNotice(`Updated ${id} to ${STATUS_META[nextStatus].label}.`);
    } catch {
      showTemporaryNotice(`Could not update payment status for ${id}.`);
    }
  }

  function handleExportCsv() {
    exportRegistrationsToCsv(filteredRecords);
    showTemporaryNotice(`Exported ${filteredRecords.length} registration(s) to CSV.`);
  }

  return (
    <div className="min-h-screen overflow-x-clip bg-background">
      {/* Top Organiser Bar */}
      <header className="sticky top-0 z-40 border-b-[3px] border-ink bg-primary">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2.5">
              <img
                src={EVENT_CONFIG.community.logoSrc}
                alt="UX 36गढ़ official logo"
                className="h-7 w-auto object-contain sm:h-8"
              />
              <span className="rounded-sm border-2 border-ink bg-ink px-2 py-0.5 font-display text-[11px] uppercase tracking-wider text-cream">
                Admin
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              to="/register"
              className="rounded-sm border-2 border-ink bg-cream px-3 py-1.5 font-display text-xs uppercase text-ink shadow-[2px_2px_0_var(--ink)] hover:bg-sand"
            >
              Registration Page
            </Link>
            <button
              type="button"
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 rounded-sm border-2 border-ink bg-ink px-3 py-1.5 font-display text-xs uppercase text-cream shadow-[2px_2px_0_var(--cream)] hover:bg-ink/90"
            >
              <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Lock</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:py-10">
        {/* Heading + Quick Actions */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="font-display text-xs uppercase tracking-widest text-muted-foreground">
              {EVENT_CONFIG.upcomingEvent.name} · {EVENT_CONFIG.upcomingEvent.date}
            </p>
            <h1 className="mt-1 font-display text-3xl text-ink retro-3d sm:text-4xl">
              Registration &amp; Payment Verification
            </h1>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={() => void loadRegistrations(true)}
              disabled={isLoading}
              className="pop-btn bg-cream px-4 py-2.5 text-xs text-ink disabled:opacity-60"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <RefreshCw className="h-4 w-4" aria-hidden="true" />
              )}
              <span>Refresh</span>
            </button>
            <button
              type="button"
              onClick={handleExportCsv}
              disabled={filteredRecords.length === 0}
              className="pop-btn bg-primary px-4 py-2.5 text-xs text-ink disabled:opacity-50"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Transient Action Notice */}
        <div aria-live="polite" className="mt-4 min-h-[24px]">
          {noticeMessage && (
            <div className="inline-block rounded-sm border-2 border-ink bg-cream px-3.5 py-1.5 text-xs font-extrabold text-ink shadow-[2px_2px_0_var(--ink)]">
              {noticeMessage}
            </div>
          )}
        </div>

        {/* Four Summary Cards */}
        <section
          aria-label="Registration summary statistics"
          className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4"
        >
          <div className="pop-card-static bg-cream p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
                Total Registrations
              </span>
              <Users className="h-5 w-5 text-primary" aria-hidden="true" />
            </div>
            <div className="mt-3 font-display text-4xl text-ink">{summary.total}</div>
            <div className="mt-1 text-[11px] font-bold uppercase text-muted-foreground">
              Sequential records
            </div>
          </div>

          <div className="pop-card-static bg-sand p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-ink/80">
                Pending Verification
              </span>
              <Clock className="h-5 w-5 text-ink" aria-hidden="true" />
            </div>
            <div className="mt-3 font-display text-4xl text-ink">{summary.pending}</div>
            <div className="mt-1 text-[11px] font-bold uppercase text-ink/70">Awaiting review</div>
          </div>

          <div className="pop-card-static bg-emerald-100 p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-ink/80">
                Verified Payments
              </span>
              <CheckCircle2 className="h-5 w-5 text-emerald-800" aria-hidden="true" />
            </div>
            <div className="mt-3 font-display text-4xl text-ink">{summary.verified}</div>
            <div className="mt-1 text-[11px] font-bold uppercase text-ink/70">₹250 confirmed</div>
          </div>

          <div className="pop-card-static bg-red-100 p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-ink/80">
                Rejected Payments
              </span>
              <XCircle className="h-5 w-5 text-red-800" aria-hidden="true" />
            </div>
            <div className="mt-3 font-display text-4xl text-ink">{summary.rejected}</div>
            <div className="mt-1 text-[11px] font-bold uppercase text-ink/70">Needs follow-up</div>
          </div>
        </section>

        {/* Search & Status Filter Toolbar */}
        <section
          aria-label="Search and filter registrations"
          className="pop-card-static mt-8 bg-cream p-4 sm:p-5"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1 md:max-w-md">
              <label htmlFor="admin-search" className="sr-only">
                Search by participant number, name, mobile number, or city
              </label>
              <Search
                className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <input
                id="admin-search"
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by #001, name, mobile, or city..."
                className="w-full rounded-sm border-[3px] border-ink bg-background py-2.5 pr-4 pl-10 text-sm font-semibold text-ink placeholder:text-muted-foreground focus:outline-none focus:ring-4 focus:ring-primary/40"
              />
            </div>

            <div
              role="group"
              aria-label="Filter by payment status"
              className="flex flex-wrap items-center gap-2"
            >
              {(
                [
                  { id: "all", label: `All (${summary.total})` },
                  { id: "pending", label: `Pending (${summary.pending})` },
                  { id: "verified", label: `Verified (${summary.verified})` },
                  { id: "rejected", label: `Rejected (${summary.rejected})` },
                ] as const
              ).map((tab) => {
                const isActive = statusFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setStatusFilter(tab.id)}
                    aria-pressed={isActive}
                    className={`rounded-sm border-2 border-ink px-3 py-1.5 font-display text-xs uppercase transition-colors ${
                      isActive
                        ? "bg-primary text-ink shadow-[2px_2px_0_var(--ink)]"
                        : "bg-background text-ink hover:bg-sand"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Registrations Table */}
        <section
          aria-label="Event registrations table"
          className="pop-card-static mt-6 overflow-hidden bg-cream"
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[960px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b-[3px] border-ink bg-sand font-display text-xs uppercase tracking-wider text-ink">
                  <th className="px-4 py-3.5">No.</th>
                  <th className="px-4 py-3.5">Participant Name</th>
                  <th className="px-4 py-3.5">Mobile Number</th>
                  <th className="px-4 py-3.5">City</th>
                  <th className="px-4 py-3.5">Payment Screenshot</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5">Registered At</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-ink/15 font-semibold text-ink">
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-muted-foreground">
                      Loading registrations...
                    </td>
                  </tr>
                ) : filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-muted-foreground">
                      {records.length === 0
                        ? "No registrations recorded yet. Submit a registration on /register to see participants appear here with sequential numbers (#001, #002, ...)."
                        : "No registrations match your search or status filter."}
                    </td>
                  </tr>
                ) : (
                  filteredRecords.map((record) => {
                    const statusStyle = STATUS_META[record.paymentStatus];
                    return (
                      <tr key={record.id} className="transition-colors hover:bg-background/70">
                        <td className="px-4 py-3.5">
                          <span className="inline-block rounded-sm border-2 border-ink bg-[#F83F28] px-2 py-0.5 font-display text-xs text-white">
                            {record.formattedParticipantNumber}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 font-bold">{record.fullName}</td>
                        <td className="px-4 py-3.5 font-mono text-xs font-bold">
                          {record.mobileNumber}
                        </td>
                        <td className="px-4 py-3.5">{record.city}</td>
                        <td className="px-4 py-3.5">
                          <button
                            type="button"
                            onClick={() => setSelectedRecord(record)}
                            className="inline-flex items-center gap-2 rounded-sm border-2 border-ink bg-background p-1 pr-2.5 text-xs font-bold text-ink transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-sand"
                          >
                            <img
                              src={record.screenshotUrl}
                              alt={`Payment screenshot thumbnail for ${record.fullName}`}
                              loading="lazy"
                              className="h-9 w-7 rounded-[2px] border border-ink object-cover"
                            />
                            <span>Preview</span>
                          </button>
                        </td>
                        <td className="px-4 py-3.5">
                          <span
                            className={`inline-block rounded-sm border-2 px-2.5 py-0.5 font-display text-[11px] uppercase ${statusStyle.badgeClass}`}
                          >
                            {statusStyle.label}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-xs font-bold text-muted-foreground">
                          {record.registeredAt}
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => setSelectedRecord(record)}
                              title="View screenshot preview"
                              aria-label={`View payment screenshot for ${record.fullName}`}
                              className="inline-flex items-center gap-1 rounded-sm border-2 border-ink bg-background px-2.5 py-1.5 text-xs font-extrabold text-ink hover:bg-sand"
                            >
                              <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                              <span className="sr-only sm:not-sr-only">View</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => void handleStatusChange(record.id, "verified")}
                              disabled={record.paymentStatus === "verified"}
                              className="inline-flex items-center gap-1 rounded-sm border-2 border-ink bg-emerald-200 px-2.5 py-1.5 text-xs font-extrabold text-ink hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-45"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                              <span>Verify</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => void handleStatusChange(record.id, "rejected")}
                              disabled={record.paymentStatus === "rejected"}
                              className="inline-flex items-center gap-1 rounded-sm border-2 border-ink bg-red-200 px-2.5 py-1.5 text-xs font-extrabold text-ink hover:bg-red-300 disabled:cursor-not-allowed disabled:opacity-45"
                            >
                              <XCircle className="h-3.5 w-3.5" aria-hidden="true" />
                              <span>Reject</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 border-t-[3px] border-ink bg-sand/70 px-4 py-3 text-xs font-bold text-ink">
            <span>
              Showing {filteredRecords.length} of {records.length} registrations
            </span>
            <span>Server-assigned sequential participant numbers · Pending until verified</span>
          </div>
        </section>
      </main>

      {/* Screenshot Preview Modal */}
      <Dialog
        open={selectedRecord !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedRecord(null);
        }}
      >
        <DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto border-[3px] border-ink bg-cream p-0 shadow-[8px_8px_0_var(--ink)] sm:rounded-sm">
          {selectedRecord && (
            <>
              <div className="border-b-[3px] border-ink bg-primary px-6 py-4 pr-12">
                <DialogHeader className="text-left">
                  <DialogTitle className="font-display text-lg uppercase text-ink">
                    Payment Proof · {selectedRecord.formattedParticipantNumber} ({selectedRecord.id}
                    )
                  </DialogTitle>
                  <DialogDescription className="text-xs font-bold text-ink/85">
                    Verify the uploaded ₹250 UPI screenshot before marking as verified.
                  </DialogDescription>
                </DialogHeader>
              </div>

              <div className="space-y-5 p-6">
                <div className="grid grid-cols-2 gap-3 rounded-sm border-2 border-ink bg-background p-4 text-xs font-bold">
                  <div>
                    <span className="block uppercase text-muted-foreground">Participant</span>
                    <span className="mt-0.5 block text-sm text-ink">
                      {selectedRecord.formattedParticipantNumber} — {selectedRecord.fullName}
                    </span>
                  </div>
                  <div>
                    <span className="block uppercase text-muted-foreground">Mobile</span>
                    <span className="mt-0.5 block font-mono text-sm text-ink">
                      {selectedRecord.mobileNumber}
                    </span>
                  </div>
                  <div>
                    <span className="block uppercase text-muted-foreground">City</span>
                    <span className="mt-0.5 block text-sm text-ink">{selectedRecord.city}</span>
                  </div>
                  <div>
                    <span className="block uppercase text-muted-foreground">Current Status</span>
                    <span
                      className={`mt-1 inline-block rounded-sm border-2 px-2 py-0.5 font-display text-[10px] uppercase ${STATUS_META[selectedRecord.paymentStatus].badgeClass}`}
                    >
                      {STATUS_META[selectedRecord.paymentStatus].label}
                    </span>
                  </div>
                </div>

                <div className="flex justify-center rounded-sm border-[3px] border-ink bg-background p-4">
                  <img
                    src={selectedRecord.screenshotUrl}
                    alt={`Payment proof for ${selectedRecord.fullName}`}
                    className="max-h-[420px] w-auto rounded-sm object-contain"
                  />
                </div>

                <div className="flex flex-wrap items-center justify-end gap-3 border-t-2 border-ink/15 pt-4">
                  <button
                    type="button"
                    onClick={() => void handleStatusChange(selectedRecord.id, "rejected")}
                    disabled={selectedRecord.paymentStatus === "rejected"}
                    className="pop-btn bg-red-200 px-4 py-2 text-xs text-ink disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <XCircle className="h-4 w-4" aria-hidden="true" />
                    <span>Mark as Rejected</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleStatusChange(selectedRecord.id, "verified")}
                    disabled={selectedRecord.paymentStatus === "verified"}
                    className="pop-btn bg-emerald-200 px-4 py-2 text-xs text-ink disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                    <span>Mark as Verified</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
