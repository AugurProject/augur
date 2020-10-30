import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import makePath from 'modules/routes/helpers/make-path';
import {
  SecondaryButton,
  PrimaryButton,
  CashoutButton,
  PendingIconButton,
} from 'modules/common/buttons';
import {
  BetsIcon,
  Trash,
  ThickChevron,
} from 'modules/common/icons';
import { MY_POSITIONS } from 'modules/routes/constants/views';
import { LinearPropertyLabel, TextLabel } from 'modules/common/labels';
import { calculateBetslipTotals } from 'modules/trading/store/betslip-hooks';
import { useBetslipStore } from 'modules/trading/store/betslip';
import { BET_STATUS, BETSLIP_SELECTED } from 'modules/trading/store/constants';
import { formatDai } from 'utils/format-number';

import Styles from 'modules/trading/common.styles.less';
import { convertToOdds, getWager, getShares } from 'utils/get-odds';
import { convertUnixToFormattedDate } from 'utils/format-date';
import { useAppStatusStore } from 'modules/app/store/app-status';
import { useMarketsStore } from 'modules/markets/store/markets';
import { createBigNumber } from 'utils/create-big-number';
import {
  INSUFFICIENT_FUNDS_ERROR,
  MODAL_ADD_FUNDS,
  MODAL_CANCEL_ALL_BETS,
  MODAL_SIGNUP,
  MODAL_LOGIN,
  THEMES,
} from 'modules/common/constants';
import {
  checkMultipleOfShares,
  checkInsufficientFunds,
} from 'utils/betslip-helpers';

export interface EmptyStateProps {
  selectedTab: number;
}

export const EmptyState = () => {
  const {
    selected: { header },
  } = useBetslipStore();
  const {
    isLogged,
    actions: { setModal },
  } = useAppStatusStore();
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
        <PrimaryButton
          text="Signup"
          action={() => setModal({ type: MODAL_SIGNUP })}
        />
      ) : (
        <SecondaryButton
          text="View tutorial"
          action={() => console.log('add tutorial link')}
        />
      )}
    </>
  );
};

function convertToCaps(description) {
  const vsIndex = description.indexOf('vs.');
  return vsIndex > -1
    ? description.substring(0, vsIndex).toUpperCase() +
        'vs.' +
        description.substring(vsIndex + 3, description.length).toUpperCase()
    : description.toUpperCase();
}

export const SportsMarketBets = ({ market }) => {
  const marketId = market[0];
  const {
    actions: { modifyBet, cancelBet },
  } = useBetslipStore();
  const { marketInfos } = useMarketsStore();
  const { description, orders } = market[1];
  const marketInfo = marketInfos[marketId];
  const bets = orders.map(order => ({
    ...order,
    orderId: order.orderId,
    min: marketInfo.minPrice,
    max: marketInfo.maxPrice,
    poolId: marketInfo?.sportsBook?.liquidityPool,
    modifyBet: orderUpdate =>
      modifyBet(marketId, order.orderId, { ...order, ...orderUpdate }),
    cancelBet: () => cancelBet(marketId, order.orderId),
  }));
  return (
    <div className={Styles.SportsMarketBets}>
      <h4>
        <TextLabel text={convertToCaps(description)} />
      </h4>
      <>
        {bets.map(bet => (
          <SportsBet
            key={bet.orderId}
            bet={bet}
            market={marketInfos[marketId]}
          />
        ))}
      </>
    </div>
  );
};

export const SportsMarketMyBets = ({ market }) => {
  const {
    selected: { subHeader },
    actions: { retry, cashOut, trash },
  } = useBetslipStore();
  const marketId = market[0];
  const { description, orders } = market[1];
  const bets = orders.map((order, orderId) => ({
    ...order,
    orderId,
    cashOut: () => cashOut(marketId, orderId),
    retry: () => retry(marketId, orderId),
    trash: () => trash(marketId, orderId),
  }));
  return (
    <div className={Styles.SportsMarketBets}>
      <h4>
        <TextLabel text={convertToCaps(description)} />
      </h4>
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
    cancelBet,
    recentlyUpdated,
    errorMessage,
    price,
    min,
    max,
  } = bet;
  const { liquidityPools } = useMarketsStore();
  const checkWager = wager => {
    if (!wager || wager <= 0 || wager === '' || isNaN(Number(wager))) {
      return {
        checkError: true,
        errorMessage: 'Enter a valid number',
      };
    }
    const insufficientFundsError = checkInsufficientFunds(
      min,
      max,
      price,
      getShares(wager, price)
    );
    if (insufficientFundsError !== '') {
      return {
        checkError: true,
        errorMessage: INSUFFICIENT_FUNDS_ERROR,
      };
    }

    const liquidity = liquidityPools[bet.poolId][bet.outcomeId];
    if (liquidity) {
      const totalWager = getWager(liquidity.shares, liquidity.price);
      if (createBigNumber(totalWager).lt(createBigNumber(wager))) {
        return {
          checkError: true,
          errorMessage: 'Your bet exceeds the max available for this odds',
        };
      }
    }
    const multipleOf = checkMultipleOfShares(wager, price, market);
    if (multipleOf !== '') {
      return {
        checkError: true,
        errorMessage: multipleOf,
      };
    }

    return {
      checkError: false,
      errorMessage: '',
    };
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
            orderErrorMessage={errorMessage}
          />
          <BetslipInput
            label="To Win"
            value={toWin}
            valueKey="toWin"
            modifyBet={modifyBet}
            noEdit
            errorCheck={null}
            orderErrorMessage=""
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
    status,
    amountFilled,
    toWin,
    timestamp,
  } = bet;

  let message = null;
  let messageAction = null;
  let wagerToShow = wager;
  let classToApply = null;
  const { PARTIALLY_FILLED, FAILED, PENDING } = BET_STATUS;
  switch (status) {
    case PARTIALLY_FILLED:
      message = `This bet was partially filled. Original wager: ${
        formatDai(wager).full
      }`;
      wagerToShow = amountFilled;
      break;
    case FAILED:
      message = `Order failed when processing. `;
      messageAction = <button onClick={() => retry()}>Retry</button>;
      classToApply = Styles.FAILED;
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
        <PendingIconButton bet={bet} />
      </header>
      <LinearPropertyLabel
        label="wager"
        value={formatDai(wagerToShow)}
        useFull
      />
      <LinearPropertyLabel label="to win" value={formatDai(toWin)} useFull />
      {status !== FAILED && status !== PENDING && (
        <LinearPropertyLabel
          label="Date"
          value={convertUnixToFormattedDate(timestamp).formattedUtc}
        />
      )}
      {!!message && (
        <span>
          {message}
          {!!messageAction && messageAction}
        </span>
      )}
      {status !== PENDING && status !== FAILED && (
        <>
          <CashoutButton bet={bet} />
        </>
      )}
    </div>
  );
};

