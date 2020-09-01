import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Onboarding } from 'modules/modal/onboarding';
import { updateModal } from 'modules/modal/actions/update-modal';
import { AppState } from 'appStore';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { MODAL_TEST_BET, MODAL_BANKROLL } from 'modules/common/constants';
import { closeModal } from '../actions/close-modal';
import { updateLoginAccount } from 'modules/account/actions/login-account';

const mapStateToProps = (state: AppState) => {
  return {
    address: state.loginAccount.address,
    balances: state.loginAccount.balances,
    blockchain: state.blockchain,
  };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  closeModal: () => dispatch(closeModal()),
  testBetModal: () => dispatch(updateModal({ type: MODAL_TEST_BET })),
  goBack: () => dispatch(updateModal({ type: MODAL_BANKROLL })),
  setCurrentOnboardingStep: (currentOnboardingStep) => dispatch(updateLoginAccount({ currentOnboardingStep })),
});

const mergeProps = (sP: any, dP: any, oP: any) => ({
  ...sP,
  title: 'Please approve your wallet to interact with the Ethereum network',
  showApprovals: true,
  currentStep: 6,
  setCurrentOnboardingStep: dP.setCurrentOnboardingStep,
  goBack: dP.goBack,
  closeModal: dP.closeModal,
  content: [
    {
      content:
        'This is a one time action that’s necesary in order to transact on Augur. It is advised to use the recommended gas price when doing these approvals to prevent any delay.',
    },
    {
      content:
        'Once all approvals are confirmed you can begin making transactions on Augur. If skipped you will be prompted later when required.',
    },
  ],
  buttons: [
    {
      text: 'Next',
      disabled: false,
      action: () => {
        dP.testBetModal();
      },
    },
  ],
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps, mergeProps)(Onboarding)
);
