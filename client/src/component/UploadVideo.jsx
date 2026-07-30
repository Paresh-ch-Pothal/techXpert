
// import React, { useEffect, useRef, useState } from 'react'
// import { Link, useNavigate } from 'react-router-dom'
// import { FaLock, FaCloudUploadAlt, FaImage, FaVideo, FaTimes } from "react-icons/fa"
// import { API_BASE } from '../config'
// import { uploadVideoAndThumbnail } from '../utils/CloudinaryUpload'

// const SealMark = ({ size = 44 }) => (
//     <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
//         <circle cx="20" cy="20" r="18.5" fill="#101827" />
//         <circle cx="20" cy="20" r="18.5" fill="none" stroke="#C6741B" strokeWidth="1" strokeDasharray="2 3" />
//         <text x="20" y="25" textAnchor="middle" fontFamily="'Fraunces', serif" fontWeight="600" fontSize="15" fill="#FAF6EF">TX</text>
//         <circle cx="31.5" cy="30.5" r="2.1" fill="#C6741B" />
//     </svg>
// )

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

// const UploadVideo = () => {
//     const [title, setTitle] = useState('')
//     const [videofile, setVideofile] = useState(null)
//     const [thumbnailfile, setThumbnailfile] = useState(null)
//     const [thumbPreview, setThumbPreview] = useState(null)
//     const [videoPreview, setVideoPreview] = useState(null)
//     const [dragThumb, setDragThumb] = useState(false)
//     const [dragVideo, setDragVideo] = useState(false)
//     const [errors, setErrors] = useState({})
//     const [uploading, setUploading] = useState(false)
//     const [progress, setProgress] = useState(0)
//     const [submitError, setSubmitError] = useState(null)

//     const navigate = useNavigate()
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
//         setErrors((e) => ({ ...e, thumbnail: null }))
//     }

//     const onVideoFile = (file) => {
//         if (!file) return
//         if (videoPreview) URL.revokeObjectURL(videoPreview)
//         setVideofile(file)
//         setVideoPreview(URL.createObjectURL(file))
//         setErrors((e) => ({ ...e, video: null }))
//     }

//     const validate = () => {
//         const next = {}
//         if (!title.trim()) next.title = "Give your course a title."
//         if (!thumbnailfile) next.thumbnail = "Add a thumbnail image."
//         if (!videofile) next.video = "Add a video file."
//         setErrors(next)
//         return Object.keys(next).length === 0
//     }

//     const handlevideoupload = async (e) => {
//         e.preventDefault()
//         setSubmitError(null)
//         if (!validate()) return

//         setUploading(true)
//         setProgress(0)

//         try {
//             const token = localStorage.getItem('token')

//             // Step 1: upload directly to Cloudinary (client -> Cloudinary, server not involved)
//             const { videoURL, thumbnailURL } = await uploadVideoAndThumbnail(
//                 videofile,
//                 thumbnailfile,
//                 token,
//                 setProgress
//             )

//             // Step 2: save metadata to your backend (fast, no file bytes)
//             const res = await fetch(`${API_BASE}/api/video/upload`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'auth-token': token,
//                 },
//                 body: JSON.stringify({ title, videoURL, thumbnailURL }),
//             })

//             if (!res.ok) throw new Error('Failed to save video details')

//             navigate("/dashboard")
//         } catch (error) {
//             console.error('Upload failed:', error.message)
//             setSubmitError(error.message || "Upload failed. Try again.")
//         } finally {
//             setUploading(false)
//         }
//     }

//     if (!localStorage.getItem("token")) {
//         return (
//             <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="min-h-screen bg-[#101827] flex items-center justify-center px-6">
//                 <style>{`
//                     @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
//                     .txp-wordmark { font-family: 'Fraunces', serif; }
//                 `}</style>
//                 <div className="bg-[#17223A] border border-[rgba(255,254,251,0.1)] rounded-2xl p-10 max-w-sm w-full text-center">
//                     <div className="w-14 h-14 rounded-full bg-[#2A2313] flex items-center justify-center mx-auto mb-5">
//                         <FaLock size={20} color="#E8A845" />
//                     </div>
//                     <h1 className="txp-wordmark text-[#FBF7EF] font-semibold text-2xl mb-2">Sign in to upload a video</h1>
//                     <p className="text-[#B8BDC7] text-sm mb-7 leading-relaxed">
//                         You'll need an account to start teaching on TechXpert.
//                     </p>
//                     <Link
//                         to="/signin"
//                         className="inline-flex items-center justify-center bg-[#C6741B] text-[#FFFEFB] font-semibold text-base py-3 px-8 rounded-lg hover:bg-[#A15E13] transition-colors"
//                     >
//                         Sign in
//                     </Link>
//                 </div>
//             </div>
//         )
//     }

