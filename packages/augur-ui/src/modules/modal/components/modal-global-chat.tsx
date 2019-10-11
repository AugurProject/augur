import React, { useState } from 'react';

import { SecondaryButton } from 'modules/common/buttons';
import { Chevron, Close } from 'modules/common/icons';

import Styles from 'modules/modal/modal.styles.less';

export interface ModalGlobalChatProps {
  numberOfPeers: number;
  closeModal: Function;
}

export const ModalGlobalChat = (props: ModalGlobalChatProps) => {
  return (
    <div className={Styles.ModalGlobalChat}>
      <div>
        <div>
          <span>Global Chat</span>
          <button onClick={() => props.closeModal()}>
            {Close}
          </button>
        </div>
        <iframe src='https://augurproject.github.io/orbit-web/#/channel/augur' />
      </div>
    </div>
  );
};
