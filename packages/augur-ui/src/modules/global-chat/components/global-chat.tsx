import React, { lazy, Suspense, useState } from 'react';
import Styles from 'modules/global-chat/components/global-chat.styles.less';
import { SecondaryButton } from 'modules/common/buttons';
import { Initialized3box } from 'modules/types';
import { Close, ThickChevron } from 'modules/common/icons';
import classNames from 'classnames';

const ThreeBoxChat = lazy(() =>
  import(/* webpackChunkName: '3box-chat' */ 'modules/global-chat/components/three-box-chat')
);

export interface GlobalChatProps {
  provider: any;
  whichChatPlugin: string;
  initialize3box: Function;
  initialized3box: Initialized3box;
  isLogged: boolean;
}

export const GlobalChat = ({
  provider,
  whichChatPlugin,
  isLogged,
  initialize3box,
  initialized3box,
}: GlobalChatProps) => {
  const [show, setShow] = useState(false);

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
            initialize3box={initialize3box}
            initialized3box={initialized3box}
            openOnMount
            popupChat
          />
        </Suspense>
      )}
    </div>
  );
};
