
import React, { useEffect, useState } from 'react';

import {
  DefaultButtonProps,
  ExternalLinkButton,
} from 'modules/common/buttons';
import {
  ButtonsRow,
  LargeSubheader,
  SmallSubheader,
  InfoBubble,
  Bankroll,
  Approvals,
  Deposit,
  TokenSelect,
} from 'modules/modal/common';
import classNames from 'classnames';
import { DAI, ETH, ACCOUNT_TYPES } from 'modules/common/constants';
import {
  oneInchExchageIcon,
  compoundIcon,
  CheckMark,
  MobileNavBackIcon,
  MobileNavCloseIcon,
} from 'modules/common/icons';
import { Swap } from 'modules/swap/components/swap';
import {
  approveZeroXCheck,
  approveShareTokenCheck,
  approveFillOrderCheck,
  approveShareToken,
  approveFillOrder,
  approveZeroX,
} from 'modules/contracts/actions/contractCalls';
import { windowRef } from 'utils/window-ref';
import { createBigNumber } from 'utils/create-big-number';
import { AccountBalances, Blockchain } from 'modules/types';
import { addFundsTorus, addFundsFortmatic } from './containers/modal-add-funds';

import Styles from 'modules/modal/modal.styles.less';

export const CURRENT_ONBOARDING_STEP_KEY = 'currentOnboardingStep';
export const TOTAL_ONBOARDING_STEPS = 7;

interface Content {
  icon: string;
  content: string;
  header: string;
}

interface OnboardingProps {
  closeModal?: Function;
  buttons: DefaultButtonProps[];
  currentStep?: number;
  content: Content[];
  title: string;
  show1InchToolTip: boolean;
  showCompoundToolTip: boolean;
  showSwapper: boolean;
  showApprovals: boolean;
  showDeposit: boolean;
  showSkipButton: boolean;
  showBankroll: boolean;
  address?: string;
  swapOptions: {
    balances: AccountBalances;
  };
  balances: AccountBalances;
  blockchain: Blockchain;
  modalAction: Function;
  goBack: Function;
  swapModal: Function;
  gotoApprovals: Function;
  gotoTokenSelect: Function;
  gotoDeposit: Function;
  ethToDaiRate: number;
  token: string;
  walletOnRamp: boolean;
  accountType: string;
  setCurrentOnboardingStep: Function;
}

