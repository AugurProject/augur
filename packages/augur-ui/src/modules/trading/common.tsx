import React, { useContext } from 'react';
import classNames from 'classnames';

import { SecondaryButton, PrimaryButton } from 'modules/common/buttons';
import { Ticket, Trash } from 'modules/common/icons';
import { LinearPropertyLabel } from 'modules/common/labels';
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

export const BetslipFooter = () => {
  return (
    <footer className={Styles.BetslipFooter}>
      <div>
        <LinearPropertyLabel label="Total Stake" value="$75.00" />
        <LinearPropertyLabel label="Potential Returns" value="$575.00" />
      </div>
      <SecondaryButton
        text="Cancel Bet"
        action={() => console.log('Bet Canceled')}
        icon={Trash}
      />
      <PrimaryButton
        text="Place Bet"
        action={() => console.log('Bet Placed')}
      />
    </footer>
  );
}