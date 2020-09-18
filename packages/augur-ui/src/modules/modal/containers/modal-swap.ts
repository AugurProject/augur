import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Onboarding } from 'modules/modal/onboarding';
import { updateModal } from 'modules/modal/actions/update-modal';
import { AppState } from 'appStore';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { MODAL_APPROVALS, MODAL_BANKROLL, ETH, USDC, USDT } from 'modules/common/constants';
import { createBigNumber } from 'utils/create-big-number';
import { formatDai } from 'utils/format-number';
import { closeModal } from '../actions/close-modal';
import { updateLoginAccount } from 'modules/account/actions/login-account';

const mapStateToProps = (state: AppState) => {
  const ethToDaiRate = state.appStatus.ethToDaiRate;
  const repToDaiRate = state.appStatus.repToDaiRate;
  const usdtToDaiRate = state.appStatus.usdtToDaiRate;
  const usdcToDaiRate = state.appStatus.usdcToDaiRate;
  const ETH_RATE = createBigNumber(1).dividedBy(
    ethToDaiRate?.value || createBigNumber(1)
  );
  const REP_RATE = createBigNumber(ETH_RATE).times(
    repToDaiRate?.value || createBigNumber(1)
  );

  const balances = state.loginAccount?.balances?.signerBalances;
  const ethAmountInDai =
    Number(state.loginAccount.balances.signerBalances.eth) * ethToDaiRate?.value || createBigNumber(0);
  const hasDai = Number(balances?.dai) > 0;

  const swapOptions = {
    loginAccount: state.loginAccount,
    address: state.loginAccount.address,
    balances: {
      ...state.loginAccount.balances.signerBalances,
    },
    ETH_RATE,
    REP_RATE,
    config: state.env,
    ethToDaiRate,
    repToDaiRate,
    usdtToDaiRate,
    usdcToDaiRate,
    gasPrice:
      state.gasPriceInfo.userDefinedGasPrice || state.gasPriceInfo.average,
  };

  return {
    ethAmountInDai,
    swapOptions,
    token: state.modal.token || ETH,
    hasDai,
  };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  approvalsModal: () => dispatch(updateModal({ type: MODAL_APPROVALS })),
  closeModal: () => dispatch(closeModal()),
  goBack: () => dispatch(updateModal({ type: MODAL_BANKROLL })),
  setCurrentOnboardingStep: (currentOnboardingStep) => dispatch(updateLoginAccount({ currentOnboardingStep })),
});

const mergeProps = (sP: any, dP: any, oP: any) => {
    let title = null;

    if (sP.token === ETH) {
      title = `You have ##$${formatDai(sP.ethAmountInDai).formatted} worth of ETH## in your wallet, would you like to convert a portion of this to DAI?`;
    } else if (sP.token === USDC) {
      title = `You have ##$${formatDai(sP.swapOptions?.balances?.usdc).formatted} worth of USDC## in your wallet, would you like to convert a portion of this to DAI?`;
    } else if (sP.token === USDT) {
      title = `You have ##$${formatDai(sP.swapOptions?.balances?.usdt).formatted} worth of USDT## in your wallet, would you like to convert a portion of this to DAI?`;
    }

    return {
    ...sP,
    title,
    show1InchToolTip: true,
    showSwapper: true,
    currentStep: 5,
    setCurrentOnboardingStep: dP.setCurrentOnboardingStep,
    goBack: dP.goBack,
    closeModal: dP.closeModal,
    showSkipButton: true,
    skipAction: dP.approvalsModal,
    content: [],
    buttons: [],
  }
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps, mergeProps)(Onboarding)
);
