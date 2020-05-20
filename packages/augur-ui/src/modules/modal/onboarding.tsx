import React, { useEffect } from 'react';

import { DefaultButtonProps, ProcessingButton } from 'modules/common/buttons';
import {
  ButtonsRow,
  LargeSubheader,
  SmallSubheader,
  MediumSubheader,
  LinkContentSection,
  Stepper,
} from 'modules/modal/common';
import AccountStatusTracker from 'modules/modal/containers/account-status-tracker';
import TransferMyDai from 'modules/modal/containers/transfer-my-dai';
import { LinkContent } from 'modules/types';
import classNames from 'classnames';
import { ONBOARDING_MAX_STEPS, TRANSACTIONS, CREATEAUGURWALLET } from 'modules/common/constants';
import Styles from 'modules/modal/modal.styles.less';

interface OnboardingProps {
  closeAction: Function;
  buttons: DefaultButtonProps[];
  largeHeader?: string;
  smallHeader?: string;
  mediumHeader?: string;
  linkContent?: LinkContent[];
  currentStep?: number;
  changeCurrentStep?: Function;
  icon: React.ReactNode;
  condensed?: boolean;
  analyticsEvent?: Function;
  showAccountStatus?: boolean;
  showTransferMyDai?: boolean;
  showActivationButton?: boolean;
  createFundedGsnWallet?: Function;
}

export const Onboarding = ({
  largeHeader,
  buttons,
  smallHeader,
  mediumHeader,
  linkContent,
  currentStep,
  icon,
  condensed,
  analyticsEvent,
  changeCurrentStep,
  showAccountStatus,
  showTransferMyDai,
  showActivationButton,
  createFundedGsnWallet,
}: OnboardingProps) => {
  useEffect(() => {
    analyticsEvent && analyticsEvent();
  });
  return (
    <div className={classNames(Styles.Onboarding, {[Styles.Condensed]: condensed})}>
      {showAccountStatus && <AccountStatusTracker />}
      <main>
        {icon && <div>{icon}</div>}
        {largeHeader && <LargeSubheader text={largeHeader} />}
        {smallHeader && <SmallSubheader text={smallHeader} />}
        {mediumHeader && <MediumSubheader text={mediumHeader} />}
        {linkContent && <LinkContentSection linkContent={linkContent} />}
      </main>
      {showTransferMyDai && <TransferMyDai />}
      <div>
        <div>
          {buttons.length > 0 && <ButtonsRow buttons={buttons} />}
          {showActivationButton &&
            <ProcessingButton
              small
              text={'Activate Account'}
              action={() => createFundedGsnWallet()}
              queueName={TRANSACTIONS}
              queueId={CREATEAUGURWALLET}
            />
          }
        </div>
        {currentStep && <Stepper changeCurrentStep={changeCurrentStep} currentStep={currentStep} maxSteps={ONBOARDING_MAX_STEPS} /> }
      </div>
    </div>
  );
}
