// import { useState, useEffect, useCallback, useRef } from "react";
// import { useParams, useLocation, useNavigate } from "react-router-dom";
// import Editor from "@monaco-editor/react";
// import ProgressBar from "@ramonak/react-progress-bar";
// import { FaShieldAlt, FaExpand } from "react-icons/fa";
// import { MdWarningAmber, MdClose } from "react-icons/md";
// import api from "../utils/api";

// const TEST_DURATION_MINUTES = 30;
// const MAX_VIOLATIONS = 5;
// const CRITICAL_SECONDS = 120; // timer turns urgent below this

// const TYPE_LABELS = {
//   mcq: "Multiple choice",
//   "case studies": "Case study",
//   coding: "Coding",
// };

// const TestPage = () => {
//   const { assessmentId } = useParams();
//   const { state } = useLocation();
//   const navigate = useNavigate();

//   const questions = state?.questions || [];
//   const testType = state?.testType;

//   const [answers, setAnswers] = useState({});
//   const [violations, setViolations] = useState(0);
//   const [violationLog, setViolationLog] = useState([]);
//   const [showLog, setShowLog] = useState(false);
//   const [toasts, setToasts] = useState([]);
//   const [secondsLeft, setSecondsLeft] = useState(TEST_DURATION_MINUTES * 60);
//   const [submitting, setSubmitting] = useState(false);
//   const [autoSubmitReason, setAutoSubmitReason] = useState(null);
//   const [testStarted, setTestStarted] = useState(false);
//   const [isFullscreen, setIsFullscreen] = useState(false);
//   const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
//   const [activeQuestionId, setActiveQuestionId] = useState(questions[0]?._id);

//   const submittedRef = useRef(false); // guards against double-submit (timer + manual click racing)
//   const questionRefs = useRef({});

//   // ---------- Toasts & violation logging ----------

//   const pushToast = useCallback((text) => {
//     const id = Date.now() + Math.random();
//     setToasts((t) => [...t, { id, text }]);
//     setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
//   }, []);

//   const registerViolation = useCallback(
//     (type, message) => {
//       setViolations((v) => v + 1);
//       setViolationLog((log) =>
//         [{ id: Date.now() + Math.random(), type, message, time: new Date() }, ...log].slice(0, 20)
//       );
//       pushToast(message);
//     },
//     [pushToast]
//   );

//   // ---------- Redirect back if someone lands here directly (e.g. refresh) ----------

//   useEffect(() => {
//     if (!questions.length) {
//       navigate("/dashboard");
//     }
//   }, [questions, navigate]);

//   // ---------- Warn before leaving the tab/window ----------

//   useEffect(() => {
//     if (!testStarted) return;
//     const handler = (e) => {
//       e.preventDefault();
//       e.returnValue = "";
//     };
//     window.addEventListener("beforeunload", handler);
//     return () => window.removeEventListener("beforeunload", handler);
//   }, [testStarted]);

//   // ---------- Tab-switch / window-blur violation tracking ----------

//   useEffect(() => {
//     if (!testStarted) return;
//     const handleVisibilityChange = () => {
//       if (document.hidden) {
//         registerViolation("tab", "Tab switch detected");
//       }
//     };
//     document.addEventListener("visibilitychange", handleVisibilityChange);
//     return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
//   }, [testStarted, registerViolation]);

//   // ---------- Fullscreen enforcement ----------

//   const requestFullscreen = useCallback(async () => {
//     const el = document.documentElement;
//     try {
//       if (el.requestFullscreen) await el.requestFullscreen();
//       else if (el.webkitRequestFullscreen) await el.webkitRequestFullscreen();
//     } catch {
//       // Some browsers/environments block programmatic fullscreen — the
//       // overlay stays up and the person can retry with the button.
//     }
//   }, []);

//   useEffect(() => {
//     const handler = () => {
//       const active = !!(document.fullscreenElement || document.webkitFullscreenElement);
//       setIsFullscreen(active);
//       if (testStarted && !active) {
//         registerViolation("fullscreen", "Exited fullscreen mode");
//       }
//     };
//     document.addEventListener("fullscreenchange", handler);
//     document.addEventListener("webkitfullscreenchange", handler);
//     return () => {
//       document.removeEventListener("fullscreenchange", handler);
//       document.removeEventListener("webkitfullscreenchange", handler);
//     };
//   }, [testStarted, registerViolation]);

//   // Leave fullscreen behind once the test page unmounts (e.g. after submit)
//   useEffect(() => {
//     return () => {
//       if (document.fullscreenElement) {
//         document.exitFullscreen?.().catch(() => {});
//       }
//     };
//   }, []);

//   // ---------- Block copy / paste / cut / right-click ----------

//   const blockClipboard = useCallback(
//     (label) => (e) => {
//       e.preventDefault();
//       registerViolation("integrity", label);
//     },
//     [registerViolation]
//   );

//   // ---------- Block devtools / print shortcuts ----------

//   useEffect(() => {
//     if (!testStarted) return;
//     const handleKeyDown = (e) => {
//       const key = e.key?.toUpperCase();
//       const blocked =
//         key === "F12" ||
//         (e.ctrlKey && e.shiftKey && ["I", "J", "C"].includes(key)) ||
//         (e.metaKey && e.altKey && ["I", "J", "C"].includes(key)) ||
//         (e.ctrlKey && ["U", "P"].includes(key));
//       if (blocked) {
//         e.preventDefault();
//         registerViolation("integrity", "Blocked restricted shortcut");
//       }
//     };
//     window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, [testStarted, registerViolation]);

//   // ---------- Answers ----------

//   const handleAnswerChange = (questionId, value) => {
//     setAnswers((prev) => ({ ...prev, [questionId]: value }));
//   };

//   // ---------- Submit ----------

//   const submitTest = useCallback(async () => {
//     if (submittedRef.current) return;
//     submittedRef.current = true;
//     setSubmitting(true);

//     const formattedAnswers = Object.entries(answers).map(([questionId, submittedAnswer]) => ({
//       questionId,
//       submittedAnswer: submittedAnswer || "",
//     }));

//     try {
//       const res = await api.post("/api/assessment/submit-test", {
//         assessmentId,
//         answers: formattedAnswers,
//         violations,
//       });
//       navigate("/test-result", { state: { result: res.data, testType } });
//     } catch (err) {
//       console.error(err);
//       alert(err.response?.data?.error || "Submission failed. Please try again.");
//       submittedRef.current = false;
//       setSubmitting(false);
//       setAutoSubmitReason(null);
//     }
//   }, [answers, violations, assessmentId, testType, navigate]);

