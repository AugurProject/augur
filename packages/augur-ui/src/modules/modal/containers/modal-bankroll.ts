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
  USDT,
  USDC,
} from 'modules/common/constants';
import { closeModal } from '../actions/close-modal';
import { updateLoginAccount } from 'modules/account/actions/login-account';
import { createBigNumber } from 'utils/create-big-number';

const mapStateToProps = (state: AppState) => {
  return {
    address: state.loginAccount?.address,
    balances: state.loginAccount?.balances,
    token: state.modal?.token || ETH,
    accountType: state.loginAccount?.meta?.accountType,
    ethToDaiRate: state.appStatus?.ethToDaiRate?.value,
  };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  closeModal: () => dispatch(closeModal()),
  approvalModal: () => dispatch(updateModal({ type: MODAL_APPROVALS })),
  swapModal: (token) => dispatch(updateModal({ type: MODAL_SWAP, token })),
  goBack: () => dispatch(updateModal({ type: MODAL_ETH_DEPOSIT })),
  setCurrentOnboardingStep: (currentOnboardingStep) => dispatch(updateLoginAccount({ currentOnboardingStep })),
});

const mergeProps = (sP: any, dP: any, oP: any) => {
  const MIN_AMOUNT = 50000;
  let hasBalanceOver50k = false;

  if (sP.token === USDC) {
    const totalUSDC = createBigNumber(Number(sP.balances.signerBalances.usdc));
    if (totalUSDC.gt(MIN_AMOUNT)) {
      hasBalanceOver50k = true;
    }
  } else if (sP.token === USDT) {
    const totalUSDT = createBigNumber(Number(sP.balances.signerBalances.usdt));
    if (totalUSDT.gt(MIN_AMOUNT)) {
      hasBalanceOver50k = true;
    }
  } else {
    const totalETHinDai = createBigNumber(Number(sP.balances.signerBalances.eth)).times(sP.ethToDaiRate);
    if (totalETHinDai.gt(MIN_AMOUNT)) {
      hasBalanceOver50k = true;
    }
  }

  return {
    ...sP,
    goBack: dP.goBack,
    title: 'How much money do you wish to begin your bankroll with?',
    showBankroll: true,
    closeModal: dP.closeModal,
    content: [],
    currentStep: 4,
    hasBalanceOver50k,
    setCurrentOnboardingStep: dP.setCurrentOnboardingStep,
    swapModal: () => {
      dP.swapModal(sP.token);
    },
    modalAction: () => {
      dP.approvalModal();
    },
    buttons: [],
  }
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps, mergeProps)(Onboarding)
);
