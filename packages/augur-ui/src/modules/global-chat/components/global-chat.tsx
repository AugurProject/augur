import React, { useEffect, useState } from 'react';

import Styles from 'modules/global-chat/components/global-chat.styles.less';

import Box from '3box';
import ChatBox from '3box-chatbox-react';

export interface GlobalChatProps {
  accountType: string,
  initialChatVisibility: boolean;
  provider: any;
  whichChatPlugin?: string;
}

export const GlobalChat = ({
  accountType,
  initialChatVisibility,
  provider,
  whichChatPlugin,
}: GlobalChatProps) => {
  const [show, setShow] = useState(initialChatVisibility);

  const [address, setAddress] = useState();
  const [box, setBox] = useState({});
  const [isReady, setIsReady] = useState(false);
  const [profile, setProfile] = useState();

  useEffect(() => {
    whichChatPlugin === '3box' && handleLogin();
  }, []);

  useEffect(() => {
    whichChatPlugin === '3box' && handleLogin();
  }, [accountType, provider]);

  const handleLogin = async () => {
    setIsReady(false);

    if (!provider) {
      return;
    }

    let threeBoxInstance;
    let addressFromProvider = (await provider.enable())[0];
    let publicProfile;

    try {
      threeBoxInstance = await Box.create(provider);

      await threeBoxInstance.auth([], { address: addressFromProvider });
      await threeBoxInstance.syncDone;

      const space = await threeBoxInstance.openSpace('augur', {});
      await space.syncDone;

      publicProfile = await Box.getProfile(addressFromProvider);
    } catch (error) {
      console.error(error);
      return;
    }

    setBox(threeBoxInstance);
    setAddress(addressFromProvider);
    setProfile(publicProfile);
    setIsReady(true);
  };

  return (
    <div className={Styles.GlobalChat}>
      {whichChatPlugin === '3box' && isReady && (
      <ChatBox
        // required
        spaceName="augur"
        threadName="globalChat"

        // Required props for context A) & B)
        box={box}
        currentUserAddr={address}

        // optional
        mute={false}
        popupChat
        showEmoji
        colorTheme="#0E0E0F"
        currentUser3BoxProfile={profile}
        // userProfileURL={address => `https://mywebsite.com/user/${address}`}
        // spaceOpts={}
        // threadOpts={}
        agentProfile={{
          chatName: "Global Chat",
          // imageUrl: "https://imgur.com/RXJO8FD"
        }}
      />
      )}
    </div>
  )

  //   whichChatPlugin === 'orbit' && (
  //     <div className={Styles.GlobalChat}>
  //       {!show && (
  //         <SecondaryButton
  //           action={() => setShow(!show)}
  //           text="Global Chat"
  //           icon={Chevron}
  //         />
  //       )}
  //       <div
  //         className={classNames({
  //           [Styles.ShowGlobalChat]: show,
  //         })}
  //       >
  //         <div>
  //           <span>Global Chat</span>
  //           <button onClick={() => setShow(!show)}>{Close}</button>
  //         </div>
  //         <iframe src="./chat/index.html#/channel/augur" />
  //       </div>
  //     </div>
  //   )
  // );
};
