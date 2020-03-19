import { connect } from 'react-redux';
import { MarketComments } from 'modules/market/components/common/comments/market-comments';
import { ACCOUNT_TYPES } from 'modules/common/constants';

const mapStateToProps = ({loginAccount}) => {
  const signer = loginAccount.meta?.signer;

  return signer ? {
    accountType: loginAccount.meta && loginAccount.meta.accountType,
    // // address: (await window.portis.provider.enable())[0],
    // provider: window.portis,
    // address: signer._address.toLowerCase(),
    // provider: signer.provider._web3Provider,
    provider: window.portis.provider,
  } : window.ethereum ? {
    accountType: ACCOUNT_TYPES.METAMASK,
    // address: (await window.ethereum.enable())[0],
    provider: window.ethereum,
  } : {
    accountType: loginAccount.meta && loginAccount.meta.accountType,
  }
};

// const mapStateToProps = (state, ownProps) => ({
//   numPosts: ownProps.numPosts || DEFAULT_NUM_POSTS,
//   colorScheme: ownProps.colorScheme || COLOR_SCHEME,
//   networkId: getNetworkId(),
//   whichCommentPlugin: state.env.plugins?.comments,
// });

const MarketCommentsContainer = connect(mapStateToProps)(MarketComments);

export default MarketCommentsContainer;
