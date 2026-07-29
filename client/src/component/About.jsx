import React from 'react'
import { Link } from 'react-router-dom'

// Replace with your real founding story — this is placeholder copy.
const STORY_PARAGRAPHS = [
    "TechXpert started from a simple frustration: teaching online took too much overhead, and proving you'd actually learned something took too little. Course platforms made instructors act like video editors and made learners collect certificates that nobody could verify.",
    "So we built a platform that automates the parts that don't need a human — processing a video into a structured course, issuing and verifying a certificate — so the parts that do need a human, the teaching and the learning, can stay the focus.",
]

const charter = [
    {
        num: "I",
        title: "Anyone who can teach, can teach",
        text: "No studio, no editing suite, no application process. Upload a video and it becomes a course.",
    },
    {
        num: "II",
        title: "A course isn't finished until it's provable",
        text: "Every completed course ends in a certificate, issued and verified automatically — not promised, not delayed.",
    },
    {
        num: "III",
        title: "Automation should remove busywork, not people",
        text: "TechXpert handles structuring, hosting and grading. What's taught, and how well, is still entirely up to the instructor.",
    },
    {
        num: "IV",
        title: "Learning shouldn't wait on office hours",
        text: "Every course is self-paced and open. Progress is saved automatically, whenever you show up.",
    },
]

const values = [
    {
        title: "Built for creators",
        text: "If you can record a video, you can run a course here. We handle the rest.",
    },
    {
        title: "Verified by design",
        text: "Certificates carry a serial number that can be checked from the footer of every page, by anyone.",
    },
    {
        title: "Open by default",
        text: "No application to teach, no waitlist to learn. The classroom is open.",
    },
]

// Placeholder team — swap in real names, roles and short bios.
const team = [
    { initials: "?", name: "Your name here", role: "Founder" },
    { initials: "?", name: "Your name here", role: "Engineering" },
    { initials: "?", name: "Your name here", role: "Education lead" },
]

const SealMark = ({ size = 56 }) => (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
        <circle cx="20" cy="20" r="18.5" fill="#101827" />
        <circle cx="20" cy="20" r="18.5" fill="none" stroke="#C6741B" strokeWidth="1" strokeDasharray="2 3" />
        <text x="20" y="25" textAnchor="middle" fontFamily="'Fraunces', serif" fontWeight="600" fontSize="13" fill="#FAF6EF">TX</text>
        <circle cx="31.5" cy="30.5" r="2.1" fill="#C6741B" />
    </svg>
)

