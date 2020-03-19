import React, { useContext, useState } from 'react';
import classNames from 'classnames';

import { SecondaryButton, PrimaryButton } from 'modules/common/buttons';
import { Ticket, Trash } from 'modules/common/icons';
import { LinearPropertyLabel } from 'modules/common/labels';
import { SelectedContext } from 'modules/trading/hooks/betslip';
import { formatDai } from 'utils/format-number';

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

export const SportsMarketBets = ({ market, removeOrder, modifyOrder }) => {
  const marketId = market[0];
  const { description, orders } = market[1];
  const bets = orders.map((order, orderId) => ({
    ...order,
    orderId,
    modifyOrder: orderUpdate =>
      modifyOrder(marketId, orderId, { ...order, orderUpdate }),
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
      <SportsInput
        label="Wager"
        value={wager}
        valueKey="wager"
        modifyOrder={modifyOrder}
      />
      <SportsInput
        label="To Win"
        value={toWin}
        valueKey="toWin"
        modifyOrder={modifyOrder}
        disabled
      />
    </div>
  );
};
// this is actually a common component, doing this for ease
export const SportsInput = ({
  label,
  value,
  valueKey,
  modifyOrder,
  disabled = false,
}) => {
  const [curVal, setCurVal] = useState(formatDai(value).full);
  return (
    <div>
      <span>{label}</span>
      <input
        onChange={e => {
          const newVal = e.target.value.replace('$', '');
          setCurVal(newVal);
        }}
        value={curVal}
        onBlur={() => {
          // if the value isn't a valid number, we revert to what it was.
          const updatedValue = isNaN(Number(curVal)) ? value : curVal;
          modifyOrder({ [valueKey]: updatedValue });
          // make sure to add the $ to the updated view
          setCurVal(formatDai(updatedValue).full);
        }}
        disabled={disabled}
      />
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
              key={`${market[1]}`}
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
  const [step, setStep] = useState(0);
  const { ordersInfo, ordersActions } = betslipInfo;
  const { bettingTextValues, confirmationDetails } = ordersInfo;
  const { betting, potential } = bettingTextValues;
  const { wager, fees } = confirmationDetails;
  const bet = formatDai(betting).full;
  const win = formatDai(potential).full;

  return (
    <footer className={Styles.BetslipFooter}>
      {step !== 0 && (
        <div>
          <LinearPropertyLabel
            label="Total Wager"
            value={formatDai(wager)}
            useFull
          />
          <LinearPropertyLabel
            label="Estimated Total Fees"
            value={formatDai(fees)}
            useFull
          />
        </div>
      )}
      <span>
        {`You're Betting `}
        <b>{bet}</b>
        {` and will win `}
        <b>{win}</b>
        {` if you win`}
      </span>
      <SecondaryButton
        text="Cancel Bets"
        action={() => {
          console.log('Bets Canceled, this should open a modal to confirm.');
          ordersActions.cancelAllOrders();
          setStep(0);
        }}
        icon={Trash}
      />
      <PrimaryButton
        text={step === 0 ? 'Place Bets' : 'Confirm Bets'}
        action={() => {
          if (step === 0) {
            setStep(1);
          } else {
            ordersActions.sendAllOrders();
            setStep(0);
          }
        }}
      />
    </footer>
  );
};
