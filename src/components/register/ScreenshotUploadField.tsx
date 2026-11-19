import { ImagePlus, Loader2, RefreshCw, Trash2, UploadCloud } from "lucide-react";
import { useEffect, useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { formatFileSize, validatePaymentScreenshot } from "@/lib/registration-service";

interface ScreenshotUploadFieldProps {
  file: File | null;
  error: string | null;
  onFileSelect: (file: File | null, validationError: string | null) => void;
}

export function ScreenshotUploadField({ file, error, onFileSelect }: ScreenshotUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }

    setIsReading(true);
    const objectUrl = URL.createObjectURL(file);
    const timer = window.setTimeout(() => {
      setPreviewUrl(objectUrl);
      setIsReading(false);
    }, 180);

    return () => {
      window.clearTimeout(timer);
      URL.revokeObjectURL(objectUrl);
    };
  }, [file]);

  function processFile(candidate: File | null) {
    if (!candidate) return;
    const validationError = validatePaymentScreenshot(candidate);
    if (validationError) {
      onFileSelect(null, validationError);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }
    onFileSelect(candidate, null);
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0] ?? null;
    processFile(selected);
  }

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    const dropped = event.dataTransfer.files?.[0] ?? null;
    processFile(dropped);
  }

  function handleRemove() {
    onFileSelect(null, null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  function handleTriggerBrowse() {
    inputRef.current?.click();
  }

  return (
    <div className="pop-card-static bg-cream p-6 sm:p-8">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border-[3px] border-ink bg-primary font-display text-sm text-ink shadow-[2px_2px_0_var(--ink)]">
          03
        </span>
        <div>
          <h2 className="font-display text-2xl text-ink sm:text-3xl">Almost there!</h2>
          <p className="mt-0.5 text-sm font-semibold text-muted-foreground sm:text-base">
            Upload a screenshot of your completed ₹250 payment.
          </p>
        </div>
      </div>

      {/* Hidden native file input */}
      <input
        ref={inputRef}
        id="reg-payment-screenshot"
        name="paymentScreenshot"
        type="file"
        accept=".png,.jpg,.jpeg,image/png,image/jpeg"
        onChange={handleInputChange}
        aria-label="Upload payment screenshot"
        className="sr-only"
      />

      <div className="mt-6">
        {!file ? (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleTriggerBrowse}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleTriggerBrowse();
              }
            }}
            role="button"
            tabIndex={0}
            aria-describedby="screenshot-requirements"
            className={`flex cursor-pointer flex-col items-center justify-center rounded-sm border-[3px] border-dashed px-6 py-10 text-center transition-colors focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ink ${
              isDragging
                ? "border-ink bg-sand"
                : error
                  ? "border-destructive bg-destructive/5"
                  : "border-ink bg-background hover:bg-sand/60"
            }`}
          >
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-sm border-[3px] border-ink bg-primary text-ink shadow-[3px_3px_0_var(--ink)]">
              <UploadCloud className="h-7 w-7" aria-hidden="true" />
            </span>
            <p className="mt-4 font-display text-base uppercase text-ink sm:text-lg">
              Drag &amp; drop your payment screenshot
            </p>
            <p className="mt-1 text-sm font-semibold text-muted-foreground">
              or click to browse from your device
            </p>
            <span className="mt-4 inline-flex items-center gap-2 rounded-sm border-2 border-ink bg-cream px-4 py-2 font-display text-xs uppercase text-ink shadow-[2px_2px_0_var(--ink)]">
              <ImagePlus className="h-4 w-4" aria-hidden="true" />
              Browse Files
            </span>
            <p
              id="screenshot-requirements"
              className="mt-4 text-xs font-bold uppercase tracking-wider text-muted-foreground"
            >
              Accepted: PNG, JPG, JPEG · Max size: 5 MB
            </p>
          </div>
        ) : (
          <div className="rounded-sm border-[3px] border-ink bg-background p-4 shadow-[4px_4px_0_var(--ink)] sm:p-5">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              {/* Thumbnail Preview */}
              <div className="flex h-44 w-full shrink-0 items-center justify-center overflow-hidden rounded-sm border-[3px] border-ink bg-cream sm:h-40 sm:w-40">
                {isReading || !previewUrl ? (
                  <div className="flex flex-col items-center gap-2 text-xs font-bold text-muted-foreground">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" aria-hidden="true" />
                    <span>Loading preview...</span>
                  </div>
                ) : (
                  <img
                    src={previewUrl}
                    alt="Uploaded payment screenshot preview"
                    className="h-full w-full object-contain"
                  />
                )}
              </div>

              {/* File info & Replace/Remove actions */}
              <div className="min-w-0 flex-1">
                <span className="inline-block rounded-sm border-2 border-ink bg-sand px-2.5 py-0.5 font-display text-[11px] uppercase text-ink">
                  Screenshot Attached
                </span>
                <p className="mt-2 truncate font-display text-base text-ink" title={file.name}>
                  {file.name}
                </p>
                <p className="mt-1 text-sm font-semibold text-muted-foreground">
                  {formatFileSize(file.size)} · Ready for frontend preview submission
                </p>

                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handleTriggerBrowse}
                    className="inline-flex items-center gap-1.5 rounded-sm border-2 border-ink bg-sand px-3.5 py-2 font-display text-xs uppercase text-ink shadow-[2px_2px_0_var(--ink)] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5"
                  >
                    <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
                    Replace Image
                  </button>
                  <button
                    type="button"
                    onClick={handleRemove}
                    className="inline-flex items-center gap-1.5 rounded-sm border-2 border-ink bg-cream px-3.5 py-2 font-display text-xs uppercase text-destructive shadow-[2px_2px_0_var(--ink)] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5"
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <p role="alert" className="mt-3 text-sm font-bold text-destructive">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
