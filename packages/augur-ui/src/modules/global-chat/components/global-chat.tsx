import React, { useState } from 'react';
import Styles from 'modules/global-chat/components/global-chat.styles.less';
import { SecondaryButton } from 'modules/common/buttons';
import { useAppStatusStore } from 'modules/app/store/app-status';
import { ThickChevron, Close } from 'modules/common/icons';
import classNames from 'classnames';

export const GlobalChat = () => {
  let { loginAccount, env, initialized3box } = useAppStatusStore();
  const [show, setShow] = useState(false);
  const signer = loginAccount.meta?.signer;

  const whichChatPlugin = env.plugins?.chat;
  initialized3box = signer ? initialized3box : false;

  return (
    <div
      className={classNames({
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
    </div>
  );
};
