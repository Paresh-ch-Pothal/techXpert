import React from 'react'
import { media } from '../config/media'
import ReactPlayer from 'react-player'

const VideoPlayer = () => {
    return (
        <div>
            <ReactPlayer light={<img src='https://static.toiimg.com/img/66084423/Master.jpg' alt='Thumbnail' />} playing={true} controls={true} width={340} height={400} volume={0.6} url={media.video1}/>
        </div>
    )
}

export default VideoPlayer