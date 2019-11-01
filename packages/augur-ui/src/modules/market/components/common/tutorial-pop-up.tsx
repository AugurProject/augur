import React from 'react';
import Styles from 'modules/market/components/common/tutorial-pop-up.styles.less';
import { SecondaryButton } from 'modules/common/buttons';
import classNames from 'classnames';

export interface TutorialPopUpProps {
  next: Function;
  back: Function;
  left?: boolean;
  right?: boolean;
  top?: boolean;
  bottom?: boolean;
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
      <span>My Fills</span>
      <span>
        Once an order is partially or completley filled, you'll get a
        notification in the top right. 'My Fills' are where you can track all
        filled or partially-filled orders.
      </span>
      <div>
        <SecondaryButton text="Back" action={() => props.back()} />
        <span>
          <span>11</span>/ 12
        </span>
        <SecondaryButton text="Next" action={() => props.next()} />
      </div>
    </div>
  </section>
);
