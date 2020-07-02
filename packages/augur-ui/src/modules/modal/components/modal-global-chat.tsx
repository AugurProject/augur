import React from 'react';
import { Close } from 'modules/common/icons';
import Styles from 'modules/modal/modal.styles.less';
import classNames from 'classnames';

export interface ModalGlobalChatProps {
  closeModal: Function;
  whichChatPlugin: string;
}

export const ModalGlobalChat = ({
  closeModal,
  whichChatPlugin,
}: ModalGlobalChatProps) => (
  <div
    className={classNames({
      [Styles.ModalOrbitChat]: whichChatPlugin === 'orbit',
    })}
  >
    <div>
      <div>
        <span>Global Chat</span>
        <button onClick={() => closeModal()}>{Close}</button>
      </div>
      {whichChatPlugin === 'orbit' && (
        <iframe src="./chat/index.html#/channel/augur" />
      )}
    </div>
  </div>
);
