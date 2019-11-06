import React from 'react';
import Styles from 'modules/market/components/common/tutorial-pop-up.styles.less';
import { SecondaryButton } from 'modules/common/buttons';
import classNames from 'classnames';

interface TextLink {
  text: string;
  link?: string;
  linkText?: string;
}

interface TextObject {
  title: string;
  subheader: TextLink[];
}

export interface TutorialPopUpProps {
  next: Function;
  back: Function;
  left?: boolean;
  right?: boolean;
  top?: boolean;
  bottom?: boolean;
  step: number;
  totalSteps: number;
  text: TextObject;
}

export const TutorialPopUp = (props: TutorialPopUpProps) => (
  <section
    className={classNames(Styles.TutorialPopUp, {
      [Styles.Left]: props.left,
      [Styles.Top]: props.top,
      [Styles.Bottom]: props.bottom,
      [Styles.Right]: props.right,
    })}
  >
    <div>
      <h1>{props.text.title}</h1>
      {props.text.subheader.map((subheader, idx) =>
        <span key={idx}>
          {subheader.text}
          {subheader.linkText && <a href={subheader.link} target="blank">{subheader.linkText}</a>}
        </span>
      )}
      <div>
        <SecondaryButton text="Back" action={() => props.back()} />
        <span>
          <span>{props.step}</span>/ {props.totalSteps}
        </span>
        <SecondaryButton text="Next" action={() => props.next()} />
      </div>
    </div>
  </section>
);
