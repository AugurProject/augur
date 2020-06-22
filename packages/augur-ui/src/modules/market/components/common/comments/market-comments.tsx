import React, { lazy, Suspense } from 'react';
import { FacebookComments } from 'modules/market/components/common/comments/facebook-comments';
import Styles from 'modules/market/components/market-view/market-view.styles.less';
import { Initialized3box } from 'modules/types';
import { useAppStatusStore } from 'modules/app/store/app-status';
import { initialize3box } from 'modules/global-chat/actions/initialize-3box';
import { getNetworkId } from 'modules/contracts/actions/contractCalls';

const ThreeBoxComments = lazy(() =>
  import('modules/market/components/common/comments/three-box-comments')
);

const DEFAULT_NUM_POSTS = 10;
const COLOR_SCHEME = 'dark'; // this might change depending on themes
const THREE_BOX_ADMIN_ACCOUNT = '0x913dA4198E6bE1D5f5E4a40D0667f70C0B5430Eb';

export const MarketComments = () => {
  let { isLogged, loginAccount, env, initialized3box: {numPosts, colorScheme} } = useAppStatusStore();
  const signer = loginAccount.meta?.signer;

 
  const adminEthAddr = THREE_BOX_ADMIN_ACCOUNT;
  colorScheme = colorScheme || COLOR_SCHEME;
  const networkId = getNetworkId();
  numPosts = numPosts || DEFAULT_NUM_POSTS;
  const whichCommentPlugin = env.plugins?.comments;
  const provider = signer ? signer.provider?._web3Provider : false;
  initialized3box = signer ? initialized3box : false;

  return isLogged ? (
    <section className={Styles.Comments}>
      {whichCommentPlugin === '3box' && (
        <Suspense fallback={null}>
          <ThreeBoxComments
            // required
            adminEthAddr={adminEthAddr}
            provider={provider}
            initialize3box={initialize3box}
            initialized3box={initialized3box}
            marketId={marketId}
          />
        </Suspense>
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
