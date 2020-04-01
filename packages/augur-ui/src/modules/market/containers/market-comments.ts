import { connect } from 'react-redux';
import { MarketComments } from 'modules/market/components/common/comments/market-comments';
import { getNetworkId } from 'modules/contracts/actions/contractCalls';
import { initialize3box } from 'modules/global-chat/actions/initialize-3box';

const DEFAULT_NUM_POSTS = 10;
const COLOR_SCHEME = 'dark'; // this might change depending on themes
const THREE_BOX_ADMIN_ACCOUNT = '0x913dA4198E6bE1D5f5E4a40D0667f70C0B5430Eb';

const mapStateToProps = ({loginAccount, env, initialized3box}, {numPosts, colorScheme}) => {
  const signer = loginAccount.meta?.signer;

  const defaultCommentProps = {
    adminEthAddr: THREE_BOX_ADMIN_ACCOUNT,
    colorScheme: colorScheme || COLOR_SCHEME,
    networkId: getNetworkId(),
    numPosts: numPosts || DEFAULT_NUM_POSTS,
    whichCommentPlugin: env.plugins?.comments,
  };

  return signer ? {
    ...defaultCommentProps,
    provider: signer.provider?._web3Provider,
    initialized3box,
  } : defaultCommentProps;
};

const mapDispatchToProps = dispatch => ({
  initialize3box: (address, box, profile) => dispatch(initialize3box(address, box, profile)),
});

const MarketCommentsContainer = connect(mapStateToProps, mapDispatchToProps)(MarketComments);

export default MarketCommentsContainer;
