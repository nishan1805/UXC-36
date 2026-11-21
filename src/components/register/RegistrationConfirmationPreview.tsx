import { CheckCircle2 } from "lucide-react";
import { AttendeeBadgeCard } from "@/components/register/AttendeeBadgeCard";
import { EVENT_CONFIG } from "@/lib/event-config";
import type { RegistrationSubmissionResult } from "@/lib/registration-service";

interface RegistrationConfirmationPreviewProps {
  result: RegistrationSubmissionResult;
  onReset: () => void;
}

export function RegistrationConfirmationPreview({
  result,
  onReset,
}: RegistrationConfirmationPreviewProps) {
  const { upcomingEvent } = EVENT_CONFIG;

  return (
    <div
      id="registration-confirmation"
      className="pop-card-static overflow-hidden bg-cream p-6 sm:p-8"
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-sm border-[3px] border-ink bg-primary text-ink shadow-[3px_3px_0_var(--ink)]">
          <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
        </span>
        <div>
          <h2 className="font-display text-2xl text-ink sm:text-3xl">Registration Submitted</h2>
          <p className="mt-1 text-sm font-semibold text-muted-foreground sm:text-base">
            Thank you, <strong className="text-ink">{result.participant.fullName}</strong>! Your
            registration for <strong className="text-ink">{upcomingEvent.name}</strong> has been
            received. Payment verification is currently pending review by the organising team.
          </p>
        </div>
      </div>

      {/* Personalized Event Attendance Card + Action Buttons */}
      <AttendeeBadgeCard
        attendeeName={result.participant.fullName}
        attendeeCity={result.participant.city}
        participantNumber={result.formattedParticipantNumber}
        onRegisterAnother={onReset}
      />
    </div>
  );
}
