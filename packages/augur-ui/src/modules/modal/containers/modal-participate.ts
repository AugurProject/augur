import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { ModalParticipate } from 'modules/modal/components/modal-participate';
import { purchaseParticipationTokens } from 'modules/reporting/actions/participation-tokens-management';
import { closeModal } from 'modules/modal/actions/close-modal';
import { AppState } from 'appStore';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { updateModal } from '../actions/update-modal';
import { MODAL_INITIALIZE_ACCOUNT, GSN_WALLET_SEEN } from 'modules/common/constants';
import { isGSNUnavailable } from 'modules/app/selectors/is-gsn-unavailable';
import getValueFromlocalStorage from 'utils/get-local-storage-value';
import { getTransactionLabel } from 'modules/auth/selectors/get-gas-price';

const mapStateToProps = (state: AppState) => {
  const gsnWalletInfoSeen = getValueFromlocalStorage(GSN_WALLET_SEEN) === "true" ? true : false;

  return {
    modal: state.modal,
    rep: state.loginAccount.balances.rep,
    gasPrice: state.gasPriceInfo.userDefinedGasPrice || state.gasPriceInfo.average,
    messages: [
      {
        key: 'quant',
        preText: 'Quantity (1 token @ 1 REP)',
      },
    ],
    title: 'Buy Participation Tokens',
    GsnEnabled: state.appStatus.gsnEnabled,
    gsnUnavailable: isGSNUnavailable(state),
    gsnWalletInfoSeen,
    transactionLabel: getTransactionLabel(state)
  }
};

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  initializeGsnWallet: (customAction = null) => dispatch(updateModal({ customAction, type: MODAL_INITIALIZE_ACCOUNT })),
  closeModal: () => dispatch(closeModal()),
  purchaseParticipationTokens: (amount, gasEstimate, callback) =>
    dispatch(purchaseParticipationTokens(amount, gasEstimate, callback)),
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ModalParticipate)
);
