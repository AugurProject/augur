import React from 'react'
import ReactPlayer from 'react-player'
import Styles from 'modules/modal/modal.styles.less';
import * as classNames from 'classnames';
import { Title, ButtonsRow } from 'modules/modal/common';

const Video = ({ title, closeAction, buttons }) => (
  <div className={classNames(Styles.Message)}>
    <Title title={title} closeAction={closeAction} />
    <main>
    <div className="player-wrapper">
      <ReactPlayer
        className="react-player fixed-bottom"
        url="videos/mobile.trading.medium.mp4"
        width="100%"
        height="100%"
        controls={true}
      />
    </div>
    </main>
    {buttons.length > 0 && <ButtonsRow buttons={buttons} />}
  </div>

  )

export default Video;
