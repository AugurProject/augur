import React, { lazy, Suspense } from 'react';
import { Close } from 'modules/common/icons';
import Styles from 'modules/modal/modal.styles.less';
import { Initialized3box } from 'modules/types';
import classNames from 'classnames';

const ThreeBoxChat = lazy(() =>
  import('modules/global-chat/components/three-box-chat')
);

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
}: ModalGlobalChatProps) => (
  <div
    className={classNames({
      [Styles.ModalThreeBoxChat]: whichChatPlugin === '3box',
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
      {whichChatPlugin === '3box' && (
        <Suspense fallback={null}>
          <ThreeBoxChat
            provider={provider}
            initialize3box={initialize3box}
            initialized3box={initialized3box}
            activatedFromStart
          />
        </Suspense>
      )}
    </div>
  </div>
);
