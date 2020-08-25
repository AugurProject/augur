/* eslint react/no-array-index-key: 0 */

import React, { Component } from 'react';
import classNames from 'classnames';

import { formatDai, formatMarketShares } from 'utils/format-number';
import { SELL, SCALAR } from 'modules/common/constants';
import { HoverValueLabel, DataArchivedLabel } from 'modules/common/labels';
import OrderHeader from 'modules/market-charts/components/order-header/order-header';

import Styles from 'modules/market/components/market-trade-history/market-trade-history.styles.less';
import { useMarketsStore } from 'modules/markets/store/markets';
import { marketTradingPriceTimeSeries } from 'modules/markets/selectors/market-trading-price-time-series';
import { createBigNumber } from 'utils/create-big-number';

interface MarketTradeHistoryProps {
  marketId: string;
  tradingTutorial?: boolean;
  toggle: Function;
  hide: boolean;
  marketType: string;
  isArchived?: boolean;
  initialGroupedTradeHistory?: object
  outcome?: number;
}
const MarketTradeHistory = ({
  marketId,
  tradingTutorial,
  toggle,
  hide,
  marketType,
  isArchived,
  initialGroupedTradeHistory,
  outcome
}: MarketTradeHistoryProps) => {
  const { marketTradingHistory } = useMarketsStore();
  let groupedTradeHistory = {};
  const groupedTradeHistoryVolume = {};
  const tradeHistory = marketTradingHistory[marketId] || [];

  if (tradeHistory.length > 0 || tradingTutorial) {
    groupedTradeHistory = tradingTutorial
      ? initialGroupedTradeHistory
      : marketTradingPriceTimeSeries(tradeHistory, outcome);

    Object.keys(groupedTradeHistory).forEach(key => {
      groupedTradeHistoryVolume[key] = groupedTradeHistory[key].reduce(
        (p, item) =>
          createBigNumber(p)
            .plus(createBigNumber(item.amount))
            .toFixed(4),
        '0'
      );
    });
  }
  const isScalar = marketType === SCALAR;

  return (
    <section className={Styles.TradeHistory}>
      <OrderHeader
        title="Trade History"
        headers={['quantity', 'price', 'time']}
        toggle={toggle}
        hide={hide}
      />
      <div>
        {isArchived && <DataArchivedLabel label="tradeHistory" />}
        {!isArchived && Object.keys(groupedTradeHistory).length === 0 && (
          <span className={Styles.NoHistory}>No Trade History</span>
        )}
        {!isArchived &&
          groupedTradeHistory &&
          Object.keys(groupedTradeHistory).map((date, index) => (
            <div className={Styles.TradeHistoryTable} key={index}>
              <span>
                {`${
                  formatMarketShares(
                    marketType,
                    groupedTradeHistoryVolume[date]
                  ).full
                } - ${date}`}
              </span>
              {groupedTradeHistory[date].map((priceTime, indexJ) => {
                const isSell = priceTime.type === SELL;
                return (
                  <ul
                    className={classNames({ [Styles.Sell]: isSell })}
                    key={index + indexJ}
                  >
                    <li>
                      <HoverValueLabel
                        value={formatMarketShares(marketType, priceTime.amount)}
                        useFull
                      />
                    </li>
                    <li>
                      {isScalar ? (
                        <HoverValueLabel value={formatDai(priceTime.price)} />
                      ) : (
                        priceTime.price.toFixed(2)
                      )}
                      <span
                        className={classNames({
                          [Styles.Up]: !isSell,
                          [Styles.Down]: isSell,
                        })}
                      />
                    </li>
                    <li>{priceTime.time}</li>
                  </ul>
                );
              })}
            </div>
          ))}
      </div>
    </section>
  );
};
export default MarketTradeHistory;
