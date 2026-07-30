
// import React, { useEffect, useState } from 'react'
// import { Link } from 'react-router-dom'
// import { MdDelete } from "react-icons/md"
// import { FaCertificate } from "react-icons/fa"
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
// import ProgressBar from "@ramonak/react-progress-bar"
// import { API_BASE } from '../config'

// const DashBoard = () => {
//     const token = localStorage.getItem('token')

//     const [playlists, setPlaylists] = useState([])
//     const [loadingUploads, setLoadingUploads] = useState(true)
//     const [deleteTarget, setDeleteTarget] = useState(null)
//     const [deleting, setDeleting] = useState(false)

//     const populatevideos = async () => {
//         setLoadingUploads(true)
//         try {
//             const response = await fetch(`${API_BASE}/api/video/fetchplaylistuser`, {
//                 method: 'GET',
//                 headers: {
//                     'auth-token': token,
//                     'Content-Type': 'application/json',
//                 },
//             })

//             if (!response.ok) {
//                 throw new Error('Failed to fetch playlists')
//             }

//             const data = await response.json()
//             setPlaylists(data)
//         } catch (err) {
//             console.log("some error has occurred")
//         } finally {
//             setLoadingUploads(false)
//         }
//     }

//     const handleDeletePlaylist = async (id) => {
//         setDeleting(true)
//         try {
//             const response = await fetch(`${API_BASE}/api/video/deleteplaylist/${id}`, {
//                 method: 'DELETE',
//                 headers: {
//                     'auth-token': token,
//                     'Content-Type': 'application/json',
//                 },
//             })
//             if (!response.ok) {
//                 throw new Error('Failed to delete playlist')
//             }
//             setPlaylists((prev) => prev.filter((p) => p._id !== id))
//         } catch (error) {
//             console.log("some error has occurred")
//         } finally {
//             setDeleting(false)
//             setDeleteTarget(null)
//         }
//     }

//     useEffect(() => {
//         populatevideos()
//     }, [])

//     const [seenplaylist, setseenplaylist] = useState([])
//     const FetchAllPlaylistSeenByUser = async () => {
//         try {
//             const response = await fetch(`${API_BASE}/api/video/userplaylist`, {
//                 method: 'GET',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'auth-token': token,
//                 },
//             })

//             if (!response.ok) {
//                 throw new Error('Failed to fetch playlists')
//             }

//             const json = await response.json()
//             setseenplaylist(json.uniqueUserSeenPlaylist)
//         } catch (err) {
//             console.log("some error has occurred")
//         }
//     }

//     const [percent, setpercent] = useState([])

//     useEffect(() => {
//         FetchAllPlaylistSeenByUser()
//     }, [token])

//     const PercentVideoOfUSer = async (playlistId) => {
//         try {
//             const response = await fetch(`${API_BASE}/api/video/countvideos/${playlistId}`, {
//                 method: 'GET',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'auth-token': token,
//                 },
//             })
//             const json = await response.json()
//             const noofvideos = json.NoOfVideos
//             const countVideosUser = json.countVideosOfUser
//             const playlistname = json.playlistname.name
//             const percentage = (countVideosUser / noofvideos) * 100
//             return { playlistId, percentage, playlistname }
//         } catch (error) {
//             console.log(error)
//         }
//     }

//     useEffect(() => {
//         FetchAllPlaylistSeenByUser()
//         seenplaylist.forEach(async (playlistId) => {
//             const result = await PercentVideoOfUSer(playlistId)
//             if (result) setpercent(prevPercent => [...prevPercent, result])
//         })
//     }, [])

//     useEffect(() => {
//         const fetchpercentages = async () => {
//             const percentageData = await Promise.all(
//                 seenplaylist.map((playlistId) => PercentVideoOfUSer(playlistId))
//             )
//             setpercent(percentageData.filter(Boolean))
//         }
//         if (seenplaylist.length > 0) {
//             fetchpercentages()
//         }
//     }, [seenplaylist])

//     const completedPlaylistByUser = async () => {
//         try {
//             await fetch(`${API_BASE}/api/user/completedPLaylistByUser`, {
//                 method: 'GET',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     "auth-token": token
//                 },
//             })
//         } catch (error) {
//             console.log(error)
//         }
//     }

//     useEffect(() => {
//         completedPlaylistByUser()
//     }, [])