//     return (
//         <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="min-h-screen bg-[#FFFEFB]">
//             <style>{`
//                 @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500&display=swap');

//                 .txp-wordmark { font-family: 'Fraunces', serif; }
//                 .txp-mono { font-family: 'IBM Plex Mono', monospace; letter-spacing: 0.06em; }

//                 .txp-field {
//                     background: #FFFEFB; border: 1.5px solid #E8E4DA;
//                     transition: border-color 160ms ease;
//                 }
//                 .txp-field:focus-within { border-color: #C6741B; }
//                 .txp-field.txp-field-error { border-color: #E24B4A; }
//                 .txp-field input {
//                     background: transparent; border: none; outline: none;
//                     width: 100%; font-size: 15px; color: #101827;
//                 }
//                 .txp-field input::placeholder { color: #B0AC9F; }

//                 .txp-dropzone {
//                     border: 1.5px dashed #D8D2C4;
//                     background: #FBF7EF;
//                     transition: border-color 180ms ease, background-color 180ms ease;
//                     cursor: pointer;
//                 }
//                 .txp-dropzone:hover { border-color: #C6741B; }
//                 .txp-dropzone.dragging { border-color: #C6741B; background: #FBF0DF; }
//                 .txp-dropzone.has-error { border-color: #E24B4A; }

//                 .txp-remove-btn {
//                     background: rgba(16, 24, 39, 0.7); color: #FFFEFB;
//                     transition: background-color 160ms ease;
//                 }
//                 .txp-remove-btn:hover { background: rgba(16, 24, 39, 0.9); }

//                 .txp-btn-fill {
//                     background: #C6741B; border: 1.5px solid #C6741B;
//                     transition: background-color 180ms ease, transform 150ms ease, opacity 160ms ease;
//                 }
//                 .txp-btn-fill:hover:not(:disabled) { background: #A15E13; border-color: #A15E13; transform: translateY(-1px); }
//                 .txp-btn-fill:disabled { opacity: 0.7; cursor: not-allowed; }

//                 .txp-progress-track { background: #F1EDE3; border-radius: 999px; overflow: hidden; }
//                 .txp-progress-fill { background: #C6741B; height: 100%; transition: width 200ms ease; }

//                 @media (prefers-reduced-motion: reduce) {
//                     .txp-field, .txp-dropzone, .txp-remove-btn, .txp-btn-fill, .txp-progress-fill { transition: none; }
//                 }
//             `}</style>

//             <div className="container max-w-3xl mx-auto px-6 py-16 md:py-20">
//                 <div className="flex justify-center mb-6">
//                     <SealMark size={44} />
//                 </div>
//                 <div className="text-center mb-12">
//                     <span className="txp-mono text-[#A15E13] text-xs uppercase">Teach</span>
//                     <h1 className="txp-wordmark text-[#101827] font-semibold text-3xl sm:text-4xl mt-3 mb-4">
//                         Upload a video
//                     </h1>
//                     <p className="text-[#5B6472] text-base leading-relaxed max-w-lg mx-auto">
//                         This becomes the first lesson of a new course, and its title
//                         becomes the course title — so name it well.
//                     </p>
//                 </div>

//                 <form onSubmit={handlevideoupload} className="bg-white border border-[#E8E4DA] rounded-2xl p-6 sm:p-8 flex flex-col gap-6">
//                     {submitError && (
//                         <div className="bg-[#FBECEA] text-[#A83A34] text-sm font-medium rounded-lg px-4 py-3">
//                             {submitError}
//                         </div>
//                     )}

