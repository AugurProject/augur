import React, { useState } from 'react';
import Styles from 'modules/global-chat/components/global-chat.styles.less';
import { SecondaryButton } from 'modules/common/buttons';
import { Close, ThickChevron } from 'modules/common/icons';
import classNames from 'classnames';

export interface GlobalChatProps {
  whichChatPlugin: string;
}

export const GlobalChat = ({
  whichChatPlugin,
}: GlobalChatProps) => {
  const [show, setShow] = useState(false);

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
