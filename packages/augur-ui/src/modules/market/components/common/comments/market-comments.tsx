import React, { useEffect, useState } from 'react';
import Box from '3box';
import ThreeBoxComments from '3box-comments-react';
import { FacebookComments } from 'modules/market/components/common/comments/facebook-comments';

import Styles from 'modules/market/components/market-view/market-view.styles.less';

interface MarketCommentsProps {
  accountType: string;
  adminEthAddr: string;
  colorScheme: string;
  marketId: string;
  networkId: string;
  numPosts: number;
  provider: any;
  whichCommentPlugin: string;
}

export const MarketComments = ({
  accountType,
  adminEthAddr,
  colorScheme,
  marketId,
  networkId,
  numPosts,
  provider,
  whichCommentPlugin,
}: MarketCommentsProps) => {
  const [address, setAddress] = useState();
  const [box, setBox] = useState({});
  const [isReady, setIsReady] = useState(false);
  const [profile, setProfile] = useState();

  useEffect(() => {
    handleLogin();
  }, []);

  useEffect(() => {
    handleLogin();
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
    <section className={Styles.Comments}>
      {whichCommentPlugin === '3box' && isReady && (
        <ThreeBoxComments
          // required
          spaceName="augur"
          threadName={marketId}
          adminEthAddr={adminEthAddr}

          // Required props for context A) & B)
          box={box}
          currentUserAddr={address}

          // optional
          showCommentCount={numPosts}
          currentUser3BoxProfile={profile}
          // useHovers={true}
        />
      )}
      {whichCommentPlugin === 'facebook' && (
        <FacebookComments
          marketId={marketId}
          colorScheme={colorScheme}
          numPosts={numPosts}
          networkId={networkId}
        />
      )}
    </section>
  );
};
