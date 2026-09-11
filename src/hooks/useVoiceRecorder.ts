import { useCallback, useEffect, useRef, useState } from "react";

export type RecorderState = "idle" | "requesting" | "recording" | "paused" | "stopped" | "error";

interface RecorderResult {
  blob: Blob;
  url: string;
  durationSeconds: number;
}

export function useVoiceRecorder() {
  const [state, setState] = useState<RecorderState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [seconds, setSeconds] = useState(0);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [result, setResult] = useState<RecorderResult | null>(null);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const resolveRef = useRef<((value: RecorderResult | null) => void) | null>(null);

  const cleanup = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    void audioCtxRef.current?.close().catch(() => undefined);
    audioCtxRef.current = null;
    setAnalyser(null);
  }, []);

  useEffect(() => cleanup, [cleanup]);

  const start = useCallback(async () => {
    setError(null);
    setResult(null);
    setSeconds(0);
    setState("requesting");
    try {
      if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
        throw new Error("unsupported");
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const AudioCtx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;
      const source = ctx.createMediaStreamSource(stream);
      const node = ctx.createAnalyser();
      node.fftSize = 512;
      source.connect(node);
      setAnalyser(node);

      const mime = ["audio/webm", "audio/mp4", "audio/ogg"].find((type) =>
        typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(type),
      );
      const recorder = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
      chunksRef.current = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
        cleanup();
        if (blob.size === 0) {
          setState("error");
          setError("The recording was empty. Please record at least two seconds of speech.");
          resolveRef.current?.(null);
          resolveRef.current = null;
          return;
        }
        const payload = { blob, url: URL.createObjectURL(blob), durationSeconds: seconds };
        setResult(payload);
        setState("stopped");
        resolveRef.current?.(payload);
        resolveRef.current = null;
      };
      recorder.start(200);
      recorderRef.current = recorder;
      setState("recording");
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } catch (err) {
      cleanup();
      setState("error");
      const name = (err as { name?: string; message?: string }).name ?? (err as Error).message;
      setError(
        name === "NotAllowedError" || name === "SecurityError"
          ? "Microphone permission was denied. Allow access in your browser settings, or run the guided demo instead."
          : name === "NotFoundError"
            ? "No microphone was found on this device. Try the guided demo instead."
            : "Recording is not supported in this browser. Try the guided demo instead.",
      );
    }
  }, [cleanup, seconds]);

  const pause = useCallback(() => {
    if (recorderRef.current?.state === "recording") {
      recorderRef.current.pause();
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
      setState("paused");
    }
  }, []);

  const resume = useCallback(() => {
    if (recorderRef.current?.state === "paused") {
      recorderRef.current.resume();
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
      setState("recording");
    }
  }, []);

  const stop = useCallback(() => {
    return new Promise<RecorderResult | null>((resolve) => {
      const recorder = recorderRef.current;
      if (!recorder || recorder.state === "inactive") {
        resolve(null);
        return;
      }
      resolveRef.current = resolve;
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
      recorder.stop();
    });
  }, []);

  const reset = useCallback(() => {
    cleanup();
    recorderRef.current = null;
    setResult(null);
    setSeconds(0);
    setError(null);
    setState("idle");
  }, [cleanup]);

  return { state, error, seconds, analyser, result, start, pause, resume, stop, reset };
}

export function formatDuration(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const secs = Math.floor(totalSeconds % 60);
  return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}
