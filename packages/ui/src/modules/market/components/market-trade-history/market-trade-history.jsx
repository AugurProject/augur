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
    isMobile: PropTypes.bool,
    // isMobileSmall: PropTypes.boolean,
    // todo figure out how to do keyed objects shape prop type
    groupedTradeHistoryVolume: PropTypes.object.isRequired,
    groupedTradeHistory: PropTypes.object.isRequired,
    toggle: PropTypes.func.isRequired,
    extend: PropTypes.bool.isRequired,
    hide: PropTypes.bool.isRequired
  };

  static defaultProps = {
    isMobile: false
    // isMobileSmall: false
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
      isMobile,
      toggle,
      extend,
      hide
    } = this.props;

    return (
      <section className={Styles.MarketTradeHistory__container}>
        <MarketOutcomeHeaderOrders
          isMobile={isMobile}
          title="Trade History"
          headers={["quantity", "price", "time"]}
          toggle={toggle}
          extended={extend}
          hide={hide}
        />
        <div className={Styles.MarketTradeHistory__table__data}>
          {groupedTradeHistory &&
            Object.keys(groupedTradeHistory).map((date, index) => (
              <div key={index}>
                <div className={Styles.MarketTradeHistory__table}>
                  <ul className={Styles.MarketTradeHistory__table__header__day}>
                    <li>{groupedTradeHistoryVolume[date]} Shares</li>
                    <li>|</li>
                    <li>{date}</li>
                  </ul>
                </div>
                <div className={Styles.MarketTradeHistory__table__price}>
                  {groupedTradeHistory[date].map((priceTime, indexJ) => (
                    <ul
                      key={priceTime.key + index + indexJ}
                      className={Styles.MarketTradeHistory__table__trade__data}
                    >
                      <li
                        className={classNames(
                          Styles.MarketTradeHistory__trade__bar,
                          {
                            [Styles.MarketTradeHistory__trade__barNeg]:
                              priceTime.type === SELL
                          }
                        )}
                      />
                      <li>
                        <HoverValueLabel
                          value={formatShares(priceTime.amount)}
                        />
                      </li>
                      <li
                        className={classNames({
                          [`${Styles.MarketTradeHistory__buy}`]:
                            priceTime.type !== SELL,
                          [`${Styles.MarketTradeHistory__sell}`]:
                            priceTime.type === SELL
                        })}
                      >
                        {priceTime.price.toFixed(4)}
                        <span
                          className={classNames({
                            [Styles.MarketTradeHistory__trade__indicatorUp]:
                              priceTime.type !== SELL,
                            [Styles.MarketTradeHistory__trade__indicatorDown]:
                              priceTime.type === SELL
                          })}
                        />
                      </li>
                      <li>{priceTime.time}</li>
                    </ul>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </section>
    );
  }
}
