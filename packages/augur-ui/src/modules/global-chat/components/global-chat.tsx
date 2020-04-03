import React from 'react';

import Styles from 'modules/global-chat/components/global-chat.styles.less';
import ChatBox from '3box-chatbox-react';
import { use3box } from 'utils/use-3box';
import { SecondaryButton } from 'modules/common/buttons';
import { THEMES } from 'modules/common/constants';

export interface GlobalChatProps {
  provider: any;
  whichChatPlugin: string;
  theme: string;
}

export const GlobalChat = ({ provider, whichChatPlugin, theme }: GlobalChatProps) => {
  const { activate, setActivate, address, box, isReady, profile } =
    whichChatPlugin === '3box' && use3box(provider, theme);

  return (
    <div className={Styles.GlobalChat}>
      {whichChatPlugin === '3box' && isReady && (
        <ChatBox
          // required
          spaceName="augur"
          threadName="globalChat"
          // Required props for context A) & B)
          box={box}
          currentUserAddr={address}
          // optional
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
      {whichChatPlugin === '3box' && !isReady && (
        <SecondaryButton
          action={() => setActivate(true)}
          text={activate ? "Loading Global Chat..." : "Global Chat"}
          disabled={activate}
        />
      )}
    </div>
  );
};