export const Onboarding = ({
  closeModal,
  buttons,
  currentStep,
  content,
  title,
  show1InchToolTip = false,
  showCompoundToolTip = false,
  showSwapper = false,
  showApprovals = false,
  showDeposit = false,
  showSkipButton = false,
  showBankroll = false,
  address,
  swapOptions,
  balances,
  blockchain,
  modalAction,
  goBack,
  swapModal,
  gotoApprovals,
  gotoTokenSelect,
  gotoDeposit,
  ethToDaiRate,
  token,
  walletOnRamp,
  accountType,
  setCurrentOnboardingStep,
}: OnboardingProps) => {
  const [ethRecieved, setEthRecieved] = useState(false);
  const [isZeroXApproved, setIsZeroXApproved] = useState(false);
  const [isShareTokenApproved, setIsShareTokenApproved] = useState(false);
  const [isFillOrderAprpoved, setIsFillOrderApproved] = useState(false);
  const [currentApprovalStep, setCurrentApprovalStep] = useState(0);
  const [onboardingRoute, setOnboardingRoute] = useState(null);

  useEffect(() => {
    if (balances && balances?.signerBalances?.eth) {
      const daiAmount = createBigNumber(balances?.signerBalances?.dai);
      const ethAmount = createBigNumber(balances?.signerBalances?.eth);

      if (daiAmount.gt(1)) {
        setOnboardingRoute(1);
      } else if (ethAmount.gt(0)) {
        setOnboardingRoute(2);
      } else {
        setOnboardingRoute(3);
      }
     }

    if (currentStep) {
      setCurrentOnboardingStep(currentStep);
    }

    if (showDeposit && Number(balances?.signerBalances?.eth) > 0) {
      setEthRecieved(true);
    }

    const checkIsZeroXApproved = async () => {
      const approved = await approveZeroXCheck(address);
      setIsZeroXApproved(approved);
      if (!approved) {
        setCurrentApprovalStep(0);
      }
    }

    const checkIsShareTokenApproved = async () => {
      const approved = await approveShareTokenCheck(address);
      setIsShareTokenApproved(approved);
      if (!approved) {
        setCurrentApprovalStep(1);
      }
    }

    const checkIsFillOrderApproved = async () => {
      const approved = await approveFillOrderCheck(address);
      setIsFillOrderApproved(approved);
      if (!approved) {
        setCurrentApprovalStep(2);
      }
    }

    if (address && showApprovals && (!isZeroXApproved || !isShareTokenApproved || !isFillOrderAprpoved)) {
      if (!isFillOrderAprpoved) {
        checkIsFillOrderApproved();
      }

      if (!isShareTokenApproved) {
        checkIsShareTokenApproved();
      }

      if (!isZeroXApproved) {
        checkIsZeroXApproved();
     }

      if (isZeroXApproved &&  isShareTokenApproved && isFillOrderAprpoved) {
        setCurrentApprovalStep(3);
      }
    }
  }, [balances, blockchain]);


  let approvalData = [];

  if (showApprovals && address) {
    approvalData = [{
      label: 'Approval 1',
      action: async () => {
        const approved = await approveZeroX(address);
        setIsZeroXApproved(approved);
      },
      isApproved: isZeroXApproved,
    }, {
      label: 'Approval 2',
      action: async () => {
        const approved = await approveShareToken(address);
        setIsShareTokenApproved(approved);
      },
      isApproved: isShareTokenApproved,
    }, {
      label: 'Approval 3',
      action: async () => {
        const approved = await approveFillOrder(address);
        setIsFillOrderApproved(approved);
      },
      isApproved: isFillOrderAprpoved,
    }];
  }

  if (showApprovals) {
    buttons[0].disabled = (!isZeroXApproved || !isShareTokenApproved || !isFillOrderAprpoved);
  }

  if (showSwapper) {
    buttons[0].disabled = createBigNumber(swapOptions?.balances?.dai || 0).lte(0);
  }

  if (currentStep === 1) {
    buttons[0].disabled = onboardingRoute === null;
    buttons[0].action = () => {
      if (onboardingRoute === 1) {
        gotoApprovals();
      } else if (onboardingRoute === 2) {
        gotoTokenSelect();
      } else if (onboardingRoute === 3) {
        gotoDeposit();
      }
    }
  }

  const navControls = (
    <>
      <div>
        {showDeposit && !ethRecieved && <span>Waiting for your deposit (transfer may take time)</span>}
        {showDeposit && ethRecieved && <span>{CheckMark} Deposit recieved</span>}
        {buttons.length > 0 && <ButtonsRow buttons={buttons} />}
        {showSkipButton && <span onClick={() => buttons[0].action()}>skip this step</span>}
      </div>
    </>
  );

  return (
    <div
      className={classNames(Styles.Onboarding, {
        [Styles.Condensed]: false,
      })}
    >
      <nav>
        {goBack && false && <div onClick={() => goBack()}>{MobileNavBackIcon()}</div>}
        {closeModal && (
          <div onClick={() => closeModal()}>{MobileNavCloseIcon()}</div>
        )}
      </nav>
      <div>
        {!showSwapper && title && (
          <div>
            <h2>{title}</h2>
            <hr />
          </div>
        )}

        {showSwapper && title && (
          <div>
            <h2>
              {title.split('##').map((dom, idx) => {
                return idx === 1 ? <span key={idx}>{dom}</span> : dom;
              })}
            </h2>
          </div>
        )}

        {showSwapper && swapOptions && (
          <Swap
            {...swapOptions}
            toToken={DAI}
            fromToken={token || ETH}
            onboarding={true}
          />
        )}

        {content &&
          content.map((item, idx) => {
            return (
              <main key={idx}>
                <div>{item.icon}</div>
                <LargeSubheader text={item.header} />
                <SmallSubheader text={item.content} />
              </main>
            );
          })}

        {showCompoundToolTip && (
          <TokenSelect
            ethToDaiRate={ethToDaiRate}
            handleSelection={(token) => modalAction(token)}
            balances={balances}
          />
        )}

        {showBankroll && (
          <Bankroll
            token={token}
            swapModal={() => swapModal()}
            approveModal={() => modalAction()}
          />
        )}

        {showApprovals && (
          <Approvals
            currentApprovalStep={currentApprovalStep}
            approvalData={approvalData}
          />
        )}

        {showDeposit && <Deposit address={address} />}

        {showDeposit && walletOnRamp && (
          <div className={Styles.OnboardingDepositWalletOnRamp}>
            <div>
              <hr />
              OR
              <hr />
            </div>
            <div
              onClick={() =>
                accountType === ACCOUNT_TYPES.TORUS
                  ? addFundsTorus(createBigNumber(50), address)
                  : addFundsFortmatic(createBigNumber(50), ETH, address)
              }
            >
              Buy direct through {accountType}{' '}
            </div>
          </div>
        )}

        <div className={Styles.OnboardingNav}>{navControls}</div>

        {show1InchToolTip && (
          <InfoBubble icon={oneInchExchageIcon}>
            <div>
              Looking to get a large quantity of DAI at a lower slippage. Try{' '}
              <ExternalLinkButton
                URL={'https://1inch.exchange'}
                label={'1inch.exchange'}
              />
            </div>
          </InfoBubble>
        )}

        {showCompoundToolTip && (
          <InfoBubble icon={compoundIcon}>
            <div>
              Don’t want to sell your crypto to buy DAI. Depost tokens to borrow
              dai in{' '}
              <ExternalLinkButton
                URL={'https://compound.finance '}
                label={'compound.finance '}
              />
            </div>
          </InfoBubble>
        )}
      </div>
      <div className={Styles.OnboardingMobileNav} />
    </div>
  );
}
