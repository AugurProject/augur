/* eslint react/no-array-index-key: 0 */

import React, { Component } from 'react';
import classNames from 'classnames';

import { formatDaiPrice, formatMarketShares } from 'utils/format-number';
import {
  SELL,
  SCALAR,
} from 'modules/common/constants';
import { HoverValueLabel, DataArchivedLabel } from 'modules/common/labels';
import OrderHeader from 'modules/market-charts/components/order-header/order-header';

import Styles from 'modules/market/components/market-trade-history/market-trade-history.styles.less';

interface MarketTradeHistoryProps {
  groupedTradeHistoryVolume: object;
  groupedTradeHistory: object;
  toggle: Function;
  hide: boolean;
  marketType: string;
  isArchived?: boolean;
}

export default class MarketTradeHistory extends Component<
  MarketTradeHistoryProps
> {
  render() {
    const {
      groupedTradeHistory,
      groupedTradeHistoryVolume,
      toggle,
      hide,
      marketType,
      isArchived,
    } = this.props;
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
            <span>No Trade History</span>
          )}
          {!isArchived &&
            groupedTradeHistory &&
            Object.keys(groupedTradeHistory).map((date, index) => (
              <div className={Styles.TradeHistoryTable} key={index}>
                <span>
                  {`${
                    formatMarketShares(marketType, groupedTradeHistoryVolume[date]).full
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
                          <HoverValueLabel value={formatDaiPrice(priceTime.price)} />
                        ) : (
                          priceTime.price.toFixed(3)
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
  }
}
