import React, { useContext } from 'react';
import classNames from 'classnames';

import { Ticket } from 'modules/common/icons';
import { SecondaryButton } from 'modules/common/buttons';
import { SelectedContext } from 'modules/trading/hooks/betslip';

import Styles from 'modules/trading/common.styles';

export interface EmptyStateProps {
  selectedTab: number;
}

export const EmptyState = ({ emptyHeader }) => {
  return (
    <>
      <div>{Ticket}</div>
      <h3>{emptyHeader}</h3>
      <h4>Need help placing a bet?</h4>
      <SecondaryButton
        text="View tutorial"
        action={() => console.log('add tutorial link')}
      />
    </>
  );
};

export const BetslipHeader = ({ toggleSelected, betslipInfo }) => {
  const selected: number = useContext(SelectedContext);
  const { betslipAmount, myBetsAmount } = betslipInfo;
  return (
    <ul className={Styles.HeaderTabs}>
      <li
        className={classNames({ [Styles.Selected]: selected === 0 })}
        onClick={() => toggleSelected(selected)}
      >
        Betslip<span>{betslipAmount}</span>
      </li>
      <li
        className={classNames({ [Styles.Selected]: selected === 1 })}
        onClick={() => toggleSelected(selected)}
      >
        My Bets<span>{myBetsAmount}</span>
      </li>
    </ul>
  );
};
