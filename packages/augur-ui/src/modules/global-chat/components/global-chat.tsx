import React from 'react';

import Styles from 'modules/global-chat/components/global-chat.styles.less';
import ChatBox from '3box-chatbox-react';
import { use3box } from 'utils/use-3box';
import { SecondaryButton } from 'modules/common/buttons';
import { THEMES } from 'modules/common/constants';
import { Initialized3box } from 'modules/types';
import { useAppStatusStore } from 'modules/app/store/app-status';

export interface GlobalChatProps {
  provider: any;
  whichChatPlugin: string;
  initialize3box: Function;
  initialized3box: Initialized3box;
}

export const GlobalChat = ({ provider, whichChatPlugin, initialize3box, initialized3box }: GlobalChatProps) => {
  const { theme, isLogged } = useAppStatusStore();
  const { activate, setActivate, address, box, isReady, profile } =
    whichChatPlugin === '3box' && use3box(provider, initialize3box, initialized3box, 'chat');

  return isLogged ? (
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
      {whichChatPlugin === '3box' && !isReady && (
        <SecondaryButton
          action={() => setActivate(true)}
          text={activate ? "Loading Global Chat..." : "Global Chat"}
          disabled={activate}
        />
      )}
    </div>
  ) : null;
};
