import React from 'react';

import { DefaultButtonProps } from 'modules/common/buttons';
import {
  ButtonsRow,
  LargeSubheader,
  SmallSubheader,
  MediumSubheader,
  DaiGraphic,
  TestBet,
  LinkContentSection,
} from 'modules/modal/common';

import Styles from 'modules/modal/modal.styles.less';
import { LinkContent } from 'modules/types';

interface OnboardingProps {
  closeAction: Function;
  buttons: Array<DefaultButtonProps>;
  largeHeader?: string;
  smallHeader?: string;
  daiGraphic?: boolean;
  mediumHeader?: string;
  linkContent?: LinkContent[];
  testBet?: boolean;
}

export const Onboarding = ({
  largeHeader,
  buttons,
  smallHeader,
  daiGraphic,
  mediumHeader,
  linkContent,
  testBet,
}: OnboardingProps) => (
  <div className={Styles.Onboarding}>
    <main>
      {largeHeader && <LargeSubheader text={largeHeader} />}
      {smallHeader && <SmallSubheader text={smallHeader} />}
      {daiGraphic && <DaiGraphic />}
      {testBet && <TestBet />}
      {mediumHeader && <MediumSubheader text={mediumHeader} />}
      {linkContent && <LinkContentSection linkContent={linkContent} />}
    </main>
    {buttons.length > 0 && <ButtonsRow buttons={buttons} />}
  </div>
);
