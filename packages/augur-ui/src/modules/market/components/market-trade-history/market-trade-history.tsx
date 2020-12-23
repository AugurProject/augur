/* eslint react/no-array-index-key: 0 */

import React from 'react';
import classNames from 'classnames';

import { formatDai, formatEther, formatMarketShares } from 'utils/format-number';
import { SELL, SCALAR, WETH, DAI, DEFAULT_PARA_TOKEN } from 'modules/common/constants';
import { HoverValueLabel, DataArchivedLabel } from 'modules/common/labels';
import OrderHeader from 'modules/market-charts/components/order-header/order-header';

import Styles from 'modules/market/components/market-trade-history/market-trade-history.styles.less';
import { useMarketsStore } from 'modules/markets/store/markets';
import { marketTradingPriceTimeSeries } from 'modules/markets/selectors/market-trading-price-time-series';
import { createBigNumber } from 'utils/create-big-number';
import { getIsTutorial } from 'modules/market/store/market-utils';
import { AppStatus } from 'modules/app/store/app-status';

interface MarketTradeHistoryProps {
  marketId: string;
  toggle: Function;
  hide: boolean;
  marketType: string;
  isArchived?: boolean;
  initialGroupedTradeHistory?: object
  outcome?: number;
}

const MarketTradeHistory = ({
  marketId,
  toggle,
  hide,
  marketType,
  isArchived,
  initialGroupedTradeHistory,
  outcome
}: MarketTradeHistoryProps) => {
  const { marketTradingHistory } = useMarketsStore();
  const { paraTokenName } = AppStatus.get();
  const tradingTutorial = getIsTutorial(marketId);
  let groupedTradeHistory = {};
  const groupedTradeHistoryVolume = {};
  const tradeHistory = marketTradingHistory[marketId] || [];

  if (tradeHistory.length > 0 || tradingTutorial) {
    groupedTradeHistory = tradingTutorial
      ? initialGroupedTradeHistory
      : marketTradingPriceTimeSeries(tradeHistory, outcome);

    Object.keys(groupedTradeHistory).forEach(key => {
      groupedTradeHistoryVolume[key] = groupedTradeHistory[key].reduce(
        (p, { amount }) =>
          createBigNumber(p)
            .plus(createBigNumber(amount))
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
              {groupedTradeHistory[date].map(({
                type,
                amount,
                price,
                time,
              }, indexJ) => {
                const isSell = type === SELL;
                return (
                  <ul
                    className={classNames({ [Styles.Sell]: isSell })}
                    key={index + indexJ}
                  >
                    <li>
                      <HoverValueLabel
                        value={formatMarketShares(marketType, amount)}
                        useFull
                      />
                    </li>
                    <li>
                      {isScalar ? (
                        <HoverValueLabel value={paraTokenName !== WETH ? formatDai(price) : formatEther(price)} />
                      ) : (
                        price.toFixed(2)
                      )}
                      <span
                        className={classNames({
                          [Styles.Up]: !isSell,
                          [Styles.Down]: isSell,
                        })}
                      />
                    </li>
                    <li>{time}</li>
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
