import useProctoring from '../hooks/Useproctoring';
import useAudioMonitor from '../hooks/Useaudiomonitor'; 

/**
 * ProctoringCamera
 *
 * Drop this into the HUD bar. Owns both the vision hook (camera + face +
 * phone detection) and the audio hook, renders a small live thumbnail with
 * a status dot, and forwards every violation to whatever registerViolation
 * you already have wired up in TestPage.
 *
 * Pass `stream` from a permission request you made up front (e.g. on the
 * pre-test screen, before entering fullscreen) so this never triggers its
 * own getUserMedia prompt after fullscreen — that combination is unreliable
 * across browsers.
 *
 * <ProctoringCamera enabled={testStarted} registerViolation={registerViolation} stream={mediaStream} />
 */
const SIZE_CLASSES = {
  md: "w-16 h-12", // 64x48 — default, clearly visible without crowding the HUD
  lg: "w-20 h-[60px]", // 80x60
};
 
const ProctoringCamera = ({ enabled, registerViolation, stream, size = "md" }) => {
  const { videoRef, status: vision } = useProctoring({ enabled, registerViolation, stream });
  const { status: audio } = useAudioMonitor({ enabled, registerViolation, stream });
 
  const flagged = vision.faceCount === 0 || vision.faceCount >= 2 || vision.phoneDetected;
  const hasError = !!vision.error || !!audio.error;
 
  const title = hasError
    ? vision.error || audio.error
    : vision.faceCount === 0
    ? "No face detected"
    : vision.faceCount >= 2
    ? "Multiple faces detected"
    : vision.phoneDetected
    ? "Phone detected"
    : "Monitoring active";
 
  const dotColor = hasError
    ? "bg-[#7A7669]"
    : flagged
    ? "bg-[#E36B5F]"
    : vision.ready
    ? "bg-[#6FCF8F]"
    : "bg-[#7A7669]";
 
  return (
    <div
      className={`relative w-32 h-24 rounded-lg overflow-hidden border-2 shrink-0 ${
        flagged ? "border-[#E36B5F]" : "border-[#2A2F3A]"
      }`}
      title={title}
    >
      <video ref={videoRef} muted playsInline className="w-full h-full object-cover" />
      <span className={`absolute top-1 right-1 w-2 h-2 rounded-full ${dotColor}`} />
    </div>
  );
};
 
export default ProctoringCamera;
