// import React, { useEffect, useRef, useState } from 'react'
// import ReactPlayer from 'react-player'
// import { Link, useParams } from 'react-router-dom'
// import { MdDelete } from "react-icons/md"
// import { FaCloudUploadAlt, FaImage, FaVideo, FaTimes, FaCheckCircle } from "react-icons/fa"
// import { BiSolidLike, BiSolidDislike } from "react-icons/bi"
// import CountUp from 'react-countup'
// import { API_BASE } from '../config'
// import { uploadVideoAndThumbnail } from '../utils/CloudinaryUpload'

// const formatBytes = (bytes) => {
//     if (!bytes) return ""
//     const mb = bytes / (1024 * 1024)
//     return mb >= 1 ? `${mb.toFixed(1)} MB` : `${(bytes / 1024).toFixed(0)} KB`
// }

// const uploadWithProgress = (url, formData, headers, onProgress) =>
//     new Promise((resolve, reject) => {
//         const xhr = new XMLHttpRequest()
//         xhr.open('POST', url)
//         Object.entries(headers).forEach(([key, value]) => xhr.setRequestHeader(key, value))
//         xhr.upload.onprogress = (e) => {
//             if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100))
//         }
//         xhr.onload = () => {
//             let json
//             try { json = JSON.parse(xhr.responseText) } catch { json = null }
//             if (xhr.status >= 200 && xhr.status < 300) {
//                 resolve(json)
//             } else {
//                 reject(new Error(json?.message || 'Upload failed'))
//             }
//         }
//         xhr.onerror = () => reject(new Error('Upload failed'))
//         xhr.send(formData)
//     })

// const Playlist = () => {
//     const { id } = useParams()
//     const token = localStorage.getItem('token')

//     const [playlist, setPlaylist] = useState({})
//     const [videos, setVideos] = useState([])
//     const [user, setUser] = useState(null)
//     const [isCompleted, setIsCompleted] = useState(false)
//     const [loading, setLoading] = useState(true)

//     const fetchPlaylist = async () => {
//         setLoading(true)
//         try {
//             const response = await fetch(`${API_BASE}/api/video/fetchplaylistbyid/${id}`, {
//                 method: 'GET',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//             })

//             if (!response.ok) {
//                 throw new Error('Failed to fetch playlists')
//             }

//             const data = await response.json()
//             setVideos(data.videos)
//             setUser(data.user)
//             setPlaylist(data.playlist)
//             setIsCompleted(data.playlist.isCompleted)
//         } catch (err) {
//             console.log("some error has occurred")
//         } finally {
//             setLoading(false)
//         }
//     }

//     useEffect(() => {
//         fetchPlaylist()
//     }, [id])

//     // Add-video form
//     const [title, setTitle] = useState('')
//     const [videofile, setVideofile] = useState(null)
//     const [thumbnailfile, setThumbnailfile] = useState(null)
//     const [thumbPreview, setThumbPreview] = useState(null)
//     const [videoPreview, setVideoPreview] = useState(null)
//     const [dragThumb, setDragThumb] = useState(false)
//     const [dragVideo, setDragVideo] = useState(false)
//     const [formErrors, setFormErrors] = useState({})
//     const [uploading, setUploading] = useState(false)
//     const [progress, setProgress] = useState(0)
//     const [submitError, setSubmitError] = useState(null)

//     const thumbInputRef = useRef(null)
//     const videoInputRef = useRef(null)

//     useEffect(() => {
//         return () => {
//             if (thumbPreview) URL.revokeObjectURL(thumbPreview)
//             if (videoPreview) URL.revokeObjectURL(videoPreview)
//         }
//     }, [thumbPreview, videoPreview])

//     const onThumbnailFile = (file) => {
//         if (!file) return
//         if (thumbPreview) URL.revokeObjectURL(thumbPreview)
//         setThumbnailfile(file)
//         setThumbPreview(URL.createObjectURL(file))
//         setFormErrors((e) => ({ ...e, thumbnail: null }))
//     }

//     const onVideoFile = (file) => {
//         if (!file) return
//         if (videoPreview) URL.revokeObjectURL(videoPreview)
//         setVideofile(file)
//         setVideoPreview(URL.createObjectURL(file))
//         setFormErrors((e) => ({ ...e, video: null }))
//     }

//     const resetForm = () => {
//         setTitle('')
//         setVideofile(null)
//         setThumbnailfile(null)
//         setThumbPreview(null)
//         setVideoPreview(null)
//         if (thumbInputRef.current) thumbInputRef.current.value = ""
//         if (videoInputRef.current) videoInputRef.current.value = ""
//     }

//     const validateForm = () => {
//         const next = {}
//         if (!title.trim()) next.title = "Give this video a title."
//         if (!thumbnailfile) next.thumbnail = "Add a thumbnail image."
//         if (!videofile) next.video = "Add a video file."
//         setFormErrors(next)
//         return Object.keys(next).length === 0
//     }

//     const handlevideoupload = async (e) => {
//         e.preventDefault()
//         setSubmitError(null)
//         if (!validateForm()) return

//         setUploading(true)
//         setProgress(0)

//         try {
//             // Step 1: upload directly to Cloudinary (client -> Cloudinary)
//             const { videoURL, thumbnailURL } = await uploadVideoAndThumbnail(
//                 videofile,
//                 thumbnailfile,
//                 token,
//                 setProgress
//             )

//             // Step 2: save metadata to backend, attach to this playlist
//             const res = await fetch(`${API_BASE}/api/video/uploadtoplaylist/${id}`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'auth-token': token,
//                 },
//                 body: JSON.stringify({ title, videoURL, thumbnailURL }),
//             })

//             if (!res.ok) {
//                 const errData = await res.json().catch(() => ({}))
//                 throw new Error(errData.error || 'Upload failed')
//             }

