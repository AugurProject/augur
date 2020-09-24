import React, { useEffect } from 'react';

import { DefaultButtonProps } from 'modules/common/buttons';
import {
  ButtonsRow,
  LargeSubheader,
  SmallSubheader,
  MediumSubheader,
  LinkContentSection,
  Stepper,
} from 'modules/modal/common';
import { LinkContent } from 'modules/types';
import classNames from 'classnames';
import { ONBOARDING_MAX_STEPS, DAI } from 'modules/common/constants';
import { LeftChevron } from 'modules/common/icons';

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
  showAugurP2PModal?: Function;
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
  showAugurP2PModal,
}: OnboardingProps) => {
  useEffect(() => {
    analyticsEvent && analyticsEvent();
  });

  const NavControls = (
    <>
      <div>
        {buttons.length > 0 && <ButtonsRow buttons={buttons} />}
      </div>
      {currentStep && <Stepper changeCurrentStep={changeCurrentStep} currentStep={currentStep} maxSteps={ONBOARDING_MAX_STEPS} /> }
    </>
  );

  return (
    <div
      className={classNames(Styles.Onboarding, {
        [Styles.Condensed]: condensed,
      })}
    >
      <div>
        <main>
          {icon && <div>{icon}</div>}
          {largeHeader && <LargeSubheader text={largeHeader} />}
          {smallHeader && <SmallSubheader text={smallHeader} />}
          {mediumHeader && <MediumSubheader text={mediumHeader} />}
          {linkContent && <LinkContentSection linkContent={linkContent} />}
        </main>

        <div className={Styles.OnboardingNav}>{NavControls}</div>
      </div>

      <div className={Styles.OnboardingMobileNav}>
        <div
          onClick={() =>
            changeCurrentStep(currentStep === 1 ? 1 : currentStep - 1)
          }
        >
          {currentStep < ONBOARDING_MAX_STEPS && LeftChevron}
        </div>
        <div>{NavControls}</div>
        <div
          onClick={() =>
            changeCurrentStep(
              currentStep === ONBOARDING_MAX_STEPS
                ? ONBOARDING_MAX_STEPS
                : currentStep + 1
            )
          }
        >
          {currentStep < ONBOARDING_MAX_STEPS && LeftChevron}
        </div>
      </div>
    </div>
  );
}
