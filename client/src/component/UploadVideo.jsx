import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { media } from '../config/media'
import { FaLock } from "react-icons/fa";
import { API_BASE } from '../config';

const UploadVideo = () => {

    const [title, settitle] = useState('');
    const [videofile, setvideofile] = useState(null)
    const [thumbnailfile, setthumbnailfile] = useState(null);
    let navigate = useNavigate();

    const handlevideoupload = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('video', videofile);
        formData.append('thumbnail', thumbnailfile);

        try {
            const token = localStorage.getItem('token');

            const response = await fetch(`${API_BASE}/api/video/upload`, {
                method: 'POST',
                headers: {
                    'auth-token': token,
                },
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Upload failed');
            }
            console.log(e.target.file)
            const data = await response.json();
            console.log('Upload successful:', data);
            navigate("/dashboard")
        } catch (error) {
            console.error('Upload failed:', error.message);
        }
    };

    return (
        <div>
            {!localStorage.getItem("token") && (
                <div
                    style={{
                        position: "relative",
                        width: "100%",
                        height: "100vh",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        color: "white",
                        flexDirection: "column",
                        textAlign: "center",
                        fontSize: "24px",
                    }}
                >
                    {/* Background with blurred effect */}
                    <div
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            backgroundImage: `url(${media.back2})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            filter: "blur(12px)",
                            zIndex: -1,
                        }}
                    ></div>

                    {/* Dimmed overlay */}
                    <div
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            background: "rgba(0, 0, 0, 0.5)", // Semi-transparent overlay
                            zIndex: 0,
                        }}
                    ></div>

                    {/* Content shown when user is not signed in */}
                    <div style={{ zIndex: 1, display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center" }}>
                        <span className='text-center my-2'><FaLock size={40} color='yellow' className='text-center' /></span>
                        <p>Please Sign in To Upload Lectures</p>
                        <Link className="text-red-500 hover:text-blue-500" to="/signin">
                            &nbsp;&nbsp;&nbsp;Click Here To Sign In
                        </Link>
                    </div>
                </div>
            )}
            {localStorage.getItem("token") &&
                <section className="text-gray-400 body-font relative" style={{ backgroundColor: "#101010" }}>
                    <div className="container px-5 py-24 mx-auto">
                        <div className="flex flex-col text-center w-full mb-12">
                            <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-white">Upload Videos</h1>
                            <p className="lg:w-2/3 mx-auto leading-relaxed text-base">Become a educator and started teaching by upload the first video and this becomes the heading of the course. So upload carefully</p>
                        </div>
                        <div className="lg:w-1/2 md:w-2/3 mx-auto">
                            <div className="flex flex-wrap -m-2">
                                <div className="p-2 w-1/2">
                                    <div className="relative">
                                        <label htmlFor="head" className="leading-7 text-sm text-gray-400">Heading Of The Video</label>
                                        <input value={title} onChange={(e) => {
                                            settitle(e.target.value)
                                        }} type="text" id="head" name="head" className="w-full bg-gray-800 bg-opacity-40 rounded border border-gray-700 focus:border-green-500 focus:bg-gray-900 focus:ring-2 focus:ring-green-900 text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                                    </div>
                                </div>
                                <div className="p-2 w-1/2">
                                    <div className="relative">
                                        <label htmlFor="thumbnail" className="leading-7 text-sm text-gray-400">Thumbnail Image</label>
                                        <input onChange={(e) => {
                                            setthumbnailfile(e.target.files[0])
                                        }} type="file" id="thumbnail" name="thumbnail" className="w-full bg-gray-800 bg-opacity-40 rounded border border-gray-700 focus:border-green-500 focus:bg-gray-900 focus:ring-2 focus:ring-green-900 text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                                    </div>
                                </div>
                                <div className="p-2 w-full">
                                    <div className="relative">
                                        <label htmlFor="video" className="leading-7 text-sm text-gray-400">Upload Video</label>
                                        <input onChange={(e) => {
                                            setvideofile(e.target.files[0])
                                        }} type="file" id="video" name="video" className="w-full bg-gray-800 bg-opacity-40 rounded border border-gray-700 focus:border-green-500 focus:bg-gray-900 focus:ring-2 focus:ring-green-900 text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                                    </div>
                                </div>
                                <div className="p-2 w-full">
                                    <button className="flex mx-auto text-white bg-green-500 border-0 py-2 px-8 focus:outline-none hover:bg-red-500 rounded text-lg" onClick={handlevideoupload}>Upload</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>}
        </div>
    )
}

export default UploadVideo
