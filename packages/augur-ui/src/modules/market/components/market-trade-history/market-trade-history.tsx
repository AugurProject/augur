/* eslint react/no-array-index-key: 0 */

import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { formatShares } from "utils/format-number";
import { SELL } from "modules/common-elements/constants";
import { HoverValueLabel } from "modules/common-elements/labels";
import MarketOutcomeHeaderOrders from "modules/market-charts/components/market-outcome--header-orders/market-outcome--header-orders";

import Styles from "modules/market/components/market-trade-history/market-trade-history.styles";

export default class MarketTradeHistory extends Component {
  static propTypes = {
    groupedTradeHistoryVolume: PropTypes.object.isRequired,
    groupedTradeHistory: PropTypes.object.isRequired,
    toggle: PropTypes.func.isRequired,
    extend: PropTypes.bool.isRequired,
    hide: PropTypes.bool.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      // misc: false
    };
  }

  render() {
    const {
      groupedTradeHistory,
      groupedTradeHistoryVolume,
      toggle,
      extend,
      hide
    } = this.props;

    return (
      <section className={Styles.TradeHistory}>
        <MarketOutcomeHeaderOrders
          title="Trade History"
          headers={["quantity", "price", "time"]}
          toggle={toggle}
          extended={extend}
          hide={hide}
        />
        <div>
          {groupedTradeHistory &&
            Object.keys(groupedTradeHistory).map((date, index) => (
              <div className={Styles.TradeHistoryTable} key={index}>
                <ul>
                  <li>{groupedTradeHistoryVolume[date]} Shares</li>
                  <li>|</li>
                  <li>{date}</li>
                </ul>
                {groupedTradeHistory[date].map((priceTime, indexJ) => (
                  <ul key={index + indexJ}>
                    <li
                      className={classNames({
                        [Styles.Neg]: priceTime.type === SELL
                      })}
                    />
                    <li>
                      <HoverValueLabel
                        value={formatShares(priceTime.amount)}
                      />
                    </li>
                    <li
                      className={classNames({
                        [Styles.Buy]:
                          priceTime.type !== SELL,
                        [Styles.Sell]:
                          priceTime.type === SELL
                      })}
                    >
                      {priceTime.price.toFixed(4)}
                      <span
                        className={classNames({
                          [Styles.Up]:
                            priceTime.type !== SELL,
                          [Styles.Down]:
                            priceTime.type === SELL
                        })}
                      />
                    </li>
                    <li>{priceTime.time}</li>
                  </ul>
                ))}
              </div>
            ))}
        </div>
      </section>
    );
  }
}
