import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { EVENT_CONFIG } from "@/lib/event-config";

/**
 * Minimal Play/Pause ambient music toggle for the registration hero bottom-right corner.
 *
 * - Attempts autoplay once on mount and reflects actual HTMLAudioElement playback state.
 * - If browser autoplay policies block initial playback, stays cleanly paused and starts
 *   playback once on the first user interaction (without repeatedly retrying).
 * - Automatically pauses audio when navigating away from /register.
 */
export function RegistrationMusicControl() {
  const { src, volume } = EVENT_CONFIG.ambientAudio;
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const userManuallyPausedRef = useRef(false);
  const removeUnlockListenersRef = useRef<(() => void) | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !src) return;

    let cancelled = false;
    userManuallyPausedRef.current = false;
    audio.volume = volume;

    const detachUnlockListeners = () => {
      if (removeUnlockListenersRef.current) {
        removeUnlockListenersRef.current();
        removeUnlockListenersRef.current = null;
      }
    };

    const handlePlaying = () => {
      if (!cancelled) setIsPlaying(!audio.paused);
    };
    const handlePause = () => {
      if (!cancelled) setIsPlaying(false);
    };
    const handleEnded = () => {
      if (!cancelled) setIsPlaying(false);
    };
    const handleError = () => {
      detachUnlockListeners();
      if (!cancelled) {
        setIsPlaying(false);
        setHasError(true);
      }
    };

    audio.addEventListener("play", handlePlaying);
    audio.addEventListener("playing", handlePlaying);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    const attachOneShotUnlockListeners = () => {
      detachUnlockListeners();

      const onFirstInteraction = (event: Event) => {
        detachUnlockListeners();
        if (cancelled || userManuallyPausedRef.current || !audio.paused) return;
        // Let the toggle button's own click handler manage playback if clicked directly.
        if (event.target instanceof Node && buttonRef.current?.contains(event.target)) {
          return;
        }
        const retryPromise = audio.play();
        if (retryPromise !== undefined) {
          retryPromise
            .then(() => {
              if (!cancelled) setIsPlaying(!audio.paused);
            })
            .catch(() => {
              if (!cancelled) setIsPlaying(false);
            });
        } else if (!cancelled) {
          setIsPlaying(!audio.paused);
        }
      };

      window.addEventListener("pointerdown", onFirstInteraction, { passive: true });
      window.addEventListener("keydown", onFirstInteraction, { passive: true });

      removeUnlockListenersRef.current = () => {
        window.removeEventListener("pointerdown", onFirstInteraction);
        window.removeEventListener("keydown", onFirstInteraction);
      };
    };

    // Attempt autoplay once on registration page load
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          if (!cancelled) setIsPlaying(!audio.paused);
        })
        .catch(() => {
          // Autoplay blocked by browser policy — stay paused and unlock on first user interaction.
          if (!cancelled) {
            setIsPlaying(false);
            attachOneShotUnlockListeners();
          }
        });
    } else {
      setIsPlaying(!audio.paused);
    }

    return () => {
      cancelled = true;
      detachUnlockListeners();
      audio.pause();
      audio.currentTime = 0;
      audio.removeEventListener("play", handlePlaying);
      audio.removeEventListener("playing", handlePlaying);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
    };
  }, [src, volume]);

  function handleToggle() {
    const audio = audioRef.current;
    if (!audio || !src || hasError) return;

    if (removeUnlockListenersRef.current) {
      removeUnlockListenersRef.current();
      removeUnlockListenersRef.current = null;
    }

    if (!audio.paused) {
      userManuallyPausedRef.current = true;
      audio.pause();
    } else {
      userManuallyPausedRef.current = false;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(!audio.paused);
          })
          .catch(() => {
            setIsPlaying(false);
          });
      } else {
        setIsPlaying(!audio.paused);
      }
    }
  }

  return (
    <div className="absolute right-4 bottom-4 z-20 sm:right-6 sm:bottom-6">
      {src && <audio ref={audioRef} src={src} loop preload="auto" playsInline />}
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        disabled={!src || hasError}
        aria-label={isPlaying ? "Pause background music" : "Play background music"}
        aria-pressed={isPlaying}
        className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border-[3px] border-ink bg-cream text-ink shadow-[3px_3px_0_var(--primary)] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-cream disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPlaying ? (
          <Pause className="h-4 w-4 fill-ink" aria-hidden="true" />
        ) : (
          <Play className="h-4 w-4 translate-x-[1px] fill-ink" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