//   // Auto-submit once the violation ceiling is hit
//   useEffect(() => {
//     if (violations >= MAX_VIOLATIONS && !submittedRef.current) {
//       setAutoSubmitReason("Repeated integrity violations were detected during this session.");
//       submitTest();
//     }
//   }, [violations, submitTest]);

//   // Countdown timer — auto-submits at zero
//   useEffect(() => {
//     if (!testStarted) return;
//     if (secondsLeft <= 0) {
//       setAutoSubmitReason((r) => r || "Time's up.");
//       submitTest();
//       return;
//     }
//     const interval = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
//     return () => clearInterval(interval);
//   }, [testStarted, secondsLeft, submitTest]);

//   // ---------- Scroll-spy for the question navigator ----------

//   useEffect(() => {
//     if (!testStarted) return;
//     const observer = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((entry) => {
//           if (entry.isIntersecting) setActiveQuestionId(entry.target.dataset.qid);
//         });
//       },
//       { rootMargin: "-35% 0px -55% 0px", threshold: 0 }
//     );
//     Object.values(questionRefs.current).forEach((el) => el && observer.observe(el));
//     return () => observer.disconnect();
//   }, [testStarted, questions]);

//   const jumpToQuestion = (qid) => {
//     questionRefs.current[qid]?.scrollIntoView({ behavior: "smooth", block: "start" });
//   };

//   // ---------- Derived values ----------

//   const formatTime = (totalSeconds) => {
//     const m = Math.floor(Math.max(totalSeconds, 0) / 60);
//     const s = Math.max(totalSeconds, 0) % 60;
//     return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
//   };

//   const isAnswered = (q) => {
//     const val = answers[q._id];
//     return typeof val === "string" && val.trim() !== "";
//   };

//   const answeredCount = questions.filter(isAnswered).length;
//   const progressPercent = questions.length ? Math.round((answeredCount / questions.length) * 100) : 0;
//   const unanswered = questions.filter((q) => !isAnswered(q));
//   const timeCritical = secondsLeft <= CRITICAL_SECONDS;

//   if (!questions.length) return null;

//   // ---------- Pre-test instructions screen ----------

//   if (!testStarted) {
//     return (
//       <div className="txp-page min-h-screen flex items-center justify-center px-6 py-12">
//         <TxpStyles />
//         <div className="max-w-lg w-full bg-white border border-[#E8E4DA] rounded-2xl p-8 sm:p-10">
//           <div className="w-12 h-12 rounded-full bg-[#FBF0DF] border border-[#EAD3AE] flex items-center justify-center mb-6">
//             <FaShieldAlt className="text-[#A15E13]" size={18} />
//           </div>
//           <span className="txp-mono text-[#A15E13] text-xs uppercase">Creator verification</span>
//           <h1 className="txp-wordmark text-[#101827] font-semibold text-2xl sm:text-3xl mt-2 mb-5">
//             Before you begin
//           </h1>
//           <ul className="flex flex-col gap-3 mb-8">
//             {[
//               `You'll have ${TEST_DURATION_MINUTES} minutes once the test starts — the timer won't pause.`,
//               "The test runs in fullscreen. Leaving fullscreen or switching tabs is logged.",
//               "Copying, pasting, and right-click are disabled for the duration of the test.",
//               `The test auto-submits after ${MAX_VIOLATIONS} logged violations, or when time runs out.`,
//             ].map((rule, i) => (
//               <li key={i} className="flex items-start gap-3 text-sm text-[#334155]">
//                 <span className="txp-mono text-[11px] text-[#A15E13] mt-0.5 shrink-0">
//                   {String(i + 1).padStart(2, "0")}
//                 </span>
//                 {rule}
//               </li>
//             ))}
//           </ul>
//           <button
//             onClick={async () => {
//               await requestFullscreen();
//               setTestStarted(true);
//             }}
//             className="txp-btn-fill w-full flex items-center justify-center gap-2 text-white text-sm font-semibold py-3 rounded-lg"
//           >
//             <FaExpand size={13} />
//             Enter fullscreen &amp; start test
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // ---------- Main test UI ----------

//   return (
//     <div
//       className="txp-page min-h-screen"
//       onCopy={blockClipboard("Copy is disabled during this test")}
//       onCut={blockClipboard("Cut is disabled during this test")}
//       onPaste={blockClipboard("Paste is disabled during this test")}
//       onContextMenu={blockClipboard("Right-click is disabled during this test")}
//     >
//       <TxpStyles />

//       {/* HUD — proctoring status bar */}
//       <div className="txp-hud sticky top-0 z-40">
//         <div className="flex items-center gap-2.5">
//           <FaShieldAlt size={14} className="text-[#E8B26A]" />
//           <span className="txp-mono text-[11px] uppercase tracking-wider text-[#E8E4DA]">
//             Proctored session
//           </span>
//           <span
//             className={`w-1.5 h-1.5 rounded-full ${isFullscreen ? "bg-[#6FCF8F]" : "bg-[#E36B5F]"}`}
//             title={isFullscreen ? "Fullscreen active" : "Not in fullscreen"}
//           />
//         </div>

//         <div className="flex items-center gap-4 relative">
//           <button
//             onClick={() => setShowLog((s) => !s)}
//             className="txp-mono text-[11px] uppercase tracking-wider text-[#E8E4DA] hover:text-white transition-colors flex items-center gap-1.5"
//           >
//             <MdWarningAmber size={14} className={violations > 0 ? "text-[#E8B26A]" : "text-[#7A7669]"} />
//             {violations} / {MAX_VIOLATIONS} flags
//           </button>

//           {showLog && (
//             <div className="absolute right-0 top-8 w-64 bg-[#101827] border border-[#2A2F3A] rounded-xl p-3 shadow-xl">
//               {violationLog.length === 0 ? (
//                 <p className="txp-mono text-[10px] text-[#7A7669] uppercase">No flags yet</p>
//               ) : (
//                 <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
//                   {violationLog.map((v) => (
//                     <div key={v.id} className="text-[11px] text-[#D8D5CC] flex justify-between gap-3">
//                       <span>{v.message}</span>
//                       <span className="txp-mono text-[#7A7669] shrink-0">
//                         {v.time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           )}

