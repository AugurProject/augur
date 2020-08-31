import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Onboarding } from 'modules/modal/onboarding';
import { updateModal } from 'modules/modal/actions/update-modal';
import { AppState } from 'appStore';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import {
  MODAL_APPROVALS,
  MODAL_ETH_DEPOSIT,
  MODAL_SWAP,
  ETH,
} from 'modules/common/constants';
import { closeModal } from '../actions/close-modal';

const mapStateToProps = (state: AppState) => {
  return {
    address: state.loginAccount.address,
    balances: state.loginAccount.balances,
    token: state.modal?.token || ETH,
  };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  closeModal: () => dispatch(closeModal()),
  approvalModal: () => dispatch(updateModal({ type: MODAL_APPROVALS })),
  swapModal: (token) => dispatch(updateModal({ type: MODAL_SWAP, token })),
  goBack: () => dispatch(updateModal({ type: MODAL_ETH_DEPOSIT })),
});

const mergeProps = (sP: any, dP: any, oP: any) => ({
  ...sP,
  goBack: dP.goBack,
  title: 'How much money do you wish to begin your bankroll with?',
  showBankroll: true,
  closeModal: dP.closeModal,
  content: [],
  currentStep: 4,
  swapModal: () => {
    dP.swapModal(sP.token);
  },
  modalAction: () => {
    dP.approvalModal();
  },
  buttons: [],
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps, mergeProps)(Onboarding)
);
