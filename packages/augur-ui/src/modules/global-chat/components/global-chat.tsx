import React, { useState } from 'react';

import Styles from 'modules/global-chat/components/global-chat.styles.less';
import ChatBox from '3box-chatbox-react';
import { use3box } from 'utils/use-3box';
import { SecondaryButton } from 'modules/common/buttons';
import { THEMES } from 'modules/common/constants';
import { Initialized3box } from 'modules/types';
import { useAppStatusStore } from 'modules/app/store/app-status';
import { ThickChevron, Close } from 'modules/common/icons';
import classNames from 'classnames';

export interface GlobalChatProps {
  provider: any;
  whichChatPlugin: string;
  initialize3box: Function;
  initialized3box: Initialized3box;
}

export const GlobalChat = ({ provider, whichChatPlugin, initialize3box, initialized3box }: GlobalChatProps) => {
  const { theme, isLogged } = useAppStatusStore();
  const [show, setShow] = useState(false);
  const { activate, setActivate, address, box, isReady, profile } =
    whichChatPlugin === '3box' && use3box(provider, initialize3box, initialized3box, 'chat');

  return (
    <div className={classNames({
        [Styles.ThreeBoxChat]: whichChatPlugin === '3box',
        [Styles.OrbitChat]: whichChatPlugin === 'orbit',
      })}>
      {whichChatPlugin === 'orbit' && !show && (
        <SecondaryButton
            action={() => setShow(!show)}
            text='Global Chat'
            icon={ThickChevron}
        />
      )}
      {whichChatPlugin === 'orbit' && show && (
        <div className={classNames({
          [Styles.ShowGlobalChat]: show
        })}>
            <div>
                <span>Global Chat</span>
                <button onClick={() => setShow(!show)}>
                  {Close}
                </button>
            </div>
            <iframe src='./chat/index.html#/channel/augur' />
        </div>
      )}
      {isLogged && whichChatPlugin === '3box' && isReady && (
        <ChatBox
          // required
          spaceName="augur"
          threadName="globalChat"
          // Required props for context A) & B)
          box={box}
          currentUserAddr={address}
          // optional
          openOnMount
          mute
          popupChat
          showEmoji
          colorTheme={theme !== THEMES.TRADING ? '#D1D1D9' : '#0E0E0F'}
          currentUser3BoxProfile={profile}
          agentProfile={{
            chatName: 'Global Chat',
          }}
        />
      )}
      {isLogged && whichChatPlugin === '3box' && !isReady && (
        <SecondaryButton
          action={() => setActivate(true)}
          text={activate ? "Loading Global Chat..." : "Global Chat"}
          disabled={activate}
        />
      )}
    </div>
  );
};
