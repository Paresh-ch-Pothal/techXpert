// import React, { useState } from 'react'
// import { Link, useNavigate } from 'react-router-dom'
// import { FaUserGraduate } from "react-icons/fa";
// import { media } from '../config/media'

// const navLinks = [
//     { to: "/", label: "Home" },
//     { to: "/course", label: "Courses" },
//     { to: "/contact", label: "Contact" },
//     { to: "/about", label: "About us" },
//     { to: "/certificate", label: "Your certificates" },
// ]

// const Navbar = () => {

//     const [profile, setprofile] = useState(false)
//     let navigate = useNavigate();

//     const handleshowprofile = () => {
//         setprofile(!profile);
//     }

//     const handlesignout = () => {
//         localStorage.removeItem("token");
//         navigate("/signin")
//         window.location.reload();
//     }

//     return (
//         <div style={{ fontFamily: "'Inter', sans-serif" }}>
//             <style>{`
//                 @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@600;700;800&family=Inter:wght@400;500;600&display=swap');
//                 .txp-heading { font-family: 'Manrope', sans-serif; }
//                 .txp-nav-link { position: relative; transition: color 180ms ease; }
//                 .txp-nav-link::after {
//                     content: "";
//                     position: absolute;
//                     left: 0; bottom: -4px;
//                     width: 0; height: 2px;
//                     background: #4F46E5;
//                     transition: width 200ms ease;
//                 }
//                 .txp-nav-link:hover::after { width: 100%; }
//                 .txp-btn-primary { transition: background-color 180ms ease, box-shadow 180ms ease, transform 150ms ease; }
//                 .txp-btn-primary:hover { background-color: #4338CA; box-shadow: 0 8px 20px -6px rgba(79, 70, 229, 0.45); transform: translateY(-1px); }
//                 .txp-avatar { transition: border-color 180ms ease, background-color 180ms ease; }
//                 .txp-avatar:hover { border-color: #4F46E5; background-color: #EEF2FF; }
//             `}</style>

//             <header className="bg-white border-b border-[#E2E8F0] sticky top-0 z-20">
//                 <div className="container mx-auto flex flex-wrap px-6 py-4 flex-col md:flex-row items-center relative">

//                     <Link to="/" className="flex items-center mb-4 md:mb-0">
//                         <span className="w-10 h-10 rounded-xl border border-[#E2E8F0] flex items-center justify-center overflow-hidden bg-[#F8FAFC]">
//                             <img src={media.logoNav} width={26} height={26} alt="" />
//                         </span>
//                         <span className="txp-heading ml-3 text-xl font-extrabold text-[#0F172A] tracking-tight">
//                             TechXpert
//                         </span>
//                     </Link>

//                     <nav className="md:mr-auto md:ml-8 md:pl-8 md:border-l md:border-[#E2E8F0] flex flex-wrap items-center text-[15px] justify-center gap-1">
//                         {navLinks.map((link) => (
//                             <Link
//                                 key={link.to}
//                                 className="txp-nav-link mr-5 last:mr-0 px-1 py-1 text-[#475569] hover:text-[#0F172A] font-medium"
//                                 to={link.to}
//                             >
//                                 {link.label}
//                             </Link>
//                         ))}
//                     </nav>

//                     {!localStorage.getItem("token") ?
//                         <Link
//                             to="/signin"
//                             className="txp-btn-primary inline-flex items-center gap-2 bg-[#4F46E5] text-white border-0 py-2.5 px-5 rounded-lg text-sm font-semibold mt-4 md:mt-0"
//                         >
//                             Sign in
//                             <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-4 h-4" viewBox="0 0 24 24">
//                                 <path d="M5 12h14M12 5l7 7-7 7"></path>
//                             </svg>
//                         </Link>
//                         :
//                         <button
//                             onClick={handleshowprofile}
//                             aria-label="Account menu"
//                             className="txp-avatar absolute right-5 top-4 md:static w-10 h-10 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-[#4F46E5]"
//                         >
//                             <FaUserGraduate size={16} />
//                         </button>
//                     }

