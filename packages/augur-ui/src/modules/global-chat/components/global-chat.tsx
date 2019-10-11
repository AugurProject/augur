import React, { useState } from 'react';

import { SecondaryButton } from 'modules/common/buttons';
import { Chevron, Close } from 'modules/common/icons';

import Styles from 'modules/global-chat/components/global-chat.styles.less';

export interface GlobalChatProps {
  show: boolean;
  numberOfPeers: number;
}

export const GlobalChat = (props: GlobalChatProps) => {
  const [show, setShow] = useState(props.show);
  return (
    <div className={Styles.GlobalChat}>
      {!show &&
        <SecondaryButton
          action={() => setShow(!show)}
          text='Global Chat'
          icon={Chevron}
        />
      }
      {show &&
        <div>
          <div>
            <span>Global Chat</span>
            <span>{props.numberOfPeers} Peers</span>
            <button onClick={() => setShow(!show)}>
              {Close}
            </button>
          </div>
          <div>
            Chat content goes here.
          </div>
          <div>
            <textarea placeholder='Type your message...' rows='2'></textarea>
          </div>
        </div>
      }
    </div>
  );
};
