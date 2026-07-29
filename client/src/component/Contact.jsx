import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa"
// import { API_BASE } from '../config'

const socials = [
    { label: "Facebook", Icon: FaFacebookF, href: "#" },
    { label: "Twitter", Icon: FaTwitter, href: "#" },
    { label: "Instagram", Icon: FaInstagram, href: "#" },
    { label: "LinkedIn", Icon: FaLinkedinIn, href: "#" },
]

const SealMark = ({ size = 56 }) => (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
        <circle cx="20" cy="20" r="18.5" fill="#FBF0DF" />
        <circle cx="20" cy="20" r="18.5" fill="none" stroke="#C6741B" strokeWidth="1" strokeDasharray="2 3" />
        <text x="20" y="25" textAnchor="middle" fontFamily="'Fraunces', serif" fontWeight="600" fontSize="13" fill="#101827">TX</text>
        <circle cx="31.5" cy="30.5" r="2.1" fill="#C6741B" />
    </svg>
)

const Contact = () => {
    const [info, setInfo] = useState({ name: "", email: "", message: "" })
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)
    const [sent, setSent] = useState(false)

    const onChange = (e) => {
        setInfo({ ...info, [e.target.name]: e.target.value })
        if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: null })
    }

    const validate = () => {
        const next = {}
        if (!info.name.trim()) next.name = "Enter your name."
        if (!/^\S+@\S+\.\S+$/.test(info.email)) next.email = "Enter a valid email."
        if (!info.message.trim()) next.message = "Enter a message."
        setErrors(next)
        return Object.keys(next).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validate()) return

        setLoading(true)
        try {
            // Wire this up to your real endpoint, e.g.:
            // await fetch(`${API_BASE}/api/contact/send`, {
            //     method: "POST",
            //     headers: { "Content-Type": "application/json" },
            //     body: JSON.stringify(info),
            // })
            await new Promise((resolve) => setTimeout(resolve, 700))
            setSent(true)
        } finally {
            setLoading(false)
        }
    }

    const handleSendAnother = () => {
        setInfo({ name: "", email: "", message: "" })
        setSent(false)
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
                .txp-field input, .txp-field textarea {
                    background: transparent; border: none; outline: none;
                    width: 100%; font-size: 15px; color: #101827; resize: none;
                }
                .txp-field input::placeholder, .txp-field textarea::placeholder { color: #B0AC9F; }

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

                .txp-social {
                    width: 34px; height: 34px; border-radius: 50%;
                    border: 1px solid rgba(255, 254, 251, 0.16);
                    display: flex; align-items: center; justify-content: center;
                    color: #B8BDC7;
                    transition: border-color 160ms ease, color 160ms ease, transform 150ms ease;
                }
                .txp-social:hover { border-color: #C6741B; color: #FBF0DF; transform: translateY(-2px); }

                .txp-check {
                    animation: txp-pop 260ms cubic-bezier(.34,1.56,.64,1) both;
                }
                @keyframes txp-pop {
                    from { opacity: 0; transform: scale(0.7); }
                    to { opacity: 1; transform: scale(1); }
                }

                @media (prefers-reduced-motion: reduce) {
                    .txp-field, .txp-btn-fill, .txp-social { transition: none; }
                    .txp-spinner, .txp-check { animation: none; }
                }
            `}</style>

            <div className="grid md:grid-cols-2 min-h-screen">
                {/* Info panel */}
                <div className="hidden md:flex flex-col justify-between bg-[#101827] px-12 lg:px-16 py-14">
                    <Link to="/" className="flex items-center gap-3">
                        <SealMark size={38} />
                        <span className="txp-wordmark text-xl font-semibold text-[#FBF7EF]">TechXpert</span>
                    </Link>

                    <div>
                        <span className="txp-mono text-[#C6741B] text-xs uppercase">Get in touch</span>
                        <h1 className="txp-wordmark text-[#FBF7EF] font-semibold text-3xl lg:text-4xl leading-tight mt-4 mb-4 max-w-sm">
                            Questions, feedback, or something broken?
                        </h1>
                        <p className="text-[#B8BDC7] text-[15px] leading-relaxed max-w-sm mb-8">
                            We read every message ourselves and reply as soon as we can.
                        </p>

                        <div className="flex flex-col gap-4">
                            <div>
                                <p className="txp-mono text-[10px] text-[#6B7280] uppercase mb-1">Email</p>
                                {/* Replace with your real support address */}
                                <a href="mailto:hello@techxpert.com" className="text-[#FBF0DF] text-[15px] font-medium">
                                    hello@techxpert.com
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2.5">
                        {socials.map(({ label, Icon, href }) => (
                            <a key={label} href={href} aria-label={label} className="txp-social">
                                <Icon size={13} />
                            </a>
                        ))}
                    </div>
                </div>

                {/* Form panel */}
                <div className="flex items-center justify-center px-6 py-16">
                    <div className="w-full max-w-sm">
                        <Link to="/" className="flex md:hidden items-center gap-3 mb-10">
                            <SealMark size={34} />
                            <span className="txp-wordmark text-lg font-semibold text-[#101827]">TechXpert</span>
                        </Link>

                        {sent ? (
                            <div className="text-center py-10">
                                <div className="txp-check w-14 h-14 rounded-full bg-[#EAF3DE] flex items-center justify-center mx-auto mb-5">
                                    <svg width="24" height="24" viewBox="0 0 20 20" fill="none">
                                        <path d="M4 10.5L8 14.5L16 5.5" stroke="#3B6D11" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <h2 className="txp-wordmark text-[#101827] font-semibold text-2xl mb-2">Message sent</h2>
                                <p className="text-[#5B6472] text-sm mb-8">
                                    Thanks for reaching out — we'll get back to you soon.
                                </p>
                                <button
                                    onClick={handleSendAnother}
                                    className="text-[#A15E13] hover:text-[#101827] text-sm font-semibold"
                                >
                                    Send another message
                                </button>
                            </div>
                        ) : (
                            <>
                                <h2 className="txp-wordmark text-[#101827] font-semibold text-2xl mb-2">Contact us</h2>
                                <p className="text-[#5B6472] text-sm mb-8">
                                    Fill this in and we'll get back to you by email.
                                </p>

                                <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-[#334155] mb-1.5">Name</label>
                                        <div className={`txp-field rounded-lg px-3.5 py-2.5 ${errors.name ? "txp-field-error" : ""}`}>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                placeholder="Your full name"
                                                onChange={onChange}
                                                value={info.name}
                                            />
                                        </div>
                                        {errors.name && <p className="text-xs text-[#E24B4A] mt-1.5">{errors.name}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-[#334155] mb-1.5">Email</label>
                                        <div className={`txp-field rounded-lg px-3.5 py-2.5 ${errors.email ? "txp-field-error" : ""}`}>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                placeholder="you@example.com"
                                                onChange={onChange}
                                                value={info.email}
                                            />
                                        </div>
                                        {errors.email && <p className="text-xs text-[#E24B4A] mt-1.5">{errors.email}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="message" className="block text-sm font-medium text-[#334155] mb-1.5">Message</label>
                                        <div className={`txp-field rounded-lg px-3.5 py-2.5 ${errors.message ? "txp-field-error" : ""}`}>
                                            <textarea
                                                id="message"
                                                name="message"
                                                rows={5}
                                                placeholder="How can we help?"
                                                onChange={onChange}
                                                value={info.message}
                                            />
                                        </div>
                                        {errors.message && <p className="text-xs text-[#E24B4A] mt-1.5">{errors.message}</p>}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="txp-btn-fill flex items-center justify-center gap-2 text-[#FFFEFB] font-semibold text-base py-3 rounded-lg mt-2"
                                    >
                                        {loading && <span className="txp-spinner" />}
                                        {loading ? "Sending" : "Send message"}
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Contact