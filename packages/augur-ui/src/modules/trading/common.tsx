import React, { useState, useEffect, useRef } from 'react';
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
  BetsIcon,
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
import { convertToOdds, getWager } from 'utils/get-odds';
import { convertUnixToFormattedDate } from 'utils/format-date';
import { useAppStatusStore } from 'modules/app/store/app-status';
import { useMarketsStore } from 'modules/markets/store/markets';
import { createBigNumber } from 'utils/create-big-number';
import {
  INSUFFICIENT_FUNDS_ERROR,
  MODAL_ADD_FUNDS,
  MODAL_CANCEL_ALL_BETS,
  MODAL_SIGNUP,
} from 'modules/common/constants';
import { checkMultipleOfShares } from 'utils/betslip-helpers';

export interface EmptyStateProps {
  selectedTab: number;
}

export const EmptyState = () => {
  const {
    selected: { header },
  } = useBetslipStore();
  const { isLogged, actions: { setModal } } = useAppStatusStore();
  return (
    <>
      <div>{BetsIcon}</div>
      <h3>
        {header === BETSLIP_SELECTED.BETSLIP
          ? `Betslip is empty`
          : `You don't have any bets`}
      </h3>
      <h4>
        {!isLogged
          ? `You need to Sign in to start betting!`
          : `Need help placing a bet?`}
      </h4>
      {!isLogged ? (
        <PrimaryButton text="Signup" action={() => setModal({ type: MODAL_SIGNUP })} />
      ) : (
        <SecondaryButton
          text="View tutorial"
          action={() => console.log('add tutorial link')}
        />
      )}
    </>
  );
};

export const SportsMarketBets = ({ market }) => {
  const marketId = market[0];
  const {
    actions: { modifyBet, cancelBet, modifyBetErrorMessage },
  } = useBetslipStore();
  const { marketInfos } = useMarketsStore();
  const { description, orders } = market[1];
  const bets = orders.map((order, orderId) => ({
    ...order,
    orderId,
    poolId: marketInfos[marketId]?.sportsBook?.liquidityPool,
    modifyBet: orderUpdate =>
      modifyBet(marketId, orderId, { ...order, ...orderUpdate }),
    modifyBetErrorMessage: errorMessage =>
      modifyBetErrorMessage(marketId, orderId, errorMessage),
    cancelBet: () => cancelBet(marketId, orderId),
  }));
  return (
    <div className={Styles.SportsMarketBets}>
      <h4>{description}</h4>
      <>
        {bets.map(bet => (
          <SportsBet key={bet.orderId} bet={bet} market={marketInfos[marketId]}/>
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

export const SportsBet = ({ bet, market }) => {
  const { step } = useBetslipStore();
  const {
    actions: { setModal },
  } = useAppStatusStore();
  const isReview = step === 1;
  const {
    outcome,
    normalizedPrice,
    wager,
    toWin,
    modifyBet,
    modifyBetErrorMessage,
    cancelBet,
    recentlyUpdated,
    errorMessage,
    selfTrade,
    insufficientFunds,
    price
  } = bet;
  const { liquidityPools } = useMarketsStore();
  const checkWager = wager => {
    if (wager === '' || isNaN(Number(wager))) {
      return {
        checkError: true,
        errorMessage: 'Enter a valid number'
      }
    }
    const liquidity = liquidityPools[bet.poolId][bet.outcomeId];
    if (liquidity) {
      const totalWager = getWager(liquidity.shares, liquidity.price);
      if (createBigNumber(totalWager).lt(createBigNumber(wager))) {
        return {
          checkError: true,
          errorMessage: 'Your bet exceeds the max available for this odds'
        }
      }
    }
    const multipleOf = checkMultipleOfShares(wager, price, market);
    if (multipleOf !== '') {
      return {
        checkError: true,
        errorMessage: multipleOf
      }
    }
    modifyBetErrorMessage(
      ''
    );
    return false;
  };
  return (
    <div
      className={classNames(Styles.SportsBet, {
        [Styles.Review]: isReview,
        [Styles.RecentlyUpdated]: recentlyUpdated,
      })}
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
            recentlyUpdated={recentlyUpdated}
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
            errorCheck={checkWager}
            noEdit={selfTrade || insufficientFunds}
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
      <span className={Styles.error}>
        {errorMessage}
        {errorMessage === INSUFFICIENT_FUNDS_ERROR && (
          <button onClick={() => setModal({ type: MODAL_ADD_FUNDS })}>
            Add funds
          </button>
        )}
      </span>
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
  errorCheck,
}) => {
  const betslipInput = useRef(null);
  const [curVal, setCurVal] = useState(formatDai(value).formatted);
  const [invalid, setInvalid] = useState(false);
  useEffect(() => {
    betslipInput && betslipInput.current.focus();
  }, []);
  useEffect(() => {
    if (noEdit) setCurVal(value)
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
        ref={betslipInput}
        onChange={e => {
          const newVal = e.target.value.replace('$', '');
          const {
            checkError, 
            errorMessage 
          } = errorCheck(newVal);
          setInvalid(checkError);
          if (!checkError) {
            modifyBet({ [valueKey]: newVal, errorMessage: '' });
          } else {
            modifyBet({ [valueKey]: newVal, errorMessage });
          }
          setCurVal(newVal);
        }}
        value={`$${curVal}`}
        onBlur={() => {
          const {
            checkError, 
            errorMessage 
          } = errorCheck(curVal);
          setInvalid(checkError);
          if (!checkError) {
            modifyBet({ [valueKey]: curVal, errorMessage: '' });
          } else {
            modifyBet({ [valueKey]: curVal, errorMessage });
          }
          setCurVal(curVal);
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
        Active Bets<span>{myBetsCount}</span>
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
    placeBetsDisabled,
  } = useBetslipStore();
  const {
    actions: { setModal },
  } = useAppStatusStore();
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
          {!isReview && !placeBetsDisabled && (
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
              setModal({
                type: MODAL_CANCEL_ALL_BETS,
                cb: () => {
                  cancelAllBets();
                  if (isReview) toggleStep();
                },
              });
            }}
            icon={Trash}
          />
          <PrimaryButton
            text={!isReview ? 'Place Bets' : 'Confirm Bets'}
            disabled={placeBetsDisabled}
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
  const { betslipMinimized, isLogged } = useAppStatusStore();

  return (
    <section
      className={classNames(Styles.SideImages, {
        [Styles.Hide]: isLogged || !betslipMinimized,
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
