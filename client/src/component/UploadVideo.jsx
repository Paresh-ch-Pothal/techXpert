import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaLock, FaCloudUploadAlt, FaCheckCircle, FaArrowRight } from "react-icons/fa"
import { API_BASE } from '../config'
import { clearVerificationPass } from '../utils/verificationAccess'

const SealMark = ({ size = 44 }) => (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
        <circle cx="20" cy="20" r="18.5" fill="#101827" />
        <circle cx="20" cy="20" r="18.5" fill="none" stroke="#C6741B" strokeWidth="1" strokeDasharray="2 3" />
        <text x="20" y="25" textAnchor="middle" fontFamily="'Fraunces', serif" fontWeight="600" fontSize="15" fill="#FAF6EF">TX</text>
        <circle cx="31.5" cy="30.5" r="2.1" fill="#C6741B" />
    </svg>
)

const UploadVideo = () => {
    const [title, setTitle] = useState('')
    const [error, setError] = useState('')
    const [submitError, setSubmitError] = useState(null)
    const [submitting, setSubmitting] = useState(false)
    const [createdPlaylist, setCreatedPlaylist] = useState(null) // holds the response once created

    const navigate = useNavigate()

    const handleCreate = async (e) => {
        e.preventDefault()
        setSubmitError(null)

        if (!title.trim()) {
            setError("Give your course a title.")
            return
        }
        setError('')
        setSubmitting(true)

        try {
            const token = localStorage.getItem('token')
            const res = await fetch(`${API_BASE}/api/video/upload`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token,
                },
                body: JSON.stringify({ title: title.trim() }),
            })

            const data = await res.json().catch(() => null)

            if (!res.ok) {
                throw new Error(data?.message || 'Could not create your course')
            }

            // data.playlist is expected from the backend
            setCreatedPlaylist(data.playlist)
            clearVerificationPass();
        } catch (err) {
            console.error('Create playlist failed:', err.message)
            setSubmitError(err.message || "Something went wrong. Try again.")
        } finally {
            setSubmitting(false)
        }
    }

    if (!localStorage.getItem("token")) {
        return (
            <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="min-h-screen bg-[#101827] flex items-center justify-center px-6">
                <style>{`
                    @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
                    .txp-wordmark { font-family: 'Fraunces', serif; }
                `}</style>
                <div className="bg-[#17223A] border border-[rgba(255,254,251,0.1)] rounded-2xl p-10 max-w-sm w-full text-center">
                    <div className="w-14 h-14 rounded-full bg-[#2A2313] flex items-center justify-center mx-auto mb-5">
                        <FaLock size={20} color="#E8A845" />
                    </div>
                    <h1 className="txp-wordmark text-[#FBF7EF] font-semibold text-2xl mb-2">Sign in to create a course</h1>
                    <p className="text-[#B8BDC7] text-sm mb-7 leading-relaxed">
                        You'll need an account to start teaching on TechXpert.
                    </p>
                    <Link
                        to="/signin"
                        className="inline-flex items-center justify-center bg-[#C6741B] text-[#FFFEFB] font-semibold text-base py-3 px-8 rounded-lg hover:bg-[#A15E13] transition-colors"
                    >
                        Sign in
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="min-h-screen bg-[#FFFEFB]">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500&display=swap');

                .txp-wordmark { font-family: 'Fraunces', serif; }
                .txp-mono { font-family: 'IBM Plex Mono', monospace; letter-spacing: 0.06em; }

                .txp-field {
                    background: #FFFEFB; border: 1.5px solid #E8E4DA;
                    transition: border-color 160ms ease;
                }
                .txp-field:focus-within { border-color: #C6741B; }
                .txp-field.txp-field-error { border-color: #E24B4A; }
                .txp-field input {
                    background: transparent; border: none; outline: none;
                    width: 100%; font-size: 15px; color: #101827;
                }
                .txp-field input::placeholder { color: #B0AC9F; }

                .txp-btn-fill {
                    background: #C6741B; border: 1.5px solid #C6741B;
                    transition: background-color 180ms ease, transform 150ms ease, opacity 160ms ease;
                }
                .txp-btn-fill:hover:not(:disabled) { background: #A15E13; border-color: #A15E13; transform: translateY(-1px); }
                .txp-btn-fill:disabled { opacity: 0.7; cursor: not-allowed; }

                .txp-step {
                    display: flex; gap: 14px; align-items: flex-start;
                }
                .txp-step-num {
                    width: 26px; height: 26px; border-radius: 999px;
                    background: #FBF0DF; color: #A15E13; font-weight: 600; font-size: 13px;
                    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
                }

                @media (prefers-reduced-motion: reduce) {
                    .txp-field, .txp-btn-fill { transition: none; }
                }
            `}</style>

            <div className="container max-w-2xl mx-auto px-6 py-16 md:py-20">
                <div className="flex justify-center mb-6">
                    <SealMark size={44} />
                </div>

                {!createdPlaylist ? (
                    <>
                        <div className="text-center mb-12">
                            <span className="txp-mono text-[#A15E13] text-xs uppercase">Teach</span>
                            <h1 className="txp-wordmark text-[#101827] font-semibold text-3xl sm:text-4xl mt-3 mb-4">
                                Name your course
                            </h1>
                            <p className="text-[#5B6472] text-base leading-relaxed max-w-lg mx-auto">
                                This creates an empty playlist for your course. You'll add your
                                first video to it from the dashboard in the next step.
                            </p>
                            {/* Added message below */}
                            <p className="text-[#C6741B] text-xs font-medium mt-3">
                                Don't worry, you can always change the name later!
                            </p>
                        </div>

                        <form onSubmit={handleCreate} className="bg-white border border-[#E8E4DA] rounded-2xl p-6 sm:p-8 flex flex-col gap-6">
                            {submitError && (
                                <div className="bg-[#FBECEA] text-[#A83A34] text-sm font-medium rounded-lg px-4 py-3">
                                    {submitError}
                                </div>
                            )}

                            <div>
                                <label htmlFor="head" className="block text-sm font-medium text-[#334155] mb-1.5">
                                    Course title
                                </label>
                                <div className={`txp-field rounded-lg px-3.5 py-2.5 ${error ? "txp-field-error" : ""}`}>
                                    <input
                                        type="text"
                                        id="head"
                                        name="head"
                                        placeholder="e.g. Introduction to React Hooks"
                                        value={title}
                                        onChange={(e) => {
                                            setTitle(e.target.value)
                                            setError('')
                                        }}
                                    />
                                </div>
                                {error && <p className="text-xs text-[#E24B4A] mt-1.5">{error}</p>}
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="txp-btn-fill flex items-center justify-center gap-2 text-[#FFFEFB] font-semibold text-base py-3 rounded-lg"
                            >
                                <FaCloudUploadAlt size={17} />
                                {submitting ? "Creating…" : "Create course"}
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="bg-white border border-[#E8E4DA] rounded-2xl p-6 sm:p-8">
                        <div className="flex items-center gap-3 mb-2">
                            <FaCheckCircle size={22} className="text-[#2E7D4F]" />
                            <h1 className="txp-wordmark text-[#101827] font-semibold text-2xl">
                                "{createdPlaylist.name}" created
                            </h1>
                        </div>
                        <p className="text-[#5B6472] text-sm mb-8 ml-9">
                            Your course playlist is live but still empty. Here's how to add its first lesson:
                        </p>

                        <div className="flex flex-col gap-5 mb-8">
                            <div className="txp-step">
                                <span className="txp-step-num">1</span>
                                <p className="text-[#334155] text-sm pt-0.5">
                                    Go to your <strong>Dashboard</strong> — you'll see
                                    "{createdPlaylist.name}" listed as a course with no videos yet.
                                </p>
                            </div>
                            <div className="txp-step">
                                <span className="txp-step-num">2</span>
                                <p className="text-[#334155] text-sm pt-0.5">
                                    Open that course and choose <strong>Upload video</strong> — this is where
                                    you'll pick the actual video file and a thumbnail.
                                </p>
                            </div>
                            <div className="txp-step">
                                <span className="txp-step-num">3</span>
                                <p className="text-[#334155] text-sm pt-0.5">
                                    Once uploaded, it becomes the first lesson in this playlist, and your
                                    course goes live for students.
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => navigate("/dashboard")}
                            className="txp-btn-fill w-full flex items-center justify-center gap-2 text-[#FFFEFB] font-semibold text-base py-3 rounded-lg"
                        >
                            Go to dashboard
                            <FaArrowRight size={14} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default UploadVideo