//             const data = await res.json()

//             setVideos((prevVideos) => [...prevVideos, data.video])
//             resetForm()
//         } catch (error) {
//             console.error('Upload failed:', error.message)
//             setSubmitError(error.message || "Upload failed. Try again.")
//         } finally {
//             setUploading(false)
//         }
//     }

//     const handleDeleteVideo = async (videoId) => {
//         try {
//             const response = await fetch(`${API_BASE}/api/video/deletevideo/${videoId}`, {
//                 method: 'DELETE',
//                 headers: {
//                     'auth-token': token,
//                     'Content-Type': 'application/json',
//                 },
//             })
//             if (!response.ok) {
//                 throw new Error('Failed to delete the video')
//             }
//             setVideos((prev) => prev.filter((v) => v._id !== videoId))
//         } catch (error) {
//             console.log("some error has occurred")
//         }
//     }

//     const markComplete = async () => {
//         try {
//             const response = await fetch(`${API_BASE}/api/video/isPlaylistComplete/${id}`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//             })
//             const data = await response.json()
//             if (data.success) {
//                 setIsCompleted(data.playlist.isCompleted)
//             }
//         } catch (error) {
//             console.log(error)
//         }
//     }

//     const completedPlaylistByUser = async () => {
//         try {
//             await fetch(`${API_BASE}/api/video/completedPLaylistByUser`, {
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

//     // Confirmation modal (delete video / mark complete)
//     const [modal, setModal] = useState(null)
//     const [acting, setActing] = useState(false)

//     const closeModal = () => !acting && setModal(null)

//     const confirmAction = async () => {
//         setActing(true)
//         if (modal.type === "delete") {
//             await handleDeleteVideo(modal.videoId)
//         } else if (modal.type === "complete") {
//             await markComplete()
//         }
//         setActing(false)
//         setModal(null)
//     }

//     return (
//         <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="min-h-screen bg-[#FFFEFB]">
//             <style>{`
//                 @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500&display=swap');

//                 .txp-wordmark { font-family: 'Fraunces', serif; }
//                 .txp-mono { font-family: 'IBM Plex Mono', monospace; letter-spacing: 0.06em; }

//                 .txp-video-row { transition: border-color 180ms ease, box-shadow 180ms ease; }
//                 .txp-video-row:hover { border-color: #C6741B; box-shadow: 0 10px 24px -16px rgba(16, 24, 39, 0.18); }

//                 .txp-delete-btn { color: #B0AC9F; transition: color 160ms ease, background-color 160ms ease; }
//                 .txp-delete-btn:hover { color: #A83A34; background-color: #FBECEA; }

//                 .txp-field { background: #FFFEFB; border: 1.5px solid #E8E4DA; transition: border-color 160ms ease; }
//                 .txp-field:focus-within { border-color: #C6741B; }
//                 .txp-field.txp-field-error { border-color: #E24B4A; }
//                 .txp-field input { background: transparent; border: none; outline: none; width: 100%; font-size: 15px; color: #101827; }
//                 .txp-field input::placeholder { color: #B0AC9F; }

//                 .txp-dropzone { border: 1.5px dashed #D8D2C4; background: #FBF7EF; transition: border-color 180ms ease, background-color 180ms ease; cursor: pointer; }
//                 .txp-dropzone:hover { border-color: #C6741B; }
//                 .txp-dropzone.dragging { border-color: #C6741B; background: #FBF0DF; }
//                 .txp-dropzone.has-error { border-color: #E24B4A; }

//                 .txp-remove-btn { background: rgba(16, 24, 39, 0.7); color: #FFFEFB; transition: background-color 160ms ease; }
//                 .txp-remove-btn:hover { background: rgba(16, 24, 39, 0.9); }

//                 .txp-btn-fill { background: #C6741B; border: 1.5px solid #C6741B; transition: background-color 180ms ease, transform 150ms ease, opacity 160ms ease; }
//                 .txp-btn-fill:hover:not(:disabled) { background: #A15E13; border-color: #A15E13; transform: translateY(-1px); }
//                 .txp-btn-fill:disabled { opacity: 0.7; cursor: not-allowed; }

//                 .txp-btn-outline { border: 1.5px solid #101827; color: #101827; transition: background-color 180ms ease, color 180ms ease; }
//                 .txp-btn-outline:hover { background: #101827; color: #FFFEFB; }

//                 .txp-progress-track { background: #F1EDE3; border-radius: 999px; overflow: hidden; }
//                 .txp-progress-fill { background: #C6741B; height: 100%; transition: width 200ms ease; }

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
//                     .txp-video-row, .txp-delete-btn, .txp-field, .txp-dropzone, .txp-remove-btn,
//                     .txp-btn-fill, .txp-btn-outline, .txp-progress-fill { transition: none; }
//                     .txp-modal-backdrop, .txp-modal-card { animation: none; }
//                 }
//             `}</style>

//             <div className="container max-w-4xl mx-auto px-6 py-12 md:py-16">
//                 <Link to="/dashboard" className="text-sm text-[#5B6472] hover:text-[#101827] font-medium">
//                     &larr; Back to dashboard
//                 </Link>

//                 <div className="flex flex-wrap items-center justify-between gap-3 mt-6 mb-2">
//                     <h1 className="txp-wordmark text-[#101827] font-semibold text-3xl sm:text-4xl">
//                         {playlist.name || "Your playlist"}
//                     </h1>
//                     {isCompleted ? (
//                         <span className="flex items-center gap-1.5 txp-mono text-[10px] uppercase text-[#3B6D11] bg-[#EAF3DE] rounded-full px-3 py-1.5">
//                             <FaCheckCircle size={11} />
//                             Marked complete
//                         </span>
//                     ) : (
//                         <span className="txp-mono text-[10px] uppercase text-[#A15E13] bg-[#FBF0DF] border border-[#EAD3AE] rounded-full px-3 py-1.5">
//                             Open for new lessons
//                         </span>
//                     )}
//                 </div>
//                 <p className="text-[#5B6472] text-sm mb-10">
//                     {videos.length} {videos.length === 1 ? "video" : "videos"} in this course
//                 </p>

