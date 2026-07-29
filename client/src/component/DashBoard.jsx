import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MdDelete } from "react-icons/md";
import { PieChart, Pie, Sector, Cell, ResponsiveContainer, Tooltip, Legend, Label } from 'recharts';
import ProgressBar from "@ramonak/react-progress-bar";
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { API_BASE } from '../config';

const DashBoard = () => {

    const token = localStorage.getItem('token');
    const getRandomRGBColor = () => {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        return `rgb(${r}, ${g}, ${b})`;
    };

    const [playlists, setPlaylists] = useState([]);
    const populatevideos = async () => {
        try {
            const response = await fetch(`${API_BASE}/api/video/fetchplaylistuser`, {
                method: 'GET',
                headers: {
                    'auth-token': token, // Include auth header if necessary
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch playlists');
            }

            const data = await response.json();
            console.log(data)
            setPlaylists(data);
        } catch (err) {
            console.log("some error has been occured")
        }
    }

    const handleDeletePlaylist = async (id) => {
        try {
            const response = await fetch(`${API_BASE}/api/video/deleteplaylist/${id}`, {
                method: 'DELETE',
                headers: {
                    'auth-token': token,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Failed to delete playlist');
            }
            window.location.reload()

        } catch (error) {
            console.log("some error has been occured")
        }
    }

    useEffect(() => {
        populatevideos();
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
            });

            if (!response.ok) {
                throw new Error('Failed to fetch playlists');
            }

            const json = await response.json();
            console.log(json.uniqueUserSeenPlaylist)
            setseenplaylist(json.uniqueUserSeenPlaylist);
        } catch (err) {
            console.log("some error has been occured")
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
            });
            const json = await response.json();
            const noofvideos = json.NoOfVideos;
            const countVideosUser = json.countVideosOfUser;
            const playlistname = json.playlistname.name;
            const percentage = (countVideosUser / noofvideos) * 100;
            console.log(json);
            return { playlistId, percentage, playlistname };
        } catch (error) {

        }
    }

    useEffect(() => {
        FetchAllPlaylistSeenByUser();
        seenplaylist.forEach(async (playlistId) => {
            const { playlistId: id, percentage, playlistname } = await PercentVideoOfUSer(playlistId);
            setpercent(prevPercent => [...prevPercent, { playlistId: id, percentage, playlistname }]);
        });
    }, [])



    useEffect(() => {
        const fetchpercentages = async () => {
            const percentageData = await Promise.all(
                seenplaylist.map((playlistId) => PercentVideoOfUSer(playlistId))
            )
            setpercent(percentageData)
        }
        if (seenplaylist.length > 0) {
            fetchpercentages();
        }
    }, [seenplaylist])

    let v = 0
    const num = percent.reduce((acc, ind) => acc + ind.percentage, 0);
    const mean = num / percent.length;

    const data = [
        {
            name: 'Page A',
            uv: 4000,
            pv: 2400,
            amt: 2400,
        },
        {
            name: 'Page B',
            uv: 3000,
            pv: 1398,
            amt: 2210,
        },
        {
            name: 'Page C',
            uv: 2000,
            pv: 9800,
            amt: 2290,
        },
        {
            name: 'Page D',
            uv: 2780,
            pv: 3908,
            amt: 2000,
        },
        {
            name: 'Page E',
            uv: 1890,
            pv: 4800,
            amt: 2181,
        },
        {
            name: 'Page F',
            uv: 2390,
            pv: 3800,
            amt: 2500,
        },
        {
            name: 'Page G',
            uv: 3490,
            pv: 4300,
            amt: 2100,
        },
    ];

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
    })




    return (
        <div>
            
            <section style={{ background: "linear-gradient(135deg, rgb(19, 16, 22), rgb(26, 27, 32), rgb(20, 25, 27), rgb(29 31 35), rgb(9, 16, 12))" }}>
            
                <div className='DashboardTop'>
                    <div className='DashboardCircle'>

                        <div className='PlaylistPercentage'>
                            {percent.length > 0 ? (percent.map((val, index) => {
                                return (
                                    <div key={index} className='progressBar'>
                                        <span>{val.playlistname}</span>
                                        <span><ProgressBar width='100%' completed={(val.percentage).toFixed(1)} bgColor={getRandomRGBColor()} /></span>
                                    </div>
                                )
                            })) : <div style={{ color: "white" }}>You Have Not Start A Playlist</div>}
                        </div>
                    </div>
                    <div className='DashboardActivity'>
                        {/* <div className='DashboardDaily'></div>
                        <div className='DashboardWeekly'></div>
                        <div className='DashboardMonthly'></div> */}
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                width={500}
                                height={300}
                                data={data}
                                margin={{
                                    top: 10,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className='DashboardBottom'>
                    <h1 style={{ fontSize: "26px", color: "white", textAlign: "center" }}>Uploaded Playlist</h1>
                    <div className='dashboardPlaylist'>
                        {playlists.length == 0 ? (<div className='text-white text-center'>You don't have started to upload playlist : <a className='text-red-500 cursor-pointer underline hover:text-blue-400'>To upload playlist please fill the form and start the test</a></div>) : (
                            playlists.map((playlist) => {
                                console.log(playlist)
                                return (

                                    <div key={playlist._id} className="xl:w-1/4 md:w-1/2 p-4">
                                        <div style={{ height: "60vh" }} className="bg-gray-800 bg-opacity-40 p-6 rounded-lg">
                                            <img style={{ width: "100%", height: "65%" }} src={playlist.videos[0].thumbnail} alt="content" />
                                            <h3 className="tracking-widest text-green-400 text-xs font-medium title-font">TITLE</h3>
                                            <h2 className="text-lg text-white font-medium title-font mb-4">{playlist.name}</h2>
                                            <Link to={`/playlist/${playlist._id}`} className="leading-relaxed text-basen cursor-pointer  text-red-600 hover:text-blue-600" >See Your Playlist</Link>
                                            <MdDelete onClick={() => { handleDeletePlaylist(playlist._id) }} color='white' size={20} style={{ cursor: "pointer" }} />
                                        </div>
                                    </div>

                                )
                            })
                        )}
                    </div>
                </div>

            </section>
        </div>


        //name of the user , no of videos upload , recent activity : - recent upload , recent video watch , no of video watch of a particular playlist , daily activities , 
    )
}

export default DashBoard