//     // Real progress data, chart-friendly: one bar per playlist the person
//     // has actually started, rounded for display.
//     const chartData = percent
//         .filter(Boolean)
//         .map((p) => ({ name: p.playlistname, complete: Math.round(p.percentage) }))

//     return (
//         <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="min-h-screen bg-[#FFFEFB]">
//             <style>{`
//                 @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500&display=swap');

//                 .txp-wordmark { font-family: 'Fraunces', serif; }
//                 .txp-mono { font-family: 'IBM Plex Mono', monospace; letter-spacing: 0.06em; }

//                 .txp-card { transition: transform 200ms ease, box-shadow 200ms ease, border-color 200ms ease; }
//                 .txp-card:hover { transform: translateY(-4px); box-shadow: 0 16px 30px -14px rgba(16, 24, 39, 0.16); border-color: #C6741B; }

//                 .txp-delete-btn { color: #B0AC9F; transition: color 160ms ease, background-color 160ms ease; }
//                 .txp-delete-btn:hover { color: #A83A34; background-color: #FBECEA; }

//                 .txp-btn-fill { background: #C6741B; border: 1.5px solid #C6741B; transition: background-color 180ms ease, transform 150ms ease; }
//                 .txp-btn-fill:hover:not(:disabled) { background: #A15E13; border-color: #A15E13; transform: translateY(-1px); }
//                 .txp-btn-fill:disabled { opacity: 0.65; cursor: not-allowed; }

//                 .txp-btn-outline { border: 1.5px solid #101827; color: #101827; transition: background-color 180ms ease, color 180ms ease; }
//                 .txp-btn-outline:hover { background: #101827; color: #FFFEFB; }

//                 .txp-modal-backdrop {
//                     position: fixed; inset: 0; z-index: 50;
//                     background: rgba(16, 24, 39, 0.55);
//                     display: flex; align-items: center; justify-content: center;
//                     animation: txp-fade 200ms ease both;
//                 }
//                 @keyframes txp-fade { from { opacity: 0; } to { opacity: 1; } }
//                 .txp-modal-card {
//                     background: #FFFEFB; border-radius: 16px;
//                     padding: 32px; max-width: 340px; width: 90%;
//                     animation: txp-pop 220ms cubic-bezier(.34,1.56,.64,1) both;
//                 }
//                 @keyframes txp-pop { from { opacity: 0; transform: scale(0.94); } to { opacity: 1; transform: scale(1); } }

//                 @media (prefers-reduced-motion: reduce) {
//                     .txp-card, .txp-delete-btn, .txp-btn-fill, .txp-btn-outline { transition: none; }
//                     .txp-modal-backdrop, .txp-modal-card { animation: none; }
//                 }
//             `}</style>

//             <div className="container max-w-6xl mx-auto px-6 py-12 md:py-16">
//                 <span className="txp-mono text-[#A15E13] text-xs uppercase">Your space</span>
//                 <h1 className="txp-wordmark text-[#101827] font-semibold text-3xl sm:text-4xl mt-3 mb-10">
//                     Dashboard
//                 </h1>

//                 {/* Progress overview */}
//                 <div className="grid lg:grid-cols-[1fr_1.2fr] gap-6 mb-14">
//                     <div className="bg-white border border-[#E8E4DA] rounded-2xl p-6">
//                         <h2 className="txp-wordmark text-[#101827] font-semibold text-lg mb-5">Courses in progress</h2>

//                         {percent.length > 0 ? (
//                             <div className="flex flex-col gap-5">
//                                 {percent.filter(Boolean).map((val, index) => (
//                                     <div key={index}>
//                                         <div className="flex items-center justify-between mb-1.5">
//                                             <span className="text-[#334155] text-sm font-medium truncate pr-2">{val.playlistname}</span>
//                                             <span className="txp-mono text-[11px] text-[#A15E13] shrink-0">{val.percentage.toFixed(0)}%</span>
//                                         </div>
//                                         <ProgressBar
//                                             width="100%"
//                                             height="8px"
//                                             completed={Number(val.percentage.toFixed(1))}
//                                             bgColor="#C6741B"
//                                             baseBgColor="#F1EDE3"
//                                             isLabelVisible={false}
//                                             borderRadius="6px"
//                                         />
//                                     </div>
//                                 ))}
//                             </div>
//                         ) : (
//                             <div className="text-center py-8">
//                                 <p className="text-[#5B6472] text-sm mb-4">You haven't started a course yet.</p>
//                                 <Link to="/course" className="text-[#A15E13] hover:text-[#101827] text-sm font-semibold">
//                                     Browse courses
//                                 </Link>
//                             </div>
//                         )}
//                     </div>

