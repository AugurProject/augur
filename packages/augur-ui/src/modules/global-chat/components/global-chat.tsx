import React, { useState } from 'react';

import { SecondaryButton } from 'modules/common/buttons';
import { Chevron, Close } from 'modules/common/icons';

import Styles from 'modules/global-chat/components/global-chat.styles.less';
import classNames = require('classnames');

export interface GlobalChatProps {
  initialChatVisibility: boolean;
  whichChatPlugin?: string;
}

export const GlobalChat = ({
  initialChatVisibility,
  whichChatPlugin,
}: GlobalChatProps) => {
  const [show, setShow] = useState(initialChatVisibility);

  return (
    whichChatPlugin === 'orbit' && (
      <div className={Styles.GlobalChat}>
        {!show && (
          <SecondaryButton
            action={() => setShow(!show)}
            text="Global Chat"
            icon={Chevron}
          />
        )}
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
      </div>
    )
  );
};
