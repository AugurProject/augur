import React from 'react';
import { Close } from 'modules/common/icons';

import Styles from 'modules/modal/modal.styles.less';

export interface ModalGlobalChatProps {
  closeModal: Function;
  whichChatPlugin?: string;
}

export const ModalGlobalChat = ({
  closeModal,
  whichChatPlugin,
}: ModalGlobalChatProps) => {
  return (
    whichChatPlugin === 'orbit' && (
      <div className={Styles.ModalGlobalChat}>
        <div>
          <div>
            <span>Global Chat</span>
            <button onClick={() => closeModal()}>{Close}</button>
          </div>
          <iframe src="./chat/index.html#/channel/augur" />
        </div>
      </div>
    )
  );
};