//                     <div className="bg-white border border-[#E8E4DA] rounded-2xl p-6">
//                         <h2 className="txp-wordmark text-[#101827] font-semibold text-lg mb-5">Completion by course</h2>
//                         {chartData.length > 0 ? (
//                             <ResponsiveContainer width="100%" height={220}>
//                                 <BarChart data={chartData} margin={{ top: 4, right: 8, left: -20, bottom: 4 }}>
//                                     <CartesianGrid strokeDasharray="3 3" stroke="#E8E4DA" vertical={false} />
//                                     <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#94918A" }} interval={0} angle={-15} textAnchor="end" height={50} />
//                                     <YAxis tick={{ fontSize: 11, fill: "#94918A" }} domain={[0, 100]} />
//                                     <Tooltip
//                                         formatter={(value) => [`${value}%`, "Complete"]}
//                                         contentStyle={{ borderRadius: 8, border: "1px solid #E8E4DA", fontSize: 13 }}
//                                     />
//                                     <Bar dataKey="complete" fill="#C6741B" radius={[4, 4, 0, 0]} />
//                                 </BarChart>
//                             </ResponsiveContainer>
//                         ) : (
//                             <div className="h-[220px] flex items-center justify-center text-center px-4">
//                                 <p className="text-[#94918A] text-sm">Your progress chart will appear here once you start a course.</p>
//                             </div>
//                         )}
//                     </div>
//                 </div>

//                 {/* Uploaded playlists */}
//                 <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
//                     <h2 className="txp-wordmark text-[#101827] font-semibold text-2xl">Your uploaded courses</h2>
//                     <span className="txp-mono text-[10px] uppercase text-[#A15E13] bg-[#FBF0DF] border border-[#EAD3AE] rounded-full px-3 py-1">
//                         Qualifying test — coming soon
//                     </span>
//                 </div>
//                 <p className="text-[#5B6472] text-sm mb-8 max-w-xl">
//                     Uploading will soon require passing a short qualifying test first.
//                     That's not built yet — for now this is just here so you know
//                     what's coming.
//                 </p>

//                 {loadingUploads ? (
//                     <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
//                         {Array.from({ length: 4 }).map((_, i) => (
//                             <div key={i} className="h-72 rounded-2xl bg-[#FBF7EF] border border-[#E8E4DA] animate-pulse" />
//                         ))}
//                     </div>
//                 ) : playlists.length === 0 ? (
//                     <div className="bg-[#FBF7EF] border border-[#E8E4DA] rounded-2xl p-10 text-center max-w-lg">
//                         <FaCertificate size={22} className="text-[#C6741B] mx-auto mb-4" />
//                         <p className="txp-wordmark text-[#101827] font-semibold text-lg mb-2">
//                             You haven't uploaded a course yet
//                         </p>
//                         <p className="text-[#5B6472] text-sm">
//                             <StartCreator/>
//                         </p>
//                     </div>
//                 ) : (
//                     <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
//                         {playlists.map((playlist) => (
//                             <div key={playlist._id} className="txp-card bg-white border border-[#E8E4DA] rounded-2xl p-4 flex flex-col">
//                                 <div className="rounded-xl overflow-hidden h-36 mb-4">
//                                     <img
//                                         className="w-full h-full object-cover object-center"
//                                         src={playlist.videos?.[0]?.thumbnail}
//                                         alt={playlist.name}
//                                     />
//                                 </div>
//                                 <h3 className="txp-wordmark text-[#101827] font-semibold text-base mb-3 leading-snug line-clamp-2">
//                                     {playlist.name}
//                                 </h3>
//                                 <div className="mt-auto flex items-center justify-between pt-3 border-t border-[#F1EDE3]">
//                                     <Link to={`/playlist/${playlist._id}`} className="text-[#A15E13] hover:text-[#101827] text-sm font-semibold">
//                                         View playlist
//                                     </Link>
//                                     <button
//                                         onClick={() => setDeleteTarget(playlist)}
//                                         aria-label="Delete playlist"
//                                         className="txp-delete-btn w-8 h-8 rounded-lg flex items-center justify-center"
//                                     >
//                                         <MdDelete size={17} />
//                                     </button>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 )}
//             </div>