//                     <div
//                         className="absolute right-5 top-[4.5rem] md:top-16 bg-white border border-[#E2E8F0] rounded-xl shadow-lg min-w-[170px] py-2 z-30"
//                         style={{ display: profile ? "flex" : "none", flexDirection: "column" }}
//                     >
//                         <Link
//                             className="px-4 py-2.5 text-sm text-[#334155] hover:bg-[#F8FAFC] hover:text-[#4F46E5] font-medium"
//                             to="/dashboard"
//                             onClick={() => setprofile(false)}
//                         >
//                             Dashboard
//                         </Link>
//                         {localStorage.getItem("token") &&
//                             <button
//                                 className="px-4 py-2.5 text-sm text-left text-[#DC2626] hover:bg-[#FEF2F2] font-medium"
//                                 onClick={handlesignout}
//                             >
//                                 Sign out
//                             </button>
//                         }
//                     </div>
//                 </div>
//             </header>
//         </div>
//     )
// }

// export default Navbar


import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { FaSearch, FaBars, FaTimes, FaUserGraduate, FaCertificate } from "react-icons/fa"

const navLinks = [
    { to: "/", label: "Home" },
    { to: "/course", label: "Courses" },
    { to: "/certificate", label: "Certificates" },
    { to: "/about", label: "About us" },
    { to: "/contact", label: "Contact" },
]

// Small circular "seal" mark — doubles as the logo and as the visual language
// echoed later by the amber stamp-dot under nav links. Built as inline SVG so
// there's no dependency on an external logo asset.
const SealMark = ({ size = 38 }) => (
    <svg width={size} height={size} viewBox="0 0 40 40" className="txp-seal" aria-hidden="true">
        <circle cx="20" cy="20" r="18.5" fill="#101827" />
        <circle cx="20" cy="20" r="18.5" fill="none" stroke="#C6741B" strokeWidth="1" strokeDasharray="2 3" />
        <text x="20" y="25" textAnchor="middle" fontFamily="'Fraunces', serif" fontWeight="600" fontSize="15" fill="#FAF6EF">TX</text>
        <circle cx="32" cy="31" r="2.4" fill="#C6741B" />
    </svg>
)