interface BetslipInputProps {
  label: string;
  value: string;
  valueKey: string;
  modifyBet: Function;
  orderErrorMessage?: string;
  errorCheck?: Function;
  disabled?: boolean;
  noEdit?: boolean;
  noForcedText?: boolean;
}
// this is actually a common component, doing this for ease
export const BetslipInput = ({
  label,
  value,
  valueKey,
  modifyBet,
  orderErrorMessage = '',
  disabled = false,
  noEdit = false,
  errorCheck = (newVal: string) => ({ checkError: false, errorMessage: '' }),
  noForcedText = false,
}: BetslipInputProps) => {
  const betslipInput = useRef(null);
  const [curVal, setCurVal] = useState(
    value ? formatDai(value).formatted : null
  );
  useEffect(() => {
    betslipInput && betslipInput.current.focus();
  }, []);
  useEffect(() => {
    if (noEdit) setCurVal(value);
  }, [value]);
  return (
    <div
      className={classNames(Styles.BetslipInput, {
        [Styles.Error]: orderErrorMessage && orderErrorMessage !== '',
        [Styles.NoEdit]: disabled || noEdit,
      })}
    >
      <span>{label}</span>
      <input
        ref={betslipInput}
        onChange={e => {
          const newVal = e.target.value.replace('$', '');
          const { checkError, errorMessage } = errorCheck(newVal);
          if (!checkError) {
            modifyBet({ [valueKey]: newVal, errorMessage: '' });
          } else {
            modifyBet({ [valueKey]: newVal, errorMessage });
          }
          setCurVal(newVal);
        }}
        value={`${noForcedText ? '' : '$'}${curVal ? curVal : ''}`}
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
    isLogged,
  } = useAppStatusStore();
  const { wager, potential, fees } = calculateBetslipTotals(betslip);
  const bet = formatDai(wager).full;
  const win = formatDai(potential).full;
  const isReview = step !== 0;

  return (
    <footer
      className={classNames(Styles.BetslipFooter, {
        [Styles.Unmatched]: subHeader === BETSLIP_SELECTED.UNMATCHED,
        [Styles.LoggedOut]: !isLogged,
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
              {` to win `}
              <b>{win}</b>
            </span>
          )}
          {isLogged ? (
            <>
              <SecondaryButton
                text="Cancel All"
                lightBorder
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
                text={`${!isReview ? 'Place Bet' : 'Confirm Bet'}${
                  betslip.count > 1 ? 's' : ''
                }`}
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
            <PrimaryButton
              text="Login to place bets"
              action={() =>
                setModal({
                  type: MODAL_LOGIN,
                })
              }
            />
          )}
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
  const {
    betslipMinimized,
    isLogged,
    theme,
    actions: { setTheme },
  } = useAppStatusStore();
  const Betting = () => {
    if (theme !== THEMES.BETTING) setTheme(THEMES.BETTING);
  };
  const Trading = () => {
    if (theme !== THEMES.TRADING) setTheme(THEMES.TRADING);
  };
  return (
    <section
      className={classNames(Styles.SideImages, {
        [Styles.Hide]: isLogged || !betslipMinimized,
      })}
    >
      <button onClick={Betting}>
        <img src="images/banner-2-1011x741.png" />
      </button>
      <button onClick={Trading}>
        <img src="images/banner-trading.png" />
      </button>
      <button onClick={Betting}>
        <img src="images/small-banner-sportsbook.png" />
      </button>
      <button onClick={Trading}>
        <img src="images/small-banner-trading.png" />
      </button>
    </section>
  );
};