//             {/* Delete confirmation */}
//             {deleteTarget && (
//                 <div className="txp-modal-backdrop" onClick={() => !deleting && setDeleteTarget(null)}>
//                     <div className="txp-modal-card" onClick={(e) => e.stopPropagation()}>
//                         <h3 className="txp-wordmark text-[#101827] font-semibold text-lg mb-2">Delete this course?</h3>
//                         <p className="text-[#5B6472] text-sm mb-6">
//                             "{deleteTarget.name}" will be permanently removed. This can't be undone.
//                         </p>
//                         <div className="flex gap-3">
//                             <button
//                                 onClick={() => setDeleteTarget(null)}
//                                 disabled={deleting}
//                                 className="txp-btn-outline flex-1 text-sm font-semibold py-2.5 rounded-lg"
//                             >
//                                 Cancel
//                             </button>
//                             <button
//                                 onClick={() => handleDeletePlaylist(deleteTarget._id)}
//                                 disabled={deleting}
//                                 className="flex-1 text-sm font-semibold py-2.5 rounded-lg text-white bg-[#A83A34] hover:bg-[#8E2F2A] transition-colors disabled:opacity-65"
//                             >
//                                 {deleting ? "Deleting..." : "Delete"}
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>

//         // Future dashboard ideas noted from the original: recent uploads,
//         // recent videos watched, daily/weekly/monthly activity breakdown.
//     )
// }

// export default DashBoard

import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MdDelete } from "react-icons/md"
import { FaCertificate } from "react-icons/fa"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import ProgressBar from "@ramonak/react-progress-bar"
import { API_BASE } from '../config'

