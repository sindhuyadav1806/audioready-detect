import { useRef, useState } from "react";
import { FileAudio, UploadCloud, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ACCEPTED = [".wav", ".mp3", ".m4a", ".webm", ".ogg"];
const MAX_BYTES = 25 * 1024 * 1024;

export interface SelectedAudio {
  file: File;
  url: string;
}

export function AudioUploader({
  selected,
  onSelect,
  onClear,
}: {
  selected: SelectedAudio | null;
  onSelect: (audio: SelectedAudio) => void;
  onClear: () => void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = (file: File | undefined) => {
    setError(null);
    if (!file) return;
    const extension = `.${file.name.split(".").pop()?.toLowerCase() ?? ""}`;
    const looksAudio = file.type.startsWith("audio/") || ACCEPTED.includes(extension);
    if (!looksAudio) {
      setError("Unsupported format. Upload a WAV, MP3, M4A, WebM or OGG file.");
      return;
    }
    if (file.size === 0) {
      setError("That file is empty. Choose a recording with audio content.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("File is larger than 25 MB. Upload a shorter sample.");
      return;
    }
    onSelect({ file, url: URL.createObjectURL(file) });
  };

  return (
    <div className="space-y-3">
      {selected ? (
        <div className="glass flex flex-col gap-4 rounded-2xl p-5 sm:flex-row sm:items-center">
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/15 text-primary">
            <FileAudio className="size-5" aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium">{selected.file.name}</p>
            <p className="text-xs text-muted-foreground">
              {(selected.file.size / 1024).toFixed(0)} KB · {selected.file.type || "audio"}
            </p>
            <audio controls src={selected.url} className="mt-3 w-full" />
          </div>
          <Button variant="ghost" size="icon" onClick={onClear} aria-label="Remove selected audio">
            <X className="size-4" aria-hidden />
          </Button>
        </div>
      ) : (
        <div
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragging(false);
            handleFile(event.dataTransfer.files[0]);
          }}
          className={cn(
            "flex flex-col items-center justify-center rounded-2xl border border-dashed px-6 py-14 text-center transition-colors",
            dragging ? "border-primary bg-primary/10" : "border-border bg-surface/40",
          )}
        >
          <span className="grid size-12 place-items-center rounded-full bg-primary/15 text-primary">
            <UploadCloud className="size-6" aria-hidden />
          </span>
          <p className="mt-4 font-display text-lg font-semibold">Drop an audio recording here</p>
          <p className="mt-1 text-sm text-muted-foreground">Supported formats: WAV, MP3, M4A, WebM, OGG (max 25 MB)</p>
          <Button className="mt-5" variant="glass" onClick={() => inputRef.current?.click()}>
            Browse files
          </Button>
          <input
            ref={inputRef}
            type="file"
            accept="audio/*,.wav,.mp3,.m4a,.webm,.ogg"
            className="hidden"
            onChange={(event) => handleFile(event.target.files?.[0])}
          />
        </div>
      )}
      {error ? (
        <p className="rounded-lg border border-critical/40 bg-critical/10 px-3 py-2 text-sm text-critical" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
