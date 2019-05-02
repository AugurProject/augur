import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import MarketOutcomeHeaderOrders from "modules/market-charts/components/market-outcome--header-orders/market-outcome--header-orders";
import { HoverValueLabel } from "modules/common-elements/labels";
import { ASKS, BIDS, BUY, SELL } from "modules/common-elements/constants";

import Styles from "modules/market-charts/components/market-outcome--orders/market-outcome--orders.styles";
import { isEmpty, isEqual } from "lodash";

export default class MarketOutcomeChartsOrders extends Component {
  static propTypes = {
    orderBook: PropTypes.object.isRequired,
    fixedPrecision: PropTypes.number.isRequired,
    pricePrecision: PropTypes.number.isRequired,
    updateSelectedOrderProperties: PropTypes.func.isRequired,
    isMobile: PropTypes.bool.isRequired,
    hasOrders: PropTypes.bool.isRequired,
    orderBookKeys: PropTypes.object.isRequired,
    onMobileTradingPage: PropTypes.bool,
    toggle: PropTypes.func,
    extend: PropTypes.bool,
    hide: PropTypes.bool
  };

  static defaultProps = {
    onMobileTradingPage: false,
    toggle: () => {},
    extend: false,
    hide: false
  };

  constructor(props) {
    super(props);

    this.state = {
      hoveredOrderIndex: null,
      hoveredSide: null
    };
  }

  componentDidMount() {
    this.asks.scrollTop = this.asks.scrollHeight;
  }

  componentDidUpdate(prevProps) {
    const { orderBook } = this.props;
    if (
      isEmpty(prevProps.orderBook.asks) &&
      !isEqual(prevProps.orderBook.asks, orderBook.asks)
    ) {
      this.asks.scrollTop = this.asks.scrollHeight;
    }
  }

