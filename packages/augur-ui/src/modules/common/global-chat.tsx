import * as React from "react";

import { SecondaryButton } from 'modules/common/buttons';
import { Chevron, Close } from 'modules/common/icons';

import Styles from 'modules/common/global-chat.styles.less';

export interface GlobalChatProps {
  toggleGlobalChat: Function;
}

export interface GlobalChatState {
  isOpen: boolean;
}

export class GlobalChat extends React.Component<GlobalChatProps, GlobalChatState> {
  state: GlobalChatState = {
    isOpen: false
  };

  toggleGlobalChat = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  render() {
    const numberOfPeers = 15; // Hard-code this for now
    return (
      <div ref='global-chat' className={Styles.GlobalChat}>
        {!this.state.isOpen &&
          <SecondaryButton
            action={() => this.toggleGlobalChat()}
            text='Global Chat'
            icon={Chevron}
          />
        }
        {this.state.isOpen &&
          <div>
            <div>
              <span>Global Chat</span>
              <span>{numberOfPeers} Peers</span>
              <button onClick={() => this.toggleGlobalChat()}>
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
  }
};
