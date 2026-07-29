import React, { useEffect, useRef, useState } from 'react'
import ReactPlayer from 'react-player'
import { Link, useParams } from 'react-router-dom'
import { FaPlay, FaLock, FaCertificate } from "react-icons/fa"
import { BiSolidLike, BiSolidDislike } from "react-icons/bi"
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'
import { API_BASE } from '../config'

const SealMark = ({ size = 44 }) => (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
        <circle cx="20" cy="20" r="18.5" fill="#101827" />
        <circle cx="20" cy="20" r="18.5" fill="none" stroke="#C6741B" strokeWidth="1" strokeDasharray="2 3" />
        <text x="20" y="25" textAnchor="middle" fontFamily="'Fraunces', serif" fontWeight="600" fontSize="15" fill="#FAF6EF">TX</text>
        <circle cx="31.5" cy="30.5" r="2.1" fill="#C6741B" />
    </svg>
)

const CoursePlaylist = () => {
    const { id } = useParams()
    const [playlist, setPlaylist] = useState({})
    const [videos, setVideos] = useState([])
    const [user, setUser] = useState({})
    const [loading, setLoading] = useState(true)

    const token = localStorage.getItem("token")
    const videoListRef = useRef(null)

    const fetchPlaylist = async () => {
        setLoading(true)
        try {
            const response = await fetch(`${API_BASE}/api/video/fetchplaylistbyid/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            if (!response.ok) {
                throw new Error('Failed to fetch playlists')
            }

            const data = await response.json()
            setPlaylist(data.playlist || {})
            setVideos(data.videos || [])
            setUser(data.user || {})
        } catch (err) {
            console.log("some error has occurred")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchPlaylist()
    }, [id])

    const [videoStates, setVideoStates] = useState({})
    const handleLikedVideo = async (videoId) => {
        try {
            const response = await fetch(`${API_BASE}/api/video/videolike/${videoId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token
                },
            })
            const json = await response.json()
            if (json.success) {
                setVideoStates((prevStates) => ({
                    ...prevStates,
                    [videoId]: {
                        liked: prevStates[videoId]?.liked === 1 ? 0 : 1,
                        disliked: 0
                    }
                }))
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleDislikedVideo = async (videoId) => {
        try {
            const response = await fetch(`${API_BASE}/api/video/videodislike/${videoId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token
                },
            })
            const json = await response.json()
            if (json.success) {
                setVideoStates((prevStates) => ({
                    ...prevStates,
                    [videoId]: {
                        liked: 0,
                        disliked: prevStates[videoId]?.disliked === 1 ? 0 : 1
                    }
                }))
            }
        } catch (error) {
            console.log(error)
        }
    }

    const [completedVideo, setCompletedVideo] = useState([])

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(`${API_BASE}/api/user/fetchuserbyid`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'auth-token': token
                    },
                })
                const json = await response.json()
                if (json.success) {
                    const initialStatus = {}
                    json.user.likedVideos.forEach((vid) => {
                        initialStatus[vid._id] = { liked: 1, disliked: 0 }
                    })
                    json.user.dislikedVideos.forEach((vid) => {
                        initialStatus[vid._id] = { liked: 0, disliked: 1 }
                    })
                    setVideoStates(initialStatus)
                    setCompletedVideo(json.user.completedVideo.map((vid) => vid._id))
                }
            } catch (error) {
                console.log(error)
            }
        }
        if (token) fetchUser()
    }, [token])

    const handleCompletedVideo = async (videoId) => {
        try {
            const response = await fetch(`${API_BASE}/api/video/completebyuser/${videoId}`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token
                }
            })
            const json = await response.json()
            if (json.success) {
                setCompletedVideo(prev => [...prev, videoId])
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleIncompleteVideo = async (videoId) => {
        try {
            const response = await fetch(`${API_BASE}/api/video/deletecompletebyuser/${videoId}`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token
                }
            })
            const json = await response.json()
            if (json.success) {
                setCompletedVideo(prev => prev.filter((cid) => cid !== videoId))
            }
        } catch (error) {
            console.log(error)
        }
    }

    const completedPlaylistByUser = async () => {
        try {
            await fetch(`${API_BASE}/api/user/completedPLaylistByUser`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    "auth-token": token
                },
            })
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (token) completedPlaylistByUser()
    }, [])

    const totalCount = videos.length
    const completedCount = videos.filter((v) => completedVideo.includes(v._id)).length
    const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0
    const isFinished = totalCount > 0 && completedCount === totalCount

    const progressData = [
        { name: "Completed", value: completedCount || 0.0001 },
        { name: "Remaining", value: totalCount - completedCount },
    ]

    const scrollToVideos = () => {
        videoListRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    }

    if (!token) {
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
                    <h1 className="txp-wordmark text-[#FBF7EF] font-semibold text-2xl mb-2">Sign in to access this course</h1>
                    <p className="text-[#B8BDC7] text-sm mb-7 leading-relaxed">
                        Create a free account or sign in to watch this playlist and track your progress.
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
                @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500&display=swap');

                .txp-wordmark { font-family: 'Fraunces', serif; }
                .txp-mono { font-family: 'IBM Plex Mono', monospace; letter-spacing: 0.06em; }

                .txp-video-row { transition: border-color 180ms ease, box-shadow 180ms ease; }
                .txp-video-row:hover { border-color: #C6741B; box-shadow: 0 10px 24px -16px rgba(16, 24, 39, 0.18); }

                .txp-reaction { transition: color 160ms ease, transform 150ms ease; cursor: pointer; }
                .txp-reaction:hover { transform: translateY(-1px); }

                .txp-check-wrap { position: relative; display: inline-flex; align-items: center; cursor: pointer; }
                .txp-check-wrap input { position: absolute; opacity: 0; width: 20px; height: 20px; margin: 0; cursor: pointer; }
                .txp-check-box {
                    width: 20px; height: 20px; border-radius: 6px;
                    border: 1.5px solid #D8D2C4;
                    display: flex; align-items: center; justify-content: center;
                    transition: background-color 160ms ease, border-color 160ms ease;
                }
                .txp-check-wrap input:checked ~ .txp-check-box {
                    background: #2F6F4E; border-color: #2F6F4E;
                }

                .txp-play-btn { transition: background-color 180ms ease, transform 150ms ease; }
                .txp-play-btn:hover { background-color: #A15E13; transform: translateY(-1px); }

                @media (prefers-reduced-motion: reduce) {
                    .txp-video-row, .txp-reaction, .txp-check-box, .txp-play-btn { transition: none; }
                }
            `}</style>

            <div className="container max-w-6xl mx-auto px-6 py-10 md:py-14">
                <Link to="/course" className="text-sm text-[#5B6472] hover:text-[#101827] font-medium">
                    &larr; Back to courses
                </Link>

                <div className="grid md:grid-cols-[300px_1fr] gap-10 mt-6">
                    {/* Sidebar */}
                    <aside className="md:sticky md:top-24 self-start">
                        <div className="bg-white border border-[#E8E4DA] rounded-2xl p-5">
                            <div className="rounded-xl overflow-hidden mb-4 h-40 bg-[#FBF7EF]">
                                {videos[0]?.thumbnail ? (
                                    <img src={videos[0].thumbnail} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <SealMark size={40} />
                                    </div>
                                )}
                            </div>

                            <h1 className="txp-wordmark text-[#101827] font-semibold text-xl mb-2 leading-snug">
                                {playlist.name || "Untitled course"}
                            </h1>
                            <p className="text-[#5B6472] text-sm mb-1">By {user?.name || "TechXpert instructor"}</p>
                            <p className="text-[#94918A] text-xs mb-5">
                                {totalCount} {totalCount === 1 ? "video" : "videos"}
                                {playlist.createdAt && ` \u00b7 Updated ${new Date(playlist.createdAt).toLocaleDateString()}`}
                            </p>

                            <div className="flex items-center gap-4 mb-5">
                                <div className="relative w-16 h-16 shrink-0">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={progressData}
                                                dataKey="value"
                                                innerRadius={22}
                                                outerRadius={30}
                                                startAngle={90}
                                                endAngle={-270}
                                                stroke="none"
                                            >
                                                <Cell fill="#C6741B" />
                                                <Cell fill="#EAE5D8" />
                                            </Pie>
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <span className="absolute inset-0 flex items-center justify-center txp-mono text-[11px] text-[#101827]">
                                        {percent}%
                                    </span>
                                </div>
                                <div>
                                    <p className="text-[#101827] text-sm font-semibold">{completedCount} of {totalCount} done</p>
                                    <p className="text-[#94918A] text-xs">
                                        {isFinished ? "Course complete" : "Keep going"}
                                    </p>
                                </div>
                            </div>

                            {isFinished ? (
                                <Link
                                    to="/certificate"
                                    className="flex items-center justify-center gap-2 bg-[#EAF3DE] text-[#3B6D11] text-sm font-semibold py-2.5 rounded-lg mb-3"
                                >
                                    <FaCertificate size={13} />
                                    Get your certificate
                                </Link>
                            ) : null}

                            <button
                                onClick={scrollToVideos}
                                className="txp-play-btn w-full flex items-center justify-center gap-2 bg-[#C6741B] text-[#FFFEFB] font-semibold py-3 rounded-lg text-[15px]"
                            >
                                <FaPlay size={13} />
                                Play the playlist
                            </button>
                        </div>
                    </aside>

                    {/* Video list */}
                    <div ref={videoListRef} className="flex flex-col gap-4">
                        {loading ? (
                            Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="h-28 rounded-xl bg-[#FBF7EF] border border-[#E8E4DA] animate-pulse" />
                            ))
                        ) : videos.length === 0 ? (
                            <div className="text-center py-16">
                                <p className="txp-wordmark text-[#101827] text-lg font-semibold mb-1">No videos in this course yet</p>
                                <p className="text-[#5B6472] text-sm">Check back soon.</p>
                            </div>
                        ) : (
                            videos.map((video, i) => {
                                const isComplete = completedVideo.includes(video._id)
                                const reaction = videoStates[video._id]
                                return (
                                    <div key={video._id} className="txp-video-row bg-white border border-[#E8E4DA] rounded-xl p-4 flex flex-col sm:flex-row gap-4">
                                        <div className="w-full sm:w-40 shrink-0 rounded-lg overflow-hidden">
                                            <ReactPlayer
                                                controls={true}
                                                playing={false}
                                                url={video.url}
                                                width="100%"
                                                height="90px"
                                                light={
                                                    <img src={video.thumbnail} alt="" style={{ width: "100%", height: "90px", objectFit: "cover" }} />
                                                }
                                            />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <p className="txp-mono text-[10px] text-[#A15E13] uppercase mb-1">Lesson {i + 1}</p>
                                            <h2 className="txp-wordmark text-[#101827] font-semibold text-base leading-snug mb-1 truncate">
                                                {video.title}
                                            </h2>
                                            <p className="text-[#94918A] text-xs">
                                                {user?.name} &middot; {new Date(video.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>

                                        <div className="flex sm:flex-col items-center justify-between sm:justify-center gap-3 sm:gap-3 shrink-0">
                                            <div className="flex items-center gap-3">
                                                <BiSolidLike
                                                    onClick={() => handleLikedVideo(video._id)}
                                                    className="txp-reaction"
                                                    color={reaction?.liked === 1 ? "#C6741B" : "#B0AC9F"}
                                                    size={19}
                                                />
                                                <BiSolidDislike
                                                    onClick={() => handleDislikedVideo(video._id)}
                                                    className="txp-reaction"
                                                    color={reaction?.disliked === 1 ? "#5B6472" : "#B0AC9F"}
                                                    size={19}
                                                />
                                            </div>
                                            <label className="txp-check-wrap" aria-label={isComplete ? "Mark as incomplete" : "Mark as complete"}>
                                                <input
                                                    type="checkbox"
                                                    checked={isComplete}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            handleCompletedVideo(video._id)
                                                        } else {
                                                            handleIncompleteVideo(video._id)
                                                        }
                                                    }}
                                                />
                                                <span className="txp-check-box">
                                                    {isComplete && (
                                                        <svg width="12" height="12" viewBox="0 0 20 20" fill="none">
                                                            <path d="M4 10.5L8 14.5L16 5.5" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                    )}
                                                </span>
                                            </label>
                                        </div>
                                    </div>
                                )
                            })
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CoursePlaylist