// TestResultPage.jsx
import { useLocation, useNavigate } from "react-router-dom";
import { markVerificationPass } from "../utils/verificationAccess";


// Design tokens used as arbitrary Tailwind values below — pull these into
// tailwind.config.js under theme.extend.colors if you want them reusable
// as e.g. bg-ink / text-gold instead of bg-[#12172b] / text-[#c9a24b].
//   ink:        #12172b
//   ink-soft:   #1e2540
//   paper:      #f2efe8
//   paper-dim:  #e4e0d5
//   gold:       #c9a24b
//   gold-soft:  #e8d6a3
//   brick-soft: #e7b9b2

const TestResultPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { result, testType } = state || {};

  if (!result) {
    navigate("/dashboard");
    return null;
  }

  const { score, isPassed, report, certificateUrl } = result;
  const clampedScore = Math.max(0, Math.min(100, score));

  const handleUploadClick = () => {
    // Drop a short-lived, single-purpose token so the upload page can
    // confirm this visit came from a real pass, not a typed-in URL.
    markVerificationPass();
    navigate("/uploadVideo");
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#12172b] px-5 py-12 pb-20 flex justify-center font-sans">
      {/* ambient background glow — decorative only */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-[#232c52] blur-3xl opacity-60" />
      <div className="pointer-events-none absolute -top-16 right-0 h-80 w-80 rounded-full bg-[#1a2040] blur-3xl opacity-60" />

      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-[#f2efe8] text-[#12172b] shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
        {/* ---------- Header ---------- */}
        <div
          className={`relative grid grid-cols-[auto_1fr] items-center gap-7 px-10 pt-11 pb-9 text-[#f2efe8] ${
            isPassed
              ? "bg-gradient-to-br from-[#12172b] via-[#1c2344] to-[#241a2e]"
              : "bg-gradient-to-br from-[#12172b] to-[#241820]"
          }`}
        >
          {/* score dial — percentage is dynamic, so the ring itself stays inline style */}
          <div
            className="flex h-[108px] w-[108px] flex-shrink-0 items-center justify-center rounded-full"
            style={{
              backgroundImage: `conic-gradient(${
                isPassed ? "#c9a24b" : "#e7b9b2"
              } ${clampedScore}%, rgba(255,255,255,0.14) 0)`,
            }}
            role="img"
            aria-label={`Score ${clampedScore} percent`}
          >
            <div className="flex h-[84px] w-[84px] items-baseline justify-center gap-0.5 rounded-full bg-[#1e2540] font-mono">
              <span className="text-2xl font-semibold text-[#f2efe8]">{clampedScore}</span>
              <span className="text-xs text-[#f2efe8]/60">%</span>
            </div>
          </div>

          <div>
            <span className="mb-2.5 block font-mono text-[11px] uppercase tracking-[0.14em] text-[#e8d6a3]">
              {testType === "creator_verification" ? "Creator verification" : "Course certification"}
            </span>
            <h1 className="mb-2 font-serif text-3xl font-semibold leading-tight">
              {isPassed ? "You passed" : "Not this time"}
            </h1>
            <p className="max-w-[46ch] text-sm leading-relaxed text-[#f2efe8]/70">
              {isPassed
                ? "Your results are in and they clear the bar."
                : "Your results are in. Review the breakdown below and try again when you're ready."}
            </p>
          </div>

          {/* ink-stamp flourish */}
          <div
            className={`absolute right-8 top-5 rotate-6 rounded-md border-2 px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] opacity-85 ${
              isPassed ? "border-[#e8d6a3] text-[#e8d6a3]" : "border-[#e7b9b2] text-[#e7b9b2]"
            }`}
            aria-hidden="true"
          >
            {isPassed ? "Passed" : "Not passed"}
          </div>
        </div>

        {/* ---------- Creator verification CTA ---------- */}
        {isPassed && testType === "creator_verification" && (
          <div className="mx-10 mt-7 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[#e8d6a3] bg-[#fbf3e0] px-6 py-5">
            <div>
              <h2 className="mb-1 font-serif text-[17px]">You&apos;re a verified creator</h2>
              <p className="max-w-[40ch] text-[13.5px] text-[#12172b]/68">
                Creator tools are now unlocked on your dashboard. Upload your first video to get started.
              </p>
            </div>
            <button
              type="button"
              onClick={handleUploadClick}
              className="whitespace-nowrap rounded-lg bg-[#12172b] px-5 py-2.5 text-[13.5px] font-semibold text-[#e8d6a3] transition-shadow hover:shadow-[0_8px_20px_rgba(18,23,43,0.25)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c9a24b] active:translate-y-px"
            >
              Upload your first video
            </button>
          </div>
        )}

        {/* ---------- Certificate ---------- */}
        {isPassed && testType === "course_certification" && certificateUrl && (
          <div className="mx-10 mt-7 flex flex-col items-center gap-3.5">
            <div className="w-full rounded-xl border border-[#c9a24b] bg-white p-2.5">
              <img src={certificateUrl} alt="Your certificate" className="block w-full rounded" />
            </div>
            <a
              href={certificateUrl}
              download
              className="inline-block rounded-lg bg-[#12172b] px-5 py-2.5 text-[13.5px] font-semibold text-[#f2efe8] no-underline transition-shadow hover:shadow-[0_8px_20px_rgba(18,23,43,0.25)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c9a24b]"
            >
              Download certificate
            </a>
          </div>
        )}

        {/* ---------- Report / transcript ---------- */}
        <div className="mx-10 mt-9 border-t border-[#12172b]/10 pt-6">
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="font-serif text-lg">Answer breakdown</h2>
            <span className="font-mono text-xs text-[#12172b]/50">{report.length} questions</span>
          </div>

          <ol className="list-none p-0">
            {report.map((r, i) => (
              <li
                key={i}
                className="grid grid-cols-[32px_1fr_auto] items-start gap-4 border-b border-[#12172b]/10 py-4 last:border-b-0"
              >
                <span className="pt-0.5 font-mono text-xs text-[#12172b]/40">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="mb-1 text-[14.5px] font-semibold leading-snug">{r.questionText}</p>
                  <p className="text-[13.5px] leading-relaxed text-[#12172b]/62">{r.feedback}</p>
                </div>
                <span className="h-fit rounded-md bg-[#e4e0d5] px-2.5 py-1 font-mono text-[13px] font-semibold text-[#12172b]">
                  {r.score}
                </span>
              </li>
            ))}
          </ol>
        </div>

        {/* ---------- Footer ---------- */}
        <div className="px-10 pb-10 pt-7">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="rounded-lg border border-[#12172b]/12 bg-transparent px-5 py-2.5 text-[13.5px] font-semibold text-[#12172b] transition-colors hover:bg-[#e4e0d5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c9a24b] active:translate-y-px"
          >
            Back to dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestResultPage;