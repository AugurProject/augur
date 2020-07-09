import React from 'react';
import { FacebookComments } from 'modules/market/components/common/comments/facebook-comments';
import Styles from 'modules/market/components/market-view/market-view.styles.less';
import { useAppStatusStore } from 'modules/app/store/app-status';
import { getNetworkId } from 'modules/contracts/actions/contractCalls';

const DEFAULT_NUM_POSTS = 10;

export const MarketComments = ({
  marketId,
  colorScheme = 'dark',
  numPosts = DEFAULT_NUM_POSTS,
}) => {
  let { isLogged, env } = useAppStatusStore();
  const networkId = getNetworkId();
  const whichCommentPlugin = env.plugins?.comments;

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