const Navbar = () => {
    const [profileOpen, setProfileOpen] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)
    const [searchOpen, setSearchOpen] = useState(false)
    const [query, setQuery] = useState("")
    const [scrolled, setScrolled] = useState(false)

    const profileRef = useRef(null)
    const searchInputRef = useRef(null)
    const navigate = useNavigate()
    const location = useLocation()
    const isSignedIn = !!localStorage.getItem("token")

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8)
        onScroll()
        window.addEventListener("scroll", onScroll)
        return () => window.removeEventListener("scroll", onScroll)
    }, [])

    useEffect(() => {
        setMobileOpen(false)
        setProfileOpen(false)
        setSearchOpen(false)
    }, [location.pathname])

    useEffect(() => {
        const onClickOutside = (e) => {
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setProfileOpen(false)
            }
        }
        const onKeyDown = (e) => {
            if (e.key === "Escape") {
                setProfileOpen(false)
                setMobileOpen(false)
                setSearchOpen(false)
            }
        }
        document.addEventListener("mousedown", onClickOutside)
        document.addEventListener("keydown", onKeyDown)
        return () => {
            document.removeEventListener("mousedown", onClickOutside)
            document.removeEventListener("keydown", onKeyDown)
        }
    }, [])

    useEffect(() => {
        if (searchOpen && searchInputRef.current) searchInputRef.current.focus()
    }, [searchOpen])

    const handleSignOut = () => {
        localStorage.removeItem("token")
        navigate("/signin")
        window.location.reload()
    }

    const handleSearchSubmit = (e) => {
        e.preventDefault()
        if (query.trim()) {
            navigate(`/course?search=${encodeURIComponent(query.trim())}`)
            setQuery("")
            setSearchOpen(false)
        }
    }

    return (
        <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500&display=swap');

                :root {
                    --txp-ink: #101827;
                    --txp-paper: #FFFEFB;
                    --txp-line: #E8E4DA;
                    --txp-amber: #C6741B;
                    --txp-amber-deep: #A15E13;
                    --txp-slate: #5B6472;
                    --txp-tint: #FBF7EF;
                }

                .txp-wordmark { font-family: 'Fraunces', serif; }
                .txp-mono { font-family: 'IBM Plex Mono', monospace; letter-spacing: 0.08em; }

                .txp-header {
                    background: var(--txp-paper);
                    border-bottom: 1px solid var(--txp-line);
                    transition: box-shadow 220ms ease, border-color 220ms ease;
                }
                .txp-header.is-scrolled {
                    box-shadow: 0 6px 20px -12px rgba(16, 24, 39, 0.18);
                }

                .txp-seal { transition: transform 320ms cubic-bezier(.34,1.56,.64,1); transform-origin: center; }
                .txp-logo-link:hover .txp-seal, .txp-logo-link:focus-visible .txp-seal {
                    transform: rotate(-8deg) scale(1.06);
                }

                .txp-nav-link {
                    position: relative;
                    color: var(--txp-slate);
                    font-weight: 500;
                    font-size: 14.5px;
                    padding: 6px 2px 14px;
                    transition: color 160ms ease;
                }
                .txp-nav-link:hover, .txp-nav-link:focus-visible { color: var(--txp-ink); }
                .txp-nav-link .dot {
                    position: absolute;
                    left: 50%;
                    bottom: 4px;
                    width: 5px;
                    height: 5px;
                    border-radius: 50%;
                    background: var(--txp-amber);
                    transform: translate(-50%, 6px) scale(0);
                    transition: transform 200ms cubic-bezier(.34,1.56,.64,1);
                }
                .txp-nav-link:hover .dot, .txp-nav-link:focus-visible .dot {
                    transform: translate(-50%, 0) scale(1);
                }
                .txp-nav-link.active { color: var(--txp-ink); font-weight: 600; }
                .txp-nav-link.active .dot { transform: translate(-50%, 0) scale(1); }

                .txp-icon-btn {
                    width: 38px; height: 38px;
                    border-radius: 10px;
                    display: flex; align-items: center; justify-content: center;
                    color: var(--txp-slate);
                    border: 1px solid transparent;
                    transition: background-color 160ms ease, border-color 160ms ease, color 160ms ease;
                }
                .txp-icon-btn:hover { background: var(--txp-tint); border-color: var(--txp-line); color: var(--txp-ink); }

                .txp-search-form {
                    display: flex; align-items: center;
                    overflow: hidden;
                    max-width: 0;
                    opacity: 0;
                    transition: max-width 260ms ease, opacity 200ms ease;
                }
                .txp-search-form.open { max-width: 220px; opacity: 1; }
                .txp-search-form input {
                    width: 100%;
                    border: none;
                    background: transparent;
                    padding: 0 4px;
                    font-size: 14px;
                    color: var(--txp-ink);
                }
                .txp-search-form input:focus { outline: none; }

                .txp-btn-outline {
                    border: 1.5px solid var(--txp-ink);
                    color: var(--txp-ink);
                    background: transparent;
                    font-weight: 600;
                    transition: background-color 160ms ease, color 160ms ease;
                }
                .txp-btn-outline:hover { background: var(--txp-ink); color: var(--txp-paper); }

                .txp-btn-fill {
                    background: var(--txp-amber);
                    color: #FFFEFB;
                    font-weight: 600;
                    border: 1.5px solid var(--txp-amber);
                    transition: background-color 160ms ease, border-color 160ms ease, transform 150ms ease;
                }
                .txp-btn-fill:hover { background: var(--txp-amber-deep); border-color: var(--txp-amber-deep); transform: translateY(-1px); }

                .txp-avatar {
                    width: 38px; height: 38px; border-radius: 50%;
                    background: var(--txp-tint);
                    border: 1.5px solid var(--txp-line);
                    display: flex; align-items: center; justify-content: center;
                    color: var(--txp-ink);
                    transition: border-color 160ms ease, transform 150ms ease;
                }
                .txp-avatar:hover { border-color: var(--txp-amber); transform: translateY(-1px); }

                .txp-dropdown {
                    transform-origin: top right;
                    animation: txp-pop 160ms ease both;
                }
                @keyframes txp-pop {
                    from { opacity: 0; transform: scale(0.96) translateY(-4px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }

                .txp-mobile-panel {
                    max-height: 0;
                    overflow: hidden;
                    transition: max-height 320ms ease;
                }
                .txp-mobile-panel.open { max-height: 480px; }

                .txp-burger span {
                    display: block;
                    width: 20px; height: 2px;
                    background: var(--txp-ink);
                    transition: transform 220ms ease, opacity 200ms ease;
                }

                @media (prefers-reduced-motion: reduce) {
                    .txp-header, .txp-seal, .txp-nav-link, .txp-nav-link .dot,
                    .txp-icon-btn, .txp-search-form, .txp-btn-outline, .txp-btn-fill,
                    .txp-avatar, .txp-dropdown, .txp-mobile-panel, .txp-burger span {
                        transition: none !important;
                        animation: none !important;
                    }
                }

                a:focus-visible, button:focus-visible, input:focus-visible {
                    outline: 2px solid var(--txp-amber);
                    outline-offset: 2px;
                }
            `}</style>

            <header className={`txp-header sticky top-0 z-30 ${scrolled ? "is-scrolled" : ""}`}>
                <div className="container mx-auto px-5 md:px-6">
                    <div className="flex items-center justify-between h-16 md:h-[68px]">

                        <Link to="/" className="txp-logo-link flex items-center gap-3 shrink-0">
                            <SealMark />
                            <span className="flex flex-col leading-none">
                                <span className="txp-wordmark text-[19px] font-semibold text-[#101827]">TechXpert</span>
                                <span className="txp-mono hidden sm:block text-[9.5px] text-[#5B6472] mt-1 uppercase">
                                    Learn &middot; Teach &middot; Certify
                                </span>
                            </span>
                        </Link>

                        <nav className="hidden md:flex items-center gap-7 mx-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    className={`txp-nav-link ${location.pathname === link.to ? "active" : ""}`}
                                >
                                    {link.label}
                                    <span className="dot" />
                                </Link>
                            ))}
                            {/* When an instructor route exists, add it here, e.g.:
                            <Link to="/teach" className="txp-nav-link">Teach<span className="dot" /></Link> */}
                        </nav>

                        <div className="flex items-center gap-2 md:gap-3">

                            <form onSubmit={handleSearchSubmit} className={`txp-search-form ${searchOpen ? "open" : ""}`}>
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search courses"
                                    aria-label="Search courses"
                                />
                            </form>
                            <button
                                type="button"
                                onClick={() => setSearchOpen((v) => !v)}
                                className="txp-icon-btn hidden sm:flex"
                                aria-label={searchOpen ? "Close search" : "Search courses"}
                            >
                                {searchOpen ? <FaTimes size={15} /> : <FaSearch size={15} />}
                            </button>

                            {!isSignedIn ? (
                                <div className="hidden md:flex items-center gap-2">
                                    <Link to="/signin" className="txp-btn-outline text-sm px-4 py-2 rounded-lg">
                                        Sign in
                                    </Link>
                                </div>
                            ) : (
                                <div className="hidden md:block relative" ref={profileRef}>
                                    <button
                                        type="button"
                                        onClick={() => setProfileOpen((v) => !v)}
                                        className="txp-avatar"
                                        aria-haspopup="menu"
                                        aria-expanded={profileOpen}
                                        aria-label="Account menu"
                                    >
                                        <FaUserGraduate size={15} />
                                    </button>

                                    {profileOpen && (
                                        <div
                                            role="menu"
                                            className="txp-dropdown absolute right-0 top-[46px] bg-white border border-[#E8E4DA] rounded-xl shadow-lg min-w-[190px] py-2 flex flex-col"
                                        >
                                            <Link
                                                to="/dashboard"
                                                role="menuitem"
                                                onClick={() => setProfileOpen(false)}
                                                className="px-4 py-2.5 text-sm text-[#101827] hover:bg-[#FBF7EF] font-medium"
                                            >
                                                Dashboard
                                            </Link>
                                            <Link
                                                to="/certificate"
                                                role="menuitem"
                                                onClick={() => setProfileOpen(false)}
                                                className="px-4 py-2.5 text-sm text-[#101827] hover:bg-[#FBF7EF] font-medium flex items-center gap-2"
                                            >
                                                <FaCertificate size={13} className="text-[#C6741B]" />
                                                Your certificates
                                            </Link>
                                            <div className="my-1 border-t border-[#E8E4DA]" />
                                            <button
                                                role="menuitem"
                                                onClick={handleSignOut}
                                                className="px-4 py-2.5 text-sm text-left text-[#B4433C] hover:bg-[#FBF0EE] font-medium"
                                            >
                                                Sign out
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            <button
                                type="button"
                                onClick={() => setMobileOpen((v) => !v)}
                                className="txp-icon-btn md:hidden"
                                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                                aria-expanded={mobileOpen}
                            >
                                <div className="txp-burger flex flex-col gap-[5px]">
                                    <span style={mobileOpen ? { transform: "translateY(7px) rotate(45deg)" } : {}} />
                                    <span style={mobileOpen ? { opacity: 0 } : {}} />
                                    <span style={mobileOpen ? { transform: "translateY(-7px) rotate(-45deg)" } : {}} />
                                </div>
                            </button>
                        </div>
                    </div>

                    <div className={`txp-mobile-panel md:hidden ${mobileOpen ? "open" : ""}`}>
                        <div className="pb-5 border-t border-[#E8E4DA] pt-4 flex flex-col gap-1">
                            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 mb-3 bg-[#FBF7EF] border border-[#E8E4DA] rounded-lg px-3 py-2.5">
                                <FaSearch size={13} className="text-[#5B6472]" />
                                <input
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search courses"
                                    aria-label="Search courses"
                                    className="bg-transparent border-none outline-none text-sm flex-1 text-[#101827]"
                                />
                            </form>

                            {navLinks.map((link) => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    className={`px-2 py-3 rounded-lg text-[15px] font-medium ${
                                        location.pathname === link.to
                                            ? "text-[#101827] bg-[#FBF7EF]"
                                            : "text-[#5B6472] hover:bg-[#FBF7EF] hover:text-[#101827]"
                                    }`}
                                >
                                    {link.label}
                                </Link>
                            ))}

                            <div className="mt-3 flex flex-col gap-2">
                                {!isSignedIn ? (
                                    <Link to="/signin" className="txp-btn-fill text-center text-sm px-4 py-3 rounded-lg">
                                        Sign in
                                    </Link>
                                ) : (
                                    <>
                                        <Link to="/dashboard" className="txp-btn-outline text-center text-sm px-4 py-3 rounded-lg">
                                            Dashboard
                                        </Link>
                                        <button onClick={handleSignOut} className="text-center text-sm px-4 py-3 rounded-lg text-[#B4433C] font-semibold border border-[#F0DAD7]">
                                            Sign out
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </div>
    )
}

export default Navbar