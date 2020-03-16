import React, { useState } from 'react';
import classNames from 'classnames';
import { Ticket } from 'modules/common/icons';
import { SecondaryButton } from 'modules/common/buttons';

import Styles from 'modules/trading/betslip.styles';

export interface BetslipProps {}

export const Betslip = ({  }: BetslipProps) => {
  const [selected, setSelected] = useState(0);
  const betslipAmount = 0;
  const myBetsAmount = 0;
  return (
    <aside className={Styles.Betslip}>
      <section className={Styles.Container}>
        <ul className={Styles.HeaderTabs}>
          <li
            className={classNames({ [Styles.Selected]: selected === 0 })}
            onClick={() => {
              if (selected !== 0) setSelected(0);
            }}
          >
            Betslip<span>{betslipAmount}</span>
          </li>
          <li
            className={classNames({ [Styles.Selected]: selected === 1 })}
            onClick={() => {
              if (selected !== 1) setSelected(1);
            }}
          >
            My Bets<span>{myBetsAmount}</span>
          </li>
        </ul>
        <section
          className={classNames(Styles.MainSection, Styles.BetSlipEmpty)}
        >
          <div>{Ticket}</div>
          <h3>Betslip is empty</h3>
          <h4>Need help placing a bet?</h4>
          <SecondaryButton
            text="View tutorial"
            action={() => console.log('add tutorial link')}
          />
        </section>
      </section>
    </aside>
  );
};
