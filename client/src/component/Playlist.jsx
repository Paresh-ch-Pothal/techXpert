import React, { useEffect, useState } from 'react'
import ReactPlayer from 'react-player'
import { useParams } from 'react-router-dom'
import { MdDelete } from "react-icons/md";
import CountUp from 'react-countup';
import { API_BASE } from '../config';


const Playlist = () => {
    const { id } = useParams();
    const [videos, setvideos] = useState([])
    const [user, setuser] = useState(null)
    const [showupload ,setshowupload]=useState(false);

    const fetchPlaylist = async () => {
        try {
            const response = await fetch(`${API_BASE}/api/video/fetchplaylistbyid/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch playlists');
            }

            const data = await response.json();
            console.log(data);
            setvideos(data.videos);
            setuser(data.user);
            console.log(videos)
            console.log(user);
            setshowupload(data.playlist.isCompleted);
        } catch (err) {
            console.log("some error has been occured")
        }
    }

    useEffect(() => {
        fetchPlaylist();
    }, [id])


    const [title, settitle] = useState('');
    const [videofile, setvideofile] = useState(null)
    const [thumbnailfile, setthumbnailfile] = useState(null);

    const handlevideoupload = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('video', videofile);
        formData.append('thumbnail', thumbnailfile);

        try {
            const token = localStorage.getItem('token');

            const response = await fetch(`${API_BASE}/api/video/uploadtoplaylist/${id}`, {
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
            setvideos((prevVideos) => [...prevVideos, data.video]);

            // Clear the input fields after a successful upload
            settitle('');
            setvideofile(null);
            setthumbnailfile(null);
        } catch (error) {
            console.error('Upload failed:', error.message);
        }
    };

    const handleDeleteVideo = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE}/api/video/deletevideo/${id}`, {
                method: 'DELETE',
                headers: {
                    'auth-token': token,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Failed to Delete The video');
            }
            window.location.reload()

        } catch (error) {
            console.log("some error has been occured")
        }
    }

    const [iscompleted,setIsCompleted]=useState(false);

    const markComplete=async()=>{
        try {
            const response=await fetch(`${API_BASE}/api/video/isPlaylistComplete/${id}`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            const data=await response.json();
            console.log(data);
            if (data.success){
                setIsCompleted(true);
                setshowupload(data.playlist.isCompleted);
            }
        } catch (error) {
            
        }
    }

    const token=localStorage.getItem('token');

    const completedPlaylistByUser=async()=>{
        try {
            const response=await fetch(`${API_BASE}/api/video/completedPLaylistByUser`,{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    "auth-token":token
                },
            })
            const data=await response.json();
            console.log(data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(()=>{
        completedPlaylistByUser();
    })

    

    return (
        <>
            <div style={{ background: "linear-gradient(135deg, rgb(11, 10, 10), rgb(30, 31, 37), rgb(19, 23, 25), rgb(16, 16, 19), rgb(32 26 35))", color: "white" }}>
                <h1 style={{ fontSize: "34px", padding: "10px", textAlign: "center" }}>Your Playlist</h1>
                <div className='DashBoardPlaylist'>

                    {videos.length === 0 ? (
                        "No videos are present"
                    ) : (
                        videos.map((video) => {
                            return (
                                <div className='DashBoardplaylisthead' key={video._id}>

                                    <ReactPlayer
                                        controls={true}
                                        playing={false}
                                        url={video.url}
                                        height="24%"
                                        width="28%"
                                        light={<img src={video.thumbnail} alt='Thumbnail' height="100%" width="60%" style={{ borderRadius: "7px" }} />}
                                    />
                                    <div style={{ display: "flex", flexDirection: "column" }}>
                                        <div className='DashBoardplaylisttitle'>Title: {video.title}</div>
                                        {user && <div className='playlistauthor' style={{ color: "gray", fontSize: "16px" }}>
                                            {user.name} | <span>{new Date(video.createdAt).toLocaleDateString()}</span>
                                            <MdDelete onClick={() => { handleDeleteVideo(video._id) }} size={20} style={{ cursor: "pointer" }} />
                                        </div>}
                                    </div>

                                    <div style={{ display: "flex", gap: "10px", marginLeft: "20px" }}>
                                        <span>Likes: <CountUp end={video.likes}></CountUp></span>
                                        <span>DisLikes: <CountUp end={video.dislikes}></CountUp></span>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
                {!showupload && 
                <div style={{ marginTop: "60px" }}>
                    <h1>Add More Videos to it</h1>
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
                            <button onClick={handlevideoupload} className="flex my-8 mx-auto text-white bg-green-500 border-0 py-2 px-8 focus:outline-none hover:bg-green-600 rounded text-lg">Upload</button>
                        </div>
                    </div>
                </div>}

                {!showupload && <button onClick={markComplete} className="flex justify-center mx-auto mt-16 text-white bg-green-500 border-0 py-2 px-8 focus:outline-none hover:bg-red-500 rounded text-lg"><span className='text-center'>Click If Your Video Upload Is completed</span></button>}
            </div>
        </>
    )
}

export default Playlist
