import React from 'react'
import ReactPlayer from 'react-player'

const Video = () => {

  return (
    <div className="player-wrapper">
      <ReactPlayer
        className="react-player fixed-bottom"
        url="videos/mobile.trading.small.mp4"
        width="100%"
        height="100%"
        controls={true}
      />
    </div>
  );
}

export default Video;
