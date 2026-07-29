import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa"

const columns = [
    {
        heading: "Learn",
        links: [
            { label: "Browse courses", to: "/course" },
            { label: "Your certificates", to: "/certificate" },
            { label: "Your dashboard", to: "/dashboard" },
            { label: "Sign in", to: "/signin" },
        ],
    },
    {
        heading: "Teach",
        links: [
            { label: "Upload a video", to: "/uploadvideo" },
            { label: "Become an instructor", to: "/signin" },
            { label: "Your dashboard", to: "/dashboard" },
        ],
    },
    {
        heading: "Company",
        links: [
            { label: "About us", to: "/about" },
            { label: "Contact", to: "/contact" },
        ],
    },
]

const socials = [
    { label: "Facebook", Icon: FaFacebookF, href: "#" },
    { label: "Twitter", Icon: FaTwitter, href: "#" },
    { label: "Instagram", Icon: FaInstagram, href: "#" },
    { label: "LinkedIn", Icon: FaLinkedinIn, href: "#" },
]

const SealMark = ({ size = 34 }) => (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
        <circle cx="20" cy="20" r="18.5" fill="#FBF0DF" />
        <circle cx="20" cy="20" r="18.5" fill="none" stroke="#C6741B" strokeWidth="1" strokeDasharray="2 3" />
        <text x="20" y="25" textAnchor="middle" fontFamily="'Fraunces', serif" fontWeight="600" fontSize="13" fill="#101827">TX</text>
        <circle cx="31.5" cy="30.5" r="2.1" fill="#C6741B" />
    </svg>
)

const Footer = () => {
    const [certId, setCertId] = useState("")
    const navigate = useNavigate()

    const handleVerify = (e) => {
        e.preventDefault()
        if (certId.trim()) {
            navigate(`/certificate?verify=${encodeURIComponent(certId.trim())}`)
        }
    }

    return (
        <footer style={{ backgroundColor: "#101827", fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="text-[#B8BDC7]">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500&display=swap');

                .txp-wordmark { font-family: 'Fraunces', serif; }
                .txp-mono { font-family: 'IBM Plex Mono', monospace; letter-spacing: 0.06em; }

                .txp-foot-link { transition: color 160ms ease; }
                .txp-foot-link:hover { color: #FBF0DF; }

                .txp-social {
                    width: 34px; height: 34px; border-radius: 50%;
                    border: 1px solid rgba(255, 254, 251, 0.16);
                    display: flex; align-items: center; justify-content: center;
                    color: #B8BDC7;
                    transition: border-color 160ms ease, color 160ms ease, transform 150ms ease;
                }
                .txp-social:hover { border-color: #C6741B; color: #FBF0DF; transform: translateY(-2px); }

                .txp-verify-input {
                    background: rgba(255, 254, 251, 0.06);
                    border: 1px solid rgba(255, 254, 251, 0.16);
                    transition: border-color 160ms ease;
                }
                .txp-verify-input:focus-within { border-color: #C6741B; }
                .txp-verify-input input {
                    background: transparent; border: none; outline: none;
                    color: #FBF7EF; font-size: 13px; width: 100%;
                }
                .txp-verify-input input::placeholder { color: #6B7280; }

                .txp-verify-btn { transition: background-color 160ms ease; }
                .txp-verify-btn:hover { background-color: #A15E13; }

                @media (prefers-reduced-motion: reduce) {
                    .txp-foot-link, .txp-social, .txp-verify-input, .txp-verify-btn { transition: none; }
                }
            `}</style>

            <div className="container max-w-6xl mx-auto px-6 pt-16 pb-12">
                <div className="grid md:grid-cols-[1.3fr_1fr_1fr_1.2fr] gap-12 mb-14">

                    <div>
                        <Link to="/" className="flex items-center gap-3 mb-4">
                            <SealMark />
                            <span className="txp-wordmark text-xl font-semibold text-[#FBF7EF]">TechXpert</span>
                        </Link>
                        <p className="text-sm text-[#8A8F99] leading-relaxed max-w-[240px] mb-6">
                            Anyone can teach it. Anyone can learn it. Every finished course
                            ends in a certificate.
                        </p>
                        <div className="flex gap-2.5">
                            {socials.map(({ label, Icon, href }) => (
                                <a key={label} href={href} aria-label={label} className="txp-social">
                                    <Icon size={13} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {columns.map((col) => (
                        <div key={col.heading}>
                            <h2 className="txp-mono text-[#FBF7EF] text-xs uppercase mb-4">{col.heading}</h2>
                            <nav className="flex flex-col gap-3">
                                {col.links.map((link) => (
                                    <Link key={link.label} to={link.to} className="txp-foot-link text-sm text-[#B8BDC7]">
                                        {link.label}
                                    </Link>
                                ))}
                            </nav>
                        </div>
                    ))}

                    <div>
                        <h2 className="txp-mono text-[#FBF7EF] text-xs uppercase mb-4">Verify a certificate</h2>
                        <p className="text-sm text-[#8A8F99] leading-relaxed mb-4">
                            Enter a certificate number to confirm it was issued by TechXpert.
                        </p>
                        <form onSubmit={handleVerify} className="txp-verify-input flex items-center gap-2 rounded-lg px-3 py-2.5">
                            <input
                                type="text"
                                value={certId}
                                onChange={(e) => setCertId(e.target.value)}
                                placeholder="e.g. TXP-2026-0482"
                                aria-label="Certificate number"
                            />
                            <button
                                type="submit"
                                className="txp-verify-btn txp-mono text-[10px] uppercase shrink-0 bg-[#C6741B] text-[#FFFEFB] rounded-md px-3 py-1.5"
                            >
                                Verify
                            </button>
                        </form>
                    </div>
                </div>

                <div className="pt-8 border-t border-[rgba(255,254,251,0.1)] flex flex-wrap items-center justify-between gap-4">
                    <p className="text-xs text-[#6B7280]">&copy; 2026 TechXpert. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link to="/about" className="txp-foot-link text-xs text-[#6B7280]">Terms</Link>
                        <Link to="/about" className="txp-foot-link text-xs text-[#6B7280]">Privacy</Link>
                        <Link to="/contact" className="txp-foot-link text-xs text-[#6B7280]">Help</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer