import React from 'react';
import { useHistory } from 'react-router';

import { useAppStatusStore } from 'modules/app/store/app-status';
import {
  MODAL_AUGUR_USES_DAI,
  MODAL_BUY_DAI,
  HELP_CENTER_WHAT_IS_DAI,
  MODAL_AUGUR_P2P,
  MODAL_ADD_FUNDS,
  HELP_CENTER_ADD_FUNDS,
  TRANSACTIONS,
  HELP_CENTER_LEARN_ABOUT_ADDRESS,
  MODAL_ACCOUNT_CREATED,
  MODAL_TEST_BET,
  TRADING_TUTORIAL,
} from 'modules/common/constants';
import {
  OnboardingCheckIcon,
  OnboardingDollarDaiIcon,
  OnboardingPaymentIcon,
} from 'modules/common/icons';
import {
  track,
  ACCOUNT_CREATED,
  AUGUR_USES_DAI,
  BUY_DAI,
  FINISHED_TEST_TRADE,
  AUGUR_IS_P2P,
  DO_A_TEST_BET,
  START_TEST_TRADE,
  SKIPPED_TEST_TRADE,
} from 'services/analytics/helpers';
import { Onboarding } from './onboarding';
import { TestBet } from './common';
import makePath from 'modules/routes/helpers/make-path';
import { MARKETS, MARKET } from 'modules/routes/constants/views';
import { formatDai } from 'utils/format-number';
import { createBigNumber } from 'utils/create-big-number';
import makeQuery from 'modules/routes/helpers/make-query';
import { MARKET_ID_PARAM_NAME } from 'modules/routes/constants/param-names';

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

export const ModalAccountCreated = () => {
  const {
    actions: { setModal },
  } = useAppStatusStore();
  const augurUsesDaiModal = () => setModal({ type: MODAL_AUGUR_USES_DAI });
  const gotoOnboardingStep = step =>
    setModal({ type: getOnboardingStep(step) });
  return (
    <Onboarding
      icon={OnboardingCheckIcon}
      analyticsEvent={() => track(ACCOUNT_CREATED, {})}
      largeHeader={'Log-in created'}
      smallHeader={
        'The next two steps are adding funds and activating your account. Once done you can start betting!'
      }
      showAccountStatus={true}
      currentStep={1}
      changeCurrentStep={step => {
        gotoOnboardingStep(step);
      }}
      buttons={[
        {
          text: 'Continue',
          disabled: false,
          action: () => {
            augurUsesDaiModal();
          },
        },
      ]}
    />
  );
};

export const ModalAugurUsesDai = () => {
  const {
    actions: { setModal },
  } = useAppStatusStore();
  const buyDaiModal = () => setModal({ type: MODAL_BUY_DAI });
  const gotoOnboardingStep = step =>
    setModal({ type: getOnboardingStep(step) });
  return (
    <Onboarding
      icon={OnboardingDollarDaiIcon}
      analyticsEvent={() => track(AUGUR_USES_DAI, {})}
      largeHeader={'Augur uses Dai for betting'}
      showAccountStatus={true}
      currentStep={2}
      changeCurrentStep={step => {
        gotoOnboardingStep(step);
      }}
      linkContent={[
        {
          content:
            'Dai is a pegged currency that mirrors the value of the US dollar. This means that ‘1 Dai’ is equivalent to ‘1 USD’. We refer to Dai using the $ symbol.',
        },
        {
          content: 'Learn more about DAI',
          link: HELP_CENTER_WHAT_IS_DAI,
        },
      ]}
      buttons={[
        {
          text: 'Continue',
          disabled: false,
          action: () => {
            buyDaiModal();
          },
        },
      ]}
    />
  );
};

