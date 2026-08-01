// import React, { useEffect, useState } from 'react'
// import jsPDF from 'jspdf';
// import html2canvas from 'html2canvas';
// import { Link } from 'react-router-dom';
// import { media } from '../config/media'
// import { FaLock } from "react-icons/fa";
// import { API_BASE } from '../config';

// const Certificates = () => {


//     const token = localStorage.getItem("token");

//     const generateCertificate = async () => {
//         try {
//             const response = await fetch(`${API_BASE}/api/certificate/generateCertificate`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'auth-token': token
//                 },
//             })
//             const data = await response.json();
//             console.log(data);
//         } catch (error) {

//         }
//     }
//     const [mycertificates, setMyCertificate] = useState([]);
//     const myCertificates = async () => {
//         try {
//             const response = await fetch(`${API_BASE}/api/certificate/myCertificate`, {
//                 method: 'GET',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'auth-token': token
//                 },
//             })
//             const data = await response.json();
//             console.log(data.certificate[0].certificateImage);
//             if (data.success) {
//                 setMyCertificate(data.certificate)
//             }
//         } catch (error) {
//             console.log(error);
//         }
//     }

//     useEffect(() => {
//         myCertificates();
//     }, [token])



//     return (
//         <>
//             {/* {!localStorage.getItem("token") &&
//                 <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh", width: "100%", backgroundColor: "#121413", color: "white" }} >Please Sign in To access Certificates
//                     <div>
//                         <Link className='text-red-500 hover:text-blue-500' to='/signin' >&nbsp;&nbsp;&nbsp;Click Here To Sign In</Link>
//                     </div></div>} */}
//             {!localStorage.getItem("token") && (
//                 <div
//                     style={{
//                         position: "relative",
//                         width: "100%",
//                         height: "100vh",
//                         display: "flex",
//                         justifyContent: "center",
//                         alignItems: "center",
//                         color: "white",
//                         flexDirection: "column",
//                         textAlign: "center",
//                         fontSize: "24px",
//                     }}
//                 >
//                     {/* Background with blurred effect */}
//                     <div
//                         style={{
//                             position: "absolute",
//                             top: 0,
//                             left: 0,
//                             width: "100%",
//                             height: "100%",
//                             backgroundImage: `url(${media.back1})`,
//                             backgroundSize: "cover",
//                             backgroundPosition: "center",
//                             filter: "blur(18px)",
//                             zIndex: -1,
//                         }}
//                     ></div>

//                     {/* Dimmed overlay */}
//                     <div
//                         style={{
//                             position: "absolute",
//                             top: 0,
//                             left: 0,
//                             width: "100%",
//                             height: "100%",
//                             background: "rgba(0, 0, 0, 0.5)", // Semi-transparent overlay
//                             zIndex: 0,
//                         }}
//                     ></div>

//                     {/* Content shown when user is not signed in */}
//                     <div style={{ zIndex: 1 ,display: "flex",justifyContent: "center",flexDirection: "column",alignItems: "center"}}>
//                         <span className='text-center my-2'><FaLock size={40} color='yellow' className='text-center'/></span>
//                         <p>Please Sign in To access Certificates</p>
//                         <Link className="text-red-500 hover:text-blue-500" to="/signin">
//                             &nbsp;&nbsp;&nbsp;Click Here To Sign In
//                         </Link>
//                     </div>
//                 </div>
//             )}
//             {localStorage.getItem("token") &&
//                 <div style={{ backgroundColor: "rgb(13 15 15)" }}>
//                     <div className='certificateContainer' >
//                         {mycertificates.length === 0 ? (<div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh", width: "100%", backgroundColor: "#121413", color: "white" }}>No Certificates have been issued</div>) : (
//                             mycertificates.map((certificate) => {
//                                 return (
//                                     <div key={certificate._id} className='certificateBox'>
//                                         <div className='certificateImg'>
//                                             <img src={certificate.certificateImage} alt="" />
//                                         </div>
//                                         <div className='certificateDetails'>
//                                             <a download={certificate.certificateImage} className="flex cursor-pointer justify-center mx-auto mt-16 text-white bg-green-500 border-0 py-2 px-8 focus:outline-none hover:bg-red-500 rounded text-lg"><span className='text-center'>Click To Download</span></a>
//                                         </div>
//                                     </div>
//                                 )
//                             })
//                         )}
//                     </div>
//                     <button onClick={generateCertificate} className="flex justify-center mx-auto mt-16 text-white bg-green-500 border-0 py-2 px-8 focus:outline-none hover:bg-red-500 rounded text-lg"><span className='text-center'>Click To Generate Certificate</span></button>
//                 </div>}
//         </>
//     )
// }

