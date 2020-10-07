import React from 'react';
import { useHistory } from 'react-router';

import { useAppStatusStore } from 'modules/app/store/app-status';
import {
  MODAL_TEST_BET,
  TRADING_TUTORIAL,
  MODAL_APPROVALS,
  MODAL_TOKEN_SELECT,
  MODAL_ETH_DEPOSIT,
  MODAL_BANKROLL,
  USDC,
  USDT,
  ETH,
} from 'modules/common/constants';
import {
  EthIcon,
  OnboardingDollarDaiIcon,
} from 'modules/common/icons';
import { Onboarding } from './onboarding';
import { TestBet } from './common';
import makePath from 'modules/routes/helpers/make-path';
import { MARKET } from 'modules/routes/constants/views';
import { formatDai } from 'utils/format-number';
import { createBigNumber } from 'utils/create-big-number';
import makeQuery from 'modules/routes/helpers/make-query';
import { MARKET_ID_PARAM_NAME } from 'modules/routes/constants/param-names';

export const ModalAugurUsesDai = () => {
  const {
    actions: { setModal },
  } = useAppStatusStore();
  const gotoDeposit = () => setModal({ type: MODAL_ETH_DEPOSIT });

  return (
    <Onboarding
      title={'Augur requires both DAI & ETH '}
      content={[
        {
          icon: OnboardingDollarDaiIcon,
          header: 'Augur uses DAI for betting',
          content:
            'DAI is a pegged currency that mirrors the value of the US dollar. This means that ‘1 DAI’ is equivalent to ‘1 USD’. DAI is referred to with $ symbol.',
        },
        {
          icon: EthIcon,
          header: 'ETH is used for transaction costs',
          content:
            'Gas costs are transaction fees which are payed in ETH. These are required to process any transactions on the Ethereum network.',
        },
      ]}
      currentStep={1}
      buttons={[
        {
          text: 'Next',
          disabled: false,
          action: () => gotoDeposit(),
        },
      ]}
    />
  );
};

export const ModalEthDeposit = () => {
  const {
    loginAccount: { balances },
    actions: { setModal }
  } = useAppStatusStore();
  const tokenSelectModal = () => setModal({ type: MODAL_TOKEN_SELECT });

  return (
    <Onboarding
      title={'First you need to deposit ETH to pay for transaction fees.'}
      showDeposit={true}
      showSkipButton={true}
      skipAction={tokenSelectModal}
      currentStep={2}
      content={[
        {
          content:
            'Before you can start trading, you need to fund your wallet with ETH to process transactions on the Ethereum network.',
        },
      ]}
      buttons={[
        {
          text: 'Next',
          disabled: !(Number(balances?.signerBalances?.eth) > 0),
          action: () => {
            tokenSelectModal();
          },
        },
      ]}
    />
  );
};

export const ModalTokenSelect = () => {
  const {
    actions: { setModal },
  } = useAppStatusStore();
  const bankrollModal = (token) => setModal({ type: MODAL_BANKROLL, token});

  return (
    <Onboarding
      title={'DAI is required for trading. Which currency would you like to convert to DAI?'}
      content={[]}
      showCompoundToolTip={true}
      currentStep={3}
      modalAction={token => {
        bankrollModal(token);
      }}
      buttons={[]}
    />
  );
};

export const ModalBankroll = () => {
  const {
    ethToDaiRate,
    loginAccount: { balances },
    modal,
    actions: { setModal },
  } = useAppStatusStore();
  const approvalModal = () => setModal({ type: MODAL_APPROVALS });

  const MIN_AMOUNT = 50000;
  let hasBalanceOver50k = false;

  if (modal?.token === USDC) {
    const totalUSDC = createBigNumber(Number(balances.signerBalances.usdc));
    if (totalUSDC.gt(MIN_AMOUNT)) {
      hasBalanceOver50k = true;
    }
  } else if (modal?.token === USDT) {
    const totalUSDT = createBigNumber(Number(balances.signerBalances.usdt));
    if (totalUSDT.gt(MIN_AMOUNT)) {
      hasBalanceOver50k = true;
    }
  } else {
    const totalETHinDai = createBigNumber(Number(balances.signerBalances.eth)).times(ethToDaiRate?.value);
    if (totalETHinDai.gt(MIN_AMOUNT)) {
      hasBalanceOver50k = true;
    }
  }

  return (
    <Onboarding
      hasBalanceOver50k={hasBalanceOver50k}
      title={'How much money do you wish to begin your bankroll with?'}
      showBankroll={true}
      content={[]}
      currentStep={4}
      modalAction={() => {
        approvalModal();
      }}
      buttons={[]}
    />
  );
};

export const ModalApprovals = () => {
  const {
    actions: { setModal },
  } = useAppStatusStore();
  const testBetModal = () => setModal({ type: MODAL_TEST_BET });

  return (
    <Onboarding
      title={'Please approve your wallet to interact with the Ethereum network'}
      showApprovals={true}
      currentStep={6}
      content={[
        {
          content:
            'This is a one time action that’s necesary in order to transact on Augur. It is advised to use the recommended gas price when doing these approvals to prevent any delay.',
        },
        {
          content:
            'Once all approvals are confirmed you can begin making transactions on Augur. If skipped you will be prompted later when required.',
        },
      ]}
      buttons={[
        {
          text: 'Next',
          disabled: false,
          action: () => {
            testBetModal();
          },
        },
      ]}
    />
  );
};

export const ModalSwap = () => {
  const {
    loginAccount,
    ethToDaiRate,
    modal,
    actions: { setModal },
  } = useAppStatusStore();

  const balances = loginAccount.balances.signerBalances;
  const ethAmountInDai =
    Number(balances.eth) * ethToDaiRate?.value || createBigNumber(0);
  const token = modal?.token || ETH;
  const approvalsModal = () => setModal({ type: MODAL_APPROVALS });

  let title = null;

  if (token === ETH) {
    title = `You have ##$${formatDai(ethAmountInDai).formatted} worth of ETH## in your wallet, would you like to convert a portion of this to DAI?`;
  } else if (token === USDC) {
    title = `You have ##$${formatDai(balances?.usdc).formatted} worth of USDC## in your wallet, would you like to convert a portion of this to DAI?`;
  } else if (token === USDT) {
    title = `You have ##$${formatDai(balances?.usdt).formatted} worth of USDT## in your wallet, would you like to convert a portion of this to DAI?`;
  }

  return (
    <Onboarding
      show1InchToolTip={true}
      showSwapper={true}
      currentStep={5}
      title={title}
      showSkipButton={true}
      skipAction={approvalsModal}
      content={[]}
      buttons={[]}
    />
  );
};

export const ModalTestBet = () => {
  const {
    actions: { closeModal },
  } = useAppStatusStore();
  const isTablet = window.innerWidth <= 1280;
  const history = useHistory();

  return (
    <Onboarding
      title={'Congratulations! You’re now ready to start trading'}
      content={[
        {
          icon: TestBet,
          content: isTablet
            ? ''
            : 'Learn how betting works on Augur by placing a pretend bet. Get tips and guidance and start betting for real today',
        },
      ]}
      currentStep={7}
      showTestBet={true}
      skipAction={closeModal}
      buttons={[
        {
          text: isTablet ? 'Continue' : 'Place test bet',
          action: () => {
            if (!isTablet) {
              closeModal();
              history.push({
                pathname: makePath(MARKET),
                search: makeQuery({
                  [MARKET_ID_PARAM_NAME]: TRADING_TUTORIAL,
                }),
              });
            } else {
              closeModal();
            }
          },
        },
      ]}
    />
  );
};
