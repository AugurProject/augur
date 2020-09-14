import React, { lazy, Suspense } from 'react';
import { FacebookComments } from 'modules/market/components/common/comments/facebook-comments';
import Styles from 'modules/market/components/market-view/market-view.styles.less';
import { useAppStatusStore } from 'modules/app/store/app-status';
import { getNetworkId } from 'modules/contracts/actions/contractCalls';

const ThreeBoxComments = lazy(() =>
  import(/* webpackChunkName: '3box-comments' */ 'modules/market/components/common/comments/three-box-comments')
);

const DEFAULT_NUM_POSTS = 10;

export const MarketComments = ({
  marketId,
  colorScheme = 'dark',
  numPosts = DEFAULT_NUM_POSTS,
}) => {
  const {
    isLogged,
    env: {
      plugins: { comments } = { comments: null },
    },
  } = useAppStatusStore();
  const threeBoxAdminAccount = '0x913dA4198E6bE1D5f5E4a40D0667f70C0B5430Eb';

  const networkId = getNetworkId();

  return isLogged ? (
    <section className={Styles.Comments}>
      {comments === '3box' && (
        <Suspense fallback={null}>
          <ThreeBoxComments
            adminEthAddr={threeBoxAdminAccount}
            marketId={marketId}
          />
        </Suspense>
      )}
      {comments === 'facebook' && (
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
