/* eslint react/no-array-index-key: 0 */

import React, { Component } from 'react';
import classNames from 'classnames';

import { formatShares } from 'utils/format-number';
import {
  SELL,
  SCALAR,
  BINARY_CATEGORICAL_FORMAT_OPTIONS,
} from 'modules/common/constants';
import { HoverValueLabel } from 'modules/common/labels';
import OrderHeader from 'modules/market-charts/components/order-header/order-header';

import Styles from 'modules/market/components/market-trade-history/market-trade-history.styles';

interface MarketTradeHistoryProps {
  groupedTradeHistoryVolume: object;
  groupedTradeHistory: object;
  toggle: Function;
  hide: boolean;
  marketType: string;
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
    } = this.props;
    const isScalar = marketType === SCALAR;

    const opts =
        isScalar
        ? { removeComma: true }
        : { ...BINARY_CATEGORICAL_FORMAT_OPTIONS, removeComma: true };

    return (
      <section className={Styles.TradeHistory}>
        <OrderHeader
          title="Trade History"
          headers={['quantity', 'price', 'time']}
          toggle={toggle}
          hide={hide}
        />
        <div>
          {groupedTradeHistory &&
            Object.keys(groupedTradeHistory).map((date, index) => (
              <div className={Styles.TradeHistoryTable} key={index}>
                <span>
                  {`${
                    formatShares(groupedTradeHistoryVolume[date], opts).full
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
                          value={formatShares(priceTime.amount, opts)}
                          useFull
                        />
                      </li>
                      <li>
                        {priceTime.price.toFixed(isScalar ? 4 : 2)}
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
