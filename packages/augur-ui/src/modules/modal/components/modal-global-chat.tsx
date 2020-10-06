import React, { lazy, Suspense } from 'react';
import { Close } from 'modules/common/icons';
import Styles from 'modules/modal/modal.styles.less';
import classNames from 'classnames';
import { useAppStatusStore } from 'modules/app/store/app-status';

const ThreeBoxChat = lazy(() =>
  import('modules/global-chat/components/three-box-chat')
);

export const ModalGlobalChat = () => {
  const {
    isLogged,
    loginAccount: {
      meta: { signer } = { signer: null },
    },
    env: {
      plugins: { chat } = { chat: null },
    },
    initialized3box,
    actions: { closeModal, setInitialized3Box },
    theme,
  } = useAppStatusStore();
  const provider = signer ? signer.provider?._web3Provider : false;

  return (
    <div
      className={classNames({
        [Styles.ModalThreeBoxChat]: chat === '3box',
        [Styles.ModalOrbitChat]: chat === 'orbit',
      })}
    >
      <div>
        <div>
          <span>Global Chat</span>
          <button onClick={() => closeModal()}>{Close}</button>
        </div>
        {chat === 'orbit' && (
          <iframe src="./chat/index.html#/channel/augur" name={theme} />
        )}
        {isLogged && chat === '3box' && (
          <Suspense fallback={null}>
            <ThreeBoxChat
              provider={provider}
              initialize3box={setInitialized3Box}
              initialized3box={initialized3box || {}}
              activatedFromStart
            />
          </Suspense>
        )}
      </div>
    </div>
  );
};
