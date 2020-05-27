import { connect } from 'react-redux';
import { updateModal } from 'modules/modal/actions/update-modal';
import { Transactions } from 'modules/account/components/transactions';
import {
  NETWORK_IDS,
  MODAL_TRANSFER,
  MODAL_CASHOUT,
  MODAL_REP_FAUCET,
  MODAL_DAI_FAUCET,
  MODAL_ADD_FUNDS,
  MODAL_TRANSACTIONS,
  MODAL_ACCOUNT_APPROVAL,
  ZERO,
} from 'modules/common/constants';
import { AppState } from 'appStore';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { getNetworkId, getLegacyRep } from 'modules/contracts/actions/contractCalls'
import { createBigNumber } from 'utils/create-big-number';

const mapStateToProps = (state: AppState) => {
  const { loginAccount } = state;
  const { meta, balances } = loginAccount;
  const signingWallet = meta.signer?._address;
  const networkId = getNetworkId();
  const showFaucets = networkId !== NETWORK_IDS.Mainnet;

  const localLabel = networkId !== NETWORK_IDS.Kovan ? 'Use flash to transfer ETH to address' : null;
  const targetAddress = signingWallet;
  const signingWalletNoEth = createBigNumber(balances.signerBalances?.eth || 0).lte(ZERO);

  return {
    isMainnet: networkId === NETWORK_IDS.Mainnet,
    showFaucets,
    targetAddress,
    signingEth: balances.signerBalances?.eth || 0,
    signingWalletNoEth,
    localLabel
  };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  repFaucet: () => dispatch(updateModal({ type: MODAL_REP_FAUCET })),
  daiFaucet: () => dispatch(updateModal({ type: MODAL_DAI_FAUCET })),
  addFunds: () => dispatch(updateModal({ type: MODAL_ADD_FUNDS })),
  transfer: () => dispatch(updateModal({ type: MODAL_TRANSFER })),
  transactions: () => dispatch(updateModal({ type: MODAL_TRANSACTIONS })),
  approval: () => dispatch(updateModal({ type: MODAL_ACCOUNT_APPROVAL })),
  legacyRepFaucet: () => getLegacyRep(),
  cashOut: () => dispatch(updateModal({ type: MODAL_CASHOUT })),
});

const TransactionsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Transactions);

export default TransactionsContainer;
