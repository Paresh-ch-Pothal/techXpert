import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom';
import { API_BASE } from '../config';

const ShowSearchPlaylist = () => {
    const [searchResult,setsearchResult]=useState([]);

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get("search");
    const searchPlaylist = async (query) => {
        try {
            const response = await fetch(`${API_BASE}/api/video/searchPlaylist?search=${query}`, {
                method: 'GET',
                headers: {
                    'COntent-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error("Failed To Fetch Playlist");
            }
            const data = await response.json();

            console.log(data)
            if (data.success) {
                setsearchResult(data.result)
            }
        } catch (error) {
            console.log("some error has been occured")
        }
    }

    useEffect(()=>{
        if(searchQuery){
            searchPlaylist(searchQuery)
        }
        
    },[searchQuery])
    return (
        <div  style={{backgroundColor: "black",overflow: "hidden",width:"100vw"}}>
           <div className="flex flex-wrap my-10">
              {searchResult.length === 0 ? (
                <div className='text-center'>
                    <h1 className="sm:text-3xl text-2xl text-center font-medium title-font mb-2 text-white">No Playlist is Present</h1>
                    <img src="https://img.freepik.com/free-vector/404-error-with-landscape-concept-illustration_114360-7898.jpg" alt="" />
                </div>) : (
                searchResult.map((playlist, index) => {
                  return (
                    <div key={playlist._id} className="xl:w-1/4 md:w-1/2 p-4">
                      <div style={{height: "45vh"}} className="bg-gray-800 bg-opacity-40 p-6 rounded-lg">
                        <img className="h-40 rounded w-full object-cover object-center mb-6" src={playlist.videos[0].thumbnail} />
                        <h3 className="tracking-widest text-green-400 text-xs font-medium title-font">TITLE</h3>
                        <h2 className="text-lg text-white font-medium title-font mb-4">{playlist.name}</h2>
                        <Link className="leading-relaxed text-base text-red-600 hover:text-blue-600" to={`/courseplaylist/${playlist._id}`}>See All The videos</Link>
                      </div>
                    </div>
                  )
                })
              )}

            </div>
        </div>
    )
}

export default ShowSearchPlaylist
