import React, { useEffect } from 'react';
import classNames from 'classnames';
import { ThickChevron, Close } from 'modules/common/icons';
import {
  EmptyState,
  BetslipHeader,
  BetslipFooter,
  BetslipList,
  MyBetsSubheader,
} from 'modules/trading/common';
import { useAppStatusStore } from 'modules/app/store/app-status';
import { THEMES } from 'modules/common/constants';
import { BETSLIP_SELECTED } from 'modules/trading/store/constants';
import { useBetslipStore } from 'modules/trading/store/betslip';

import Styles from 'modules/trading/betslip.styles.less';
import { PrimaryButton } from 'modules/common/buttons';
import { BetslipMarketItemType } from 'modules/trading/store/betslip-hooks';

export const Betslip = () => {
  const {
    theme,
    accountPositions: positions,
    betslipMinimized,
    actions: { setBetslipMinimized },
  } = useAppStatusStore();
  const {
    selected: { header },
    betslip: { count: betslipCount, items: betslipItems },
    matched: { items: matchedItems },
    actions: { toggleSubHeader },
    step,
  } = useBetslipStore();

  let filteredMatchedItems = matchedItems;
  let matchedCount = 0;

  Object.keys(matchedItems).map(marketId => {
    const orders = matchedItems[marketId].orders;
    const filteredOrders = orders.filter(order => {
      const marketPositions = positions[marketId];
      const position = marketPositions?.tradingPositions[order.outcomeId];
      return !position?.priorPosition;
    });
    if (filteredOrders.length > 0) {
      filteredMatchedItems[marketId] = {
        ...filteredMatchedItems[marketId],
        orders: filteredOrders,
      };
      matchedCount += filteredOrders.length;
    } else {
      delete filteredMatchedItems[marketId];
    }
  });

  useEffect(() => {
    // this has to be done as useAnything must go above any other declarations.
    const isSportsBook = theme === THEMES.SPORTS;
    if (isSportsBook) {
      toggleSubHeader(BETSLIP_SELECTED.MATCHED);
    }
  }, [theme]);

  const isMyBets = header === BETSLIP_SELECTED.MY_BETS;
  const myBetsCount = matchedCount;
  const isSelectedEmpty = isMyBets ? myBetsCount === 0 : betslipCount === 0;
  let marketItems = isMyBets
    ? Object.entries(filteredMatchedItems)
    : Object.entries(betslipItems);

  if (isMyBets) {
    marketItems.map(
      item =>
        (item[1].orders = item[1].orders.sort(
          (a, b) => b.timestamp - a.timestamp
        ))
    );
    marketItems = marketItems.sort(
      (a, b) => b[1].orders[0].timestamp - a[1].orders[0].timestamp
    );
  }
  let oddsChanged = false;
  Object.values(betslipItems).map((market: BetslipMarketItemType) => {
    const recentlyUpdated = market?.orders.filter(item => item.recentlyUpdated);
    if (recentlyUpdated.length > 0) {
      oddsChanged = true;
    }
  });
  return (
    <>
      <aside
        className={classNames(Styles.Betslip, {
          [Styles.Minimized]: betslipMinimized,
          [Styles.MyBetsBetslip]: isMyBets 
        })}
      >
        <div onClick={() => !betslipMinimized && setBetslipMinimized(true)}>
          <button onClick={() => setBetslipMinimized(!betslipMinimized)}>
            {isMyBets ? 'Active Bets' : `Betslip (${betslipCount})`} {isMyBets ? Close : ThickChevron}
          </button>
        </div>
        <section className={Styles.Container}>
          <BetslipHeader myBetsCount={myBetsCount} />
          {isMyBets && <MyBetsSubheader />}
          <section
            className={classNames(Styles.MainSection, {
              [Styles.BetslipEmpty]: isSelectedEmpty,
              [Styles.BetslipList]: !isSelectedEmpty,
            })}
          >
            {isSelectedEmpty ? (
              <EmptyState />
            ) : (
              <>
                {step !== 0 && !isMyBets && (
                  <span className={Styles.ReviewBets}>Please review your bets:</span>
                )}
                <BetslipList marketItems={marketItems} />
                {oddsChanged && !isMyBets && (
                  <span className={Styles.OddsChanged}>Highlighted odds changed since you selected them.</span>
                )}
                <BetslipFooter />
              </>
            )}
          </section>
        </section>
      </aside>
      {betslipCount > 0 && (
        <PrimaryButton
          text={`Betslip (${betslipCount})`}
          action={() => setBetslipMinimized(!betslipMinimized)}
          className={classNames(Styles.OpenBetslipButton, {
            [Styles.Minimized]: betslipMinimized,
          })}
        />
      )}
    </>
  );
};
