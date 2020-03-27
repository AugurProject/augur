import React, { useContext, useState, useEffect } from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import makePath from 'modules/routes/helpers/make-path';

import {
  SecondaryButton,
  PrimaryButton,
  ExternalLinkButton,
} from 'modules/common/buttons';
import {
  Ticket,
  Trash,
  ThickChevron,
  CheckMark,
  LoadingEllipse,
} from 'modules/common/icons';
import { MY_POSITIONS } from 'modules/routes/constants/views';
import { LinearPropertyLabel } from 'modules/common/labels';
import {
  SelectedContext,
  BetslipStepContext,
  BET_STATUS,
  BETSLIP_SELECTED,
  calculateBetslipTotals,
  BetslipActionsContext,
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
      <h3>
        {header === BETSLIP_SELECTED.BETSLIP
          ? `Betslip is empty`
          : `You don't have any bets`}
      </h3>
      <h4>Need help placing a bet?</h4>
      <SecondaryButton
        text="View tutorial"
        action={() => console.log('add tutorial link')}
      />
    </>
  );
};

export const SportsMarketBets = ({ market }) => {
  const marketId = market[0];
  const { modifyBet, cancelBet } = useContext(BetslipActionsContext);
  const { description, orders } = market[1];
  const bets = orders.map((order, orderId) => ({
    ...order,
    orderId,
    modifyBet: orderUpdate =>
      modifyBet(marketId, orderId, { ...order, orderUpdate }),
    cancelBet: () => cancelBet(marketId, orderId),
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

export const SportsMarketMyBets = ({ market }) => {
  const { subHeader } = useContext(SelectedContext);
  const marketId = market[0];
  const { retry, cashOut, updateMatched, updateUnmatched, trash } = useContext(BetslipActionsContext);
  const { description, orders } = market[1];
  const bets = orders.map((order, orderId) => ({
    ...order,
    orderId,
    cashOut: () => cashOut(marketId, orderId),
    retry: () => retry(marketId, orderId),
    trash: () => trash(marketId, orderId),
    update: updates =>
      subHeader === BETSLIP_SELECTED.UNMATCHED
        ? updateUnmatched(marketId, orderId, updates)
        : updateMatched(marketId, orderId, updates),
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
  const { outcome, odds, wager, toWin, modifyBet, cancelBet } = bet;
  return (
    <div
      className={classNames(Styles.SportsBet, { [Styles.Review]: isReview })}
    >
      <header>
        <span>{outcome}</span>
        <span>{odds}</span>
        <button onClick={() => cancelBet()}>
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
            modifyBet={modifyBet}
          />
          <BetslipInput
            label="To Win"
            value={toWin}
            valueKey="toWin"
            modifyBet={modifyBet}
            noEdit
          />
        </>
      )}
    </div>
  );
};

export const SportsMyBet = ({
  bet: {
    outcome,
    odds,
    wager,
    retry,
    cashOut,
    update,
    trash,
    status,
    amountFilled,
    toWin,
    dateUpdated,
  },
}) => {
  const [expanded, setExpanded] = useState(false);
  const [isRecentUpdate, setIsRecentUpdate] = useState(true);
  useEffect(() => {
    setIsRecentUpdate(true);
  }, [dateUpdated]);

  useEffect(() => {
    const currentTime = new Date().getTime() / 1000;
    const seconds = Math.round(currentTime - dateUpdated.timestamp);
    const milliSeconds = seconds * 1000;
    if (isRecentUpdate && status === BET_STATUS.FILLED && seconds < 20) {
      setTimeout(() => {
        setIsRecentUpdate(false);
      }, 20000 - milliSeconds);
    } else {
      setIsRecentUpdate(false);
    }
  }, [isRecentUpdate]);

  useEffect(() => {
    if (status === BET_STATUS.PENDING) {
      setTimeout(() => {
        update({ status: BET_STATUS.FILLED });
      }, 20000);
    }
  });
  const { PENDING, FILLED, PARTIALLY_FILLED, FAILED } = BET_STATUS;
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
      message = `This bet was partially filled. Original wager: ${
        formatDai(wager).full
      }`;
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
      iconAction = () => trash();
      message = `Order failed when processing. `;
      messageAction = <button onClick={() => retry()}>Retry</button>;
    default:
      break;
  }
  return (
    <div
      className={classNames(Styles.SportsMyBet, Styles.Review, classToApply, {
        [Styles.Expanded]: expanded,
      })}
    >
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
      <LinearPropertyLabel
        label="wager"
        value={formatDai(wagerToShow)}
        useFull
      />
      <LinearPropertyLabel label="odds" value={odds} />
      <LinearPropertyLabel label="to win" value={formatDai(toWin)} useFull />
      <LinearPropertyLabel
        label="Date"
        value={dateUpdated.formattedLocalShortWithUtcOffset}
      />
      {!!message && (
        <span>
          {message}
          {!!messageAction && messageAction}
        </span>
      )}
      <ExternalLinkButton URL={null} label="view tx" />
      <button onClick={() => cashOut()} disabled={cashoutDisabled}>
        {cashoutText}
      </button>
    </div>
  );
};
// this is actually a common component, doing this for ease
export const BetslipInput = ({
  label,
  value,
  valueKey,
  modifyBet,
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
          modifyBet({ [valueKey]: updatedValue });
          // make sure to add the $ to the updated view
          setCurVal(formatDai(updatedValue).full);
          setInvalid(false);
        }}
        disabled={disabled || noEdit}
      />
    </div>
  );
};

export const BetslipList = ({ marketItems }) => {
  const { header } = useContext(SelectedContext);
  return (
    <>
      <section className={Styles.BetslipList}>
        {marketItems.map(market => {
          return header === BETSLIP_SELECTED.BETSLIP ? (
            <SportsMarketBets
              key={`${market[0]}`}
              market={market}
            />
          ) : (
            <SportsMarketMyBets
              key={`${market[0]}`}
              market={market}
            />
          );
        })}
      </section>
    </>
  );
};

export const BetslipHeader = ({
  betslipCount,
  myBetsCount,
}) => {
  const { header } = useContext(SelectedContext);
  const { toggleHeader } = useContext(BetslipActionsContext);
  const isBetslip = header === BETSLIP_SELECTED.BETSLIP;
  const isMyBets = !isBetslip;
  return (
    <ul className={Styles.HeaderTabs}>
      <li
        className={classNames({ [Styles.Selected]: isBetslip })}
        onClick={() => {
          if (!isBetslip) toggleHeader();
        }}
      >
        Betslip<span>{betslipCount}</span>
      </li>
      <li
        className={classNames({ [Styles.Selected]: isMyBets })}
        onClick={() => {
          if (!isMyBets) toggleHeader();
        }}
      >
        My Bets<span>{myBetsCount}</span>
      </li>
    </ul>
  );
};

export const MyBetsSubheader = ({
  unmatchedCount,
  matchedCount,
}) => {
  const { subHeader } = useContext(SelectedContext);
  const { toggleSubHeader } = useContext(BetslipActionsContext);
  const isUnmatched = subHeader === BETSLIP_SELECTED.UNMATCHED;
  const isMatched = !isUnmatched;
  return (
    <ul className={Styles.MyBetsSubheader}>
      <li
        className={classNames({ [Styles.Selected]: isUnmatched })}
        onClick={() => {
          if (!isUnmatched) toggleSubHeader();
        }}
      >
        Unmatched Bets ({unmatchedCount})
      </li>
      <li
        className={classNames({ [Styles.Selected]: isMatched })}
        onClick={() => {
          if (!isMatched) toggleSubHeader();
        }}
      >
        Matched Bets ({matchedCount})
      </li>
    </ul>
  );
};

export const BetslipFooter = ({
  betslip
}) => {
  const { header, subHeader } = useContext(SelectedContext);
  const { toggleStep, sendAllBets, cancelAllBets, cancelAllUnmatched } = useContext(BetslipActionsContext);
  const step = useContext(BetslipStepContext);
  const { wager, potential, fees } = calculateBetslipTotals(betslip);
  const bet = formatDai(wager).full;
  const win = formatDai(potential).full;
  const isReview = step !== 0;

  return (
    <footer
      className={classNames(Styles.BetslipFooter, {
        [Styles.Unmatched]: subHeader === BETSLIP_SELECTED.UNMATCHED,
      })}
    >
      {header === BETSLIP_SELECTED.BETSLIP ? (
        <>
          {isReview && (
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
          {!isReview && (
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
              cancelAllBets();
            }}
            icon={Trash}
          />
          <PrimaryButton
            text={!isReview ? 'Place Bets' : 'Confirm Bets'}
            action={() => {
              if (!isReview) {
                toggleStep();
              } else {
                sendAllBets();
              }
            }}
          />
        </>
      ) : (
        <>
          <Link to={makePath(MY_POSITIONS)}>
            {ThickChevron}
            <span>View All Bets</span>
          </Link>
          <button onClick={() => cancelAllUnmatched()}>
            {Trash} Cancel All
          </button>
        </>
      )}
    </footer>
  );
};
