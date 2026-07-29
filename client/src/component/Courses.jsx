import React, { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { API_BASE } from '../config'

const SkeletonCard = () => (
    <div className="bg-white border border-[#E8E4DA] rounded-2xl p-4 animate-pulse">
        <div className="h-40 rounded-xl bg-[#F1EDE3] mb-4" />
        <div className="h-3 w-16 rounded bg-[#F1EDE3] mb-3" />
        <div className="h-4 w-3/4 rounded bg-[#F1EDE3] mb-3" />
        <div className="h-3 w-1/2 rounded bg-[#F1EDE3]" />
    </div>
)

const Courses = () => {
    const [playlists, setPlaylists] = useState([])
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [search, setSearch] = useState("")

    const navigate = useNavigate()
    const [searchParams] = useSearchParams()

    const FetchAllPlaylist = async () => {
        setLoading(true)
        setError(false)
        try {
            const response = await fetch(`${API_BASE}/api/video/fetchallplaylist`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            if (!response.ok) {
                throw new Error('Failed to fetch playlists')
            }

            const data = await response.json()
            setPlaylists(data.playlist || [])
            setUsers(data.users || [])
        } catch (err) {
            console.log("some error has occurred")
            setError(true)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        FetchAllPlaylist()
    }, [])

    // Prefill the search box if the person arrived here via ?search= from
    // another page (e.g. the navbar search).
    useEffect(() => {
        const q = searchParams.get("search")
        if (q) setSearch(q)
    }, [searchParams])

    const handleSearch = (e) => {
        e.preventDefault()
        navigate(`/ShowSearchPlaylist?search=${encodeURIComponent(search)}`)
    }

    // Light, immediate filtering of what's already loaded, so people get
    // feedback as they type instead of only on submit.
    const visiblePlaylists = useMemo(() => {
        if (!search.trim()) return playlists
        const q = search.trim().toLowerCase()
        return playlists.filter((p) => p.name?.toLowerCase().includes(q))
    }, [playlists, search])

    return (
        <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="bg-[#FFFEFB] min-h-screen">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

                .txp-wordmark { font-family: 'Fraunces', serif; }
                .txp-mono { font-family: 'IBM Plex Mono', monospace; letter-spacing: 0.06em; }

                .txp-course-card {
                    transition: transform 200ms ease, box-shadow 200ms ease, border-color 200ms ease;
                }
                .txp-course-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 16px 30px -14px rgba(16, 24, 39, 0.16);
                    border-color: #C6741B;
                }
                .txp-course-card img { transition: transform 300ms ease; }
                .txp-course-card:hover img { transform: scale(1.04); }

                .txp-search-bar {
                    background: #FFFEFB;
                    border: 1.5px solid #E8E4DA;
                    transition: border-color 160ms ease;
                }
                .txp-search-bar:focus-within { border-color: #C6741B; }
                .txp-search-bar input { background: transparent; border: none; outline: none; }

                .txp-search-btn { transition: background-color 180ms ease, transform 150ms ease; }
                .txp-search-btn:hover { background-color: #A15E13; transform: translateY(-1px); }

                @keyframes txp-pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.55; }
                }
                .animate-pulse > div { animation: txp-pulse 1.6s ease-in-out infinite; }

                @media (prefers-reduced-motion: reduce) {
                    .txp-course-card, .txp-course-card img, .txp-search-bar, .txp-search-btn { transition: none; }
                    .animate-pulse > div { animation: none; }
                }
            `}</style>

            {/* Header */}
            <section className="border-b border-[#E8E4DA]">
                <div className="container max-w-6xl mx-auto px-6 pt-16 pb-10 md:pt-20 md:pb-12">
                    <span className="txp-mono text-[#A15E13] text-xs uppercase">Catalog</span>
                    <h1 className="txp-wordmark text-[#101827] font-semibold text-3xl sm:text-4xl mt-3 mb-8">
                        Courses for you
                    </h1>

                    <form onSubmit={handleSearch} className="txp-search-bar flex items-center gap-3 rounded-xl px-4 py-3 max-w-xl">
                        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" className="shrink-0 text-[#5B6472]">
                            <circle cx="9" cy="9" r="6.5" stroke="currentColor" strokeWidth="1.6" />
                            <path d="M18 18L14 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                        </svg>
                        <input
                            type="search"
                            id="search"
                            name="search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search courses, e.g. React, Data Structures"
                            className="flex-1 text-[15px] text-[#101827] placeholder:text-[#94918A]"
                        />
                        <button type="submit" className="txp-search-btn bg-[#C6741B] text-[#FFFEFB] text-sm font-semibold rounded-lg px-5 py-2 shrink-0">
                            Search
                        </button>
                    </form>
                </div>
            </section>

            {/* Grid */}
            <section className="container max-w-6xl mx-auto px-6 py-14">
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
                    </div>
                ) : error ? (
                    <div className="text-center py-20">
                        <p className="txp-wordmark text-[#101827] text-xl font-semibold mb-2">Couldn't load courses</p>
                        <p className="text-[#5B6472] text-sm mb-6">Something went wrong reaching the server. Try again.</p>
                        <button
                            onClick={FetchAllPlaylist}
                            className="txp-search-btn bg-[#C6741B] text-[#FFFEFB] text-sm font-semibold rounded-lg px-6 py-2.5"
                        >
                            Retry
                        </button>
                    </div>
                ) : visiblePlaylists.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="txp-wordmark text-[#101827] text-xl font-semibold mb-2">
                            {search ? `No courses match "${search}"` : "No courses yet"}
                        </p>
                        <p className="text-[#5B6472] text-sm mb-6 max-w-sm mx-auto">
                            {search
                                ? "Try a different search term, or browse the full catalog."
                                : "Be the first to teach here — upload a video to start a course."}
                        </p>
                        {search ? (
                            <button
                                onClick={() => setSearch("")}
                                className="text-[#A15E13] hover:text-[#101827] text-sm font-semibold"
                            >
                                Clear search
                            </button>
                        ) : (
                            <Link
                                to="/uploadvideo"
                                className="txp-search-btn inline-flex items-center justify-center bg-[#C6741B] text-[#FFFEFB] text-sm font-semibold rounded-lg px-6 py-2.5"
                            >
                                Upload a video
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {visiblePlaylists.map((playlist, index) => {
                            const lessonCount = playlist.videos?.length || 0
                            const authorName = users[index]?.name || "TechXpert instructor"
                            return (
                                <Link
                                    key={playlist._id}
                                    to={`/courseplaylist/${playlist._id}`}
                                    className="txp-course-card bg-white border border-[#E8E4DA] rounded-2xl p-4 flex flex-col"
                                >
                                    <div className="relative overflow-hidden rounded-xl mb-4 h-40">
                                        <img
                                            className="w-full h-full object-cover object-center"
                                            src={playlist.videos?.[0]?.thumbnail}
                                            alt={playlist.name}
                                        />
                                        <span className="txp-mono absolute bottom-2 right-2 bg-[#101827] text-[#FBF0DF] text-[10px] uppercase px-2 py-1 rounded-md">
                                            {lessonCount} {lessonCount === 1 ? "lesson" : "lessons"}
                                        </span>
                                    </div>
                                    <h2 className="txp-wordmark text-[#101827] font-semibold text-lg mb-3 leading-snug line-clamp-2">
                                        {playlist.name}
                                    </h2>
                                    <div className="mt-auto flex items-center gap-2 pt-3 border-t border-[#F1EDE3]">
                                        <span className="w-7 h-7 rounded-full bg-[#FBF0DF] text-[#A15E13] flex items-center justify-center txp-mono text-[10px] shrink-0">
                                            {authorName.charAt(0).toUpperCase()}
                                        </span>
                                        <span className="text-[#5B6472] text-sm truncate">{authorName}</span>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                )}
            </section>
        </div>
    )
}

export default Courses