import React from 'react';
import { Close } from 'modules/common/icons';

import Styles from 'modules/modal/modal.styles.less';
import { use3box } from 'utils/use-3box';
import ChatBox from '3box-chatbox-react';
import { SecondaryButton } from 'modules/common/buttons';
import { Initialized3box } from 'modules/types';
import classNames from 'classnames';

export interface ModalGlobalChatProps {
  closeModal: Function;
  provider: any;
  whichChatPlugin: string;
  initialize3box: Function;
  initialized3box: Initialized3box;
  isLogged: boolean;
}

export const ModalGlobalChat = ({
  closeModal,
  provider,
  whichChatPlugin,
  initialize3box,
  initialized3box,
}: ModalGlobalChatProps) => {
  const { activate, setActivate, address, box, isReady, profile } =
    whichChatPlugin === '3box' && use3box(provider, initialize3box, initialized3box, 'chat',true);

  return (
    <div className={classNames({
      [Styles.ModalThreeBoxChat]: whichChatPlugin === '3box',
      [Styles.ModalOrbitChat]: whichChatPlugin === 'orbit',
    })}>
      <div>
        <div>
          <span>Global Chat</span>
          <button onClick={() => closeModal()}>{Close}</button>
        </div>
        {whichChatPlugin === 'orbit' && (
          <iframe src='./chat/index.html#/channel/augur' />
        )}
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
    </div>
  );
};
