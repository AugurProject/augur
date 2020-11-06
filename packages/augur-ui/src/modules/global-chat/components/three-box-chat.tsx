import React from 'react';
import ChatBox from '3box-chatbox-react';
import { use3box } from 'utils/use-3box';
import { SecondaryButton } from 'modules/common/buttons';
import { Initialized3box } from 'modules/types';

interface ThreeBoxChatProps {
  provider: any;
  initialize3box: Function;
  initialized3box: Initialized3box;
  openOnMount?: boolean;
  popupChat?: boolean;
  activatedFromStart?: boolean;
}

const ThreeBoxChat = ({
  provider,
  initialize3box,
  initialized3box,
  openOnMount,
  popupChat,
  activatedFromStart
}: ThreeBoxChatProps) => {
  const { activate, setActivate, address, box, isReady, profile } = use3box(
    provider,
    initialize3box,
    initialized3box,
    'chat',
    activatedFromStart
  );

  return isReady ? (
    <ChatBox
      // required
      spaceName="augur"
      threadName="globalChat"
      // Required props for context A) & B)
      box={(box as [any])}
      currentUserAddr={address}
      // optional
      openOnMount={openOnMount}
      popupChat={popupChat}
      mute
      showEmoji
      currentUser3BoxProfile={profile}
      agentProfile={{
        chatName: 'Global Chat',
      }}
    />
  ) : (
    <SecondaryButton
      action={() => setActivate(true)}
      text={activate ? 'Loading Global Chat...' : 'Global Chat'}
      disabled={activate}
    />
  );
};

export default ThreeBoxChat;