//                     <div>
//                         <label htmlFor="head" className="block text-sm font-medium text-[#334155] mb-1.5">
//                             Course title
//                         </label>
//                         <div className={`txp-field rounded-lg px-3.5 py-2.5 ${errors.title ? "txp-field-error" : ""}`}>
//                             <input
//                                 type="text"
//                                 id="head"
//                                 name="head"
//                                 placeholder="e.g. Introduction to React Hooks"
//                                 value={title}
//                                 onChange={(e) => {
//                                     setTitle(e.target.value)
//                                     setErrors((err) => ({ ...err, title: null }))
//                                 }}
//                             />
//                         </div>
//                         {errors.title && <p className="text-xs text-[#E24B4A] mt-1.5">{errors.title}</p>}
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-[#334155] mb-1.5">Thumbnail image</label>
//                         <input
//                             ref={thumbInputRef}
//                             type="file"
//                             id="thumbnail"
//                             name="thumbnail"
//                             accept="image/*"
//                             className="hidden"
//                             onChange={(e) => onThumbnailFile(e.target.files[0])}
//                         />
//                         {thumbPreview ? (
//                             <div className="relative rounded-xl overflow-hidden h-40">
//                                 <img src={thumbPreview} alt="Thumbnail preview" className="w-full h-full object-cover" />
//                                 <button
//                                     type="button"
//                                     onClick={() => { onThumbnailFile(null); setThumbnailfile(null); setThumbPreview(null); if (thumbInputRef.current) thumbInputRef.current.value = "" }}
//                                     className="txp-remove-btn absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center"
//                                     aria-label="Remove thumbnail"
//                                 >
//                                     <FaTimes size={13} />
//                                 </button>
//                             </div>
//                         ) : (
//                             <div
//                                 onClick={() => thumbInputRef.current?.click()}
//                                 onDragOver={(e) => { e.preventDefault(); setDragThumb(true) }}
//                                 onDragLeave={() => setDragThumb(false)}
//                                 onDrop={(e) => { e.preventDefault(); setDragThumb(false); onThumbnailFile(e.dataTransfer.files[0]) }}
//                                 className={`txp-dropzone rounded-xl h-40 flex flex-col items-center justify-center gap-2 ${dragThumb ? "dragging" : ""} ${errors.thumbnail ? "has-error" : ""}`}
//                             >
//                                 <FaImage size={20} className="text-[#C6741B]" />
//                                 <p className="text-[#5B6472] text-sm text-center px-4">
//                                     Drag an image here, or click to browse
//                                 </p>
//                             </div>
//                         )}
//                         {errors.thumbnail && <p className="text-xs text-[#E24B4A] mt-1.5">{errors.thumbnail}</p>}
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-[#334155] mb-1.5">Video file</label>
//                         <input
//                             ref={videoInputRef}
//                             type="file"
//                             id="video"
//                             name="video"
//                             accept="video/*"
//                             className="hidden"
//                             onChange={(e) => onVideoFile(e.target.files[0])}
//                         />
//                         {videofile ? (
//                             <div className="flex items-center gap-4 border border-[#E8E4DA] rounded-xl p-3">
//                                 <video src={videoPreview} className="w-28 h-20 rounded-lg object-cover bg-black shrink-0" muted controls />
//                                 <div className="min-w-0 flex-1">
//                                     <p className="text-[#101827] text-sm font-medium truncate">{videofile.name}</p>
//                                     <p className="text-[#94918A] text-xs">{formatBytes(videofile.size)}</p>
//                                 </div>
//                                 <button
//                                     type="button"
//                                     onClick={() => { onVideoFile(null); setVideofile(null); setVideoPreview(null); if (videoInputRef.current) videoInputRef.current.value = "" }}
//                                     className="text-[#94918A] hover:text-[#A83A34] shrink-0"
//                                     aria-label="Remove video"
//                                 >
//                                     <FaTimes size={15} />
//                                 </button>
//                             </div>
//                         ) : (
//                             <div
//                                 onClick={() => videoInputRef.current?.click()}
//                                 onDragOver={(e) => { e.preventDefault(); setDragVideo(true) }}
//                                 onDragLeave={() => setDragVideo(false)}
//                                 onDrop={(e) => { e.preventDefault(); setDragVideo(false); onVideoFile(e.dataTransfer.files[0]) }}
//                                 className={`txp-dropzone rounded-xl h-32 flex flex-col items-center justify-center gap-2 ${dragVideo ? "dragging" : ""} ${errors.video ? "has-error" : ""}`}
//                             >
//                                 <FaVideo size={20} className="text-[#C6741B]" />
//                                 <p className="text-[#5B6472] text-sm text-center px-4">
//                                     Drag a video here, or click to browse
//                                 </p>
//                             </div>
//                         )}
//                         {errors.video && <p className="text-xs text-[#E24B4A] mt-1.5">{errors.video}</p>}
//                     </div>

//                     {uploading && (
//                         <div>
//                             <div className="flex items-center justify-between mb-1.5">
//                                 <span className="text-[#5B6472] text-xs">Uploading&hellip;</span>
//                                 <span className="txp-mono text-[11px] text-[#A15E13]">{progress}%</span>
//                             </div>
//                             <div className="txp-progress-track h-2 w-full">
//                                 <div className="txp-progress-fill" style={{ width: `${progress}%` }} />
//                             </div>
//                         </div>
//                     )}

//                     <button
//                         type="submit"
//                         disabled={uploading}
//                         className="txp-btn-fill flex items-center justify-center gap-2 text-[#FFFEFB] font-semibold text-base py-3 rounded-lg"
//                     >
//                         <FaCloudUploadAlt size={17} />
//                         {uploading ? `Uploading ${progress}%` : "Upload"}
//                     </button>
//                 </form>
//             </div>
//         </div>
//     )
// }

// export default UploadVideo


import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaLock, FaCloudUploadAlt, FaImage, FaVideo, FaTimes } from "react-icons/fa"
import { API_BASE } from '../config'
import { uploadVideoAndThumbnail } from '../utils/CloudinaryUpload'

const SealMark = ({ size = 44 }) => (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
        <circle cx="20" cy="20" r="18.5" fill="#101827" />
        <circle cx="20" cy="20" r="18.5" fill="none" stroke="#C6741B" strokeWidth="1" strokeDasharray="2 3" />
        <text x="20" y="25" textAnchor="middle" fontFamily="'Fraunces', serif" fontWeight="600" fontSize="15" fill="#FAF6EF">TX</text>
        <circle cx="31.5" cy="30.5" r="2.1" fill="#C6741B" />
    </svg>
)

const formatBytes = (bytes) => {
    if (!bytes) return ""
    const mb = bytes / (1024 * 1024)
    return mb >= 1 ? `${mb.toFixed(1)} MB` : `${(bytes / 1024).toFixed(0)} KB`
}

const uploadWithProgress = (url, formData, headers, onProgress) =>
    new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open('POST', url)
        Object.entries(headers).forEach(([key, value]) => xhr.setRequestHeader(key, value))
        xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100))
        }
        xhr.onload = () => {
            let json
            try { json = JSON.parse(xhr.responseText) } catch { json = null }
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(json)
            } else {
                reject(new Error(json?.message || 'Upload failed'))
            }
        }
        xhr.onerror = () => reject(new Error('Upload failed'))
        xhr.send(formData)
    })

