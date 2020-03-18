import { connect } from 'react-redux';
import { updateModal } from 'modules/modal/actions/update-modal';
import { Transactions } from 'modules/account/components/transactions';
import {
  NETWORK_IDS,
  MODAL_WITHDRAW,
  MODAL_REP_FAUCET,
  MODAL_DAI_FAUCET,
  MODAL_ADD_FUNDS,
  MODAL_TRANSACTIONS,
  MODAL_ACCOUNT_APPROVAL,
  MODAL_GSN_FAUCET,
} from 'modules/common/constants';
import { AppState } from 'store';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { getNetworkId, getLegacyRep } from 'modules/contracts/actions/contractCalls'
import { isGSNUnavailable } from 'modules/app/selectors/is-gsn-unavailable';

const mapStateToProps = (state: AppState) => {
  const { loginAccount } = state;
  const { meta, balances, address } = loginAccount;
  const signingWallet = meta.signer?._address;
  const networkId = getNetworkId();
  const gsnEnabled = state.appStatus.gsnEnabled;
  const gsnCreated = !isGSNUnavailable(state);

  const showFaucets = gsnEnabled
    ? networkId !== NETWORK_IDS.Mainnet && gsnCreated
    : networkId !== NETWORK_IDS.Mainnet;

  const localLabel = networkId !== NETWORK_IDS.Kovan ? 'Use flash to faucet DAI to address' : null;
  const targetAddress = networkId !== NETWORK_IDS.Kovan ? address : signingWallet;

  return {
    isMainnet: networkId === NETWORK_IDS.Mainnet,
    showFaucets,
    targetAddress,
    signingEth: balances.ethNonSafe,
    gsnCreated,
    localLabel
  };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  repFaucet: () => dispatch(updateModal({ type: MODAL_REP_FAUCET })),
  daiFaucet: () => dispatch(updateModal({ type: MODAL_DAI_FAUCET })),
  addFunds: () => dispatch(updateModal({ type: MODAL_ADD_FUNDS })),
  withdraw: () => dispatch(updateModal({ type: MODAL_WITHDRAW })),
  transactions: () => dispatch(updateModal({ type: MODAL_TRANSACTIONS })),
  approval: () => dispatch(updateModal({ type: MODAL_ACCOUNT_APPROVAL })),
  legacyRepFaucet: () => getLegacyRep(),
  fundGsnWallet: () => dispatch(updateModal({ type: MODAL_GSN_FAUCET })),
});

const TransactionsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Transactions);

export default TransactionsContainer;
