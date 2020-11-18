import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Onboarding } from 'modules/modal/onboarding';
import { updateModal } from 'modules/modal/actions/update-modal';
import { AppState } from 'appStore';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import {
  MODAL_ETH_DEPOSIT,
  MODAL_BANKROLL,
} from 'modules/common/constants';
import { closeModal } from '../actions/close-modal';
import { updateLoginAccount } from 'modules/account/actions/login-account';

const mapStateToProps = (state: AppState) => {
  const ethToDaiRate = state.appStatus?.ethToDaiRate?.value;

  return {
    address: state.loginAccount.address,
    balances: state.loginAccount.balances,
    ethToDaiRate,
  };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  closeModal: () => dispatch(closeModal()),
  bankrollModal: (token: string) =>
    dispatch(updateModal({ type: MODAL_BANKROLL, token })),
  goBack: () => dispatch(updateModal({ type: MODAL_ETH_DEPOSIT })),
  setCurrentOnboardingStep: (currentOnboardingStep) => dispatch(updateLoginAccount({ currentOnboardingStep })),
});

const mergeProps = (sP: any, dP: any, oP: any) => ({
  ...sP,
  goBack: dP.goBack,
  title:
    'DAI is required for trading. Which currency would you like to convert to DAI?',
  closeModal: dP.closeModal,
  content: [],
  showCompoundToolTip: true,
  currentStep: 3,
  setCurrentOnboardingStep: dP.setCurrentOnboardingStep,
  modalAction: token => {
    dP.bankrollModal(token);
  },
  buttons: [],
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps, mergeProps)(Onboarding)
);
