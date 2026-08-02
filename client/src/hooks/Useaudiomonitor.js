import { useEffect, useRef, useState } from "react";

const CHECK_INTERVAL_MS = 300;
const LOUD_THRESHOLD = 0.35; // normalized RMS, 0–1. Tune against a real mic test.
const LOUD_GRACE_MS = 4000; // must stay loud this long before flagging
const VIOLATION_COOLDOWN_MS = 15000;

/**
 * useAudioMonitor
 *
 * Independent of the video pipeline — opens its own audio-only
 * getUserMedia stream and watches RMS volume via the Web Audio API.
 * Flags sustained talking/noise, not brief coughs or key clicks.
 *
 * @param {boolean} enabled - gate this on your `testStarted` flag
 * @param {(type: string, message: string) => void} registerViolation
 * @param {MediaStream} [stream] - an already-granted stream with an audio
 *   track. Pass the same stream you gave useProctoring to avoid a second
 *   permission prompt. If omitted, requests its own audio-only stream.
 */
export default function useAudioMonitor({ enabled, registerViolation, stream: externalStream }) {
  const streamRef = useRef(null);
  const ownsStreamRef = useRef(false);
  const audioCtxRef = useRef(null);
  const intervalRef = useRef(null);
  const loudSinceRef = useRef(null);
  const cooldownRef = useRef(0);

  const [status, setStatus] = useState({ ready: false, level: 0, error: null });

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;

    const setup = async () => {
      try {
        let stream = externalStream;
        if (!stream) {
          stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          ownsStreamRef.current = true;
        }
        if (cancelled) {
          if (ownsStreamRef.current) stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;

        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const audioCtx = new AudioContext();
        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 512;
        source.connect(analyser);
        audioCtxRef.current = audioCtx;

        setStatus((s) => ({ ...s, ready: true, error: null }));

        const buffer = new Uint8Array(analyser.frequencyBinCount);
        intervalRef.current = setInterval(() => {
          analyser.getByteTimeDomainData(buffer);
          let sumSquares = 0;
          for (let i = 0; i < buffer.length; i++) {
            const normalized = (buffer[i] - 128) / 128;
            sumSquares += normalized * normalized;
          }
          const rms = Math.sqrt(sumSquares / buffer.length);
          setStatus((s) => ({ ...s, level: rms }));

          const now = Date.now();
          if (rms >= LOUD_THRESHOLD) {
            if (!loudSinceRef.current) loudSinceRef.current = now;
            else if (
              now - loudSinceRef.current >= LOUD_GRACE_MS &&
              now - cooldownRef.current >= VIOLATION_COOLDOWN_MS
            ) {
              cooldownRef.current = now;
              registerViolation?.("audio", "Sustained talking or background noise detected");
            }
          } else {
            loudSinceRef.current = null;
          }
        }, CHECK_INTERVAL_MS);
      } catch (err) {
        console.error("Audio monitor setup failed:", err);
        setStatus((s) => ({ ...s, error: err.message || "Microphone access failed" }));
      }
    };

    setup();

    return () => {
      cancelled = true;
      clearInterval(intervalRef.current);
      audioCtxRef.current?.close().catch(() => {});
      if (ownsStreamRef.current) {
        streamRef.current?.getTracks().forEach((t) => t.stop());
      }
      streamRef.current = null;
      loudSinceRef.current = null;
      setStatus({ ready: false, level: 0, error: null });
    };
  }, [enabled, registerViolation, externalStream]);

  return { status };
}