const About = () => {
    return (
        <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="bg-[#FFFEFB]">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500&display=swap');

                .txp-wordmark { font-family: 'Fraunces', serif; }
                .txp-mono { font-family: 'IBM Plex Mono', monospace; letter-spacing: 0.06em; }

                .txp-card {
                    transition: transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease;
                }
                .txp-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 16px 32px -14px rgba(16, 24, 39, 0.16);
                    border-color: #C6741B;
                }

                .txp-btn-fill {
                    background: #C6741B;
                    border: 1.5px solid #C6741B;
                    transition: background-color 180ms ease, transform 150ms ease;
                }
                .txp-btn-fill:hover { background: #A15E13; border-color: #A15E13; transform: translateY(-1px); }

                .txp-btn-outline {
                    border: 1.5px solid #101827;
                    transition: background-color 180ms ease, color 180ms ease;
                }
                .txp-btn-outline:hover { background: #101827; color: #FFFEFB; }

                .txp-btn-outline-light {
                    border: 1.5px solid rgba(255, 254, 251, 0.35);
                    transition: background-color 180ms ease, border-color 180ms ease;
                }
                .txp-btn-outline-light:hover { background: rgba(255, 254, 251, 0.08); border-color: rgba(255, 254, 251, 0.7); }

                @media (prefers-reduced-motion: reduce) {
                    .txp-card, .txp-btn-fill, .txp-btn-outline, .txp-btn-outline-light { transition: none; }
                }
            `}</style>

            {/* Hero */}
            <section className="relative overflow-hidden border-b border-[#E8E4DA]">
                <div
                    aria-hidden="true"
                    className="absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full opacity-60"
                    style={{ background: "radial-gradient(circle, #FBF0DF 0%, rgba(251,240,223,0) 70%)" }}
                />
                <div className="relative container max-w-4xl mx-auto px-6 pt-20 pb-16 md:pt-28 md:pb-20 text-center">
                    <div className="flex justify-center mb-6">
                        <SealMark size={48} />
                    </div>
                    <span className="txp-mono text-[#A15E13] text-xs uppercase">About TechXpert</span>
                    <h1 className="txp-wordmark text-[#101827] font-semibold text-4xl sm:text-5xl leading-[1.15] mt-4 mb-6">
                        We think a finished course should mean something.
                    </h1>
                    <p className="text-[#5B6472] text-lg leading-relaxed max-w-2xl mx-auto">
                        TechXpert is a two-sided classroom — anyone can teach by
                        uploading a video, anyone can learn from it, and every
                        completed course ends in a certificate that's issued and
                        verified automatically.
                    </p>
                </div>
            </section>

            {/* Charter */}
            <section className="container max-w-5xl mx-auto px-6 py-20 md:py-24">
                <div className="max-w-xl mb-12">
                    <span className="txp-mono text-[#A15E13] text-xs uppercase">Our charter</span>
                    <h2 className="txp-wordmark text-[#101827] font-semibold text-3xl sm:text-4xl mt-3">
                        Four things we believe
                    </h2>
                </div>

                <div className="relative bg-[#FFFEFB] border border-[#E8E4DA] rounded-2xl p-2" style={{ boxShadow: "0 24px 50px -24px rgba(16, 24, 39, 0.2)" }}>
                    <div className="relative border border-dashed border-[#EAD3AE] rounded-xl px-6 py-10 sm:px-12 sm:py-12">
                        <div className="grid sm:grid-cols-2 gap-x-12 gap-y-10">
                            {charter.map((article) => (
                                <div key={article.num}>
                                    <span className="txp-wordmark text-[#C6741B] text-3xl font-semibold">{article.num}</span>
                                    <h3 className="txp-wordmark text-[#101827] font-semibold text-lg mt-2 mb-2">
                                        {article.title}
                                    </h3>
                                    <p className="text-[#5B6472] text-[15px] leading-relaxed">{article.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Story */}
            <section className="bg-[#FBF7EF] border-y border-[#E8E4DA]">
                <div className="container max-w-3xl mx-auto px-6 py-20 md:py-24">
                    <span className="txp-mono text-[#A15E13] text-xs uppercase">How it started</span>
                    <h2 className="txp-wordmark text-[#101827] font-semibold text-3xl sm:text-4xl mt-3 mb-8">
                        Why we built it this way
                    </h2>
                    <div className="flex flex-col gap-5">
                        {STORY_PARAGRAPHS.map((p, i) => (
                            <p key={i} className="text-[#334155] text-[17px] leading-relaxed">{p}</p>
                        ))}
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="container max-w-6xl mx-auto px-6 py-20 md:py-24">
                <div className="max-w-2xl mb-12">
                    <span className="txp-mono text-[#A15E13] text-xs uppercase">What that looks like</span>
                    <h2 className="txp-wordmark text-[#101827] font-semibold text-3xl sm:text-4xl mt-3">
                        Principles into practice
                    </h2>
                </div>
                <div className="grid sm:grid-cols-3 gap-6">
                    {values.map((v) => (
                        <div key={v.title} className="txp-card bg-white border border-[#E8E4DA] rounded-2xl p-6">
                            <h3 className="txp-wordmark text-[#101827] font-semibold text-lg mb-2">{v.title}</h3>
                            <p className="text-[#5B6472] text-[15px] leading-relaxed">{v.text}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Team — placeholder, replace with real people */}
            <section className="bg-[#FBF7EF] border-y border-[#E8E4DA]">
                <div className="container max-w-6xl mx-auto px-6 py-20 md:py-24">
                    <div className="max-w-2xl mb-12">
                        <span className="txp-mono text-[#A15E13] text-xs uppercase">The team</span>
                        <h2 className="txp-wordmark text-[#101827] font-semibold text-3xl sm:text-4xl mt-3 mb-4">
                            Built by a small, focused team
                        </h2>
                        <p className="text-[#5B6472] text-base leading-relaxed">
                            Add your own bios here — this section is a placeholder.
                        </p>
                    </div>
                    <div className="grid sm:grid-cols-3 gap-6">
                        {team.map((member, i) => (
                            <div key={i} className="txp-card bg-white border border-[#E8E4DA] rounded-2xl p-6 text-center">
                                <div className="w-16 h-16 rounded-full bg-[#FBF0DF] text-[#A15E13] flex items-center justify-center txp-wordmark text-xl font-semibold mx-auto mb-4">
                                    {member.initials}
                                </div>
                                <p className="txp-wordmark text-[#101827] font-semibold">{member.name}</p>
                                <p className="text-[#94918A] text-sm txp-mono uppercase mt-1">{member.role}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA banner */}
            <section className="bg-[#101827]">
                <div className="container max-w-6xl mx-auto px-6 py-16 md:py-20 text-center">
                    <h2 className="txp-wordmark text-[#FFFEFB] font-semibold text-3xl sm:text-4xl mb-4">
                        Come teach, or come learn
                    </h2>
                    <p className="text-[#B8BDC7] text-base mb-9 max-w-xl mx-auto">
                        There's no waitlist and no application. Just a video to upload,
                        or a course to start.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <Link
                            to="/course"
                            className="txp-btn-fill inline-flex items-center justify-center text-[#FFFEFB] py-3.5 px-10 rounded-lg text-base font-semibold"
                        >
                            Start learning
                        </Link>
                        <Link
                            to="/uploadvideo"
                            className="txp-btn-outline-light inline-flex items-center justify-center text-[#FFFEFB] py-3.5 px-10 rounded-lg text-base font-semibold"
                        >
                            Start teaching
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default About