const DashBoard = () => {
    const token = localStorage.getItem('token')
    const navigate = useNavigate()

    const [playlists, setPlaylists] = useState([])
    const [loadingUploads, setLoadingUploads] = useState(true)
    const [deleteTarget, setDeleteTarget] = useState(null)
    const [deleting, setDeleting] = useState(false)

    // Start uploading playlist flow: user opens the modal, types the
    // playlist/course name, then the "Start creator" button appears and
    // kicks off the creator verification test for that name.
    const [showUploadModal, setShowUploadModal] = useState(false)
    const [playlistNameInput, setPlaylistNameInput] = useState('')
    const [startingTest, setStartingTest] = useState(false)

    const closeUploadModal = () => {
        if (startingTest) return
        setShowUploadModal(false)
        setPlaylistNameInput('')
    }

    const handleStartCreatorTest = async () => {
        if (!playlistNameInput.trim()) return
        setStartingTest(true)
        try {
            const response = await fetch(`${API_BASE}/api/assessment/start-test`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token,
                },
                body: JSON.stringify({
                    topic: playlistNameInput.trim(),
                    test_type: 'creator_verification',
                }),
            })
            const data = await response.json()
            if (!response.ok) {
                throw new Error(data?.error || 'Could not start the test.')
            }
            navigate(`/test/${data.assessmentId}`, {
                state: {
                    questions: data.questions,
                    testType: 'creator_verification',
                    topic: playlistNameInput.trim(),
                },
            })
        } catch (err) {
            alert(err.message || 'Could not start the test.')
        } finally {
            setStartingTest(false)
        }
    }

    const populatevideos = async () => {
        setLoadingUploads(true)
        try {
            const response = await fetch(`${API_BASE}/api/video/fetchplaylistuser`, {
                method: 'GET',
                headers: {
                    'auth-token': token,
                    'Content-Type': 'application/json',
                },
            })

            if (!response.ok) {
                throw new Error('Failed to fetch playlists')
            }

            const data = await response.json()
            setPlaylists(data)
        } catch (err) {
            console.log("some error has occurred")
        } finally {
            setLoadingUploads(false)
        }
    }

    const handleDeletePlaylist = async (id) => {
        setDeleting(true)
        try {
            const response = await fetch(`${API_BASE}/api/video/deleteplaylist/${id}`, {
                method: 'DELETE',
                headers: {
                    'auth-token': token,
                    'Content-Type': 'application/json',
                },
            })
            if (!response.ok) {
                throw new Error('Failed to delete playlist')
            }
            setPlaylists((prev) => prev.filter((p) => p._id !== id))
        } catch (error) {
            console.log("some error has occurred")
        } finally {
            setDeleting(false)
            setDeleteTarget(null)
        }
    }

    useEffect(() => {
        populatevideos()
    }, [])

    const [seenplaylist, setseenplaylist] = useState([])
    const FetchAllPlaylistSeenByUser = async () => {
        try {
            const response = await fetch(`${API_BASE}/api/video/userplaylist`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token,
                },
            })

            if (!response.ok) {
                throw new Error('Failed to fetch playlists')
            }

            const json = await response.json()
            setseenplaylist(json.uniqueUserSeenPlaylist)
        } catch (err) {
            console.log("some error has occurred")
        }
    }

    const [percent, setpercent] = useState([])

    useEffect(() => {
        FetchAllPlaylistSeenByUser()
    }, [token])

    const PercentVideoOfUSer = async (playlistId) => {
        try {
            const response = await fetch(`${API_BASE}/api/video/countvideos/${playlistId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token,
                },
            })
            const json = await response.json()
            const noofvideos = json.NoOfVideos
            const countVideosUser = json.countVideosOfUser
            const playlistname = json.playlistname.name
            const percentage = (countVideosUser / noofvideos) * 100
            return { playlistId, percentage, playlistname }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        FetchAllPlaylistSeenByUser()
        seenplaylist.forEach(async (playlistId) => {
            const result = await PercentVideoOfUSer(playlistId)
            if (result) setpercent(prevPercent => [...prevPercent, result])
        })
    }, [])

    useEffect(() => {
        const fetchpercentages = async () => {
            const percentageData = await Promise.all(
                seenplaylist.map((playlistId) => PercentVideoOfUSer(playlistId))
            )
            setpercent(percentageData.filter(Boolean))
        }
        if (seenplaylist.length > 0) {
            fetchpercentages()
        }
    }, [seenplaylist])

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
        completedPlaylistByUser()
    }, [])

    // Real progress data, chart-friendly: one bar per playlist the person
    // has actually started, rounded for display.
    const chartData = percent
        .filter(Boolean)
        .map((p) => ({ name: p.playlistname, complete: Math.round(p.percentage) }))

    return (
        <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="min-h-screen bg-[#FFFEFB]">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500&display=swap');

                .txp-wordmark { font-family: 'Fraunces', serif; }
                .txp-mono { font-family: 'IBM Plex Mono', monospace; letter-spacing: 0.06em; }

                .txp-card { transition: transform 200ms ease, box-shadow 200ms ease, border-color 200ms ease; }
                .txp-card:hover { transform: translateY(-4px); box-shadow: 0 16px 30px -14px rgba(16, 24, 39, 0.16); border-color: #C6741B; }

                .txp-delete-btn { color: #B0AC9F; transition: color 160ms ease, background-color 160ms ease; }
                .txp-delete-btn:hover { color: #A83A34; background-color: #FBECEA; }

                .txp-btn-fill { background: #C6741B; border: 1.5px solid #C6741B; transition: background-color 180ms ease, transform 150ms ease; }
                .txp-btn-fill:hover:not(:disabled) { background: #A15E13; border-color: #A15E13; transform: translateY(-1px); }
                .txp-btn-fill:disabled { opacity: 0.65; cursor: not-allowed; }

                .txp-btn-outline { border: 1.5px solid #101827; color: #101827; transition: background-color 180ms ease, color 180ms ease; }
                .txp-btn-outline:hover { background: #101827; color: #FFFEFB; }

                .txp-modal-backdrop {
                    position: fixed; inset: 0; z-index: 50;
                    background: rgba(16, 24, 39, 0.55);
                    display: flex; align-items: center; justify-content: center;
                    animation: txp-fade 200ms ease both;
                }
                @keyframes txp-fade { from { opacity: 0; } to { opacity: 1; } }
                .txp-modal-card {
                    background: #FFFEFB; border-radius: 16px;
                    padding: 32px; max-width: 340px; width: 90%;
                    animation: txp-pop 220ms cubic-bezier(.34,1.56,.64,1) both;
                }
                @keyframes txp-pop { from { opacity: 0; transform: scale(0.94); } to { opacity: 1; transform: scale(1); } }

                @media (prefers-reduced-motion: reduce) {
                    .txp-card, .txp-delete-btn, .txp-btn-fill, .txp-btn-outline { transition: none; }
                    .txp-modal-backdrop, .txp-modal-card { animation: none; }
                }
            `}</style>

            <div className="container max-w-6xl mx-auto px-6 py-12 md:py-16">
                <span className="txp-mono text-[#A15E13] text-xs uppercase">Your space</span>
                <h1 className="txp-wordmark text-[#101827] font-semibold text-3xl sm:text-4xl mt-3 mb-10">
                    Dashboard
                </h1>

                {/* Progress overview */}
                <div className="grid lg:grid-cols-[1fr_1.2fr] gap-6 mb-14">
                    <div className="bg-white border border-[#E8E4DA] rounded-2xl p-6">
                        <h2 className="txp-wordmark text-[#101827] font-semibold text-lg mb-5">Courses in progress</h2>

                        {percent.length > 0 ? (
                            <div className="flex flex-col gap-5">
                                {percent.filter(Boolean).map((val, index) => (
                                    <div key={index}>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <span className="text-[#334155] text-sm font-medium truncate pr-2">{val.playlistname}</span>
                                            <span className="txp-mono text-[11px] text-[#A15E13] shrink-0">{val.percentage.toFixed(0)}%</span>
                                        </div>
                                        <ProgressBar
                                            width="100%"
                                            height="8px"
                                            completed={Number(val.percentage.toFixed(1))}
                                            bgColor="#C6741B"
                                            baseBgColor="#F1EDE3"
                                            isLabelVisible={false}
                                            borderRadius="6px"
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-[#5B6472] text-sm mb-4">You haven't started a course yet.</p>
                                <Link to="/course" className="text-[#A15E13] hover:text-[#101827] text-sm font-semibold">
                                    Browse courses
                                </Link>
                            </div>
                        )}
                    </div>

                    <div className="bg-white border border-[#E8E4DA] rounded-2xl p-6">
                        <h2 className="txp-wordmark text-[#101827] font-semibold text-lg mb-5">Completion by course</h2>
                        {chartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={220}>
                                <BarChart data={chartData} margin={{ top: 4, right: 8, left: -20, bottom: 4 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#E8E4DA" vertical={false} />
                                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#94918A" }} interval={0} angle={-15} textAnchor="end" height={50} />
                                    <YAxis tick={{ fontSize: 11, fill: "#94918A" }} domain={[0, 100]} />
                                    <Tooltip
                                        formatter={(value) => [`${value}%`, "Complete"]}
                                        contentStyle={{ borderRadius: 8, border: "1px solid #E8E4DA", fontSize: 13 }}
                                    />
                                    <Bar dataKey="complete" fill="#C6741B" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-[220px] flex items-center justify-center text-center px-4">
                                <p className="text-[#94918A] text-sm">Your progress chart will appear here once you start a course.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Uploaded playlists */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                    <div>
                        <h2 className="txp-wordmark text-[#101827] font-semibold text-2xl mb-1.5">Your uploaded courses</h2>
                        <p className="text-[#5B6472] text-sm max-w-xl">
                            Name the playlist or course you want to teach, then pass a
                            short verification test to unlock uploading.
                        </p>
                    </div>
                    <button
                        onClick={() => setShowUploadModal(true)}
                        className="txp-btn-fill text-white text-sm font-semibold px-5 py-2.5 rounded-lg whitespace-nowrap"
                    >
                        Start uploading playlist
                    </button>
                </div>

                {loadingUploads ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="h-72 rounded-2xl bg-[#FBF7EF] border border-[#E8E4DA] animate-pulse" />
                        ))}
                    </div>
                ) : playlists.length === 0 ? (
                    <div className="bg-[#FBF7EF] border border-[#E8E4DA] rounded-2xl p-10 text-center max-w-lg">
                        <FaCertificate size={22} className="text-[#C6741B] mx-auto mb-4" />
                        <p className="txp-wordmark text-[#101827] font-semibold text-lg mb-2">
                            You haven't uploaded a course yet
                        </p>
                        <p className="text-[#5B6472] text-sm mb-5">
                            Name the playlist you want to teach and pass a short
                            verification test to get started.
                        </p>
                        <button
                            onClick={() => setShowUploadModal(true)}
                            className="txp-btn-fill text-white text-sm font-semibold px-5 py-2.5 rounded-lg"
                        >
                            Start uploading playlist
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                        {playlists.map((playlist) => (
                            <div key={playlist._id} className="txp-card bg-white border border-[#E8E4DA] rounded-2xl p-4 flex flex-col">
                                <div className="rounded-xl overflow-hidden h-36 mb-4">
                                    <img
                                        className="w-full h-full object-cover object-center"
                                        src={playlist.videos?.[0]?.thumbnail}
                                        alt={playlist.name}
                                    />
                                </div>
                                <h3 className="txp-wordmark text-[#101827] font-semibold text-base mb-3 leading-snug line-clamp-2">
                                    {playlist.name}
                                </h3>
                                <div className="mt-auto flex items-center justify-between pt-3 border-t border-[#F1EDE3]">
                                    <Link to={`/playlist/${playlist._id}`} className="text-[#A15E13] hover:text-[#101827] text-sm font-semibold">
                                        View playlist
                                    </Link>
                                    <button
                                        onClick={() => setDeleteTarget(playlist)}
                                        aria-label="Delete playlist"
                                        className="txp-delete-btn w-8 h-8 rounded-lg flex items-center justify-center"
                                    >
                                        <MdDelete size={17} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Delete confirmation */}
            {deleteTarget && (
                <div className="txp-modal-backdrop" onClick={() => !deleting && setDeleteTarget(null)}>
                    <div className="txp-modal-card" onClick={(e) => e.stopPropagation()}>
                        <h3 className="txp-wordmark text-[#101827] font-semibold text-lg mb-2">Delete this course?</h3>
                        <p className="text-[#5B6472] text-sm mb-6">
                            "{deleteTarget.name}" will be permanently removed. This can't be undone.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteTarget(null)}
                                disabled={deleting}
                                className="txp-btn-outline flex-1 text-sm font-semibold py-2.5 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDeletePlaylist(deleteTarget._id)}
                                disabled={deleting}
                                className="flex-1 text-sm font-semibold py-2.5 rounded-lg text-white bg-[#A83A34] hover:bg-[#8E2F2A] transition-colors disabled:opacity-65"
                            >
                                {deleting ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Start uploading playlist / start creator verification test */}
            {showUploadModal && (
                <div className="txp-modal-backdrop" onClick={closeUploadModal}>
                    <div className="txp-modal-card" onClick={(e) => e.stopPropagation()}>
                        <h3 className="txp-wordmark text-[#101827] font-semibold text-lg mb-2">Start uploading a playlist</h3>
                        <p className="text-[#5B6472] text-sm mb-5">
                            Enter the name of the playlist or course you want to teach.
                            Once you pass the short verification test, you'll be able to
                            upload it.
                        </p>

                        <label className="txp-mono text-[10px] uppercase text-[#A15E13] block mb-1.5">
                            Playlist / course name
                        </label>
                        <input
                            type="text"
                            value={playlistNameInput}
                            onChange={(e) => setPlaylistNameInput(e.target.value)}
                            placeholder="e.g. Intro to React Hooks"
                            disabled={startingTest}
                            autoFocus
                            className="w-full border border-[#E8E4DA] rounded-lg px-3 py-2.5 text-sm text-[#101827] mb-6 outline-none focus:border-[#C6741B] transition-colors disabled:opacity-60"
                        />

                        <div className="flex gap-3">
                            <button
                                onClick={closeUploadModal}
                                disabled={startingTest}
                                className="txp-btn-outline flex-1 text-sm font-semibold py-2.5 rounded-lg"
                            >
                                Cancel
                            </button>
                            {playlistNameInput.trim() && (
                                <button
                                    onClick={handleStartCreatorTest}
                                    disabled={startingTest}
                                    className="txp-btn-fill flex-1 text-sm font-semibold py-2.5 rounded-lg text-white disabled:opacity-65"
                                >
                                    {startingTest ? 'Preparing your test...' : 'Start creator'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>

        // Future dashboard ideas noted from the original: recent uploads,
        // recent videos watched, daily/weekly/monthly activity breakdown.
    )
}

export default DashBoard