import React, { useContext, useState, useEffect } from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import makePath from 'modules/routes/helpers/make-path';

import BannerSportsbook from '../../assets/images/banner-sportsbook.png';
import BannerTrading from '../../assets/images/banner-trading.png';
import {
  SecondaryButton,
  PrimaryButton,
  ExternalLinkButton,
  CashoutButton,
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
import { calculateBetslipTotals } from 'modules/trading/store/betslip-hooks';
import { useBetslipStore } from 'modules/trading/store/betslip';
import { BET_STATUS, BETSLIP_SELECTED } from 'modules/trading/store/constants';
import { formatDai } from 'utils/format-number';

import Styles from 'modules/trading/common.styles';
import { convertToOdds } from 'utils/get-odds';
import { convertUnixToFormattedDate } from 'utils/format-date';
import { useAppStatusStore } from 'modules/app/store/app-status';

export interface EmptyStateProps {
  selectedTab: number;
}

export const EmptyState = () => {
  const {
    selected: { header },
  } = useBetslipStore();
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
  const {
    actions: { modifyBet, cancelBet },
  } = useBetslipStore();
  const { description, orders } = market[1];
  const bets = orders.map((order, orderId) => ({
    ...order,
    orderId,
    modifyBet: orderUpdate =>
      modifyBet(marketId, orderId, { ...order, ...orderUpdate }),
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
  const {
    selected: { subHeader },
    actions: { retry, cashOut, updateMatched, updateUnmatched, trash },
  } = useBetslipStore();
  const marketId = market[0];
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
  const { step } = useBetslipStore();
  const isReview = step === 1;
  const { outcome, normalizedPrice, wager, toWin, modifyBet, cancelBet } = bet;
  return (
    <div
      className={classNames(Styles.SportsBet, { [Styles.Review]: isReview })}
    >
      <header>
        <span>{outcome}</span>
        <span>{convertToOdds(normalizedPrice).full}</span>
        <button onClick={() => cancelBet()}>
          {Trash} {isReview && 'Cancel'}
        </button>
      </header>
      {isReview ? (
        <>
          <LinearPropertyLabel label="wager" value={formatDai(wager)} useFull />
          <LinearPropertyLabel
            label="odds"
            value={convertToOdds(normalizedPrice).full}
          />
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

export const SportsMyBet = ({ bet }) => {
  const {
    outcome,
    normalizedPrice,
    wager,
    retry,
    trash,
    status,
    amountFilled,
    toWin,
    dateUpdated,
    timestampUpdated,
  } = bet;
  const [isRecentUpdate, setIsRecentUpdate] = useState(true);
  useEffect(() => {
    setIsRecentUpdate(true);
  }, [timestampUpdated]);

  useEffect(() => {
    const currentTime = new Date().getTime() / 1000;
    const seconds = Math.round(currentTime - timestampUpdated);
    const milliSeconds = seconds * 1000;
    if (isRecentUpdate && status === BET_STATUS.FILLED && seconds < 20) {
      setTimeout(() => {
        setIsRecentUpdate(false);
      }, 20000 - milliSeconds);
    } else {
      setIsRecentUpdate(false);
    }
  }, [isRecentUpdate]);

  const { PENDING, FILLED, PARTIALLY_FILLED, FAILED } = BET_STATUS;
  let icon = null;
  let classToApply = Styles.NEWFILL;
  let message = null;
  let messageAction = null;
  let wagerToShow = wager;
  let iconAction = () => console.log('setup actions');
  switch (status) {
    case FILLED:
      icon = isRecentUpdate ? CheckMark : null;
      classToApply = isRecentUpdate ? Styles.NEWFILL : Styles.FILLED;
      break;
    case PARTIALLY_FILLED:
      icon = null;
      classToApply = Styles.PARTIALLY_FILLED;
      message = `This bet was partially filled. Original wager: ${
        formatDai(wager).full
      }`;
      wagerToShow = amountFilled;
      break;
    case PENDING:
      icon = LoadingEllipse;
      classToApply = Styles.PENDING;
      break;
    case FAILED:
      icon = Trash;
      classToApply = Styles.FAILED;
      iconAction = () => trash();
      message = `Order failed when processing. `;
      messageAction = <button onClick={() => retry()}>Retry</button>;
      break;
    default:
      break;
  }
  return (
    <div
      className={classNames(Styles.SportsMyBet, Styles.Review, classToApply)}
    >
      <header>
        <span>{outcome}</span>
        <span>{convertToOdds(normalizedPrice).full}</span>
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
      <LinearPropertyLabel label="to win" value={formatDai(toWin)} useFull />
      <LinearPropertyLabel
        label="Date"
        value={convertUnixToFormattedDate(dateUpdated).formattedUtc}
      />
      {!!message && (
        <span>
          {message}
          {!!messageAction && messageAction}
        </span>
      )}
      {status !== PENDING && status !== FAILED && (
        <>
          <ExternalLinkButton URL={null} label="view tx" />
          <CashoutButton bet={bet} />
        </>
      )}
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
  useEffect(() => {
    const cleanCurVal = curVal.replace('$', '');
    if (cleanCurVal !== value) {
      setCurVal(formatDai(value).full);
    }
  }, [value]);
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
  const {
    selected: { header },
  } = useBetslipStore();
  return (
    <>
      <section className={Styles.BetslipList}>
        {marketItems.map(market => {
          return header === BETSLIP_SELECTED.BETSLIP ? (
            <SportsMarketBets key={`${market[0]}`} market={market} />
          ) : (
            <SportsMarketMyBets key={`${market[0]}`} market={market} />
          );
        })}
      </section>
    </>
  );
};

export const BetslipHeader = ({ myBetsCount }) => {
  const {
    selected: { header },
    actions: { toggleHeader },
    betslip: { count },
  } = useBetslipStore();
  const isBetslip = header === BETSLIP_SELECTED.BETSLIP;
  const isMyBets = !isBetslip;
  return (
    <ul className={Styles.HeaderTabs}>
      <li
        className={classNames({ [Styles.Selected]: isBetslip })}
        onClick={() => {
          toggleHeader(BETSLIP_SELECTED.BETSLIP);
        }}
      >
        Betslip<span>{count}</span>
      </li>
      <li
        className={classNames({ [Styles.Selected]: isMyBets })}
        onClick={() => {
          toggleHeader(BETSLIP_SELECTED.MY_BETS);
        }}
      >
        My Bets<span>{myBetsCount}</span>
      </li>
    </ul>
  );
};

export const MyBetsSubheader = () => {
  const {
    selected: { subHeader },
    actions: { toggleSubHeader },
    matched: { count: matchedCount },
    unmatched: { count: unmatchedCount },
  } = useBetslipStore();
  const isUnmatched = subHeader === BETSLIP_SELECTED.UNMATCHED;
  const isMatched = !isUnmatched;
  return (
    <ul className={Styles.MyBetsSubheader}>
      <li
        className={classNames({ [Styles.Selected]: isUnmatched })}
        onClick={() => {
          toggleSubHeader(BETSLIP_SELECTED.UNMATCHED);
        }}
      >
        Unmatched Bets ({unmatchedCount})
      </li>
      <li
        className={classNames({ [Styles.Selected]: isMatched })}
        onClick={() => {
          toggleSubHeader(BETSLIP_SELECTED.MATCHED);
        }}
      >
        Matched Bets ({matchedCount})
      </li>
    </ul>
  );
};

export const BetslipFooter = () => {
  const {
    selected: { header, subHeader },
    betslip,
    actions: {
      toggleStep,
      sendAllBets,
      cancelAllBets,
      cancelAllUnmatched,
      toggleHeader,
    },
    step,
  } = useBetslipStore();
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
              if (isReview) toggleStep();
            }}
            icon={Trash}
          />
          <PrimaryButton
            text={!isReview ? 'Place Bets' : 'Confirm Bets'}
            action={() => {
              if (!isReview) {
                toggleStep();
              } else {
                toggleHeader(BETSLIP_SELECTED.MY_BETS);
                toggleStep();
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

export const SideImages = () => {
  const { betslipMinimized } = useAppStatusStore();

  return (
    <section
      className={classNames(Styles.SideImages, {
        [Styles.Hide]: !betslipMinimized,
      })}
    >
      <a href="" target="_blank" rel="noopener noreferrer">
        <img
          src={BannerSportsbook}
          alt="The image shows an American Football player running. The banner says '+1000 markets' and there is a button entitled 'Explore Sportsbook'."
        />
      </a>
      <a href="" target="_blank" rel="noopener noreferrer">
        <img
          src={BannerTrading}
          alt="The image shows Augur's Trading user interface and it says 'Trade Now!'."
        />
      </a>
    </section>
  );
};
