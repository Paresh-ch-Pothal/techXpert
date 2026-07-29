import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Slide, ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { FaEye, FaEyeSlash } from "react-icons/fa"
import { API_BASE } from '../config'

const highlights = [
    "Your course progress is saved automatically",
    "Certificates are issued the moment you finish",
    "One account for learning and teaching",
]

const SealMark = ({ size = 56 }) => (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
        <circle cx="20" cy="20" r="18.5" fill="#FBF0DF" />
        <circle cx="20" cy="20" r="18.5" fill="none" stroke="#C6741B" strokeWidth="1" strokeDasharray="2 3" />
        <text x="20" y="25" textAnchor="middle" fontFamily="'Fraunces', serif" fontWeight="600" fontSize="13" fill="#101827">TX</text>
        <circle cx="31.5" cy="30.5" r="2.1" fill="#C6741B" />
    </svg>
)

const Signin = () => {
    const host = API_BASE
    const [info, setInfo] = useState({ email: "", password: "" })
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const response = await fetch(`${host}/api/user/signin`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email: info.email, password: info.password })
            })
            const json = await response.json()

            if (json.success) {
                localStorage.setItem("token", json.authtoken)
                toast.success("Signed in successfully", {
                    position: "top-left",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "colored",
                    transition: Slide,
                })
                navigate("/")
            } else {
                toast.error(json.error || "Couldn't sign in. Check your details.", {
                    position: "top-left",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "colored",
                    transition: Slide,
                })
            }
        } catch (err) {
            toast.error("Couldn't reach the server. Try again.", {
                position: "top-left",
                autoClose: 3000,
                theme: "colored",
                transition: Slide,
            })
        } finally {
            setLoading(false)
        }
    }

    const onChange = (e) => {
        setInfo({ ...info, [e.target.name]: e.target.value })
    }

    return (
        <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="min-h-screen bg-[#FFFEFB]">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500&display=swap');

                .txp-wordmark { font-family: 'Fraunces', serif; }
                .txp-mono { font-family: 'IBM Plex Mono', monospace; letter-spacing: 0.06em; }

                .txp-field {
                    background: #FFFEFB;
                    border: 1.5px solid #E8E4DA;
                    transition: border-color 160ms ease;
                }
                .txp-field:focus-within { border-color: #C6741B; }
                .txp-field input {
                    background: transparent; border: none; outline: none;
                    width: 100%; font-size: 15px; color: #101827;
                }
                .txp-field input::placeholder { color: #B0AC9F; }

                .txp-eye-btn { color: #94918A; transition: color 160ms ease; }
                .txp-eye-btn:hover { color: #101827; }

                .txp-btn-fill {
                    background: #C6741B;
                    border: 1.5px solid #C6741B;
                    transition: background-color 180ms ease, transform 150ms ease, opacity 160ms ease;
                }
                .txp-btn-fill:hover:not(:disabled) { background: #A15E13; border-color: #A15E13; transform: translateY(-1px); }
                .txp-btn-fill:disabled { opacity: 0.65; cursor: not-allowed; }

                .txp-spinner {
                    width: 16px; height: 16px;
                    border: 2px solid rgba(255, 254, 251, 0.4);
                    border-top-color: #FFFEFB;
                    border-radius: 50%;
                    animation: txp-spin 700ms linear infinite;
                }
                @keyframes txp-spin { to { transform: rotate(360deg); } }

                @media (prefers-reduced-motion: reduce) {
                    .txp-field, .txp-eye-btn, .txp-btn-fill { transition: none; }
                    .txp-spinner { animation: none; }
                }
            `}</style>

            <ToastContainer
                position="top-left"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
                transition={Slide}
            />

            <div className="grid md:grid-cols-2 min-h-screen">
                {/* Brand panel */}
                <div className="hidden md:flex flex-col justify-between bg-[#101827] px-12 lg:px-16 py-14">
                    <Link to="/" className="flex items-center gap-3">
                        <SealMark size={38} />
                        <span className="txp-wordmark text-xl font-semibold text-[#FBF7EF]">TechXpert</span>
                    </Link>

                    <div>
                        <SealMark size={64} />
                        <h1 className="txp-wordmark text-[#FBF7EF] font-semibold text-3xl lg:text-4xl leading-tight mt-6 mb-4 max-w-sm">
                            Welcome back to your classroom.
                        </h1>
                        <p className="text-[#B8BDC7] text-[15px] leading-relaxed max-w-sm mb-8">
                            Sign in to pick up where you left off — as a learner, a
                            teacher, or both.
                        </p>
                        <ul className="flex flex-col gap-3">
                            {highlights.map((h) => (
                                <li key={h} className="flex items-start gap-3 text-[#DADDE3] text-sm">
                                    <svg width="17" height="17" viewBox="0 0 20 20" fill="none" className="mt-0.5 shrink-0">
                                        <circle cx="10" cy="10" r="10" fill="#C6741B" />
                                        <path d="M6 10.5L8.5 13L14 7.5" stroke="#101827" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    {h}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <p className="txp-mono text-[10px] text-[#6B7280] uppercase">Learn &middot; Teach &middot; Certify</p>
                </div>

                {/* Form panel */}
                <div className="flex items-center justify-center px-6 py-16">
                    <div className="w-full max-w-sm">
                        <Link to="/" className="flex md:hidden items-center gap-3 mb-10">
                            <SealMark size={34} />
                            <span className="txp-wordmark text-lg font-semibold text-[#101827]">TechXpert</span>
                        </Link>

                        <h2 className="txp-wordmark text-[#101827] font-semibold text-2xl mb-2">Sign in</h2>
                        <p className="text-[#5B6472] text-sm mb-8">
                            Enter your details to continue to TechXpert.
                        </p>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-[#334155] mb-1.5">Email</label>
                                <div className="txp-field flex items-center rounded-lg px-3.5 py-2.5">
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        placeholder="you@example.com"
                                        required
                                        onChange={onChange}
                                        value={info.email}
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label htmlFor="password" className="block text-sm font-medium text-[#334155]">Password</label>
                                </div>
                                <div className="txp-field flex items-center rounded-lg px-3.5 py-2.5">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        name="password"
                                        placeholder="Enter your password"
                                        required
                                        onChange={onChange}
                                        value={info.password}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((v) => !v)}
                                        className="txp-eye-btn shrink-0"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="txp-btn-fill flex items-center justify-center gap-2 text-[#FFFEFB] font-semibold text-base py-3 rounded-lg mt-2"
                            >
                                {loading && <span className="txp-spinner" />}
                                {loading ? "Signing in" : "Sign in"}
                            </button>

                            <p className="text-xs text-[#94918A] text-center">Your password is encrypted.</p>
                        </form>

                        <p className="text-sm text-[#5B6472] text-center mt-8">
                            Don't have an account?{" "}
                            <Link to="/signup" className="text-[#A15E13] hover:text-[#101827] font-semibold">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Signin