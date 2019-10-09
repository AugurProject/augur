import React from 'react';

import { SecondaryButton } from 'modules/common/buttons';
import { Chevron } from 'modules/common/icons';

import Styles from 'modules/common/global-chat.styles.less';

interface GlobalChatProps {
}

export const GlobalChat = (props: GlobalChatProps) => {
  const toggleGlobalChat = () => {
    console.log('toggle chat!');
  };

  return (
    <div className={Styles.GlobalChat}>
      <SecondaryButton
        action={() => toggleGlobalChat()}
        text='GLOBAL CHAT'
        icon={Chevron}
      />
   </div>
  );
};
