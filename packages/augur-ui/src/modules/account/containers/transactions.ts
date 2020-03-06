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
} from 'modules/common/constants';
import { AppState } from 'store';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { getNetworkId, getLegacyRep } from 'modules/contracts/actions/contractCalls'
import { isGSNUnavailable } from 'modules/app/selectors/is-gsn-unavailable';

const mapStateToProps = (state: AppState) => {
  const networkId = getNetworkId();
  const GSN_ENABLED = state.appStatus.gsnEnabled;
  const gsnUnavailable = isGSNUnavailable(state);

  const showFaucets = GSN_ENABLED
    ? networkId !== NETWORK_IDS.Mainnet && !gsnUnavailable
    : networkId !== NETWORK_IDS.Mainnet;

  return {
    isMainnet: networkId === NETWORK_IDS.Mainnet,
    showFaucets,
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
});

const TransactionsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Transactions);

export default TransactionsContainer;