//                 {/* Video list */}
//                 <div className="flex flex-col gap-4 mb-12">
//                     {loading ? (
//                         Array.from({ length: 3 }).map((_, i) => (
//                             <div key={i} className="h-24 rounded-xl bg-[#FBF7EF] border border-[#E8E4DA] animate-pulse" />
//                         ))
//                     ) : videos.length === 0 ? (
//                         <div className="text-center py-12 border border-dashed border-[#E8E4DA] rounded-xl">
//                             <p className="text-[#5B6472] text-sm">No videos yet — add your first one below.</p>
//                         </div>
//                     ) : (
//                         videos.map((video, i) => (
//                             <div key={video._id} className="txp-video-row bg-white border border-[#E8E4DA] rounded-xl p-4 flex flex-col sm:flex-row gap-4">
//                                 <div className="w-full sm:w-36 shrink-0 rounded-lg overflow-hidden">
//                                     <ReactPlayer
//                                         controls={true}
//                                         playing={false}
//                                         url={video.url}
//                                         width="100%"
//                                         height="80px"
//                                         light={<img src={video.thumbnail} alt="Thumbnail" style={{ width: "100%", height: "80px", objectFit: "cover" }} />}
//                                     />
//                                 </div>

//                                 <div className="flex-1 min-w-0">
//                                     <p className="txp-mono text-[10px] text-[#A15E13] uppercase mb-1">Lesson {i + 1}</p>
//                                     <h2 className="txp-wordmark text-[#101827] font-semibold text-base leading-snug mb-1 truncate">
//                                         {video.title}
//                                     </h2>
//                                     {user && (
//                                         <p className="text-[#94918A] text-xs">
//                                             {user.name} &middot; {new Date(video.createdAt).toLocaleDateString()}
//                                         </p>
//                                     )}
//                                 </div>

//                                 <div className="flex sm:flex-col items-center justify-between sm:justify-center gap-3 shrink-0">
//                                     <div className="flex items-center gap-4 text-[#5B6472] text-sm">
//                                         <span className="flex items-center gap-1.5">
//                                             <BiSolidLike size={15} className="text-[#C6741B]" />
//                                             <CountUp end={video.likes} duration={1.2} />
//                                         </span>
//                                         <span className="flex items-center gap-1.5">
//                                             <BiSolidDislike size={15} className="text-[#94918A]" />
//                                             <CountUp end={video.dislikes} duration={1.2} />
//                                         </span>
//                                     </div>
//                                     <button
//                                         onClick={() => setModal({ type: "delete", videoId: video._id })}
//                                         aria-label="Delete video"
//                                         className="txp-delete-btn w-8 h-8 rounded-lg flex items-center justify-center"
//                                     >
//                                         <MdDelete size={17} />
//                                     </button>
//                                 </div>
//                             </div>
//                         ))
//                     )}
//                 </div>

//                 {/* Add more videos */}
//                 {!isCompleted && (
//                     <div className="bg-white border border-[#E8E4DA] rounded-2xl p-6 sm:p-8">
//                         <h2 className="txp-wordmark text-[#101827] font-semibold text-xl mb-1">Add more videos</h2>
//                         <p className="text-[#5B6472] text-sm mb-6">
//                             Add as many lessons as you like, then mark the course complete when you're done.
//                         </p>

//                         <form onSubmit={handlevideoupload} className="flex flex-col gap-6">
//                             {submitError && (
//                                 <div className="bg-[#FBECEA] text-[#A83A34] text-sm font-medium rounded-lg px-4 py-3">
//                                     {submitError}
//                                 </div>
//                             )}

