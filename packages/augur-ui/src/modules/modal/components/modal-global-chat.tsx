import React from 'react';
import { Close } from 'modules/common/icons';
import Styles from 'modules/modal/modal.styles.less';
import classNames from 'classnames';
import { useAppStatusStore } from 'modules/app/store/app-status';
import { initialize3box } from 'modules/global-chat/actions/initialize-3box';

const ThreeBoxChat = lazy(() =>
  import('modules/global-chat/components/three-box-chat')
);

export const ModalGlobalChat = () => {
  let {
    loginAccount,
    env,
    modal,
    initialized3box,
    actions: { closeModal },
  } = useAppStatusStore();
  const signer = loginAccount.meta?.signer;

  const whichChatPlugin = env.plugins?.chat;

  let provider = false;
  if (signer) {
    provider = signer.provider?._web3Provider;
  } else {
    initialized3box = false;
  }
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
};
