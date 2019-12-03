import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { ModalParticipate } from 'modules/modal/components/modal-participate';
import { purchaseParticipationTokens } from 'modules/reporting/actions/participation-tokens-management';
import { closeModal } from 'modules/modal/actions/close-modal';
import { AppState } from 'store';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { getGasPrice } from 'modules/auth/selectors/get-gas-price';

const mapStateToProps = (state: AppState) => ({
  modal: state.modal,
  rep: state.loginAccount.balances.rep,
  gasPrice: getGasPrice(state),
  messages: [
    {
      key: 'quant',
      preText: 'Quantity (1 token @ 1 REP)',
    },
  ],
  title: 'Buy Participation Tokens',
  Gnosis_ENABLED: state.appStatus.gnosisEnabled,
  ethToDaiRate: state.appStatus.ethToDaiRate,
});

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
