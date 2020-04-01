import React from 'react';
import ThreeBoxComments from '3box-comments-react';
import { FacebookComments } from 'modules/market/components/common/comments/facebook-comments';

import Styles from 'modules/market/components/market-view/market-view.styles.less';
import { use3box } from 'utils/use-3box';
import { SecondaryButton } from 'modules/common/buttons';

interface MarketCommentsProps {
  adminEthAddr: string;
  colorScheme: string;
  marketId: string;
  networkId: string;
  numPosts: number;
  provider: any;
  whichCommentPlugin: string;
  isLogged: boolean;
}

export const MarketComments = ({
  adminEthAddr,
  colorScheme,
  marketId,
  networkId,
  numPosts,
  provider,
  whichCommentPlugin,
  isLogged,
}: MarketCommentsProps) => {
  const { activate, setActivate, address, box, isReady, profile } =
    whichCommentPlugin === '3box' && use3box(provider);

  return isLogged ? (
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
      {whichCommentPlugin === '3box' && !isReady && (
        <SecondaryButton
          action={() => setActivate(true)}
          text={
            activate ? 'Loading comments...' : 'Click here to activate comments'
          }
          disabled={activate}
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
  ) : null;
};
