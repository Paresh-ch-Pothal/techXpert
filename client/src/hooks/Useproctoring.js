import { useEffect, useRef, useState, useCallback } from "react";
import * as faceapi from "@vladmandic/face-api";
import * as tf from "@tensorflow/tfjs";
import * as cocoSsd from "@tensorflow-models/coco-ssd";

const FACE_MODEL_URL = "/models";

const DETECTION_INTERVAL_MS = 700; // how often we sample a frame
const NO_FACE_GRACE_MS = 5000; // must be absent this long before flagging
const MULTI_FACE_GRACE_MS = 3000;
const PHONE_GRACE_MS = 2000;
const VIOLATION_COOLDOWN_MS = 15000; // don't refire the same violation type sooner than this
const PHONE_CONFIDENCE_THRESHOLD = 0.6;

/**
 * useProctoring
 *
 * Owns the camera stream + two TensorFlow.js models (face-api tiny face
 * detector, coco-ssd for object detection). Runs a polling loop and calls
 * registerViolation(type, message) when a condition persists past its
 * grace period, with a per-violation-type cooldown so one long absence
 * doesn't spam the violation log.
 *
 * @param {boolean} enabled - gate this on your `testStarted` flag
 * @param {(type: string, message: string) => void} registerViolation
 * @param {MediaStream} [stream] - an already-granted stream (video track
 *   required). Pass this in when you've requested permission up front
 *   (e.g. on the pre-test screen, before fullscreen). If omitted, the hook
 *   requests its own video-only stream, which only works reliably outside
 *   fullscreen — see the note in the README/skill guidance.
 */
export default function useProctoring({ enabled, registerViolation, stream: externalStream }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const ownsStreamRef = useRef(false);
  const cocoModelRef = useRef(null);
  const intervalRef = useRef(null);
  const timersRef = useRef({ noFaceSince: null, multiFaceSince: null, phoneSince: null });
  const cooldownRef = useRef({});

  const [status, setStatus] = useState({
    ready: false,
    faceCount: 0,
    phoneDetected: false,
    error: null,
  });

  const canFire = useCallback((type) => {
    const now = Date.now();
    const last = cooldownRef.current[type] || 0;
    if (now - last >= VIOLATION_COOLDOWN_MS) {
      cooldownRef.current[type] = now;
      return true;
    }
    return false;
  }, []);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;

    const setup = async () => {
      try {
        await tf.ready();
        await faceapi.nets.tinyFaceDetector.loadFromUri(FACE_MODEL_URL);
        cocoModelRef.current = await cocoSsd.load({ base: "lite_mobilenet_v2" });

        let stream = externalStream;
        if (!stream) {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { width: 320, height: 240 },
          });
          ownsStreamRef.current = true;
        }

        if (cancelled) {
          if (ownsStreamRef.current) stream.getTracks().forEach((t) => t.stop());
          return;
        }

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }

        setStatus((s) => ({ ...s, ready: true, error: null }));
        startLoop();
      } catch (err) {
        console.error("Proctoring setup failed:", err);
        setStatus((s) => ({ ...s, error: err.message || "Camera setup failed" }));
        registerViolation?.("camera", "Camera could not be accessed for proctoring");
      }
    };

    const startLoop = () => {
      intervalRef.current = setInterval(async () => {
        const video = videoRef.current;
        if (!video || video.readyState < 2) return;

        // --- Face detection ---
        try {
          const detections = await faceapi.detectAllFaces(
            video,
            new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.5 })
          );
          const faceCount = detections.length;
          setStatus((s) => ({ ...s, faceCount }));

          const now = Date.now();
          const timers = timersRef.current;

          if (faceCount === 0) {
            if (!timers.noFaceSince) timers.noFaceSince = now;
            else if (now - timers.noFaceSince >= NO_FACE_GRACE_MS && canFire("no_face")) {
              registerViolation?.("presence", "No face detected in camera view");
            }
          } else {
            timers.noFaceSince = null;
          }

          if (faceCount >= 2) {
            if (!timers.multiFaceSince) timers.multiFaceSince = now;
            else if (now - timers.multiFaceSince >= MULTI_FACE_GRACE_MS && canFire("multi_face")) {
              registerViolation?.("presence", "Multiple faces detected in camera view");
            }
          } else {
            timers.multiFaceSince = null;
          }
        } catch (err) {
          console.error("Face detection error:", err);
        }

        // --- Object (phone) detection ---
        try {
          if (cocoModelRef.current) {
            const predictions = await cocoModelRef.current.detect(video);
            const phone = predictions.find(
              (p) => p.class === "cell phone" && p.score >= PHONE_CONFIDENCE_THRESHOLD
            );
            setStatus((s) => ({ ...s, phoneDetected: !!phone }));

            const now = Date.now();
            const timers = timersRef.current;
            if (phone) {
              if (!timers.phoneSince) timers.phoneSince = now;
              else if (now - timers.phoneSince >= PHONE_GRACE_MS && canFire("phone")) {
                registerViolation?.("object", "Phone detected in camera view");
              }
            } else {
              timers.phoneSince = null;
            }
          }
        } catch (err) {
          console.error("Object detection error:", err);
        }
      }, DETECTION_INTERVAL_MS);
    };

    setup();

    return () => {
      cancelled = true;
      clearInterval(intervalRef.current);
      if (ownsStreamRef.current) {
        streamRef.current?.getTracks().forEach((t) => t.stop());
      }
      streamRef.current = null;
      timersRef.current = { noFaceSince: null, multiFaceSince: null, phoneSince: null };
      setStatus({ ready: false, faceCount: 0, phoneDetected: false, error: null });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, registerViolation, canFire, externalStream]);

  return { videoRef, status };
}