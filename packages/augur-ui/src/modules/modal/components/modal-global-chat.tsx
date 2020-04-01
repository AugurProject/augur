import React from 'react';
import { Close } from 'modules/common/icons';

import Styles from 'modules/modal/modal.styles.less';
import { use3box } from 'utils/use-3box';
import ChatBox from '3box-chatbox-react';
import { SecondaryButton } from 'modules/common/buttons';

export interface ModalGlobalChatProps {
  closeModal: Function;
  provider: any;
  whichChatPlugin?: string;
  initialize3box: Function;
  initialized3box: object;
}

export const ModalGlobalChat = ({
  closeModal,
  provider,
  whichChatPlugin,
  initialize3box,
  initialized3box,
}: ModalGlobalChatProps) => {
  const { activate, setActivate, address, box, isReady, profile } =
    whichChatPlugin === '3box' && use3box(provider, initialize3box, initialized3box);

  return (
    <div className={Styles.ModalGlobalChat}>
      {whichChatPlugin === '3box' && (
        <div>
          <div>
            <span>Global Chat</span>
            <button onClick={() => closeModal()}>{Close}</button>
          </div>
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
              popupChat={false}
              showEmoji
              colorTheme="#0E0E0F"
              currentUser3BoxProfile={profile}
              agentProfile={{
                chatName: 'Global Chat',
              }}
            />
          )}
          {whichChatPlugin === '3box' && !isReady && (
            <span>
              <SecondaryButton
                action={() => setActivate(true)}
                text={activate ? 'Loading Global Chat...' : 'Global Chat'}
                disabled={activate}
              />
            </span>
          )}
        </div>
      )}
    </div>
  );
};
