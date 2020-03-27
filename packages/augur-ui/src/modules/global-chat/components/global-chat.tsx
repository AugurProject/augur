import React from 'react';

import Styles from 'modules/global-chat/components/global-chat.styles.less';
import ChatBox from '3box-chatbox-react';
import { use3box } from 'utils/use-3box';

export interface GlobalChatProps {
  provider: any;
  whichChatPlugin?: string;
}

export const GlobalChat = ({ provider, whichChatPlugin }: GlobalChatProps) => {
  const { address, box, isReady, profile } =
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
          mute={false}
          popupChat
          showEmoji
          colorTheme="#0E0E0F"
          currentUser3BoxProfile={profile}
          agentProfile={{
            chatName: 'Global Chat',
          }}
        />
      )}
    </div>
  );
};
