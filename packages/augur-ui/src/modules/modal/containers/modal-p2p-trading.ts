import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Onboarding } from 'modules/modal/onboarding';
import { updateModal } from 'modules/modal/actions/update-modal';
import { AppState } from 'appStore';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import {
  MODAL_TEST_BET,
  HELP_CENTER_LEARN_ABOUT_ADDRESS,
  MODAL_ACCOUNT_CREATED,
  MODAL_AUGUR_USES_DAI,
  MODAL_BUY_DAI,
  MODAL_AUGUR_P2P,
  WALLET_STATUS_VALUES,
  TRANSACTIONS,
  CREATEAUGURWALLET,
} from 'modules/common/constants';
import { AUGUR_IS_P2P, track } from 'services/analytics/helpers';
import { getGasPrice } from "modules/auth/selectors/get-gas-price";

const DAI_HIGH_VALUE_AMOUNT = 40;

export const getOnboardingStep = (step: number): string => {
  if (step === 1) {
    return MODAL_ACCOUNT_CREATED;
  } else if (step === 2) {
    return MODAL_AUGUR_USES_DAI;
  } else if (step === 3) {
    return MODAL_BUY_DAI;
  } else if (step === 4) {
    return MODAL_AUGUR_P2P;
  } else {
    return MODAL_TEST_BET;
  }
};

const mapStateToProps = (state: AppState) => {
  const balances = state.loginAccount.balances;
  const daiHighValueAmount = DAI_HIGH_VALUE_AMOUNT;

  return {
    walletStatus: state.appStatus.walletStatus,
    pendingQueue: state.pendingQueue,
    highBalance: balances.dai > daiHighValueAmount,
    daiHighValueAmount,
    gasPrice: getGasPrice(state),
  };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  testBet: () => dispatch(updateModal({ type: MODAL_TEST_BET })),
  track: (eventName, payload) => dispatch(track(eventName, payload)),
  gotoOnboardingStep: step =>
    dispatch(updateModal({ type: getOnboardingStep(step) })),
});

const mergeProps = (sP: any, dP: any, oP: any) => ({
  gasPrice: sP.gasPrice,
  icon: null,
  largeHeader: 'Augur runs on a peer-to-peer network',
  showAccountStatus: true,
  currentStep: 4,
  showActivationButton:
    sP.walletStatus === WALLET_STATUS_VALUES.FUNDED_NEED_CREATE ||
    (sP.walletStatus === WALLET_STATUS_VALUES.CREATED &&
      sP.pendingQueue[TRANSACTIONS] &&
      sP.pendingQueue[TRANSACTIONS][CREATEAUGURWALLET] &&
      sP.pendingQueue[TRANSACTIONS][CREATEAUGURWALLET].status === 'Success'),
  disableActivatebutton: sP.walletStatus === WALLET_STATUS_VALUES.CREATED,
  analyticsEvent: () => dP.track(AUGUR_IS_P2P, {}),
  changeCurrentStep: step => {
    dP.gotoOnboardingStep(step);
  },
  linkContent: [
    {
      content:
        'This network requires transaction fees to operate which are paid in ETH. This goes entirely to the network and its participants, the Augur protocol doesn’t collect any fees.',
    },
    {
      content: ``,
    },
    {
      content: `As long as your available account balance remains over $${sP.daiHighValueAmount} DAI, your fee reserve will replenish automatically.`,
    },
    {
      content: 'Your fee reserve can easily be cashed out at anytime.',
    },
    {
      content: 'LEARN MORE',
      link: HELP_CENTER_LEARN_ABOUT_ADDRESS,
    },
  ],
  buttons:
    sP.walletStatus === WALLET_STATUS_VALUES.FUNDED_NEED_CREATE
      ? [
          {
            text: '',
            // Activate Account placeholder
          },
          {
            text: 'Continue',
            action: () => {
              dP.testBet();
            },
          },
        ]
      : [
          {
            text: 'Continue',
            action: () => {
              dP.testBet();
            },
          },
        ],
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps, mergeProps)(Onboarding)
);