//           <span
//             className={`txp-mono text-sm font-medium tabular-nums ${
//               timeCritical ? "text-[#F0897A] animate-pulse" : "text-white"
//             }`}
//           >
//             {formatTime(secondsLeft)}
//           </span>

//           <button
//             onClick={() => setShowSubmitConfirm(true)}
//             disabled={submitting}
//             className="txp-btn-fill text-white text-xs font-semibold px-4 py-2 rounded-lg disabled:opacity-60"
//           >
//             Submit test
//           </button>
//         </div>
//       </div>

//       {/* Progress + question navigator */}
//       <div className="border-b border-[#E8E4DA] bg-white/80 backdrop-blur sticky top-[52px] z-30">
//         <div className="max-w-3xl mx-auto px-6 py-4">
//           <div className="flex items-center justify-between mb-2">
//             <span className="txp-mono text-[10px] uppercase text-[#94918A]">
//               {answeredCount} of {questions.length} answered
//             </span>
//             <span className="txp-mono text-[10px] uppercase text-[#A15E13]">{progressPercent}%</span>
//           </div>
//           <ProgressBar
//             width="100%"
//             height="6px"
//             completed={progressPercent}
//             bgColor="#C6741B"
//             baseBgColor="#F1EDE3"
//             isLabelVisible={false}
//             borderRadius="6px"
//           />
//           <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
//             {questions.map((q, i) => {
//               const answered = isAnswered(q);
//               const current = activeQuestionId === q._id;
//               return (
//                 <button
//                   key={q._id}
//                   onClick={() => jumpToQuestion(q._id)}
//                   className={`txp-mono shrink-0 w-8 h-8 rounded-full text-[11px] font-medium border transition-colors ${
//                     current
//                       ? "bg-[#C6741B] border-[#C6741B] text-white"
//                       : answered
//                       ? "bg-[#FBF0DF] border-[#EAD3AE] text-[#A15E13]"
//                       : "bg-white border-[#E8E4DA] text-[#94918A]"
//                   }`}
//                 >
//                   {i + 1}
//                 </button>
//               );
//             })}
//           </div>
//         </div>
//       </div>

//       {/* Questions */}
//       <div className="max-w-3xl mx-auto px-6 py-10 flex flex-col gap-6">
//         {questions.map((q, idx) => (
//           <section
//             key={q._id}
//             data-qid={q._id}
//             ref={(el) => {
//               questionRefs.current[q._id] = el;
//             }}
//             className="txp-card bg-white border border-[#E8E4DA] rounded-2xl p-6 sm:p-7"
//           >
//             <div className="flex items-center justify-between mb-5">
//               <span className="txp-mono text-[11px] uppercase text-[#A15E13]">
//                 Question {String(idx + 1).padStart(2, "0")} / {String(questions.length).padStart(2, "0")}
//               </span>
//               <span className="txp-mono text-[10px] uppercase px-2.5 py-1 rounded-full border border-[#E8E4DA] text-[#5B6472]">
//                 {TYPE_LABELS[q.type] || q.type}
//               </span>
//             </div>

//             <p className="txp-wordmark text-[#101827] text-lg sm:text-xl font-semibold leading-snug mb-6 select-none">
//               {q.questionText}
//             </p>

//             {q.type === "mcq" && (
//               <div className="flex flex-col gap-2.5">
//                 {q.options.map((opt, i) => {
//                   const selected = answers[q._id] === opt;
//                   return (
//                     <label
//                       key={i}
//                       className={`flex items-center gap-3 border rounded-xl px-4 py-3 cursor-pointer transition-colors ${
//                         selected
//                           ? "border-[#C6741B] bg-[#FBF0DF]"
//                           : "border-[#E8E4DA] hover:border-[#D8B98A]"
//                       }`}
//                     >
//                       <input
//                         type="radio"
//                         name={q._id}
//                         value={opt}
//                         checked={selected}
//                         onChange={() => handleAnswerChange(q._id, opt)}
//                         className="sr-only"
//                       />
//                       <span
//                         className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
//                           selected ? "border-[#C6741B]" : "border-[#D8D3C6]"
//                         }`}
//                       >
//                         {selected && <span className="w-2 h-2 rounded-full bg-[#C6741B]" />}
//                       </span>
//                       <span className="text-sm text-[#334155] select-none">{opt}</span>
//                     </label>
//                   );
//                 })}
//               </div>
//             )}

//             {q.type === "case studies" && (
//               <div>
//                 <textarea
//                   rows={8}
//                   placeholder="Write your analysis here..."
//                   value={answers[q._id] || ""}
//                   onChange={(e) => handleAnswerChange(q._id, e.target.value)}
//                   className="w-full border border-[#E8E4DA] rounded-xl p-4 text-sm text-[#101827] outline-none focus:border-[#C6741B] transition-colors resize-y"
//                 />
//                 <div className="txp-mono text-[10px] text-[#94918A] text-right mt-1.5">
//                   {(answers[q._id] || "").trim().split(/\s+/).filter(Boolean).length} words
//                 </div>
//               </div>
//             )}

//             {q.type === "coding" && (
//               <div className="border border-[#E8E4DA] rounded-xl overflow-hidden">
//                 <div className="bg-[#101827] px-4 py-2 flex items-center justify-between">
//                   <span className="txp-mono text-[10px] uppercase text-[#D8D5CC]">JavaScript</span>
//                   <span className="txp-mono text-[10px] text-[#7A7669]">Autosaved</span>
//                 </div>
//                 <Editor
//                   height="300px"
//                   defaultLanguage="javascript"
//                   theme="vs-dark"
//                   value={answers[q._id] ?? q.initialCode ?? ""}
//                   onChange={(value) => handleAnswerChange(q._id, value || "")}
//                   options={{ minimap: { enabled: false }, fontSize: 14 }}
//                 />
//               </div>
//             )}
//           </section>
//         ))}

//         {/* Submit card */}
//         <div className="txp-card bg-white border border-[#E8E4DA] rounded-2xl p-6 sm:p-7 text-center">
//           <h3 className="txp-wordmark text-[#101827] font-semibold text-lg mb-1.5">Ready to submit?</h3>
//           <p className="text-[#5B6472] text-sm mb-5">
//             You've answered {answeredCount} of {questions.length} questions.
//           </p>
//           <button
//             onClick={() => setShowSubmitConfirm(true)}
//             disabled={submitting}
//             className="txp-btn-fill text-white text-sm font-semibold px-6 py-3 rounded-lg disabled:opacity-60"
//           >
//             Submit test
//           </button>
//         </div>
//       </div>

