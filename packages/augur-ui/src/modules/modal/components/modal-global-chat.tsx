import React, { lazy, Suspense, useState } from 'react';
import { Close } from 'modules/common/icons';
import Styles from 'modules/modal/modal.styles.less';
import classNames from 'classnames';
import { use3box } from 'utils/use-3box';
import { useAppStatusStore } from 'modules/app/store/app-status';
import { useAppStatus } from 'modules/app/store/app-status-hooks';

const ThreeBoxChat = lazy(() =>
  import('modules/global-chat/components/three-box-chat')
);

export interface ModalGlobalChatProps {
  closeModal: Function;
  provider: any;
  whichChatPlugin: string;
  isLogged: boolean;
}

export const ModalGlobalChat = () => {
  let { isLogged, loginAccount, env, initialized3box, actions: { closeModal } } = useAppStatusStore();
  const signer = loginAccount.meta?.signer;
  const provider = signer ? signer.provider?._web3Provider : false;
  let { setInitialized3Box } = useAppStatus();

  const whichChatPlugin = env.plugins?.chat;
  initialized3box = signer ? initialized3box : false;

  return (
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
        {isLogged && whichChatPlugin === '3box' && (
          <Suspense fallback={null}>
            <ThreeBoxChat
              provider={provider}
              initialize3box={setInitialized3Box}
              initialized3box={initialized3box}
              activatedFromStart
            />
          </Suspense>
        )}
      </div>
    </div>
  );
};
