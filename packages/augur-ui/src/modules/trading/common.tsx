import React, { useContext, useState, useEffect } from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import makePath from 'modules/routes/helpers/make-path';

import { SecondaryButton, PrimaryButton, ExternalLinkButton } from 'modules/common/buttons';
import { Ticket, Trash, ThickChevron, CheckMark, LoadingEllipse } from 'modules/common/icons';
import { MY_POSITIONS } from 'modules/routes/constants/views';
import { LinearPropertyLabel } from 'modules/common/labels';
import {
  SelectedContext,
  BetslipStepContext,
  BET_STATUS,
} from 'modules/trading/hooks/betslip';
import { formatDai } from 'utils/format-number';

import Styles from 'modules/trading/common.styles';

export interface EmptyStateProps {
  selectedTab: number;
}

export const EmptyState = () => {
  const { header } = useContext(SelectedContext);
  return (
    <>
      <div>{Ticket}</div>
      <h3>{header === 0 ? `Betslip is empty` : `You don't have any bets`}</h3>
      <h4>Need help placing a bet?</h4>
      <SecondaryButton
        text="View tutorial"
        action={() => console.log('add tutorial link')}
      />
    </>
  );
};

export const SportsMarketBets = ({ market, actions }) => {
  const marketId = market[0];
  const { modifyOrder, removeOrder } = actions;
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

export const SportsMarketMyBets = ({ market, actions }) => {
  const marketId = market[0];
  const { cashOutBet } = actions;
  const { description, orders } = market[1];
  const bets = orders.map((order, orderId) => ({
    ...order,
    orderId,
    cashOutBet: () => cashOutBet(marketId, orderId),
  }));
  return (
    <div className={Styles.SportsMarketBets}>
      <h4>{description}</h4>
      <>
        {bets.map(bet => (
          <SportsMyBet key={bet.orderId} bet={bet} />
        ))}
      </>
    </div>
  );
};

export const SportsBet = ({ bet }) => {
  const step = useContext(BetslipStepContext);
  const isReview = step === 1;
  const { outcome, odds, wager, toWin, modifyOrder, cancelOrder } = bet;
  return (
    <div
      className={classNames(Styles.SportsBet, { [Styles.Review]: isReview })}
    >
      <header>
        <span>{outcome}</span>
        <span>{odds}</span>
        <button onClick={() => cancelOrder()}>
          {Trash} {isReview && 'Cancel'}
        </button>
      </header>
      {isReview ? (
        <>
          <LinearPropertyLabel label="wager" value={formatDai(wager)} useFull />
          <LinearPropertyLabel label="odds" value={odds} />
          <LinearPropertyLabel
            label="to win"
            value={formatDai(toWin)}
            useFull
          />
        </>
      ) : (
        <>
          <BetslipInput
            label="Wager"
            value={wager}
            valueKey="wager"
            modifyOrder={modifyOrder}
          />
          <BetslipInput
            label="To Win"
            value={toWin}
            valueKey="toWin"
            modifyOrder={modifyOrder}
            noEdit
          />
        </>
      )}
    </div>
  );
};

export const SportsMyBet = ({ bet }) => {
  const [expanded, setExpanded] = useState(false);
  const [isRecentUpdate, setIsRecentUpdate] = useState(true);
  useEffect(() => {
    const currentTime = new Date().getTime() / 1000;
    const seconds = Math.round(currentTime - bet.dateUpdated.timestamp);
    const milliSeconds = seconds * 1000;
    if (seconds < 20) {
      setTimeout(() => {
        setIsRecentUpdate(false);
      }, 20000 - milliSeconds);
    } else {
      setIsRecentUpdate(false);
    }
  }, [isRecentUpdate]);

  const { outcome, odds, wager, cashOutBet, status, amountFilled, toWin, dateUpdated } = bet;
  const {
    PENDING,
    FILLED,
    PARTIALLY_FILLED,
    FAILED,
  } = BET_STATUS;
  let icon = Trash;
  let classToApply = Styles.NEWFILL;
  let message = null;
  let messageAction = null;
  let wagerToShow = wager;
  let cashoutDisabled = true;
  let cashoutText = 'cashout not available';
  let iconAction = () => console.log('setup actions');
  switch (status) {
    case FILLED:
      icon = isRecentUpdate ? CheckMark : ThickChevron;
      classToApply = isRecentUpdate ? Styles.NEWFILL : Styles.FILLED;
      iconAction = () => {
        setExpanded(!expanded);
        // also remove recent if they click the checkmark.
        if (!expanded && isRecentUpdate) {
          setIsRecentUpdate(false);
        }
      };
      cashoutText = `Cashout ${formatDai(amountFilled).full}`;
      cashoutDisabled = false;
      break;
    case PARTIALLY_FILLED:
      icon = ThickChevron;
      classToApply = Styles.PARTIALLY_FILLED;
      message = `This bet was partially filled. Original wager: ${formatDai(wager).full}`;
      iconAction = () => {
        setExpanded(!expanded);
      };
      wagerToShow = amountFilled;
      break;
    case PENDING: 
      icon = LoadingEllipse;
      classToApply = Styles.PENDING;
      break;
    case FAILED:
      classToApply = Styles.FAILED;
      message = `Order failed when processing. `
      messageAction = (<button onClick={() => console.log('resend transaction')}>Retry</button>);
    default:
      break;
  }
  return (
    <div className={classNames(Styles.SportsMyBet, Styles.Review, classToApply, { [Styles.Expanded]: expanded })}>
      <header>
        <span>{outcome}</span>
        <span>{odds}</span>
        <button
          className={classNames(classToApply)}
          onClick={() => iconAction()}
        >
          {icon}
        </button>
      </header>
      <LinearPropertyLabel label="wager" value={formatDai(wagerToShow)} useFull />
      <LinearPropertyLabel label="odds" value={odds} />
      <LinearPropertyLabel label="to win" value={formatDai(toWin)} useFull />
      <LinearPropertyLabel label="Date" value={dateUpdated.formattedLocalShortWithUtcOffset} />
      {!!message && <span>{message}{!!messageAction && messageAction}</span>}
      <ExternalLinkButton
        URL={null}
        label="view tx"
      />
      <button onClick={() => cashOutBet()} disabled={cashoutDisabled}>{cashoutText}</button>
    </div>
  );
};
// this is actually a common component, doing this for ease
export const BetslipInput = ({
  label,
  value,
  valueKey,
  modifyOrder,
  disabled = false,
  noEdit = false,
}) => {
  const [curVal, setCurVal] = useState(formatDai(value).full);
  const [invalid, setInvalid] = useState(false);
  return (
    <div
      className={classNames(Styles.BetslipInput, {
        [Styles.Error]: invalid,
        [Styles.NoEdit]: disabled || noEdit,
      })}
    >
      <span>{label}</span>
      <input
        onChange={e => {
          const newVal = e.target.value.replace('$', '');
          setCurVal(newVal);
          setInvalid(isNaN(Number(newVal)));
        }}
        value={curVal}
        onBlur={() => {
          // if the value isn't a valid number, we revert to what it was.
          const updatedValue = isNaN(Number(curVal)) ? value : curVal;
          modifyOrder({ [valueKey]: updatedValue });
          // make sure to add the $ to the updated view
          setCurVal(formatDai(updatedValue).full);
          setInvalid(false);
        }}
        disabled={disabled || noEdit}
      />
    </div>
  );
};

export const BetslipList = ({ marketItems, actions }) => {
  const { header } = useContext(SelectedContext);
  return (
    <>
      <section className={Styles.BetslipList}>
        {marketItems.map(market => {
          return header === 0 ? (
            <SportsMarketBets
              key={`${market[1]}`}
              market={market}
              actions={actions}
            />
          ) : (
            <SportsMarketMyBets
              key={`${market[1]}`}
              market={market}
              actions={actions}
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

export const BetslipFooter = ({ betslipInfo, setStep }) => {
  const { header } = useContext(SelectedContext);
  const step = useContext(BetslipStepContext);
  const { ordersInfo, ordersActions } = betslipInfo;
  const { bettingTextValues, confirmationDetails } = ordersInfo;
  const { betting, potential } = bettingTextValues;
  const { wager, fees } = confirmationDetails;
  const bet = formatDai(betting).full;
  const win = formatDai(potential).full;

  return (
    <footer className={Styles.BetslipFooter}>
      {header === 0 ? (
        <>
          {step !== 0 && (
            <div>
              <LinearPropertyLabel
                label="Total Wager"
                value={formatDai(wager)}
                useFull
                highlight
              />
              <LinearPropertyLabel
                label="Estimated Total Fees"
                value={formatDai(fees)}
                useFull
                highlight
              />
            </div>
          )}
          {step !== 1 && (
            <span>
              {`You're Betting `}
              <b>{bet}</b>
              {` and will win `}
              <b>{win}</b>
              {` if you win`}
            </span>
          )}
          <SecondaryButton
            text="Cancel Bets"
            action={() => {
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
        </>
      ) : (
        <Link to={makePath(MY_POSITIONS)}>
          {ThickChevron}
          <span>View All Bets</span>
        </Link>
      )}
    </footer>
  );
};