//       {/* Fullscreen-exit blocking overlay */}
//       {!isFullscreen && !submitting && (
//         <div className="txp-blocking-overlay">
//           <div className="max-w-sm w-full bg-white border border-[#E8E4DA] rounded-2xl p-8 text-center">
//             <div className="w-12 h-12 rounded-full bg-[#FBECEA] border border-[#F0C9C4] flex items-center justify-center mx-auto mb-5">
//               <MdWarningAmber className="text-[#A83A34]" size={22} />
//             </div>
//             <h3 className="txp-wordmark text-[#101827] font-semibold text-lg mb-2">You've left fullscreen</h3>
//             <p className="text-[#5B6472] text-sm mb-6">
//               This has been logged ({violations} / {MAX_VIOLATIONS} flags). Return to fullscreen to keep going.
//             </p>
//             <button
//               onClick={requestFullscreen}
//               className="txp-btn-fill w-full flex items-center justify-center gap-2 text-white text-sm font-semibold py-3 rounded-lg"
//             >
//               <FaExpand size={13} />
//               Return to fullscreen
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Submit confirmation */}
//       {showSubmitConfirm && !submitting && (
//         <div className="txp-modal-backdrop" onClick={() => setShowSubmitConfirm(false)}>
//           <div className="txp-modal-card" onClick={(e) => e.stopPropagation()}>
//             <h3 className="txp-wordmark text-[#101827] font-semibold text-lg mb-2">Submit this test?</h3>
//             <p className="text-[#5B6472] text-sm mb-4">
//               You've answered {answeredCount} of {questions.length} questions. This can't be undone.
//             </p>
//             {unanswered.length > 0 && (
//               <div className="flex flex-wrap gap-1.5 mb-6">
//                 {unanswered.map((q) => {
//                   const i = questions.indexOf(q);
//                   return (
//                     <button
//                       key={q._id}
//                       onClick={() => {
//                         setShowSubmitConfirm(false);
//                         jumpToQuestion(q._id);
//                       }}
//                       className="txp-mono text-[10px] px-2 py-1 rounded-md border border-[#EAD3AE] bg-[#FBF0DF] text-[#A15E13]"
//                     >
//                       Q{i + 1} unanswered
//                     </button>
//                   );
//                 })}
//               </div>
//             )}
//             <div className="flex gap-3">
//               <button
//                 onClick={() => setShowSubmitConfirm(false)}
//                 className="txp-btn-outline flex-1 text-sm font-semibold py-2.5 rounded-lg"
//               >
//                 Keep working
//               </button>
//               <button
//                 onClick={() => {
//                   setShowSubmitConfirm(false);
//                   submitTest();
//                 }}
//                 className="txp-btn-fill flex-1 text-sm font-semibold py-2.5 rounded-lg text-white"
//               >
//                 Submit
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Submitting / auto-submit overlay */}
//       {submitting && (
//         <div className="txp-blocking-overlay">
//           <div className="max-w-sm w-full bg-white border border-[#E8E4DA] rounded-2xl p-8 text-center">
//             <div className="txp-spinner mx-auto mb-5" />
//             <h3 className="txp-wordmark text-[#101827] font-semibold text-lg mb-2">
//               {autoSubmitReason ? "Test auto-submitted" : "Submitting your test..."}
//             </h3>
//             {autoSubmitReason && <p className="text-[#5B6472] text-sm">{autoSubmitReason}</p>}
//           </div>
//         </div>
//       )}

//       {/* Toasts */}
//       <div className="fixed top-4 right-4 z-[70] flex flex-col gap-2 items-end">
//         {toasts.map((t) => (
//           <div
//             key={t.id}
//             className="txp-toast flex items-center gap-2 bg-[#101827] text-white text-xs px-3.5 py-2.5 rounded-lg shadow-lg"
//           >
//             <MdWarningAmber size={14} className="text-[#E8B26A] shrink-0" />
//             {t.text}
//             <button onClick={() => setToasts((ts) => ts.filter((x) => x.id !== t.id))} className="ml-1 opacity-70 hover:opacity-100">
//               <MdClose size={13} />
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// // Shared styles — reuses the app's warm-cream / Fraunces / IBM Plex Mono
// // design language, with a dark "instrumentation" HUD as the one contrasting
// // element for the proctoring status bar.
// const TxpStyles = () => (
//   <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500&display=swap');

//         .txp-page { font-family: 'Plus Jakarta Sans', sans-serif; background: #FFFEFB; }
//         .txp-wordmark { font-family: 'Fraunces', serif; }
//         .txp-mono { font-family: 'IBM Plex Mono', monospace; letter-spacing: 0.06em; }

//         .txp-hud {
//             background: #101827;
//             padding: 12px 24px;
//             display: flex; align-items: center; justify-content: space-between;
//             border-bottom: 1px solid #1E2430;
//         }

//         .txp-card { transition: box-shadow 200ms ease, border-color 200ms ease; }

//         .txp-btn-fill { background: #C6741B; border: 1.5px solid #C6741B; transition: background-color 180ms ease, transform 150ms ease; }
//         .txp-btn-fill:hover:not(:disabled) { background: #A15E13; border-color: #A15E13; transform: translateY(-1px); }
//         .txp-btn-fill:disabled { opacity: 0.65; cursor: not-allowed; }

//         .txp-btn-outline { border: 1.5px solid #101827; color: #101827; transition: background-color 180ms ease, color 180ms ease; }
//         .txp-btn-outline:hover { background: #101827; color: #FFFEFB; }

//         .txp-modal-backdrop {
//             position: fixed; inset: 0; z-index: 60;
//             background: rgba(16, 24, 39, 0.55);
//             display: flex; align-items: center; justify-content: center;
//             animation: txp-fade 200ms ease both;
//             padding: 16px;
//         }
//         .txp-modal-card {
//             background: #FFFEFB; border-radius: 16px;
//             padding: 32px; max-width: 380px; width: 100%;
//             animation: txp-pop 220ms cubic-bezier(.34,1.56,.64,1) both;
//         }
//         .txp-blocking-overlay {
//             position: fixed; inset: 0; z-index: 65;
//             background: rgba(16, 24, 39, 0.7);
//             display: flex; align-items: center; justify-content: center;
//             padding: 16px;
//             animation: txp-fade 200ms ease both;
//         }
//         .txp-toast { animation: txp-toast-in 220ms ease both; }

