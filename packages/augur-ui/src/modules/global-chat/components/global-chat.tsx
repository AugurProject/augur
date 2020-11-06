import React, { lazy, Suspense, useState } from 'react';
// @ts-ignore
import Styles from 'modules/global-chat/components/global-chat.styles.less';
import { SecondaryButton } from 'modules/common/buttons';
import { useAppStatusStore } from 'modules/app/store/app-status';
import { Close, ThickChevron } from 'modules/common/icons';
import classNames from 'classnames';

const ThreeBoxChat = lazy(() =>
  import(/* webpackChunkName: '3box-chat' */ 'modules/global-chat/components/three-box-chat')
);

export const GlobalChat = () => {
  const [show, setShow] = useState(false);

  const {
    isLogged,
    loginAccount: {
      meta: { signer } = { signer: null },
    },
    env: {
      plugins: { chat } = { chat: null },
    },
    initialized3box,
    actions: { setInitialized3Box },
    theme,
  } = useAppStatusStore();
  const provider = signer ? signer.provider?._web3Provider : false;

  return (
    <div
      className={classNames({
        [Styles.ThreeBoxChat]: chat === '3box',
        [Styles.OrbitChat]: chat === 'orbit',
      })}
    >
      {chat === 'orbit' && !show && (
        <SecondaryButton
          action={() => setShow(!show)}
          text="Global Chat"
          icon={ThickChevron}
        />
      )}
      {chat === 'orbit' && show && (
        <div
          className={classNames({
            [Styles.ShowGlobalChat]: show,
          })}
        >
          <div>
            <span>Global Chat</span>
            <button onClick={() => setShow(!show)}>{Close}</button>
          </div>
          <iframe src="./chat/index.html#/channel/augur" name={theme} key={theme} />
        </div>
      )}
      {isLogged && chat === '3box' && (
        <Suspense fallback={null}>
          <ThreeBoxChat
            provider={provider}
            initialize3box={setInitialized3Box}
            initialized3box={initialized3box}
            openOnMount
            popupChat
          />
        </Suspense>
      )}
    </div>
  );
};

