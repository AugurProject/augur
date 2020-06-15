import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Onboarding } from 'modules/modal/onboarding';
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
import { AppStatus } from 'modules/app/store/app-status';
import { createFundedGsnWallet } from 'modules/auth/actions/update-sdk';
import { createBigNumber } from 'utils/create-big-number';
import { formatDai } from 'utils/format-number';

const DAI_HIGH_VALUE_AMOUNT = 40;
const RESERVE_IN_ETH = 0.04;

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


const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
  testBet: () => AppStatus.actions.setModal({ type: MODAL_TEST_BET }),
  track: (eventName, payload) => track(eventName, payload),
  gotoOnboardingStep: step => AppStatus.actions.setModal({ type: getOnboardingStep(step) }),
  createFundedGsnWallet: () => createFundedGsnWallet(),
});

const mergeProps = (sP, dP, oP) => {
  const { env, loginAccount, pendingQueue, ethToDaiRate, walletStatus } = AppStatus.get();
  const { balances } = loginAccount;

  const daiHighValueAmount =
    env.gsn?.minDaiForSignerETHBalanceInDAI || DAI_HIGH_VALUE_AMOUNT;
  const ethInReserveAmount =
    env.gsn?.desiredSignerBalanceInETH || RESERVE_IN_ETH;
  const ethRate = ethToDaiRate?.value || 0;
  const reserveInDai = formatDai(
    createBigNumber(ethInReserveAmount).multipliedBy(ethRate)
  );
  const highBalance = balances.dai > daiHighValueAmount;

  return {
    icon: null,
    largeHeader: 'Augur runs on a peer-to-peer network',
    showAccountStatus: true,
    currentStep: 4,
    showActivationButton:
      walletStatus === WALLET_STATUS_VALUES.FUNDED_NEED_CREATE ||
      (walletStatus === WALLET_STATUS_VALUES.CREATED &&
        pendingQueue[TRANSACTIONS] &&
        pendingQueue[TRANSACTIONS][CREATEAUGURWALLET] &&
        pendingQueue[TRANSACTIONS][CREATEAUGURWALLET].status === 'Success'),
    analyticsEvent: () => dP.track(AUGUR_IS_P2P, {}),
    createFundedGsnWallet: () => dP.createFundedGsnWallet(),
    changeCurrentStep: step => {
      dP.gotoOnboardingStep(step);
    },
    linkContent: [
      {
        content:
          'This network requires transaction fees to operate which are paid in ETH. This goes entirely to the network and Augur doesn’t collect any of these fees.',
      },
      {
        content: `Account activation is required before making your first transaction.There will be a small transaction fee to activate your account. ${
          highBalance
            ? `$${reserveInDai.formattedValue} worth of ETH, from your total funds will be held in your Fee reserve to cover further transactions.`
            : `If your account balance exceeds $${daiHighValueAmount}, a portion of this equivilant to 0.04ETH will be held in your Fee reserve to cover further transactions.`
        }`,
      },
      {
        content: `So long as your available account balance remains over $${daiHighValueAmount} Dai, your Fee reserve will replenish automatically.`,
      },
      {
        content: 'Your Fee reserve can easily be cashed out at anytime.',
      },
      {
        content: 'LEARN MORE',
        link: HELP_CENTER_LEARN_ABOUT_ADDRESS,
      },
    ],
    buttons:
      walletStatus === WALLET_STATUS_VALUES.FUNDED_NEED_CREATE
        ? [
            {
              text: '',
              // Activate Account placeholder
            },
            {
              text: 'Do it later',
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
  }
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps, mergeProps)(Onboarding)
);
