import React, { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Slide, ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { FaEye, FaEyeSlash } from "react-icons/fa"
import { API_BASE } from '../config'

const highlights = [
    "Learn from real, working practitioners",
    "Upload your own videos and start teaching",
    "Earn a verified certificate for every course you finish",
]

const SealMark = ({ size = 56 }) => (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
        <circle cx="20" cy="20" r="18.5" fill="#FBF0DF" />
        <circle cx="20" cy="20" r="18.5" fill="none" stroke="#C6741B" strokeWidth="1" strokeDasharray="2 3" />
        <text x="20" y="25" textAnchor="middle" fontFamily="'Fraunces', serif" fontWeight="600" fontSize="13" fill="#101827">TX</text>
        <circle cx="31.5" cy="30.5" r="2.1" fill="#C6741B" />
    </svg>
)

const getStrength = (password) => {
    if (!password) return 0
    let score = 0
    if (password.length >= 8) score++
    if (password.length >= 12) score++
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++
    return Math.min(score, 4)
}

const strengthLabels = ["Too short", "Weak", "Fair", "Good", "Strong"]
const strengthColors = ["#E24B4A", "#E24B4A", "#C6741B", "#C6741B", "#2F6F4E"]

const Signup = () => {
    const host = API_BASE
    const [info, setInfo] = useState({ name: "", email: "", password: "", cpassword: "" })
    const [showPassword, setShowPassword] = useState(false)
    const [showCPassword, setShowCPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const strength = useMemo(() => getStrength(info.password), [info.password])
    const passwordsMismatch = info.cpassword.length > 0 && info.password !== info.cpassword

    const notify = (fn, message) => fn(message, {
        position: "top-left",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
        transition: Slide,
    })

    const handleSubmitSignup = async (e) => {
        e.preventDefault()

        if (info.password !== info.cpassword) {
            notify(toast.error, "Your passwords don't match.")
            return
        }
        if (info.password.length < 8) {
            notify(toast.error, "Use at least 8 characters for your password.")
            return
        }

        setLoading(true)
        try {
            const response = await fetch(`${host}/api/user/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name: info.name, email: info.email, password: info.password })
            })
            const json = await response.json()

            if (json.success) {
                localStorage.setItem("token", json.authtoken)
                notify(toast.success, "Account created")
                navigate("/")
            } else {
                notify(toast.error, json.error || "Couldn't create your account. Try again.")
            }
        } catch (err) {
            notify(toast.error, "Couldn't reach the server. Try again.")
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
                .txp-field.txp-field-error { border-color: #E24B4A; }
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

                .txp-strength-seg { transition: background-color 200ms ease; }

                @media (prefers-reduced-motion: reduce) {
                    .txp-field, .txp-eye-btn, .txp-btn-fill, .txp-strength-seg { transition: none; }
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
                            Create an account, start today.
                        </h1>
                        <p className="text-[#B8BDC7] text-[15px] leading-relaxed max-w-sm mb-8">
                            One account is all it takes to start learning, start
                            teaching, or both.
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

                        <h2 className="txp-wordmark text-[#101827] font-semibold text-2xl mb-2">Create your account</h2>
                        <p className="text-[#5B6472] text-sm mb-8">
                            Join TechXpert to start learning or teaching.
                        </p>

                        <form onSubmit={handleSubmitSignup} className="flex flex-col gap-5">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-[#334155] mb-1.5">Name</label>
                                <div className="txp-field flex items-center rounded-lg px-3.5 py-2.5">
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        placeholder="Your full name"
                                        required
                                        onChange={onChange}
                                        value={info.name}
                                    />
                                </div>
                            </div>

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
                                <label htmlFor="password" className="block text-sm font-medium text-[#334155] mb-1.5">Password</label>
                                <div className="txp-field flex items-center rounded-lg px-3.5 py-2.5">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        name="password"
                                        placeholder="At least 8 characters"
                                        required
                                        minLength={8}
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
                                {info.password.length > 0 && (
                                    <div className="mt-2">
                                        <div className="flex gap-1.5 mb-1">
                                            {[0, 1, 2, 3].map((i) => (
                                                <span
                                                    key={i}
                                                    className="txp-strength-seg h-1 flex-1 rounded-full"
                                                    style={{ backgroundColor: i < strength ? strengthColors[strength] : "#E8E4DA" }}
                                                />
                                            ))}
                                        </div>
                                        <p className="txp-mono text-[10px] uppercase" style={{ color: strengthColors[strength] }}>
                                            {strengthLabels[strength]}
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label htmlFor="cpassword" className="block text-sm font-medium text-[#334155] mb-1.5">Confirm password</label>
                                <div className={`txp-field flex items-center rounded-lg px-3.5 py-2.5 ${passwordsMismatch ? "txp-field-error" : ""}`}>
                                    <input
                                        type={showCPassword ? "text" : "password"}
                                        id="cpassword"
                                        name="cpassword"
                                        placeholder="Re-enter your password"
                                        required
                                        onChange={onChange}
                                        value={info.cpassword}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowCPassword((v) => !v)}
                                        className="txp-eye-btn shrink-0"
                                        aria-label={showCPassword ? "Hide password" : "Show password"}
                                    >
                                        {showCPassword ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
                                    </button>
                                </div>
                                {passwordsMismatch && (
                                    <p className="text-xs text-[#E24B4A] mt-1.5">Passwords don't match.</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="txp-btn-fill flex items-center justify-center gap-2 text-[#FFFEFB] font-semibold text-base py-3 rounded-lg mt-2"
                            >
                                {loading && <span className="txp-spinner" />}
                                {loading ? "Creating account" : "Create account"}
                            </button>

                            <p className="text-xs text-[#94918A] text-center">Your password is encrypted.</p>
                        </form>

                        <p className="text-sm text-[#5B6472] text-center mt-8">
                            Already have an account?{" "}
                            <Link to="/signin" className="text-[#A15E13] hover:text-[#101827] font-semibold">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Signup