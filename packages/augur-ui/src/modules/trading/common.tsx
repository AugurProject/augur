import React, { useContext } from 'react';
import classNames from 'classnames';

import { SecondaryButton, PrimaryButton } from 'modules/common/buttons';
import { Ticket, Trash } from 'modules/common/icons';
import { LinearPropertyLabel } from 'modules/common/labels';
import { SelectedContext } from 'modules/trading/hooks/betslip';
import { formatDai } from 'utils/format-number';

import Styles from 'modules/trading/common.styles';
import { Orders } from 'modules/modal/modal.styles.less';

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

export const SportsMarketBets = ({ market, removeOrder, modifyOrder }) => {
  const marketId = market[0];
  const { description, orders } = market[1];
  const bets = orders.map((order, orderId) => ({
    ...order,
    orderId,
    modifyOrder: updatedOrder => modifyOrder(marketId, updatedOrder),
    cancelOrder: () => removeOrder(marketId, orderId),
  }));
  return (
    <div className={Styles.SportsMarketBets}>
      <h4>{description}</h4>
      <>
        {bets.map(bet => (
          <SportsBet key={bet.orderId} bet={bet} />
        ))}
      </>
    </div>
  );
};

export const SportsBet = ({ bet }) => {
  const { outcome, odds, wager, toWin, modifyOrder, cancelOrder } = bet;
  return (
    <div className={Styles.SportsBet}>
      <header>
        <span>{outcome}</span>
        <span>{odds}</span>
        <button onClick={() => cancelOrder()}>{Trash}</button>
      </header>
      <div>
        <span>Wager</span>
        <input
          onChange={() => modifyOrder('this would be wager input')}
          value={formatDai(wager).full}
        />
      </div>
      <div>
        <span>To Win</span>
        <input
          onChange={() => modifyOrder('this would be wager input')}
          value={formatDai(toWin).full}
        />
      </div>
    </div>
  );
};

export const BetslipList = ({ ordersInfo, actions }) => {
  const { removeOrder, modifyOrder } = actions;
  const marketOrders = Object.entries(ordersInfo.orders);

  return (
    <>
      <section className={Styles.BetslipList}>
        {marketOrders.map(market => {
          return (
            <SportsMarketBets
              key={market[1]}
              market={market}
              removeOrder={removeOrder}
              modifyOrder={modifyOrder}
            />
          );
        })}
      </section>
    </>
  );
};

export const BetslipHeader = ({ toggleSelected, betslipInfo }) => {
  const { header } = useContext(SelectedContext);
  const { betslipAmount, myBetsAmount } = betslipInfo;
  return (
    <ul className={Styles.HeaderTabs}>
      <li
        className={classNames({ [Styles.Selected]: header === 0 })}
        onClick={() => toggleSelected(0)}
      >
        Betslip<span>{betslipAmount}</span>
      </li>
      <li
        className={classNames({ [Styles.Selected]: header === 1 })}
        onClick={() => toggleSelected(1)}
      >
        My Bets<span>{myBetsAmount}</span>
      </li>
    </ul>
  );
};

export const MyBetsSubheader = ({ toggleSelected }) => {
  const { subHeader } = useContext(SelectedContext);
  return (
    <ul className={Styles.MyBetsSubheader}>
      <li
        className={classNames({ [Styles.Selected]: subHeader === 0 })}
        onClick={() => toggleSelected(0)}
      >
        Unmatched Bets
      </li>
      <li
        className={classNames({ [Styles.Selected]: subHeader === 1 })}
        onClick={() => toggleSelected(1)}
      >
        Matched Bets
      </li>
    </ul>
  );
};

export const BetslipFooter = ({ betslipInfo }) => {
  const { ordersInfo } = betslipInfo;
  const { bettingTextValues } = ordersInfo;
  const { betting, potential } = bettingTextValues;
  const bet = formatDai(betting).full;
  const win = formatDai(potential).full;

  return (
    <footer className={Styles.BetslipFooter}>
      <div>
        <LinearPropertyLabel label="Total Stake" value="$75.00" />
        <LinearPropertyLabel label="Potential Returns" value="$575.00" />
      </div>
      <span>
        {`You're Betting `}
        <b>{bet}</b>
        {` and will win `}
        <b>{win}</b>
        {` if you win`}
      </span>
      <SecondaryButton
        text="Cancel Bets"
        action={() => console.log('Bet Canceled')}
        icon={Trash}
      />
      <PrimaryButton
        text="Place Bets"
        action={() => console.log('Bet Placed')}
      />
    </footer>
  );
};