// export default Certificates



import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { FaLock, FaDownload, FaCertificate } from "react-icons/fa"
import { API_BASE } from '../config'

const GEN_STEPS = [
    "Verifying course completion",
    "Preparing your certificate",
    "Adding your seal",
    "Almost done",
]

const MIN_LOADER_MS = 2200

const SealMark = ({ size = 44, animated = false }) => (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true" className={animated ? "txp-stamp" : ""}>
        <circle cx="20" cy="20" r="18.5" fill="#101827" />
        <circle cx="20" cy="20" r="18.5" fill="none" stroke="#C6741B" strokeWidth="1" strokeDasharray="2 3" />
        <text x="20" y="25" textAnchor="middle" fontFamily="'Fraunces', serif" fontWeight="600" fontSize="15" fill="#FAF6EF">TX</text>
        <circle cx="31.5" cy="30.5" r="2.1" fill="#C6741B" />
    </svg>
)

const Certificates = () => {
    const token = localStorage.getItem("token")

    const [mycertificates, setMyCertificate] = useState([])
    const [loadingList, setLoadingList] = useState(true)
    const [generating, setGenerating] = useState(false)
    const [genStepIndex, setGenStepIndex] = useState(0)
    const [genError, setGenError] = useState(null)
    const [banner, setBanner] = useState(null)

    const stepIntervalRef = useRef(null)

    const myCertificates = async () => {
        try {
            const response = await fetch(`${API_BASE}/api/certificate/myCertificate`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token
                },
            })
            const data = await response.json()
            if (data.success) {
                setMyCertificate(data.certificate)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (!token) return
        setLoadingList(true)
        myCertificates().finally(() => setLoadingList(false))
    }, [token])

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
                    <h1 className="txp-wordmark text-[#FBF7EF] font-semibold text-2xl mb-2">Sign in to access your certificates</h1>
                    <p className="text-[#B8BDC7] text-sm mb-7 leading-relaxed">
                        Your earned certificates live here once you're signed in.
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

                .txp-cert-card { transition: transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease; animation: txp-rise 420ms ease both; }
                .txp-cert-card:hover { transform: translateY(-4px); box-shadow: 0 18px 34px -16px rgba(16, 24, 39, 0.2); border-color: #C6741B; }
                @keyframes txp-rise { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

                .txp-cert-overlay {
                    position: absolute; inset: 0;
                    background: rgba(16, 24, 39, 0.72);
                    display: flex; align-items: center; justify-content: center;
                    opacity: 0; transition: opacity 200ms ease;
                }
                .txp-cert-card:hover .txp-cert-overlay { opacity: 1; }

                .txp-download-btn { transition: background-color 160ms ease, transform 150ms ease; }
                .txp-download-btn:hover { background-color: #A15E13; transform: translateY(-1px); }

                .txp-btn-fill {
                    background: #C6741B; border: 1.5px solid #C6741B;
                    transition: background-color 180ms ease, transform 150ms ease, opacity 160ms ease;
                }
                .txp-btn-fill:hover:not(:disabled) { background: #A15E13; border-color: #A15E13; transform: translateY(-1px); }
                .txp-btn-fill:disabled { opacity: 0.7; cursor: not-allowed; }

                /* Generation overlay */
                .txp-modal-backdrop {
                    position: fixed; inset: 0; z-index: 50;
                    background: rgba(16, 24, 39, 0.6);
                    display: flex; align-items: center; justify-content: center;
                    animation: txp-fade 200ms ease both;
                }
                @keyframes txp-fade { from { opacity: 0; } to { opacity: 1; } }

                .txp-modal-card {
                    background: #FFFEFB; border-radius: 20px;
                    padding: 44px 40px; max-width: 360px; width: 90%;
                    text-align: center;
                    animation: txp-pop 260ms cubic-bezier(.34,1.56,.64,1) both;
                }
                @keyframes txp-pop { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }

                .txp-stamp { animation: txp-stamp-move 1.1s ease-in-out infinite; transform-origin: center; }
                @keyframes txp-stamp-move {
                    0%, 100% { transform: translateY(-6px) rotate(-6deg); }
                    50% { transform: translateY(2px) rotate(-2deg); }
                }

                .txp-step-dots { display: flex; gap: 6px; justify-content: center; margin-top: 18px; }
                .txp-step-dot { width: 6px; height: 6px; border-radius: 50%; background: #E8E4DA; transition: background-color 200ms ease, transform 200ms ease; }
                .txp-step-dot.active { background: #C6741B; transform: scale(1.3); }

                .txp-banner { animation: txp-slide-down 240ms ease both; }
                @keyframes txp-slide-down { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }

                @media (prefers-reduced-motion: reduce) {
                    .txp-cert-card, .txp-cert-overlay, .txp-download-btn, .txp-btn-fill, .txp-step-dot { transition: none; }
                    .txp-cert-card, .txp-modal-backdrop, .txp-modal-card, .txp-banner { animation: none; }
                    .txp-stamp { animation: none; }
                }
            `}</style>

            <div className="container max-w-6xl mx-auto px-6 py-14 md:py-16">
                <div className="flex flex-wrap items-end justify-between gap-6 mb-4">
                    <div>
                        <span className="txp-mono text-[#A15E13] text-xs uppercase">Your credentials</span>
                        <h1 className="txp-wordmark text-[#101827] font-semibold text-3xl sm:text-4xl mt-3">
                            Your certificates
                        </h1>
                    </div>
                </div>

                {banner && (
                    <div className="txp-banner flex items-center gap-2 bg-[#EAF3DE] text-[#3B6D11] text-sm font-medium rounded-lg px-4 py-3 mb-6 max-w-md">
                        <svg width="16" height="16" viewBox="0 0 20 20" fill="none" className="shrink-0">
                            <path d="M4 10.5L8 14.5L16 5.5" stroke="#3B6D11" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        {banner}
                    </div>
                )}
                {genError && (
                    <div className="txp-banner bg-[#FBECEA] text-[#A83A34] text-sm font-medium rounded-lg px-4 py-3 mb-6 max-w-md">
                        {genError}
                    </div>
                )}

                {loadingList ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="h-56 rounded-2xl bg-[#FBF7EF] border border-[#E8E4DA] animate-pulse" />
                        ))}
                    </div>
                ) : mycertificates.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="flex justify-center mb-5">
                            <SealMark size={56} />
                        </div>
                        <p className="txp-wordmark text-[#101827] text-xl font-semibold mb-2">No certificates yet</p>
                        <p className="text-[#5B6472] text-sm mb-7 max-w-sm mx-auto">
                            Finish a course to earn one, or generate a certificate for a
                            course you've already completed.
                        </p>
                        <Link
                            to="/course"
                            className="text-[#A15E13] hover:text-[#101827] text-sm font-semibold"
                        >
                            Browse courses
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                        {mycertificates.map((certificate) => (
                            <div key={certificate._id} className="txp-cert-card relative bg-white border border-[#E8E4DA] rounded-2xl overflow-hidden">
                                <img
                                    src={certificate.certificateImage}
                                    alt="Certificate"
                                    className="w-full h-56 object-cover"
                                />
                                <div className="txp-cert-overlay">
                                    <a
                                        href={certificate.certificateImage}
                                        download
                                        target="_blank"
                                        rel="noreferrer"
                                        className="txp-download-btn flex items-center gap-2 bg-[#C6741B] text-[#FFFEFB] text-sm font-semibold rounded-lg px-5 py-2.5"
                                    >
                                        <FaDownload size={13} />
                                        Download
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            
        </div>
    )
}

export default Certificates