  render() {
    const {
      fixedPrecision,
      pricePrecision,
      orderBook,
      updateSelectedOrderProperties,
      isMobile,
      hasOrders,
      orderBookKeys,
      onMobileTradingPage,
      toggle,
      extend,
      hide
    } = this.props;
    const s = this.state;

    const orderBookAsks = orderBook.asks || [];

    return (
      <section
        className={classNames(Styles.MarketOutcomeOrderBook, {
          [Styles.MarketOutcomeOrderBook__trading]: onMobileTradingPage
        })}
      >
        <MarketOutcomeHeaderOrders
          isMobile={isMobile}
          title="Order Book"
          headers={["quantity", "price", "my quantity"]}
          toggle={toggle}
          extended={extend}
          hide={hide}
        />
        <div
          className={classNames(
            Styles.MarketOutcomeOrderBook__Side,
            Styles["MarketOutcomeOrderBook__side--asks"]
          )}
        >
          <div
            className={classNames(
              Styles.MarketOutcomeOrderBook__container,
              Styles["MarketOutcomeOrderBook__container--asks"]
            )}
            ref={asks => {
              this.asks = asks;
            }}
          >
            {orderBookAsks.map((order, i) => (
              <button
                key={order.cumulativeShares}
                className={classNames(
                  Styles.MarketOutcomeOrderBook__row,
                  Styles.MarketOutcomeOrderBook__rowPositive,
                  {
                    [Styles["MarketOutcomeOrderBook__row--head-bid"]]:
                      i === orderBook.asks.length - 1,
                    [Styles["MarketOutcomeOrderBook__row--hover"]]:
                      i === s.hoveredOrderIndex && s.hoveredSide === ASKS,
                    [Styles["MarketOutcomeOrderbook__row--hover-encompassed"]]:
                      s.hoveredOrderIndex !== null &&
                      s.hoveredSide === ASKS &&
                      i > s.hoveredOrderIndex,
                    [Styles.MarketOutcomeOrderBook__row__trading]: onMobileTradingPage
                  }
                )}
                onMouseEnter={() => {
                  this.setState({
                    hoveredOrderIndex: i,
                    hoveredSide: ASKS
                  });
                }}
                onMouseLeave={() => {
                  this.setState({
                    hoveredOrderIndex: null,
                    hoveredSide: null
                  });
                }}
                onClick={() =>
                  updateSelectedOrderProperties({
                    orderPrice: order.price.value.toString(),
                    orderQuantity: order.cumulativeShares.toString(),
                    selectedNav: BUY,
                    selfTrade: order.mySize !== null
                  })
                }
              >
                <div
                  className={classNames(
                    Styles.MarketOutcomeOrderBook__rowScale,
                    Styles.MarketOutcomeOrderBook__rowScaleNeg
                  )}
                  style={{ right: order.quantityScale + "%" }}
                />
                <div
                  className={Styles.MarketOutcomeOrderBook__RowItem_ask}
                  style={{ justifyContent: "flex-start" }}
                >
                  <HoverValueLabel value={order.shares} />
                </div>
                <div
                  className={Styles.MarketOutcomeOrderBook__RowItem_ask}
                  style={{ justifyContent: "center" }}
                >
                  <span>{order.price.value.toFixed(pricePrecision)}</span>
                </div>
                <div className={Styles.MarketOutcomeOrderBook__RowItem_ask}>
                  <span>
                    {order.mySize
                      ? order.mySize.value.toFixed(fixedPrecision).toString()
                      : "—"}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
        {!hide && (
          <div className={Styles.MarketOutcomeOrderBook__Midmarket}>
            {hasOrders && (
              <div>
                <span
                  className={Styles.MarketOutcomeOrderBook__MidmarketSpread}
                >
                  Spread:
                </span>{" "}
                {orderBookKeys.spread
                  ? orderBookKeys.spread.toFixed(pricePrecision)
                  : "—"}
                {orderBookKeys.spread && (
                  <span className={Styles.MarketOutcomeOrderBook__MidmarketEth}>
                    ETH
                  </span>
                )}
              </div>
            )}
          </div>
        )}
        <div
          className={classNames(
            Styles.MarketOutcomeOrderBook__Side,
            Styles["MarketOutcomeOrderBook__side--bids"]
          )}
        >
          <div
            className={Styles.MarketOutcomeOrderBook__container}
            ref={bids => {
              this.bids = bids;
            }}
          >
            {(orderBook.bids || []).map((order, i) => (
              <button
                key={order.cumulativeShares}
                className={classNames(Styles.MarketOutcomeOrderBook__row, {
                  [Styles["MarketOutcomeOrderBook__row--head-ask"]]: i === 0,
                  [Styles["MarketOutcomeOrderBook__row--hover"]]:
                    i === s.hoveredOrderIndex && s.hoveredSide === BIDS,
                  [Styles["MarketOutcomeOrderbook__row--hover-encompassed"]]:
                    s.hoveredOrderIndex !== null &&
                    s.hoveredSide === BIDS &&
                    i < s.hoveredOrderIndex,
                  [Styles.MarketOutcomeOrderBook__row__trading]: onMobileTradingPage
                })}
                onMouseEnter={() => {
                  this.setState({
                    hoveredOrderIndex: i,
                    hoveredSide: BIDS
                  });
                }}
                onMouseLeave={() => {
                  this.setState({
                    hoveredOrderIndex: null,
                    hoveredSide: null
                  });
                }}
                onClick={() =>
                  updateSelectedOrderProperties({
                    orderPrice: order.price.value.toString(),
                    orderQuantity: order.cumulativeShares.toString(),
                    selectedNav: SELL,
                    selfTrade: order.mySize !== null
                  })
                }
              >
                <div
                  className={Styles.MarketOutcomeOrderBook__rowScale}
                  style={{ right: order.quantityScale + "%" }}
                />
                <div
                  className={Styles.MarketOutcomeOrderBook__RowItem_bid}
                  style={{ justifyContent: "flex-start" }}
                >
                  <HoverValueLabel value={order.shares} />
                </div>
                <div
                  className={Styles.MarketOutcomeOrderBook__RowItem_bid}
                  style={{ justifyContent: "center" }}
                >
                  <span>{order.price.value.toFixed(pricePrecision)}</span>
                </div>
                <div className={Styles.MarketOutcomeOrderBook__RowItem_bid}>
                  <span>
                    {order.mySize
                      ? order.mySize.value.toFixed(fixedPrecision).toString()
                      : "—"}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>
    );
  }
}