//                             <div>
//                                 <label htmlFor="head" className="block text-sm font-medium text-[#334155] mb-1.5">Video title</label>
//                                 <div className={`txp-field rounded-lg px-3.5 py-2.5 ${formErrors.title ? "txp-field-error" : ""}`}>
//                                     <input
//                                         type="text"
//                                         id="head"
//                                         name="head"
//                                         placeholder="e.g. Lesson 3 — Working with state"
//                                         value={title}
//                                         onChange={(e) => { setTitle(e.target.value); setFormErrors((err) => ({ ...err, title: null })) }}
//                                     />
//                                 </div>
//                                 {formErrors.title && <p className="text-xs text-[#E24B4A] mt-1.5">{formErrors.title}</p>}
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-medium text-[#334155] mb-1.5">Thumbnail image</label>
//                                 <input
//                                     ref={thumbInputRef}
//                                     type="file"
//                                     id="thumbnail"
//                                     name="thumbnail"
//                                     accept="image/*"
//                                     className="hidden"
//                                     onChange={(e) => onThumbnailFile(e.target.files[0])}
//                                 />
//                                 {thumbPreview ? (
//                                     <div className="relative rounded-xl overflow-hidden h-32">
//                                         <img src={thumbPreview} alt="Thumbnail preview" className="w-full h-full object-cover" />
//                                         <button
//                                             type="button"
//                                             onClick={() => { setThumbnailfile(null); setThumbPreview(null); if (thumbInputRef.current) thumbInputRef.current.value = "" }}
//                                             className="txp-remove-btn absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center"
//                                             aria-label="Remove thumbnail"
//                                         >
//                                             <FaTimes size={13} />
//                                         </button>
//                                     </div>
//                                 ) : (
//                                     <div
//                                         onClick={() => thumbInputRef.current?.click()}
//                                         onDragOver={(e) => { e.preventDefault(); setDragThumb(true) }}
//                                         onDragLeave={() => setDragThumb(false)}
//                                         onDrop={(e) => { e.preventDefault(); setDragThumb(false); onThumbnailFile(e.dataTransfer.files[0]) }}
//                                         className={`txp-dropzone rounded-xl h-32 flex flex-col items-center justify-center gap-2 ${dragThumb ? "dragging" : ""} ${formErrors.thumbnail ? "has-error" : ""}`}
//                                     >
//                                         <FaImage size={18} className="text-[#C6741B]" />
//                                         <p className="text-[#5B6472] text-sm text-center px-4">Drag an image here, or click to browse</p>
//                                     </div>
//                                 )}
//                                 {formErrors.thumbnail && <p className="text-xs text-[#E24B4A] mt-1.5">{formErrors.thumbnail}</p>}
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-medium text-[#334155] mb-1.5">Video file</label>
//                                 <input
//                                     ref={videoInputRef}
//                                     type="file"
//                                     id="video"
//                                     name="video"
//                                     accept="video/*"
//                                     className="hidden"
//                                     onChange={(e) => onVideoFile(e.target.files[0])}
//                                 />
//                                 {videofile ? (
//                                     <div className="flex items-center gap-4 border border-[#E8E4DA] rounded-xl p-3">
//                                         <video src={videoPreview} className="w-24 h-16 rounded-lg object-cover bg-black shrink-0" muted controls />
//                                         <div className="min-w-0 flex-1">
//                                             <p className="text-[#101827] text-sm font-medium truncate">{videofile.name}</p>
//                                             <p className="text-[#94918A] text-xs">{formatBytes(videofile.size)}</p>
//                                         </div>
//                                         <button
//                                             type="button"
//                                             onClick={() => { setVideofile(null); setVideoPreview(null); if (videoInputRef.current) videoInputRef.current.value = "" }}
//                                             className="text-[#94918A] hover:text-[#A83A34] shrink-0"
//                                             aria-label="Remove video"
//                                         >
//                                             <FaTimes size={15} />
//                                         </button>
//                                     </div>
//                                 ) : (
//                                     <div
//                                         onClick={() => videoInputRef.current?.click()}
//                                         onDragOver={(e) => { e.preventDefault(); setDragVideo(true) }}
//                                         onDragLeave={() => setDragVideo(false)}
//                                         onDrop={(e) => { e.preventDefault(); setDragVideo(false); onVideoFile(e.dataTransfer.files[0]) }}
//                                         className={`txp-dropzone rounded-xl h-28 flex flex-col items-center justify-center gap-2 ${dragVideo ? "dragging" : ""} ${formErrors.video ? "has-error" : ""}`}
//                                     >
//                                         <FaVideo size={18} className="text-[#C6741B]" />
//                                         <p className="text-[#5B6472] text-sm text-center px-4">Drag a video here, or click to browse</p>
//                                     </div>
//                                 )}
//                                 {formErrors.video && <p className="text-xs text-[#E24B4A] mt-1.5">{formErrors.video}</p>}
//                             </div>

//                             {uploading && (
//                                 <div>
//                                     <div className="flex items-center justify-between mb-1.5">
//                                         <span className="text-[#5B6472] text-xs">Uploading&hellip;</span>
//                                         <span className="txp-mono text-[11px] text-[#A15E13]">{progress}%</span>
//                                     </div>
//                                     <div className="txp-progress-track h-2 w-full">
//                                         <div className="txp-progress-fill" style={{ width: `${progress}%` }} />
//                                     </div>
//                                 </div>
//                             )}

//                             <button
//                                 type="submit"
//                                 disabled={uploading}
//                                 className="txp-btn-fill flex items-center justify-center gap-2 text-[#FFFEFB] font-semibold text-base py-3 rounded-lg"
//                             >
//                                 <FaCloudUploadAlt size={16} />
//                                 {uploading ? `Uploading ${progress}%` : "Add video"}
//                             </button>
//                         </form>

//                         <button
//                             onClick={() => setModal({ type: "complete" })}
//                             className="txp-btn-outline w-full flex items-center justify-center gap-2 text-sm font-semibold py-3 rounded-lg mt-4"
//                         >
//                             <FaCheckCircle size={14} />
//                             Mark course as complete
//                         </button>
//                     </div>
//                 )}
//             </div>

//             {/* Confirmation modal */}
//             {modal && (
//                 <div className="txp-modal-backdrop" onClick={closeModal}>
//                     <div className="txp-modal-card" onClick={(e) => e.stopPropagation()}>
//                         {modal.type === "delete" ? (
//                             <>
//                                 <h3 className="txp-wordmark text-[#101827] font-semibold text-lg mb-2">Delete this video?</h3>
//                                 <p className="text-[#5B6472] text-sm mb-6">This can't be undone.</p>
//                             </>
//                         ) : (
//                             <>
//                                 <h3 className="txp-wordmark text-[#101827] font-semibold text-lg mb-2">Mark course as complete?</h3>
//                                 <p className="text-[#5B6472] text-sm mb-6">
//                                     You won't be able to add more videos to this course afterward.
//                                 </p>
//                             </>
//                         )}
//                         <div className="flex gap-3">
//                             <button
//                                 onClick={closeModal}
//                                 disabled={acting}
//                                 className="txp-btn-outline flex-1 text-sm font-semibold py-2.5 rounded-lg"
//                             >
//                                 Cancel
//                             </button>
//                             <button
//                                 onClick={confirmAction}
//                                 disabled={acting}
//                                 className={`flex-1 text-sm font-semibold py-2.5 rounded-lg text-white transition-colors disabled:opacity-65 ${modal.type === "delete" ? "bg-[#A83A34] hover:bg-[#8E2F2A]" : "bg-[#C6741B] hover:bg-[#A15E13]"}`}
//                             >
//                                 {acting ? "Working..." : modal.type === "delete" ? "Delete" : "Mark complete"}
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     )
// }

// export default Playlist

import React, { useEffect, useRef, useState } from 'react'
import ReactPlayer from 'react-player'
import { Link, useParams } from 'react-router-dom'
import { MdDelete } from "react-icons/md"
import { FaCloudUploadAlt, FaImage, FaVideo, FaTimes, FaCheckCircle, FaPencilAlt, FaCheck } from "react-icons/fa"
import { BiSolidLike, BiSolidDislike } from "react-icons/bi"
import CountUp from 'react-countup'
import { API_BASE } from '../config'
import { uploadVideoAndThumbnail } from '../utils/cloudinaryUpload'

const formatBytes = (bytes) => {
    if (!bytes) return ""
    const mb = bytes / (1024 * 1024)
    return mb >= 1 ? `${mb.toFixed(1)} MB` : `${(bytes / 1024).toFixed(0)} KB`
}

const Playlist = () => {
    const { id } = useParams()
    const token = localStorage.getItem('token')

    const [playlist, setPlaylist] = useState({})
    const [videos, setVideos] = useState([])
    const [user, setUser] = useState(null)
    const [isCompleted, setIsCompleted] = useState(false)
    const [loading, setLoading] = useState(true)

    // --- Playlist Rename State ---
    const [isEditingName, setIsEditingName] = useState(false)
    const [nameDraft, setNameDraft] = useState("")
    const [savingName, setSavingName] = useState(false)
    const [nameError, setNameError] = useState("")

    // --- Individual Video Editing State ---
    const [editingVideoId, setEditingVideoId] = useState(null)
    const [editTitle, setEditTitle] = useState("")
    const [editVideoFile, setEditVideoFile] = useState(null)
    const [editThumbnailFile, setEditThumbnailFile] = useState(null)
    const [editThumbnailPreview, setEditThumbnailPreview] = useState(null)
    const [editVideoPreview, setEditVideoPreview] = useState(null)
    const [editSaving, setEditSaving] = useState(false)
    const [editProgress, setEditProgress] = useState(0)
    const [editError, setEditError] = useState("")

    const editThumbInputRef = useRef(null)
    const editVideoInputRef = useRef(null)

    // --- Add Video Form State ---
    const [title, setTitle] = useState('')
    const [videofile, setVideofile] = useState(null)
    const [thumbnailfile, setThumbnailfile] = useState(null)
    const [thumbPreview, setThumbPreview] = useState(null)
    const [videoPreview, setVideoPreview] = useState(null)
    const [dragThumb, setDragThumb] = useState(false)
    const [dragVideo, setDragVideo] = useState(false)
    const [formErrors, setFormErrors] = useState({})
    const [uploading, setUploading] = useState(false)
    const [progress, setProgress] = useState(0)
    const [submitError, setSubmitError] = useState(null)

    const thumbInputRef = useRef(null)
    const videoInputRef = useRef(null)

    const fetchPlaylist = async () => {
        setLoading(true)
        try {
            const response = await fetch(`${API_BASE}/api/video/fetchplaylistbyid/${id}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            })

            if (!response.ok) throw new Error('Failed to fetch playlists')

            const data = await response.json()
            setVideos(data.videos)
            setUser(data.user)
            setPlaylist(data.playlist)
            setIsCompleted(data.playlist.isCompleted)
        } catch (err) {
            console.log("some error has occurred")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchPlaylist()
    }, [id])

    useEffect(() => {
        return () => {
            if (thumbPreview) URL.revokeObjectURL(thumbPreview)
            if (videoPreview) URL.revokeObjectURL(videoPreview)
            if (editThumbnailPreview && editThumbnailPreview.startsWith('blob:')) URL.revokeObjectURL(editThumbnailPreview)
            if (editVideoPreview && editVideoPreview.startsWith('blob:')) URL.revokeObjectURL(editVideoPreview)
        }
    }, [thumbPreview, videoPreview, editThumbnailPreview, editVideoPreview])

    // --- Rename Playlist Handlers ---
    const startEditingName = () => {
        setNameDraft(playlist.name || "")
        setNameError("")
        setIsEditingName(true)
    }

    const saveEditedName = async () => {
        if (!nameDraft.trim()) {
            setNameError("Name cannot be empty")
            return
        }
        setSavingName(true)
        setNameError("")
        try {
            const response = await fetch(`${API_BASE}/api/video/renameplaylist/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token
                },
                body: JSON.stringify({ name: nameDraft.trim() })
            })
            const json = await response.json()
            if (json.success) {
                setPlaylist(prev => ({ ...prev, name: json.playlist.name }))
                setIsEditingName(false)
            } else {
                setNameError(json.message || "Failed to rename playlist")
            }
        } catch (error) {
            setNameError("Something went wrong. Try again.")
        } finally {
            setSavingName(false)
        }
    }

    // --- Edit Individual Video Handlers ---
    const openEditVideo = (video) => {
        setEditingVideoId(video._id)
        setEditTitle(video.title || "")
        setEditVideoFile(null)
        setEditThumbnailFile(null)
        setEditThumbnailPreview(video.thumbnail || null)
        setEditVideoPreview(video.url || null)
        setEditProgress(0)
        setEditError("")
    }

    const closeEditVideo = () => {
        if (editSaving) return
        setEditingVideoId(null)
        setEditTitle("")
        setEditVideoFile(null)
        setEditThumbnailFile(null)
        setEditThumbnailPreview(null)
        setEditVideoPreview(null)
    }

    const saveEditedVideo = async () => {
        if (!editTitle.trim()) {
            setEditError("Title is required")
            return
        }
        setEditSaving(true)
        setEditError("")

        try {
            const body = { title: editTitle.trim() }

            // Handles partial asset uploads accurately based on user choices
            if (editVideoFile || editThumbnailFile) {
                const { videoURL, videoPublicId, thumbnailURL, thumbnailPublicId } = await uploadVideoAndThumbnail(
                    editVideoFile || new File([], ""), 
                    editThumbnailFile || new File([], ""),
                    token,
                    setEditProgress
                )
                
                if (editVideoFile) {
                    body.videoURL = videoURL
                    body.videoPublicId = videoPublicId
                }
                if (editThumbnailFile) {
                    body.thumbnailURL = thumbnailURL
                    body.thumbnailPublicId = thumbnailPublicId
                }
            }

            const response = await fetch(`${API_BASE}/api/video/editvideo/${editingVideoId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token
                },
                body: JSON.stringify(body)
            })

            const json = await response.json()
            if (json.success) {
                setVideos((prev) => prev.map((v) => (v._id === json.video._id ? json.video : v)))
                closeEditVideo()
            } else {
                setEditError(json.message || "Failed to update video")
            }
        } catch (error) {
            setEditError("Upload failed. Make sure valid file formats are used.")
        } finally {
            setEditSaving(false)
        }
    }

    // --- Add Video Creation Handlers ---
    const onThumbnailFile = (file) => {
        if (!file) return
        if (thumbPreview) URL.revokeObjectURL(thumbPreview)
        setThumbnailfile(file)
        setThumbPreview(URL.createObjectURL(file))
        setFormErrors((e) => ({ ...e, thumbnail: null }))
    }

    const onVideoFile = (file) => {
        if (!file) return
        if (videoPreview) URL.revokeObjectURL(videoPreview)
        setVideofile(file)
        setVideoPreview(URL.createObjectURL(file))
        setFormErrors((e) => ({ ...e, video: null }))
    }

    const resetForm = () => {
        setTitle('')
        setVideofile(null)
        setThumbnailfile(null)
        setThumbPreview(null)
        setVideoPreview(null)
        if (thumbInputRef.current) thumbInputRef.current.value = ""
        if (videoInputRef.current) videoInputRef.current.value = ""
    }

    const validateForm = () => {
        const next = {}
        if (!title.trim()) next.title = "Give this video a title."
        if (!thumbnailfile) next.thumbnail = "Add a thumbnail image."
        if (!videofile) next.video = "Add a video file."
        setFormErrors(next)
        return Object.keys(next).length === 0
    }

    const handlevideoupload = async (e) => {
        e.preventDefault()
        setSubmitError(null)
        if (!validateForm()) return

        setUploading(true)
        setProgress(0)

        try {
            const { videoURL, videoPublicId, thumbnailURL, thumbnailPublicId } = await uploadVideoAndThumbnail(
                videofile,
                thumbnailfile,
                token,
                setProgress
            )

            const res = await fetch(`${API_BASE}/api/video/uploadtoplaylist/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token,
                },
                body: JSON.stringify({ 
                    title, 
                    videoURL, 
                    videoPublicId,
                    thumbnailURL, 
                    thumbnailPublicId 
                }),
            })

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}))
                throw new Error(errData.error || 'Upload failed')
            }

            const data = await res.json()
            setVideos((prevVideos) => [...prevVideos, data.video])
            resetForm()
        } catch (error) {
            console.error('Upload failed:', error.message)
            setSubmitError(error.message || "Upload failed. Try again.")
        } finally {
            setUploading(false)
        }
    }

    const handleDeleteVideo = async (videoId) => {
        try {
            const response = await fetch(`${API_BASE}/api/video/deletevideo/${videoId}`, {
                method: 'DELETE',
                headers: {
                    'auth-token': token,
                    'Content-Type': 'application/json',
                },
            })
            if (!response.ok) throw new Error('Failed to delete the video')
            setVideos((prev) => prev.filter((v) => v._id !== videoId))
        } catch (error) {
            console.log("some error has occurred")
        }
    }

    const markComplete = async () => {
        try {
            const response = await fetch(`${API_BASE}/api/video/isPlaylistComplete/${id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            })
            const data = await response.json()
            if (data.success) {
                setIsCompleted(data.playlist.isCompleted)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const completedPlaylistByUser = async () => {
        try {
            await fetch(`${API_BASE}/api/video/completedPLaylistByUser`, {
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

    const [modal, setModal] = useState(null)
    const [acting, setActing] = useState(false)

    const closeModal = () => !acting && setModal(null)

    const confirmAction = async () => {
        setActing(true)
        if (modal.type === "delete") {
            await handleDeleteVideo(modal.videoId)
        } else if (modal.type === "complete") {
            await markComplete()
        }
        setActing(false)
        setModal(null)
    }

    const editingVideo = videos.find(v => v._id === editingVideoId) || null

    return (
        <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="min-h-screen bg-[#FFFEFB]">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500&display=swap');
                .txp-wordmark { font-family: 'Fraunces', serif; }
                .txp-mono { font-family: 'IBM Plex Mono', monospace; letter-spacing: 0.06em; }
                .txp-video-row { transition: border-color 180ms ease, box-shadow 180ms ease; }
                .txp-video-row:hover { border-color: #C6741B; box-shadow: 0 10px 24px -16px rgba(16, 24, 39, 0.18); }
                .txp-action-btn { color: #B0AC9F; transition: color 160ms ease, background-color 160ms ease; }
                .txp-action-btn:hover { color: #C6741B; background-color: #FBF0DF; }
                .txp-delete-btn:hover { color: #A83A34; background-color: #FBECEA; }
                .txp-field { background: #FFFEFB; border: 1.5px solid #E8E4DA; transition: border-color 160ms ease; }
                .txp-field:focus-within { border-color: #C6741B; }
                .txp-field input { background: transparent; border: none; outline: none; width: 100%; font-size: 15px; color: #101827; }
                .txp-dropzone { border: 1.5px dashed #D8D2C4; background: #FBF7EF; cursor: pointer; }
                .txp-btn-fill { background: #C6741B; border: 1.5px solid #C6741B; text-align: center; }
                .txp-btn-fill:hover:not(:disabled) { background: #A15E13; border-color: #A15E13; }
                .txp-btn-outline { border: 1.5px solid #101827; color: #101827; }
                .txp-btn-outline:hover { background: #101827; color: #FFFEFB; }
                .txp-progress-track { background: #F1EDE3; border-radius: 999px; overflow: hidden; }
                .txp-progress-fill { background: #C6741B; height: 100%; }
            `}</style>

            <div className="container max-w-4xl mx-auto px-6 py-12 md:py-16">
                <Link to="/dashboard" className="text-sm text-[#5B6472] hover:text-[#101827] font-medium">
                    &larr; Back to dashboard
                </Link>

                <div className="flex flex-wrap items-center justify-between gap-3 mt-6 mb-2">
                    {isEditingName ? (
                        <div className="flex items-center gap-2 flex-1 max-w-md">
                            <input
                                type="text"
                                value={nameDraft}
                                onChange={(e) => setNameDraft(e.target.value)}
                                className="border border-[#C6741B] rounded-lg px-3 py-1 text-2xl font-semibold txp-wordmark outline-none w-full"
                            />
                            <button onClick={saveEditedName} disabled={savingName} className="p-2 bg-[#2F6F4E] text-white rounded-lg">
                                <FaCheck size={14} />
                            </button>
                            <button onClick={() => setIsEditingName(false)} className="p-2 bg-gray-200 text-gray-700 rounded-lg">
                                <FaTimes size={14} />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <h1 className="txp-wordmark text-[#101827] font-semibold text-3xl sm:text-4xl">
                                {playlist.name || "Your playlist"}
                            </h1>
                            <button onClick={startEditingName} className="text-gray-400 hover:text-[#C6741B]">
                                <FaPencilAlt size={16} />
                            </button>
                        </div>
                    )}

                    {isCompleted ? (
                        <span className="flex items-center gap-1.5 txp-mono text-[10px] uppercase text-[#3B6D11] bg-[#EAF3DE] rounded-full px-3 py-1.5">
                            <FaCheckCircle size={11} /> Marked complete
                        </span>
                    ) : (
                        <span className="txp-mono text-[10px] uppercase text-[#A15E13] bg-[#FBF0DF] border border-[#EAD3AE] rounded-full px-3 py-1.5">
                            Open for new lessons
                        </span>
                    )}
                </div>
                {nameError && <p className="text-xs text-[#E24B4A] mt-1">{nameError}</p>}
                <p className="text-[#5B6472] text-sm mb-10">{videos.length} videos in this course</p>

                {/* Video list */}
                <div className="flex flex-col gap-4 mb-12">
                    {loading ? (
                        <div className="h-24 rounded-xl bg-[#FBF7EF] animate-pulse" />
                    ) : (
                        videos.map((video, i) => (
                            <div key={video._id} className="txp-video-row bg-white border border-[#E8E4DA] rounded-xl p-4 flex flex-col sm:flex-row gap-4">
                                <div className="w-full sm:w-36 shrink-0 rounded-lg overflow-hidden">
                                    <ReactPlayer
                                        controls url={video.url} width="100%" height="80px"
                                        light={<img src={video.thumbnail} alt="" style={{ width: "100%", height: "80px", objectFit: "cover" }} />}
                                    />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <p className="txp-mono text-[10px] text-[#A15E13] uppercase mb-1">Lesson {i + 1}</p>
                                    <h2 className="txp-wordmark text-[#101827] font-semibold text-base leading-snug mb-1 truncate">{video.title}</h2>
                                    {user && <p className="text-[#94918A] text-xs">{user.name} &middot; {new Date(video.createdAt).toLocaleDateString()}</p>}
                                </div>

                                <div className="flex sm:flex-col items-center justify-between sm:justify-center gap-3 shrink-0">
                                    <div className="flex items-center gap-4 text-[#5B6472] text-sm">
                                        <span className="flex items-center gap-1.5"><BiSolidLike size={15} className="text-[#C6741B]" /><CountUp end={video.likes} /></span>
                                        <span className="flex items-center gap-1.5"><BiSolidDislike size={15} className="text-[#94918A]" /><CountUp end={video.dislikes} /></span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => openEditVideo(video)} className="txp-action-btn w-8 h-8 rounded-lg flex items-center justify-center">
                                            <FaPencilAlt size={14} />
                                        </button>
                                        <button onClick={() => setModal({ type: "delete", videoId: video._id })} className="txp-action-btn txp-delete-btn w-8 h-8 rounded-lg flex items-center justify-center">
                                            <MdDelete size={17} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Add Video Module Form Block */}
                {!isCompleted && (
                    <div className="bg-white border border-[#E8E4DA] rounded-2xl p-6 sm:p-8">
                        <h2 className="txp-wordmark text-[#101827] font-semibold text-xl mb-1">Add more videos</h2>
                        <form onSubmit={handlevideoupload} className="flex flex-col gap-6 mt-4">
                            <div>
                                <label className="block text-sm font-medium text-[#334155] mb-1.5">Video title</label>
                                <div className={`txp-field rounded-lg px-3.5 py-2.5 ${formErrors.title ? "txp-field-error" : ""}`}>
                                    <input type="text" placeholder="Lesson title" value={title} onChange={(e) => setTitle(e.target.value)} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#334155] mb-1.5">Thumbnail image</label>
                                <input ref={thumbInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => onThumbnailFile(e.target.files[0])} />
                                {thumbPreview ? (
                                    <div className="relative rounded-xl overflow-hidden h-32">
                                        <img src={thumbPreview} alt="" className="w-full h-full object-cover" />
                                        <button type="button" onClick={() => { setThumbnailfile(null); setThumbPreview(null); }} className="absolute top-2 right-2 p-2 bg-black/70 text-white rounded-full"><FaTimes size={12} /></button>
                                    </div>
                                ) : (
                                    <div onClick={() => thumbInputRef.current?.click()} className="txp-dropzone rounded-xl h-32 flex flex-col items-center justify-center"><FaImage size={18} /><p className="text-sm text-gray-500">Click to browse thumbnail</p></div>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#334155] mb-1.5">Video file</label>
                                <input ref={videoInputRef} type="file" accept="video/*" className="hidden" onChange={(e) => onVideoFile(e.target.files[0])} />
                                {videofile ? (
                                    <div className="flex items-center gap-4 border p-3 rounded-xl">
                                        <video src={videoPreview} className="w-24 h-16 rounded-lg object-cover bg-black" muted controls />
                                        <div className="flex-1"><p className="text-sm font-medium truncate">{videofile.name}</p></div>
                                        <button type="button" onClick={() => { setVideofile(null); setVideoPreview(null); }} className="text-gray-400"><FaTimes size={14} /></button>
                                    </div>
                                ) : (
                                    <div onClick={() => videoInputRef.current?.click()} className="txp-dropzone rounded-xl h-28 flex flex-col items-center justify-center"><FaVideo size={18} /><p className="text-sm text-gray-500">Click to browse video file</p></div>
                                )}
                            </div>
                            {uploading && (
                                <div>
                                    <div className="txp-progress-track h-2 w-full"><div className="txp-progress-fill" style={{ width: `${progress}%` }} /></div>
                                </div>
                            )}
                            <button type="submit" disabled={uploading} className="txp-btn-fill py-3 text-white rounded-lg font-semibold">{uploading ? `Uploading ${progress}%` : "Add video"}</button>
                        </form>
                        <button onClick={() => setModal({ type: "complete" })} className="txp-btn-outline w-full py-3 rounded-lg mt-4 font-semibold">Mark course as complete</button>
                    </div>
                )}
            </div>

            {/* Edit Lesson Form Modal */}
            {editingVideo && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4" onClick={closeEditVideo}>
                    <div className="bg-white rounded-2xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="txp-wordmark text-lg font-semibold">Edit lesson</h2>
                            <button onClick={closeEditVideo} disabled={editSaving} className="text-gray-400"><FaTimes size={16} /></button>
                        </div>
                        <label className="block text-xs font-semibold mb-1">Title</label>
                        <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} disabled={editSaving} className="w-full border rounded-lg px-3 py-2 text-sm outline-none mb-4" />
                        
                        <label className="block text-xs font-semibold mb-1">Change Thumbnail (Optional)</label>
                        <input ref={editThumbInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => {
                            const file = e.target.files?.[0]
                            if(file) { setEditThumbnailFile(file); setEditThumbnailPreview(URL.createObjectURL(file)) }
                        }} />
                        <div onClick={() => editThumbInputRef.current?.click()} className="cursor-pointer border border-dashed rounded-lg p-3 text-center mb-4 text-xs text-gray-500 bg-gray-50">
                            {editThumbnailFile ? `Selected image: ${editThumbnailFile.name}` : "Click to replace thumbnail image"}
                        </div>

                        <label className="block text-xs font-semibold mb-1">Change Video File (Optional)</label>
                        <input ref={editVideoInputRef} type="file" accept="video/*" className="hidden" onChange={(e) => {
                            const file = e.target.files?.[0]
                            if(file) setEditVideoFile(file)
                        }} />
                        <div onClick={() => editVideoInputRef.current?.click()} className="cursor-pointer border border-dashed rounded-lg p-3 text-center mb-4 text-xs text-gray-500 bg-gray-50">
                            {editVideoFile ? `Selected video: ${editVideoFile.name}` : "Click to replace video clip"}
                        </div>

                        {editSaving && (
                            <div className="mb-4">
                                <div className="txp-progress-track h-2 w-full"><div className="txp-progress-fill" style={{ width: `${editProgress}%` }} /></div>
                            </div>
                        )}
                        {editError && <p className="text-xs text-red-500 mb-2">{editError}</p>}
                        <div className="flex gap-3">
                            <button onClick={closeEditVideo} disabled={editSaving} className="flex-1 border py-2 rounded-lg text-sm">Cancel</button>
                            <button onClick={saveEditedVideo} disabled={editSaving} className="flex-1 bg-[#C6741B] text-white py-2 rounded-lg text-sm">{editSaving ? "Saving..." : "Save changes"}</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Universal Confirmation Modal Block */}
            {modal && (
                <div className="fixed inset-0 bg-black/55 z-50 flex items-center justify-center" onClick={closeModal}>
                    <div className="bg-white p-6 rounded-xl max-w-xs w-full" onClick={e => e.stopPropagation()}>
                        <h3 className="font-semibold text-lg mb-2">{modal.type === "delete" ? "Delete this video?" : "Complete course?"}</h3>
                        <div className="flex gap-3 mt-4">
                            <button onClick={closeModal} className="flex-1 border py-2 rounded-lg text-sm">Cancel</button>
                            <button onClick={confirmAction} className="flex-1 bg-[#C6741B] text-white py-2 rounded-lg text-sm">Confirm</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Playlist