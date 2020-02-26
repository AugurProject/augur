import { connect } from 'react-redux';
import { MarketComments } from 'modules/market/components/common/comments/market-comments';
import { ACCOUNT_TYPES } from 'modules/common/constants';

const mapStateToProps = ({loginAccount}) => {
  const signer = loginAccount.meta && loginAccount.meta.signer;

  return signer ? {
    accountType: loginAccount.meta && loginAccount.meta.accountType,
    address: signer._address.toLowerCase(),
    provider: signer.provider._web3Provider,
  } : window.ethereum ? {
    accountType: ACCOUNT_TYPES.METAMASK,
    address: window.ethereum.selectedAddress,
    provider: window.ethereum,
  } : {
    accountType: loginAccount.meta && loginAccount.meta.accountType,
  }
};

const MarketCommentsContainer = connect(mapStateToProps)(MarketComments);

export default MarketCommentsContainer;