const UploadVideo = () => {
    const [title, setTitle] = useState('')
    const [videofile, setVideofile] = useState(null)
    const [thumbnailfile, setThumbnailfile] = useState(null)
    const [thumbPreview, setThumbPreview] = useState(null)
    const [videoPreview, setVideoPreview] = useState(null)
    const [dragThumb, setDragThumb] = useState(false)
    const [dragVideo, setDragVideo] = useState(false)
    const [errors, setErrors] = useState({})
    const [uploading, setUploading] = useState(false)
    const [progress, setProgress] = useState(0)
    const [submitError, setSubmitError] = useState(null)

    const navigate = useNavigate()
    const thumbInputRef = useRef(null)
    const videoInputRef = useRef(null)

    useEffect(() => {
        return () => {
            if (thumbPreview) URL.revokeObjectURL(thumbPreview)
            if (videoPreview) URL.revokeObjectURL(videoPreview)
        }
    }, [thumbPreview, videoPreview])

    const onThumbnailFile = (file) => {
        if (!file) return
        if (thumbPreview) URL.revokeObjectURL(thumbPreview)
        setThumbnailfile(file)
        setThumbPreview(URL.createObjectURL(file))
        setErrors((e) => ({ ...e, thumbnail: null }))
    }

    const onVideoFile = (file) => {
        if (!file) return
        if (videoPreview) URL.revokeObjectURL(videoPreview)
        setVideofile(file)
        setVideoPreview(URL.createObjectURL(file))
        setErrors((e) => ({ ...e, video: null }))
    }

    const validate = () => {
        const next = {}
        if (!title.trim()) next.title = "Give your course a title."
        if (!thumbnailfile) next.thumbnail = "Add a thumbnail image."
        if (!videofile) next.video = "Add a video file."
        setErrors(next)
        return Object.keys(next).length === 0
    }

    const handlevideoupload = async (e) => {
        e.preventDefault()
        setSubmitError(null)
        if (!validate()) return

        setUploading(true)
        setProgress(0)

        try {
            const token = localStorage.getItem('token')

            // Step 1: upload directly to Cloudinary (client -> Cloudinary, server not involved)
            const { videoURL, thumbnailURL } = await uploadVideoAndThumbnail(
                videofile,
                thumbnailfile,
                token,
                setProgress
            )

            // Step 2: save metadata to your backend (fast, no file bytes)
            const res = await fetch(`${API_BASE}/api/video/upload`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token,
                },
                body: JSON.stringify({ title, videoURL, thumbnailURL }),
            })

            if (!res.ok) throw new Error('Failed to save video details')

            navigate("/dashboard")
        } catch (error) {
            console.error('Upload failed:', error.message)
            setSubmitError(error.message || "Upload failed. Try again.")
        } finally {
            setUploading(false)
        }
    }

    if (!localStorage.getItem("token")) {
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
                    <h1 className="txp-wordmark text-[#FBF7EF] font-semibold text-2xl mb-2">Sign in to upload a video</h1>
                    <p className="text-[#B8BDC7] text-sm mb-7 leading-relaxed">
                        You'll need an account to start teaching on TechXpert.
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
                @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500&display=swap');

                .txp-wordmark { font-family: 'Fraunces', serif; }
                .txp-mono { font-family: 'IBM Plex Mono', monospace; letter-spacing: 0.06em; }

                .txp-field {
                    background: #FFFEFB; border: 1.5px solid #E8E4DA;
                    transition: border-color 160ms ease;
                }
                .txp-field:focus-within { border-color: #C6741B; }
                .txp-field.txp-field-error { border-color: #E24B4A; }
                .txp-field input {
                    background: transparent; border: none; outline: none;
                    width: 100%; font-size: 15px; color: #101827;
                }
                .txp-field input::placeholder { color: #B0AC9F; }

                .txp-dropzone {
                    border: 1.5px dashed #D8D2C4;
                    background: #FBF7EF;
                    transition: border-color 180ms ease, background-color 180ms ease;
                    cursor: pointer;
                }
                .txp-dropzone:hover { border-color: #C6741B; }
                .txp-dropzone.dragging { border-color: #C6741B; background: #FBF0DF; }
                .txp-dropzone.has-error { border-color: #E24B4A; }

                .txp-remove-btn {
                    background: rgba(16, 24, 39, 0.7); color: #FFFEFB;
                    transition: background-color 160ms ease;
                }
                .txp-remove-btn:hover { background: rgba(16, 24, 39, 0.9); }

                .txp-btn-fill {
                    background: #C6741B; border: 1.5px solid #C6741B;
                    transition: background-color 180ms ease, transform 150ms ease, opacity 160ms ease;
                }
                .txp-btn-fill:hover:not(:disabled) { background: #A15E13; border-color: #A15E13; transform: translateY(-1px); }
                .txp-btn-fill:disabled { opacity: 0.7; cursor: not-allowed; }

                .txp-progress-track { background: #F1EDE3; border-radius: 999px; overflow: hidden; }
                .txp-progress-fill { background: #C6741B; height: 100%; transition: width 200ms ease; }

                @media (prefers-reduced-motion: reduce) {
                    .txp-field, .txp-dropzone, .txp-remove-btn, .txp-btn-fill, .txp-progress-fill { transition: none; }
                }
            `}</style>

            <div className="container max-w-3xl mx-auto px-6 py-16 md:py-20">
                <div className="flex justify-center mb-6">
                    <SealMark size={44} />
                </div>
                <div className="text-center mb-12">
                    <span className="txp-mono text-[#A15E13] text-xs uppercase">Teach</span>
                    <h1 className="txp-wordmark text-[#101827] font-semibold text-3xl sm:text-4xl mt-3 mb-4">
                        Upload a video
                    </h1>
                    <p className="text-[#5B6472] text-base leading-relaxed max-w-lg mx-auto">
                        This becomes the first lesson of a new course, and its title
                        becomes the course title — so name it well.
                    </p>
                </div>

                <form onSubmit={handlevideoupload} className="bg-white border border-[#E8E4DA] rounded-2xl p-6 sm:p-8 flex flex-col gap-6">
                    {submitError && (
                        <div className="bg-[#FBECEA] text-[#A83A34] text-sm font-medium rounded-lg px-4 py-3">
                            {submitError}
                        </div>
                    )}

                    <div>
                        <label htmlFor="head" className="block text-sm font-medium text-[#334155] mb-1.5">
                            Course title
                        </label>
                        <div className={`txp-field rounded-lg px-3.5 py-2.5 ${errors.title ? "txp-field-error" : ""}`}>
                            <input
                                type="text"
                                id="head"
                                name="head"
                                placeholder="e.g. Introduction to React Hooks"
                                value={title}
                                onChange={(e) => {
                                    setTitle(e.target.value)
                                    setErrors((err) => ({ ...err, title: null }))
                                }}
                            />
                        </div>
                        {errors.title && <p className="text-xs text-[#E24B4A] mt-1.5">{errors.title}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#334155] mb-1.5">Thumbnail image</label>
                        <input
                            ref={thumbInputRef}
                            type="file"
                            id="thumbnail"
                            name="thumbnail"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => onThumbnailFile(e.target.files[0])}
                        />
                        {thumbPreview ? (
                            <div className="relative rounded-xl overflow-hidden h-40">
                                <img src={thumbPreview} alt="Thumbnail preview" className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => { onThumbnailFile(null); setThumbnailfile(null); setThumbPreview(null); if (thumbInputRef.current) thumbInputRef.current.value = "" }}
                                    className="txp-remove-btn absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center"
                                    aria-label="Remove thumbnail"
                                >
                                    <FaTimes size={13} />
                                </button>
                            </div>
                        ) : (
                            <div
                                onClick={() => thumbInputRef.current?.click()}
                                onDragOver={(e) => { e.preventDefault(); setDragThumb(true) }}
                                onDragLeave={() => setDragThumb(false)}
                                onDrop={(e) => { e.preventDefault(); setDragThumb(false); onThumbnailFile(e.dataTransfer.files[0]) }}
                                className={`txp-dropzone rounded-xl h-40 flex flex-col items-center justify-center gap-2 ${dragThumb ? "dragging" : ""} ${errors.thumbnail ? "has-error" : ""}`}
                            >
                                <FaImage size={20} className="text-[#C6741B]" />
                                <p className="text-[#5B6472] text-sm text-center px-4">
                                    Drag an image here, or click to browse
                                </p>
                            </div>
                        )}
                        {errors.thumbnail && <p className="text-xs text-[#E24B4A] mt-1.5">{errors.thumbnail}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#334155] mb-1.5">Video file</label>
                        <input
                            ref={videoInputRef}
                            type="file"
                            id="video"
                            name="video"
                            accept="video/*"
                            className="hidden"
                            onChange={(e) => onVideoFile(e.target.files[0])}
                        />
                        {videofile ? (
                            <div className="flex items-center gap-4 border border-[#E8E4DA] rounded-xl p-3">
                                <video src={videoPreview} className="w-28 h-20 rounded-lg object-cover bg-black shrink-0" muted controls />
                                <div className="min-w-0 flex-1">
                                    <p className="text-[#101827] text-sm font-medium truncate">{videofile.name}</p>
                                    <p className="text-[#94918A] text-xs">{formatBytes(videofile.size)}</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => { onVideoFile(null); setVideofile(null); setVideoPreview(null); if (videoInputRef.current) videoInputRef.current.value = "" }}
                                    className="text-[#94918A] hover:text-[#A83A34] shrink-0"
                                    aria-label="Remove video"
                                >
                                    <FaTimes size={15} />
                                </button>
                            </div>
                        ) : (
                            <div
                                onClick={() => videoInputRef.current?.click()}
                                onDragOver={(e) => { e.preventDefault(); setDragVideo(true) }}
                                onDragLeave={() => setDragVideo(false)}
                                onDrop={(e) => { e.preventDefault(); setDragVideo(false); onVideoFile(e.dataTransfer.files[0]) }}
                                className={`txp-dropzone rounded-xl h-32 flex flex-col items-center justify-center gap-2 ${dragVideo ? "dragging" : ""} ${errors.video ? "has-error" : ""}`}
                            >
                                <FaVideo size={20} className="text-[#C6741B]" />
                                <p className="text-[#5B6472] text-sm text-center px-4">
                                    Drag a video here, or click to browse
                                </p>
                            </div>
                        )}
                        {errors.video && <p className="text-xs text-[#E24B4A] mt-1.5">{errors.video}</p>}
                    </div>

                    {uploading && (
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <span className="text-[#5B6472] text-xs">Uploading&hellip;</span>
                                <span className="txp-mono text-[11px] text-[#A15E13]">{progress}%</span>
                            </div>
                            <div className="txp-progress-track h-2 w-full">
                                <div className="txp-progress-fill" style={{ width: `${progress}%` }} />
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={uploading}
                        className="txp-btn-fill flex items-center justify-center gap-2 text-[#FFFEFB] font-semibold text-base py-3 rounded-lg"
                    >
                        <FaCloudUploadAlt size={17} />
                        {uploading ? `Uploading ${progress}%` : "Upload"}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default UploadVideo