//         .txp-spinner {
//             width: 32px; height: 32px; border-radius: 999px;
//             border: 3px solid #F1EDE3; border-top-color: #C6741B;
//             animation: txp-spin 800ms linear infinite;
//         }

//         @keyframes txp-fade { from { opacity: 0; } to { opacity: 1; } }
//         @keyframes txp-pop { from { opacity: 0; transform: scale(0.94); } to { opacity: 1; transform: scale(1); } }
//         @keyframes txp-toast-in { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
//         @keyframes txp-spin { to { transform: rotate(360deg); } }

//         @media (prefers-reduced-motion: reduce) {
//             .txp-card, .txp-btn-fill, .txp-btn-outline { transition: none; }
//             .txp-modal-backdrop, .txp-modal-card, .txp-blocking-overlay, .txp-toast, .txp-spinner { animation: none; }
//         }
//     `}</style>
// );

// export default TestPage;


import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Editor from "@monaco-editor/react";
import ProgressBar from "@ramonak/react-progress-bar";
import { FaShieldAlt, FaExpand } from "react-icons/fa";
import { MdWarningAmber, MdClose } from "react-icons/md";
import api from "../utils/api";

const TEST_DURATION_MINUTES = 30;
const MAX_VIOLATIONS = 5;
const CRITICAL_SECONDS = 120; // timer turns urgent below this

const TYPE_LABELS = {
  mcq: "Multiple choice",
  "case studies": "Case study",
  coding: "Coding",
};