export const ModalBuyDai = () => {
  const {
    actions: { setModal, closeModal },
    loginAccount: {
      balances: {
        signerBalances: { dai },
      },
    },
  } = useAppStatusStore();
  const signerHasDAI = dai !== '0';
  const showAugurP2PModal = () => setModal({ type: MODAL_AUGUR_P2P });
  const addFunds = callback =>
    setModal({ type: MODAL_ADD_FUNDS, cb: callback });

  const gotoOnboardingStep = step =>
    setModal({ type: getOnboardingStep(step) });
  return (
    <Onboarding
      icon={signerHasDAI ? null : OnboardingPaymentIcon}
      largeHeader='Add Dai to your trading account'
      showAccountStatus={true}
      currentStep={3}
      changeCurrentStep={step => {
        gotoOnboardingStep(step);
      }}
      analyticsEvent={() => track(BUY_DAI, {})}
      showTransferMyDai={signerHasDAI}
      showAugurP2PModal={() => showAugurP2PModal()}
      linkContent={[
        {
          content:
            'Buy Dai ($) directly or transfer Dai ($) to your trading account to start placing bets.',
        },
        {
          content:
            'Adding more than 40 Dai ($) allows for 0.04 ETH will be converted for your Fee reserve resulting in cheaper transaction fees.',
        },
        {
          content: 'Your Fee reserve can easily be cashed out at anytime.',
        },
        {
          content: 'LEARN MORE',
          link: HELP_CENTER_ADD_FUNDS,
        },
      ]}
      buttons={[
        {
          text: 'Add Dai',
          action: () => {
            addFunds(() => setTimeout(() => showAugurP2PModal()));
          },
        },
        {
          text: 'Do it later',
          action: () => {
            showAugurP2PModal();
          },
        },
      ]}
    />
  );
};

export const ModalTutorialIntro = ({ next, back }) => {
  const {
    actions: { closeModal },
  } = useAppStatusStore();
  const history = useHistory();

  return (
    <Onboarding
      icon={TestBet}
      largeHeader={'Welcome to our test market'}
      condensed={true}
      smallHeader={
        "Here we're going to take you through each step of placing a trade on Augur. You can exit this walkthrough at any time and access it again via the help menu"
      }
      buttons={[
        {
          text: 'Lets go!',
          action: () => {
            next();
            closeModal();
          },
        },
        {
          text: 'Not now',
          action: () => {
            history.push({
              pathname: makePath(MARKETS),
            });
            closeModal();
          },
        },
      ]}
    />
  );
};

export const ModalTutorialOutro = ({ next, back }) => {
  const {
    actions: { closeModal },
  } = useAppStatusStore();
  const history = useHistory();

  return (
    <Onboarding
      largeHeader={'Congratulations on making your first test trade!'}
      condensed={true}
      analyticsEvent={() => track(FINISHED_TEST_TRADE, {})}
      smallHeader={
        "Now you're all set! You can view this walkthrough at any time from the help menu (question mark icon on the top right). Additionally, our Knowledge Center is there to help you with more in depth guidance"
      }
      buttons={[
        {
          text: 'Explore Augur Markets',
          action: () => {
            history.push({
              pathname: makePath(MARKETS),
            });
            closeModal();
          },
        },
        {
          text: 'View again',
          action: () => {
            back();
            closeModal();
          },
        },
      ]}
    />
  );
};

const DAI_HIGH_VALUE_AMOUNT = 40;
const RESERVE_IN_ETH = 0.04;

export const ModalTestBet = () => {
  const {
    actions: { setModal, closeModal },
  } = useAppStatusStore();
  const isTablet = window.innerWidth <= 1280;
  const gotoOnboardingStep = step =>
    setModal({ type: getOnboardingStep(step) });
  const history = useHistory();

  return (
    <Onboarding
      icon={TestBet}
      analyticsEvent={() => track(DO_A_TEST_BET, {})}
      largeHeader={
        isTablet ? 'Learn how to bet on Augur' : 'Lastly, run a test bet!'
      }
      showAccountStatus={true}
      currentStep={5}
      changeCurrentStep={step => {
        gotoOnboardingStep(step);
      }}
      linkContent={[
        {
          content: isTablet
            ? 'Watch our quick start video to learn how to place a bet using our trading app.'
            : 'Learn how betting works on Augur by placing a pretend bet. Get tips and guidance and start betting for real today.',
        },
      ]}
      buttons={[
        {
          text: isTablet ? 'Watch video' : 'Place test bet',
          disabled: isTablet,
          action: () => {
            history.push({
              pathname: makePath(MARKET),
              search: makeQuery({
                [MARKET_ID_PARAM_NAME]: TRADING_TUTORIAL,
              }),
            });
            !isTablet && track(START_TEST_TRADE, {});
            closeModal();
          },
        },
        {
          text: 'Finish',
          action: () => {
            !isTablet && track(SKIPPED_TEST_TRADE, {});
            closeModal();
          },
        },
      ]}
    />
  );
};
