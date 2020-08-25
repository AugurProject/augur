import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Onboarding } from 'modules/modal/onboarding';
import { updateModal } from 'modules/modal/actions/update-modal';
import { AppState } from 'appStore';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { MODAL_APPROVALS, MODAL_BANKROLL } from 'modules/common/constants';
import { createBigNumber } from 'utils/create-big-number';
import { formatDai } from 'utils/format-number';
import { closeModal } from '../actions/close-modal';

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

  const balances = state.loginAccount.balances.signerBalances;
  const ethAmountInDai =
    Number(state.loginAccount.balances.signerBalances.eth) * ethToDaiRate.value;

  const swapOptions = {
    loginAccount: state.loginAccount,
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
  };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  approvalsModal: () => dispatch(updateModal({ type: MODAL_APPROVALS })),
  closeModal: () => dispatch(closeModal()),
  goBack: () => dispatch(updateModal({ type: MODAL_BANKROLL })),
});

const mergeProps = (sP: any, dP: any, oP: any) => ({
  ...sP,
  title: `You have ##$${
    formatDai(sP.ethAmountInDai).formattedValue
  } worth of ETH## in your wallet, would you like to convert a portion of this to DAI?`,
  show1InchToolTip: true,
  showSwapper: true,
  currentStep: 4,
  goBack: dP.goBack,
  closeModal: dP.closeModal,
  content: [],
  buttons: [
    {
      text: 'Convert',
      disabled: false,
      action: () => {
        dP.approvalsModal();
      },
    },
  ],
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps, mergeProps)(Onboarding)
);
