import React from 'react';
import Styles from 'modules/market/components/common/tutorial-pop-up.styles.less';
import { PrimaryButton } from 'modules/common/buttons';

export interface TutorialPopUpProps {
  next: Function;
  back: Function;
}

export const TutorialPopUp = (props: TutorialPopUpProps) => (
  <section className={Styles.TutorialPopUp}>
    pop up
    <PrimaryButton
      text="back"
      action={() => props.back()}
    />
    <PrimaryButton
      text="next"
      action={() => props.next()}
    />
  </section>
);
