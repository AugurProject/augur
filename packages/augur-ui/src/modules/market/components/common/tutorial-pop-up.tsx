import React from 'react';
import Styles from 'modules/market/components/common/tutorial-pop-up.styles.less';
import { SecondaryButton } from 'modules/common/buttons';
import classNames from 'classnames';
import {
  DISMISSABLE_NOTICE_BUTTON_TYPES,
  DismissableNotice,
} from 'modules/reporting/common';
import { TextObject } from 'modules/types';

export interface TutorialPopUpProps {
  next: Function;
  left?: boolean;
  right?: boolean;
  top?: boolean;
  bottom?: boolean;
  step: number;
  totalSteps: number;
  text: TextObject;
  leftBottom?: boolean;
  error?: string;
}

export const TutorialPopUp = (props: TutorialPopUpProps) => (
  <section
    className={classNames(Styles.TutorialPopUp, {
      [Styles.Left]: props.left,
      [Styles.Top]: props.top,
      [Styles.Bottom]: props.bottom,
      [Styles.Right]: props.right,
      [Styles.LeftBottom]: props.leftBottom,
    })}
    key={props.step}
  >
    <div>
      <h1>{props.text.title}</h1>
      {props.text.subheader.map((subheader, idx) => (
        <span className={classNames({[Styles.Lighten]: subheader.lighten})} key={idx}>
          {subheader.text}
          {subheader.linkText && (
            <a href={subheader.link} target="_blank" rel="noopener noreferrer">
              {subheader.linkText}
            </a>
          )}
        </span>
      ))}

      {props.error && (
        <DismissableNotice
          show
          buttonType={DISMISSABLE_NOTICE_BUTTON_TYPES.CLOSE}
          title={props.error}
        />
      )}

      <div>
        <span>
          <span>{props.step}</span>/ {props.totalSteps}
        </span>
        <SecondaryButton text="Next" action={() => props.next()} />
      </div>
    </div>
  </section>
);
