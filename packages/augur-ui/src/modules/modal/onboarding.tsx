
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
  addFundsTorus,
  addFundsFortmatic
} from 'modules/modal/common';
import classNames from 'classnames';
import {
  ETH,
  ACCOUNT_TYPES,
  MODAL_APPROVALS,
  MODAL_TOKEN_SELECT,
  MODAL_ETH_DEPOSIT,
  MODAL_SWAP,
  MODAL_TEST_BET
} from 'modules/common/constants';
import {
  oneInchExchageIcon,
  compoundIcon,
  CheckMark,
  MobileNavCloseIcon,
  ExclamationCircle,
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
import { createBigNumber } from 'utils/create-big-number';

import Styles from 'modules/modal/modal.styles.less';
import { useAppStatusStore } from 'modules/app/store/app-status';

export const TOTAL_ONBOARDING_STEPS = 7;


interface Content {
  icon?: any;
  content?: string;
  header?: string;
}

interface OnboardingProps {
  buttons: DefaultButtonProps[];
  currentStep?: number;
  content: Content[];
  title: string;
  show1InchToolTip?: boolean;
  showCompoundToolTip?: boolean;
  showSwapper?: boolean;
  showApprovals?: boolean;
  showDeposit?: boolean;
  showSkipButton?: boolean;
  showTestBet?: boolean;
  showBankroll?: boolean;
  hasBalanceOver50k?: boolean;
  modalAction?: Function;
  skipAction?: Function;
}

export const Onboarding = ({
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
  showTestBet = false,
  showBankroll = false,
  hasBalanceOver50k,
  modalAction,
  skipAction,
}: OnboardingProps) => {
  const {
    ethToDaiRate,
    loginAccount: { address, balances, meta: { accountType } },
    modal,
    actions: { updateLoginAccount, setModal, closeModal },
  } = useAppStatusStore();
  const walletOnRamp = [ACCOUNT_TYPES.TORUS, ACCOUNT_TYPES.FORTMATIC].includes(accountType);
  const hasDai = Number(balances?.dai) > 0;
  const token = modal?.token || ETH;

  const gotoApprovals = () => setModal({ type: MODAL_APPROVALS });
  const gotoTokenSelect = () => setModal({ type: MODAL_TOKEN_SELECT });
  const gotoDeposit = () => setModal({ type: MODAL_ETH_DEPOSIT });
  const swapModal = () => setModal({ type: MODAL_SWAP, token });
  const testBetModal = () => setModal({ type: MODAL_TEST_BET });
  const setCurrentOnboardingStep = (currentOnboardingStep) => updateLoginAccount({ currentOnboardingStep });

  const [ethRecieved, setEthRecieved] = useState(false);
  const [isZeroXApproved, setIsZeroXApproved] = useState(false);
  const [isShareTokenApproved, setIsShareTokenApproved] = useState(false);
  const [isFillOrderApproved, setIsFillOrderApproved] = useState(false);
  const [onboardingRoute, setOnboardingRoute] = useState(1);

  const checkIsZeroXApproved = async () => {
    const approved = await approveZeroXCheck(address);
    setIsZeroXApproved(approved);
    return approved;
  }

  const checkIsShareTokenApproved = async () => {
    const approved = await approveShareTokenCheck(address);
    setIsShareTokenApproved(approved);
    return approved;
  }

  const checkIsFillOrderApproved = async () => {
    const approved = await approveFillOrderCheck(address);
    setIsFillOrderApproved(approved);
    return approved;
  }

  useEffect(() => {
    let intervalId = null;

    if (balances && balances?.eth) {
      const daiAmount = createBigNumber(balances?.dai);
      const ethAmount = createBigNumber(balances?.eth);

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

    if (showDeposit && Number(balances?.eth) > 0) {
      setEthRecieved(true);
    }

    if (showBankroll && Number(balances?.eth) <= 0) {
      modalAction();
    }

    if (showApprovals && Number(balances?.eth) <= 0) {
      buttons[0].action();
    }

    if (showApprovals) {
      checkIsZeroXApproved();
      checkIsShareTokenApproved();
      checkIsFillOrderApproved();

      intervalId = setInterval(async(isZeroXApproved, isShareTokenApproved, isFillOrderApproved) => {
        if (!isZeroXApproved) {
          await checkIsZeroXApproved();
        } else if (!isShareTokenApproved) {
          await checkIsShareTokenApproved();
        } else if (!isFillOrderApproved) {
          await checkIsFillOrderApproved();
        } else {
          clearInterval(intervalId);
        }
      }, 0);
    }
    return () => clearInterval(intervalId);
  }, [balances]);

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
      isApproved: isFillOrderApproved,
    }];
  }

  if (showApprovals) {
    buttons[0].disabled = (!isZeroXApproved || !isShareTokenApproved || !isFillOrderApproved);
    buttons[0].text = (!isZeroXApproved || !isShareTokenApproved || !isFillOrderApproved) ? 'Please sign all approvals' : 'Next';
  }

  if (currentStep === 1) {
    buttons[0].action = () => {
      if (onboardingRoute === 1 || onboardingRoute === null) {
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
        {showSkipButton && <span onClick={() => skipAction()}>{ showSwapper && hasDai ? 'next step' : 'skip this step'}</span>}
        {showTestBet && <span onClick={() => skipAction()}>explore markets</span>}

      </div>
    </>
  );

  const triggerOnRamp = (token = ETH) =>  accountType === ACCOUNT_TYPES.TORUS
    ? addFundsTorus(createBigNumber(50), address, token)
    : addFundsFortmatic(createBigNumber(50), token, address);

    return (
      <div
        className={classNames(Styles.Onboarding, {
          [Styles.Condensed]: false,
        })}
      >
        <nav>
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
                {title.split('##').map((stringChunk, idx) => {
                  return idx === 1 ? <span key={idx}>{stringChunk}</span> : stringChunk;
                })}
              </h2>
            </div>
          )}

          {showSwapper &&
            <span>
              <div>{ExclamationCircle}</div>
              <div>
                Due to current high gas prices it’s recommended you maintain a $50
                minimum worth of ETH.
              </div>
            </span>
          }

          {showSwapper && (
            <Swap />
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
              triggerOnRamp={(token) => triggerOnRamp(token)}
              accountType={accountType}
              hasBalanceOver50k={hasBalanceOver50k}
            />
          )}

          {showApprovals && (
            <Approvals
              currentApprovalStep={!isZeroXApproved ? 0 : !isShareTokenApproved ? 1 : !isFillOrderApproved ? 2 : 3}
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
                onClick={() => triggerOnRamp()}
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