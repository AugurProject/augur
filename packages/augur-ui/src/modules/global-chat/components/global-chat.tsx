import React, { useState, Suspense, lazy } from 'react';
import Styles from 'modules/global-chat/components/global-chat.styles.less';
import { SecondaryButton } from 'modules/common/buttons';
import { useAppStatusStore } from 'modules/app/store/app-status';
import { ThickChevron, Close } from 'modules/common/icons';
import classNames from 'classnames';
import { useAppStatus } from 'modules/app/store/app-status-hooks';

const ThreeBoxChat = lazy(() =>
  import(/* webpackChunkName: '3box-chat' */ 'modules/global-chat/components/three-box-chat')
);

export const GlobalChat = () => {
  let { isLogged, loginAccount, env, initialized3box } = useAppStatusStore();
  const [show, setShow] = useState(false);
  const signer = loginAccount.meta?.signer;
  const provider = signer ? signer.provider?._web3Provider : false;
  let { setInitialized3Box } = useAppStatus();

  const whichChatPlugin = env.plugins?.chat;
  initialized3box = signer ? initialized3box : false;

  return (
    <div
      className={classNames({
        [Styles.ThreeBoxChat]: whichChatPlugin === '3box',
        [Styles.OrbitChat]: whichChatPlugin === 'orbit',
      })}
    >
      {whichChatPlugin === 'orbit' && !show && (
        <SecondaryButton
          action={() => setShow(!show)}
          text="Global Chat"
          icon={ThickChevron}
        />
      )}
      {whichChatPlugin === 'orbit' && show && (
        <div
          className={classNames({
            [Styles.ShowGlobalChat]: show,
          })}
        >
          <div>
            <span>Global Chat</span>
            <button onClick={() => setShow(!show)}>{Close}</button>
          </div>
          <iframe src="./chat/index.html#/channel/augur" />
        </div>
      )}
      {isLogged && whichChatPlugin === '3box' && (
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

