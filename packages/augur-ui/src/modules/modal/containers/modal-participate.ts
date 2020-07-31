import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { ModalParticipate } from 'modules/modal/components/modal-participate';
import { purchaseParticipationTokens } from 'modules/reporting/actions/participation-tokens-management';
import { closeModal } from 'modules/modal/actions/close-modal';
import { AppState } from 'appStore';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { getTransactionLabel } from 'modules/auth/selectors/get-gas-price';

const mapStateToProps = (state: AppState) => {

  return {
    modal: state.modal,
    rep: state.loginAccount.balances.rep,
    gasPrice: state.gasPriceInfo.userDefinedGasPrice || state.gasPriceInfo.average,
    ethToDaiRate: state.appStatus.ethToDaiRate,
    messages: [
      {
        key: 'quant',
        preText: 'Quantity (1 token @ 1 REPv2)',
      },
    ],
    title: 'Buy Participation Tokens',
    transactionLabel: getTransactionLabel(state),
  }
};

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
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
