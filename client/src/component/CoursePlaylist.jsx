import React, { useEffect, useReducer, useRef, useState } from 'react'
import ReactPlayer from 'react-player';
import { Link, useParams } from 'react-router-dom';
import { FaPlay } from "react-icons/fa";
import { BiSolidLike } from "react-icons/bi";
import { BiSolidDislike } from "react-icons/bi";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { media } from '../config/media'
import { FaLock } from "react-icons/fa";
import { API_BASE } from '../config';

const CoursePlaylist = () => {
    const { id } = useParams();
    const [playlist, setplaylist] = useState([])
    const [videos, setvideos] = useState([])
    const [user, setuser] = useState([])

    const token = localStorage.getItem("token");

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
            setplaylist(data.playlist)
            setvideos(data.videos)
            setuser(data.user)
        } catch (err) {
            console.log("some error has been occured")
        }
    }

    useEffect(() => {
        fetchPlaylist();
    }, [id])


    const [videoStates, setVideoStates] = useState({});
    const handleLikedVideo = async (videoId) => {
        try {
            const response = await fetch(`${API_BASE}/api/video/videolike/${videoId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token
                },
            });
            const json = await response.json()
            if (json.success) {
                setVideoStates((prevStates) => ({
                    ...prevStates,
                    [videoId]: {
                        liked: prevStates[videoId]?.liked === 1 ? 0 : 1,
                        disliked: 0
                    }
                }));
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
            });
            const json = await response.json()
            if (json.success) {
                setVideoStates((prevStates) => ({
                    ...prevStates,
                    [videoId]: {
                        liked: 0,
                        disliked: prevStates[videoId]?.disliked === 1 ? 0 : 1
                    }
                }));
            }
        } catch (error) {
            console.log(error)
        }
    }


    const [completedVideo, setcompletedVideo] = useState([])


    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(`${API_BASE}/api/user/fetchuserbyid`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'auth-token': token
                    },
                });
                const json = await response.json()
                console.log(json);
                console.log(json.user.completedVideo)
                if (json.success) {
                    const initialStatus = {};
                    json.user.likedVideos.forEach((vid) => {
                        initialStatus[vid._id] = { liked: 1, disliked: 0 }
                    });
                    json.user.dislikedVideos.forEach((vid) => {
                        initialStatus[vid._id] = { liked: 0, disliked: 1 }
                    })
                    setVideoStates(initialStatus)
                    setcompletedVideo(json.user.completedVideo.map((vid) => vid._id))
                }

            } catch (error) {
                console.log(error);
            }
        }
        fetchUser()
    }, [token])

    const [cvideo, setcvideo] = useState()

    const handleCompletedVideo = async (videoId) => {
        try {
            const response = await fetch(`${API_BASE}/api/video/completebyuser/${videoId}`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token
                }
            });
            const json = await response.json();
            console.log(json);
            if (json.success) {
                console.log(completedVideo);
                setcompletedVideo(prev => [...prev, videoId])
            }

        } catch (error) {
            console.log(error);
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
            });
            const json = await response.json();
            console.log(json);
            if (json.success) {
                console.log(completedVideo)
                setcompletedVideo(prev => prev.filter((id) => id !== videoId))
            }
        } catch (error) {
            console.log(error);
        }
    }

    const data01 = [
        { name: 'Group A', value: 400 },
        { name: 'Group B', value: 300 },
        { name: 'Group C', value: 300 },
        { name: 'Group D', value: 100 },
    ];

    const COLORS = ['#FF8042', '#0088FE', '#00C49F', '#FFBB28'];

    const completedPlaylistByUser = async () => {
        try {
            const response = await fetch(`${API_BASE}/api/user/completedPLaylistByUser`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    "auth-token": token
                },
            })
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        completedPlaylistByUser();
    }, [])




    return (
        <>
            {localStorage.getItem("token") ?
                (<div style={{ background: "linear-gradient(135deg, rgb(11, 10, 10), rgb(30, 31, 37), rgb(19, 23, 25), rgb(16, 16, 19), rgb(32 26 35))", color: "white" }}>
                    <h1 style={{ fontSize: "34px", padding: "10px", textAlign: "center" }}>Your Playlist</h1>
                    <div className='playlist'>
                        <div className='sideBar'>
                            <div className='sideBarimg'><img
                                src={videos.length > 0 && videos[0].thumbnail ? videos[0].thumbnail : "default-thumbnail.jpg"}
                                alt="Thumbnail" height={250} width={250} />
                            </div>
                            <h1 style={{ fontSize: "20px" }}>{playlist.name}</h1>
                            <small style={{ fontSize: "16px", color: "gray" }}>Author: {user.name}</small>
                            <span style={{ fontSize: "16px", color: "gray" }}>Total Videos: {videos.length}</span>
                            <span style={{ fontSize: "16px", color: "gray" }}>Last Updated:  {new Date(playlist.createdAt).toLocaleDateString()}</span>
                            <button className="flex items-center justify-center mx-auto text-black bg-white border-0 py-2 px-8 focus:outline-none hover:bg-green-600 rounded text-lg" style={{ borderRadius: "20px" }}>
                                <FaPlay className='mx-1' size={20} style={{ marginRight: '8px' }} />Play The Playlist
                            </button>
                        </div>
                        <div className='videosPlaylist'>
                            {videos.length === 0 ? (
                                <h1>No PlayList Is Present</h1>
                            ) : (
                                videos.map((video) => {
                                    return (

                                        <div className='playlisthead' key={video._id}>
                                            <div className='reactPlayer'>
                                                <ReactPlayer
                                                    controls={true}
                                                    playing={false}
                                                    url={video.url}
                                                    height="150px"
                                                    width="150px"
                                                    light={<img src={video.thumbnail} alt='Thumbnail' height='auto' width="100%" style={{ borderRadius: "7px" }} />}
                                                />
                                            </div>
                                            <div style={{ display: "flex", flexDirection: "column" }}>
                                                <h1 className='playlisttitle' style={{ zIndex: 3 }}>{video.title}</h1>
                                                {user && <small className='playlistauthor' style={{ color: "gray", fontSize: "16px" }}>{user.name} | <span>{new Date(video.createdAt).toLocaleDateString()}</span>
                                                </small>}
                                            </div>
                                            <div style={{ display: "flex", gap: "10px", position: "absolute", right: "10%" }}>
                                                <BiSolidLike onClick={() => { handleLikedVideo(video._id) }} color={videoStates[video._id]?.liked === 1 ? "red" : "white"} size={25} style={{ cursor: "pointer" }} />
                                                <BiSolidDislike onClick={() => { handleDislikedVideo(video._id) }} color={videoStates[video._id]?.disliked === 1 ? "blue" : "white"} style={{ cursor: "pointer" }} size={25} />
                                                <input
                                                    type="checkbox"
                                                    checked={completedVideo.includes(video._id)}
                                                    onChange={(e) => {
                                                        setcvideo(e.target.checked);
                                                        if (e.target.checked) {
                                                            handleCompletedVideo(video._id);
                                                        }
                                                        else {
                                                            handleIncompleteVideo(video._id);
                                                        }
                                                    }}
                                                    style={{ cursor: "pointer", width: "16px" }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {/* {videos.length === 0 ? (
                            "No videos are present"
                        ) : (
                            videos.map((video) => {
                                return (
                                    <div className='playlisthead' key={video._id}>
                                        <div className='playlisttitle' style={{ zIndex: 3 }}>Name: {video.title}</div>
                                        <ReactPlayer
                                            controls={true}
                                            playing={false}
                                            url={video.url}
                                            height="50%"
                                            width="80%"
                                            light={<img src={video.thumbnail} alt='Thumbnail' height="70%" width="85%" style={{ borderRadius: "7px" }} />}
                                        />
                                        {user && <div className='playlistauthor' style={{ zIndex: 3 }}>Author: {user.name}
                                        </div>}
                                    </div>
                                );
                            })
                        )} */}
                    </div>
                </div>) :
                (<div
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
                            backgroundImage: `url(${media.back3})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            filter: "blur(18px)",
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
                        <p>Please Sign in To access Courses</p>
                        <Link className="text-red-500 hover:text-blue-500" to="/signin">
                            &nbsp;&nbsp;&nbsp;Click Here To Sign In
                        </Link>
                    </div>
                </div>)}
        </>
    )
}

export default CoursePlaylist
