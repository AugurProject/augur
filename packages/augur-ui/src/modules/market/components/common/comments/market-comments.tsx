import React from 'react';
import { FacebookComments } from 'modules/market/components/common/comments/facebook-comments';

import Styles from 'modules/market/components/market-view/market-view.styles.less';
import { Initialized3box } from 'modules/types';
import ThreeBoxComments from 'modules/market/components/common/comments/three-box-comments';

interface MarketCommentsProps {
  adminEthAddr: string;
  colorScheme: string;
  marketId: string;
  networkId: string;
  numPosts: number;
  provider: any;
  whichCommentPlugin: string;
  initialize3box: Function;
  initialized3box: Initialized3box;
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
  initialize3box,
  initialized3box,
  isLogged,
}: MarketCommentsProps) => {
  return isLogged ? (
    <section className={Styles.Comments}>
      {whichCommentPlugin === '3box' && (
        <ThreeBoxComments
          // required
          adminEthAddr={adminEthAddr}
          provider={provider}
          initialize3box={initialize3box}
          initialized3box={initialized3box}
          marketId={marketId}
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
