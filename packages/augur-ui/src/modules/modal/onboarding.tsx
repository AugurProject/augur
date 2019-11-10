import React from 'react';

import { DefaultButtonProps } from 'modules/common/buttons';
import {
  ButtonsRow,
  LargeSubheader,
  SmallSubheader,
  MediumSubheader,
  LinkContentSection,
  Stepper,
} from 'modules/modal/common';

import Styles from 'modules/modal/modal.styles.less';
import { LinkContent } from 'modules/types';

interface OnboardingProps {
  closeAction: Function;
  buttons: DefaultButtonProps[];
  largeHeader?: string;
  smallHeader?: string;
  mediumHeader?: string;
  linkContent?: LinkContent[];
  currentStep?: number;
  icon: React.ReactNode;
}

export const Onboarding = ({
  largeHeader,
  buttons,
  smallHeader,
  mediumHeader,
  linkContent,
  currentStep,
  icon,
}: OnboardingProps) => (
  <div className={Styles.Onboarding}>
    <main>
      {icon && <div>{icon}</div>}
      {largeHeader && <LargeSubheader text={largeHeader} />}
      {smallHeader && <SmallSubheader text={smallHeader} />}
      {mediumHeader && <MediumSubheader text={mediumHeader} />}
      {linkContent && <LinkContentSection linkContent={linkContent} />}
    </main>
    <div>
      {buttons.length > 0 && <ButtonsRow buttons={buttons} />}
      {currentStep && <Stepper currentStep={currentStep} maxSteps={4} /> }
    </div>
  </div>
);
