import { connect } from 'react-redux';
import { MarketComments } from 'modules/market/components/common/comments/market-comments';
import { ACCOUNT_TYPES } from 'modules/common/constants';
import Web3 from 'web3';

const mapStateToProps = ({loginAccount}) => {
  const signer = loginAccount.meta && loginAccount.meta.signer;

  return signer ? {
    accountType: loginAccount.meta && loginAccount.meta.accountType,
    // // address: (await window.portis.provider.enable())[0],
    // provider: window.portis,
    // address: signer._address.toLowerCase(),
    provider: signer.provider,
  } : window.ethereum ? {
    accountType: ACCOUNT_TYPES.METAMASK,
    // address: (await window.ethereum.enable())[0],
    provider: window.ethereum,
  } : {
    accountType: loginAccount.meta && loginAccount.meta.accountType,
  }
};

const MarketCommentsContainer = connect(mapStateToProps)(MarketComments);

export default MarketCommentsContainer;
