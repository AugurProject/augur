import React from 'react';

import Styles from 'modules/global-chat/components/global-chat.styles.less';
import ChatBox from '3box-chatbox-react';
import { use3box } from 'utils/use-3box';
import { SecondaryButton } from 'modules/common/buttons';

export interface GlobalChatProps {
  provider: any;
  whichChatPlugin?: string;
}

export const GlobalChat = ({ provider, whichChatPlugin }: GlobalChatProps) => {
  const { activate, setActivate, address, box, isReady, profile } =
    whichChatPlugin === '3box' && use3box(provider);

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
          colorTheme="#0E0E0F"
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
