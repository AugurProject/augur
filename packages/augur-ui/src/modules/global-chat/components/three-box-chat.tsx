import React from 'react';
import ChatBox from '3box-chatbox-react';
import { use3box } from 'utils/use-3box';
import { SecondaryButton } from 'modules/common/buttons';

const ThreeBoxChat = ({ provider, initialize3box, initialized3box }) => {
  const { activate, setActivate, address, box, isReady, profile } = use3box(
    provider,
    initialize3box,
    initialized3box,
    'chat'
  );

  return isReady ? (
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
      colorTheme="#0E0E0F"
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
