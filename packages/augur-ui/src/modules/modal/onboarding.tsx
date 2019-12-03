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

import Styles from 'modules/modal/modal.styles.less';
import { LinkContent } from 'modules/types';
import classNames from 'classnames';

interface OnboardingProps {
  closeAction: Function;
  buttons: DefaultButtonProps[];
  largeHeader?: string;
  smallHeader?: string;
  mediumHeader?: string;
  linkContent?: LinkContent[];
  currentStep?: number;
  icon: React.ReactNode;
  condensed?: boolean;
  analyticsEvent?: Function;
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
  analyticsEvent
}: OnboardingProps) => {
  useEffect(() => {
    analyticsEvent && analyticsEvent();
  });
  return (
    <div className={classNames(Styles.Onboarding, {[Styles.Condensed]: condensed})}>
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
}