const TestPage = () => {
  const { assessmentId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const questions = state?.questions || [];
  const testType = state?.testType;

  const [answers, setAnswers] = useState({});
  const [violations, setViolations] = useState(0);
  const [violationLog, setViolationLog] = useState([]);
  const [showLog, setShowLog] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [secondsLeft, setSecondsLeft] = useState(TEST_DURATION_MINUTES * 60);
  const [submitting, setSubmitting] = useState(false);
  const [autoSubmitReason, setAutoSubmitReason] = useState(null);
  const [testStarted, setTestStarted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const submittedRef = useRef(false); // guards against double-submit (timer + manual click racing)

  // ---------- Toasts & violation logging ----------

  const pushToast = useCallback((text) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, text }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  }, []);

  const registerViolation = useCallback(
    (type, message) => {
      setViolations((v) => v + 1);
      setViolationLog((log) =>
        [{ id: Date.now() + Math.random(), type, message, time: new Date() }, ...log].slice(0, 20)
      );
      pushToast(message);
    },
    [pushToast]
  );

  // ---------- Redirect back if someone lands here directly (e.g. refresh) ----------

  useEffect(() => {
    if (!questions.length) {
      navigate("/dashboard");
    }
  }, [questions, navigate]);

  // ---------- Warn before leaving the tab/window ----------

  useEffect(() => {
    if (!testStarted) return;
    const handler = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [testStarted]);

  // ---------- Tab-switch / window-blur violation tracking ----------

  useEffect(() => {
    if (!testStarted) return;
    const handleVisibilityChange = () => {
      if (document.hidden) {
        registerViolation("tab", "Tab switch detected");
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [testStarted, registerViolation]);

  // ---------- Fullscreen enforcement ----------

  const requestFullscreen = useCallback(async () => {
    const el = document.documentElement;
    try {
      if (el.requestFullscreen) await el.requestFullscreen();
      else if (el.webkitRequestFullscreen) await el.webkitRequestFullscreen();
    } catch {
      // Some browsers/environments block programmatic fullscreen — the
      // overlay stays up and the person can retry with the button.
    }
  }, []);

  useEffect(() => {
    const handler = () => {
      const active = !!(document.fullscreenElement || document.webkitFullscreenElement);
      setIsFullscreen(active);
      if (testStarted && !active) {
        registerViolation("fullscreen", "Exited fullscreen mode");
      }
    };
    document.addEventListener("fullscreenchange", handler);
    document.addEventListener("webkitfullscreenchange", handler);
    return () => {
      document.removeEventListener("fullscreenchange", handler);
      document.removeEventListener("webkitfullscreenchange", handler);
    };
  }, [testStarted, registerViolation]);

  // Leave fullscreen behind once the test page unmounts (e.g. after submit)
  useEffect(() => {
    return () => {
      if (document.fullscreenElement) {
        document.exitFullscreen?.().catch(() => {});
      }
    };
  }, []);

  // ---------- Block copy / paste / cut / right-click ----------

  const blockClipboard = useCallback(
    (label) => (e) => {
      e.preventDefault();
      registerViolation("integrity", label);
    },
    [registerViolation]
  );

  // ---------- Block devtools / print shortcuts ----------

  useEffect(() => {
    if (!testStarted) return;
    const handleKeyDown = (e) => {
      const key = e.key?.toUpperCase();
      const blocked =
        key === "F12" ||
        (e.ctrlKey && e.shiftKey && ["I", "J", "C"].includes(key)) ||
        (e.metaKey && e.altKey && ["I", "J", "C"].includes(key)) ||
        (e.ctrlKey && ["U", "P"].includes(key));
      if (blocked) {
        e.preventDefault();
        registerViolation("integrity", "Blocked restricted shortcut");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [testStarted, registerViolation]);

  // ---------- Answers ----------

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  // ---------- Submit ----------

  const submitTest = useCallback(async () => {
    if (submittedRef.current) return;
    submittedRef.current = true;
    setSubmitting(true);

    const formattedAnswers = Object.entries(answers).map(([questionId, submittedAnswer]) => ({
      questionId,
      submittedAnswer: submittedAnswer || "",
    }));

    try {
      const res = await api.post("/api/assessment/submit-test", {
        assessmentId,
        answers: formattedAnswers,
        violations,
      });
      navigate("/test-result", { state: { result: res.data, testType } });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Submission failed. Please try again.");
      submittedRef.current = false;
      setSubmitting(false);
      setAutoSubmitReason(null);
    }
  }, [answers, violations, assessmentId, testType, navigate]);

  // Auto-submit once the violation ceiling is hit
  useEffect(() => {
    if (violations >= MAX_VIOLATIONS && !submittedRef.current) {
      setAutoSubmitReason("Repeated integrity violations were detected during this session.");
      submitTest();
    }
  }, [violations, submitTest]);

  // Countdown timer — auto-submits at zero
  useEffect(() => {
    if (!testStarted) return;
    if (secondsLeft <= 0) {
      setAutoSubmitReason((r) => r || "Time's up.");
      submitTest();
      return;
    }
    const interval = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(interval);
  }, [testStarted, secondsLeft, submitTest]);

  // ---------- Question navigation (one question per "page") ----------

  const jumpToQuestion = (qid) => {
    const idx = questions.findIndex((q) => q._id === qid);
    if (idx !== -1) setCurrentIndex(idx);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goToIndex = (idx) => {
    setCurrentIndex(Math.min(Math.max(idx, 0), questions.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goPrev = () => goToIndex(currentIndex - 1);

  const goNext = () => {
    if (currentIndex === questions.length - 1) {
      setShowSubmitConfirm(true);
    } else {
      goToIndex(currentIndex + 1);
    }
  };

  // ---------- Derived values ----------

  const formatTime = (totalSeconds) => {
    const m = Math.floor(Math.max(totalSeconds, 0) / 60);
    const s = Math.max(totalSeconds, 0) % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const isAnswered = (q) => {
    const val = answers[q._id];
    return typeof val === "string" && val.trim() !== "";
  };

  const answeredCount = questions.filter(isAnswered).length;
  const progressPercent = questions.length ? Math.round((answeredCount / questions.length) * 100) : 0;
  const unanswered = questions.filter((q) => !isAnswered(q));
  const timeCritical = secondsLeft <= CRITICAL_SECONDS;
  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;
  const isFirstQuestion = currentIndex === 0;

  if (!questions.length) return null;

  // ---------- Pre-test instructions screen ----------

  if (!testStarted) {
    return (
      <div className="txp-page min-h-screen flex items-center justify-center px-6 py-12">
        <TxpStyles />
        <div className="max-w-lg w-full bg-white border border-[#E8E4DA] rounded-2xl p-8 sm:p-10">
          <div className="w-12 h-12 rounded-full bg-[#FBF0DF] border border-[#EAD3AE] flex items-center justify-center mb-6">
            <FaShieldAlt className="text-[#A15E13]" size={18} />
          </div>
          <span className="txp-mono text-[#A15E13] text-xs uppercase">Creator verification</span>
          <h1 className="txp-wordmark text-[#101827] font-semibold text-2xl sm:text-3xl mt-2 mb-5">
            Before you begin
          </h1>
          <ul className="flex flex-col gap-3 mb-8">
            {[
              `You'll have ${TEST_DURATION_MINUTES} minutes once the test starts — the timer won't pause.`,
              "The test runs in fullscreen. Leaving fullscreen or switching tabs is logged.",
              "Copying, pasting, and right-click are disabled for the duration of the test.",
              `The test auto-submits after ${MAX_VIOLATIONS} logged violations, or when time runs out.`,
            ].map((rule, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-[#334155]">
                <span className="txp-mono text-[11px] text-[#A15E13] mt-0.5 shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {rule}
              </li>
            ))}
          </ul>
          <button
            onClick={async () => {
              await requestFullscreen();
              setTestStarted(true);
            }}
            className="txp-btn-fill w-full flex items-center justify-center gap-2 text-white text-sm font-semibold py-3 rounded-lg"
          >
            <FaExpand size={13} />
            Enter fullscreen &amp; start test
          </button>
        </div>
      </div>
    );
  }

  // ---------- Main test UI ----------

  return (
    <div
      className="txp-page min-h-screen"
      onCopy={blockClipboard("Copy is disabled during this test")}
      onCut={blockClipboard("Cut is disabled during this test")}
      onPaste={blockClipboard("Paste is disabled during this test")}
      onContextMenu={blockClipboard("Right-click is disabled during this test")}
    >
      <TxpStyles />

      {/* HUD — proctoring status bar */}
      <div className="txp-hud sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <FaShieldAlt size={14} className="text-[#E8B26A]" />
          <span className="txp-mono text-[11px] uppercase tracking-wider text-[#E8E4DA]">
            Proctored session
          </span>
          <span
            className={`w-1.5 h-1.5 rounded-full ${isFullscreen ? "bg-[#6FCF8F]" : "bg-[#E36B5F]"}`}
            title={isFullscreen ? "Fullscreen active" : "Not in fullscreen"}
          />
        </div>

        <div className="flex items-center gap-4 relative">
          <button
            onClick={() => setShowLog((s) => !s)}
            className="txp-mono text-[11px] uppercase tracking-wider text-[#E8E4DA] hover:text-white transition-colors flex items-center gap-1.5"
          >
            <MdWarningAmber size={14} className={violations > 0 ? "text-[#E8B26A]" : "text-[#7A7669]"} />
            {violations} / {MAX_VIOLATIONS} flags
          </button>

          {showLog && (
            <div className="absolute right-0 top-8 w-64 bg-[#101827] border border-[#2A2F3A] rounded-xl p-3 shadow-xl">
              {violationLog.length === 0 ? (
                <p className="txp-mono text-[10px] text-[#7A7669] uppercase">No flags yet</p>
              ) : (
                <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
                  {violationLog.map((v) => (
                    <div key={v.id} className="text-[11px] text-[#D8D5CC] flex justify-between gap-3">
                      <span>{v.message}</span>
                      <span className="txp-mono text-[#7A7669] shrink-0">
                        {v.time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <span
            className={`txp-mono text-sm font-medium tabular-nums ${
              timeCritical ? "text-[#F0897A] animate-pulse" : "text-white"
            }`}
          >
            {formatTime(secondsLeft)}
          </span>

          <button
            onClick={() => setShowSubmitConfirm(true)}
            disabled={submitting}
            className="txp-btn-fill text-white text-xs font-semibold px-4 py-2 rounded-lg disabled:opacity-60"
          >
            Submit test
          </button>
        </div>
      </div>

      {/* Progress + question navigator */}
      <div className="border-b border-[#E8E4DA] bg-white/80 backdrop-blur sticky top-[52px] z-30">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="txp-mono text-[10px] uppercase text-[#94918A]">
              {answeredCount} of {questions.length} answered
            </span>
            <span className="txp-mono text-[10px] uppercase text-[#A15E13]">{progressPercent}%</span>
          </div>
          <ProgressBar
            width="100%"
            height="6px"
            completed={progressPercent}
            bgColor="#C6741B"
            baseBgColor="#F1EDE3"
            isLabelVisible={false}
            borderRadius="6px"
          />
          <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
            {questions.map((q, i) => {
              const answered = isAnswered(q);
              const current = currentIndex === i;
              return (
                <button
                  key={q._id}
                  onClick={() => goToIndex(i)}
                  className={`txp-mono shrink-0 w-8 h-8 rounded-full text-[11px] font-medium border transition-colors ${
                    current
                      ? "bg-[#C6741B] border-[#C6741B] text-white"
                      : answered
                      ? "bg-[#FBF0DF] border-[#EAD3AE] text-[#A15E13]"
                      : "bg-white border-[#E8E4DA] text-[#94918A]"
                  }`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Current question — one question per page, exam-style split layout */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        <section
          key={currentQuestion._id}
          className="txp-card bg-white border border-[#E8E4DA] rounded-2xl overflow-hidden"
        >
          <div className="flex items-center justify-between px-6 sm:px-7 pt-6 sm:pt-7 pb-5 border-b border-[#EFEBE1]">
            <span className="txp-mono text-[11px] uppercase text-[#A15E13]">
              Question {String(currentIndex + 1).padStart(2, "0")} / {String(questions.length).padStart(2, "0")}
            </span>
            <span className="txp-mono text-[10px] uppercase px-2.5 py-1 rounded-full border border-[#E8E4DA] text-[#5B6472]">
              {TYPE_LABELS[currentQuestion.type] || currentQuestion.type}
            </span>
          </div>

          {/* Split panel: prompt on the left, answer on the right — like a real exam sheet */}
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left — problem statement / case brief */}
            <div className="p-6 sm:p-7 lg:border-r border-[#EFEBE1] bg-[#FFFEFB]">
              <span className="txp-mono text-[10px] uppercase tracking-wider text-[#94918A] block mb-3">
                {currentQuestion.type === "case studies"
                  ? "Case study"
                  : currentQuestion.type === "coding"
                  ? "Problem statement"
                  : "Question"}
              </span>
              <div
                className={`select-none ${
                  currentQuestion.type === "mcq"
                    ? ""
                    : "max-h-[420px] overflow-y-auto pr-1 border border-[#E8E4DA] rounded-xl p-4 bg-white"
                }`}
              >
                <p className="txp-wordmark text-[#101827] text-lg sm:text-xl font-semibold leading-snug whitespace-pre-wrap">
                  {currentQuestion.questionText}
                </p>
              </div>
            </div>

            {/* Right — where the answer is written */}
            <div className="p-6 sm:p-7">
              <span className="txp-mono text-[10px] uppercase tracking-wider text-[#94918A] block mb-3">
                Your answer
              </span>

              {currentQuestion.type === "mcq" && (
                <div className="flex flex-col gap-2.5">
                  {currentQuestion.options.map((opt, i) => {
                    const selected = answers[currentQuestion._id] === opt;
                    return (
                      <label
                        key={i}
                        className={`flex items-center gap-3 border rounded-xl px-4 py-3 cursor-pointer transition-colors ${
                          selected
                            ? "border-[#C6741B] bg-[#FBF0DF]"
                            : "border-[#E8E4DA] hover:border-[#D8B98A]"
                        }`}
                      >
                        <input
                          type="radio"
                          name={currentQuestion._id}
                          value={opt}
                          checked={selected}
                          onChange={() => handleAnswerChange(currentQuestion._id, opt)}
                          className="sr-only"
                        />
                        <span
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                            selected ? "border-[#C6741B]" : "border-[#D8D3C6]"
                          }`}
                        >
                          {selected && <span className="w-2 h-2 rounded-full bg-[#C6741B]" />}
                        </span>
                        <span className="text-sm text-[#334155] select-none">{opt}</span>
                      </label>
                    );
                  })}
                </div>
              )}

              {currentQuestion.type === "case studies" && (
                <div>
                  <textarea
                    rows={16}
                    placeholder="Write your analysis here..."
                    value={answers[currentQuestion._id] || ""}
                    onChange={(e) => handleAnswerChange(currentQuestion._id, e.target.value)}
                    className="w-full border border-[#E8E4DA] rounded-xl p-4 text-sm text-[#101827] outline-none focus:border-[#C6741B] transition-colors resize-y"
                  />
                  <div className="txp-mono text-[10px] text-[#94918A] text-right mt-1.5">
                    {(answers[currentQuestion._id] || "").trim().split(/\s+/).filter(Boolean).length} words
                  </div>
                </div>
              )}

              {currentQuestion.type === "coding" && (
                <div className="border border-[#E8E4DA] rounded-xl overflow-hidden">
                  <div className="bg-[#101827] px-4 py-2 flex items-center justify-between">
                    <span className="txp-mono text-[10px] uppercase text-[#D8D5CC]">JavaScript</span>
                    <span className="txp-mono text-[10px] text-[#7A7669]">Autosaved</span>
                  </div>
                  <Editor
                    height="420px"
                    defaultLanguage="javascript"
                    theme="vs-dark"
                    value={answers[currentQuestion._id] ?? currentQuestion.initialCode ?? ""}
                    onChange={(value) => handleAnswerChange(currentQuestion._id, value || "")}
                    options={{ minimap: { enabled: false }, fontSize: 14 }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Prev / Next / Submit controls */}
          <div className="flex items-center justify-between gap-3 px-6 sm:px-7 py-5 border-t border-[#EFEBE1] bg-[#FFFEFB]">
            <button
              onClick={goPrev}
              disabled={isFirstQuestion}
              className="txp-btn-outline text-sm font-semibold px-5 py-2.5 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            <span className="txp-mono text-[10px] uppercase text-[#94918A]">
              {answeredCount} of {questions.length} answered
            </span>

            <button
              onClick={goNext}
              disabled={submitting}
              className="txp-btn-fill text-white text-sm font-semibold px-6 py-2.5 rounded-lg disabled:opacity-60"
            >
              {isLastQuestion ? "Submit test" : "Next"}
            </button>
          </div>
        </section>
      </div>

      {/* Fullscreen-exit blocking overlay */}
      {!isFullscreen && !submitting && (
        <div className="txp-blocking-overlay">
          <div className="max-w-sm w-full bg-white border border-[#E8E4DA] rounded-2xl p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-[#FBECEA] border border-[#F0C9C4] flex items-center justify-center mx-auto mb-5">
              <MdWarningAmber className="text-[#A83A34]" size={22} />
            </div>
            <h3 className="txp-wordmark text-[#101827] font-semibold text-lg mb-2">You've left fullscreen</h3>
            <p className="text-[#5B6472] text-sm mb-6">
              This has been logged ({violations} / {MAX_VIOLATIONS} flags). Return to fullscreen to keep going.
            </p>
            <button
              onClick={requestFullscreen}
              className="txp-btn-fill w-full flex items-center justify-center gap-2 text-white text-sm font-semibold py-3 rounded-lg"
            >
              <FaExpand size={13} />
              Return to fullscreen
            </button>
          </div>
        </div>
      )}

      {/* Submit confirmation */}
      {showSubmitConfirm && !submitting && (
        <div className="txp-modal-backdrop" onClick={() => setShowSubmitConfirm(false)}>
          <div className="txp-modal-card" onClick={(e) => e.stopPropagation()}>
            <h3 className="txp-wordmark text-[#101827] font-semibold text-lg mb-2">Submit this test?</h3>
            <p className="text-[#5B6472] text-sm mb-4">
              You've answered {answeredCount} of {questions.length} questions. This can't be undone.
            </p>
            {unanswered.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-6">
                {unanswered.map((q) => {
                  const i = questions.indexOf(q);
                  return (
                    <button
                      key={q._id}
                      onClick={() => {
                        setShowSubmitConfirm(false);
                        jumpToQuestion(q._id);
                      }}
                      className="txp-mono text-[10px] px-2 py-1 rounded-md border border-[#EAD3AE] bg-[#FBF0DF] text-[#A15E13]"
                    >
                      Q{i + 1} unanswered
                    </button>
                  );
                })}
              </div>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => setShowSubmitConfirm(false)}
                className="txp-btn-outline flex-1 text-sm font-semibold py-2.5 rounded-lg"
              >
                Keep working
              </button>
              <button
                onClick={() => {
                  setShowSubmitConfirm(false);
                  submitTest();
                }}
                className="txp-btn-fill flex-1 text-sm font-semibold py-2.5 rounded-lg text-white"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Submitting / auto-submit overlay */}
      {submitting && (
        <div className="txp-blocking-overlay">
          <div className="max-w-sm w-full bg-white border border-[#E8E4DA] rounded-2xl p-8 text-center">
            <div className="txp-spinner mx-auto mb-5" />
            <h3 className="txp-wordmark text-[#101827] font-semibold text-lg mb-2">
              {autoSubmitReason ? "Test auto-submitted" : "Submitting your test..."}
            </h3>
            {autoSubmitReason && <p className="text-[#5B6472] text-sm">{autoSubmitReason}</p>}
          </div>
        </div>
      )}

      {/* Toasts */}
      <div className="fixed top-4 right-4 z-[70] flex flex-col gap-2 items-end">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="txp-toast flex items-center gap-2 bg-[#101827] text-white text-xs px-3.5 py-2.5 rounded-lg shadow-lg"
          >
            <MdWarningAmber size={14} className="text-[#E8B26A] shrink-0" />
            {t.text}
            <button onClick={() => setToasts((ts) => ts.filter((x) => x.id !== t.id))} className="ml-1 opacity-70 hover:opacity-100">
              <MdClose size={13} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// Shared styles — reuses the app's warm-cream / Fraunces / IBM Plex Mono
// design language, with a dark "instrumentation" HUD as the one contrasting
// element for the proctoring status bar.
const TxpStyles = () => (
  <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500&display=swap');

        .txp-page { font-family: 'Plus Jakarta Sans', sans-serif; background: #FFFEFB; }
        .txp-wordmark { font-family: 'Fraunces', serif; }
        .txp-mono { font-family: 'IBM Plex Mono', monospace; letter-spacing: 0.06em; }

        .txp-hud {
            background: #101827;
            padding: 12px 24px;
            display: flex; align-items: center; justify-content: space-between;
            border-bottom: 1px solid #1E2430;
        }

        .txp-card { transition: box-shadow 200ms ease, border-color 200ms ease; }

        .txp-btn-fill { background: #C6741B; border: 1.5px solid #C6741B; transition: background-color 180ms ease, transform 150ms ease; }
        .txp-btn-fill:hover:not(:disabled) { background: #A15E13; border-color: #A15E13; transform: translateY(-1px); }
        .txp-btn-fill:disabled { opacity: 0.65; cursor: not-allowed; }

        .txp-btn-outline { border: 1.5px solid #101827; color: #101827; transition: background-color 180ms ease, color 180ms ease; }
        .txp-btn-outline:hover { background: #101827; color: #FFFEFB; }

        .txp-modal-backdrop {
            position: fixed; inset: 0; z-index: 60;
            background: rgba(16, 24, 39, 0.55);
            display: flex; align-items: center; justify-content: center;
            animation: txp-fade 200ms ease both;
            padding: 16px;
        }
        .txp-modal-card {
            background: #FFFEFB; border-radius: 16px;
            padding: 32px; max-width: 380px; width: 100%;
            animation: txp-pop 220ms cubic-bezier(.34,1.56,.64,1) both;
        }
        .txp-blocking-overlay {
            position: fixed; inset: 0; z-index: 65;
            background: rgba(16, 24, 39, 0.7);
            display: flex; align-items: center; justify-content: center;
            padding: 16px;
            animation: txp-fade 200ms ease both;
        }
        .txp-toast { animation: txp-toast-in 220ms ease both; }

        .txp-spinner {
            width: 32px; height: 32px; border-radius: 999px;
            border: 3px solid #F1EDE3; border-top-color: #C6741B;
            animation: txp-spin 800ms linear infinite;
        }

        @keyframes txp-fade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes txp-pop { from { opacity: 0; transform: scale(0.94); } to { opacity: 1; transform: scale(1); } }
        @keyframes txp-toast-in { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes txp-spin { to { transform: rotate(360deg); } }

        @media (prefers-reduced-motion: reduce) {
            .txp-card, .txp-btn-fill, .txp-btn-outline { transition: none; }
            .txp-modal-backdrop, .txp-modal-card, .txp-blocking-overlay, .txp-toast, .txp-spinner { animation: none; }
        }
    `}</style>
);

export default TestPage;