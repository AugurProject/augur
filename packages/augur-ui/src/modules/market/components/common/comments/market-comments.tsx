import React from 'react';
import { FacebookComments } from 'modules/market/components/common/comments/facebook-comments';
import Styles from 'modules/market/components/market-view/market-view.styles.less';

interface MarketCommentsProps {
  colorScheme: string;
  marketId: string;
  networkId: string;
  numPosts: number;
  whichCommentPlugin: string;
  isLogged: boolean;
}

export const MarketComments = ({
  colorScheme,
  marketId,
  networkId,
  numPosts,
  whichCommentPlugin,
  isLogged,
}: MarketCommentsProps) => {
  return isLogged ? (
    <section className={Styles.Comments}>
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
