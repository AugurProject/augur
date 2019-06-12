import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import OrderHeader from "modules/market-charts/components/order-header/order-header";
import { HoverValueLabel } from "modules/common/labels";
import { ASKS, BIDS, BUY, SELL } from "modules/common/constants";

import Styles from "modules/market-charts/components/order-book/order-book.styles.less";

interface OrderBookSideProps {
  orderBook: object;
  updateSelectedOrderProperties: Function;
  hasOrders: boolean;
  orderBookKeys: object;
  fixedPrecision: number;
  pricePrecision: number;
  setHovers: Function;
  type: string;
  scrollToTop: boolean;
}

interface OrderBookProps {
  orderBook: object;
  updateSelectedOrderProperties: Function;
  hasOrders: boolean;
  orderBookKeys: object;
  fixedPrecision: number;
  pricePrecision: number;
  toggle: boolean;
  extend: boolean;
  hide: boolean;
}

interface OrderBookState {
  hoveredOrderIndex: number;
  hoveredSide: number;
}

class OrderBookSide extends Component<OrderBookSideProps, {}> {
  static defaultProps = {
    fixedPrecision: 4,
    pricePrecision: 4,
    scrollToTop: false
  };

  componentDidMount() {
    if (this.props.scrollToTop) this.side.scrollTop = this.side.scrollHeight;
  }

  componentDidUpdate(prevProps: OrderBookSideProps) {
    const { orderBook, scrollToTop } = this.props;
    if (
      scrollToTop &&
      prevProps.orderBook.asks.length &&
      JSON.stringify(prevProps.orderBook.asks) !==
        JSON.stringify(orderBook.asks)
    ) {
      this.side.scrollTop = this.side.scrollHeight;
    }
  }
  render() {
    const {
      fixedPrecision,
      pricePrecision,
      orderBook,
      updateSelectedOrderProperties,
      hoveredSide,
      hoveredOrderIndex,
      setHovers,
      type
    } = this.props;

    const orderBookOrders =
      type === ASKS ? orderBook.asks || [] : orderBook.bids || [];

    return (
      <div className={Styles.Side}>
        <div
          className={classNames({ [Styles.Asks]: type === ASKS })}
          ref={side => {
            this.side = side;
          }}
        >
          {orderBookOrders.map((order, i) => (
            <button
              key={order.cumulativeShares}
              className={classNames({
                [Styles.Positive]: type === ASKS,
                [Styles.BidHead]:
                  i === orderBook.asks.length - 1 && type === ASKS,
                [Styles.AskHead]: i === 0 && type === BIDS,
                [Styles.Hover]: i === hoveredOrderIndex && hoveredSide === type,
                [Styles.EncompassedHover]:
                  (hoveredOrderIndex !== null &&
                    type === ASKS &&
                    hoveredSide === ASKS &&
                    i > hoveredOrderIndex) ||
                  (hoveredOrderIndex !== null &&
                    type === BIDS &&
                    hoveredSide === BIDS &&
                    i < hoveredOrderIndex)
              })}
              onMouseEnter={() => {
                setHovers(i, type);
              }}
              onMouseLeave={() => {
                setHovers(null, null);
              }}
              onClick={() =>
                updateSelectedOrderProperties({
                  orderPrice: order.price.value.toString(),
                  orderQuantity: order.cumulativeShares.toString(),
                  selectedNav: type === ASKS ? BUY : SELL,
                  selfTrade: order.mySize !== null
                })
              }
            >
              <div
                className={classNames({ [Styles.Neg]: type === ASKS })}
                style={{ right: order.quantityScale + "%" }}
              />
              <div
                className={classNames({
                  [Styles.Ask]: type === ASKS,
                  [Styles.Bid]: type === BIDS
                })}
              >
                <HoverValueLabel value={order.shares} />
              </div>
              <div
                className={classNames({
                  [Styles.Ask]: type === ASKS,
                  [Styles.Bid]: type === BIDS
                })}
              >
                {order.price.value.toFixed(pricePrecision)}
              </div>
              <div
                className={classNames({
                  [Styles.Ask]: type === ASKS,
                  [Styles.Bid]: type === BIDS
                })}
              >
                {order.mySize
                  ? order.mySize.value.toFixed(fixedPrecision).toString()
                  : "—"}
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }
}

// tslint:disable-next-line: max-classes-per-file
export default class OrderBook extends Component<
  OrderBookProps,
  OrderBookState
> {
  static defaultProps = {
    toggle: () => {},
    extend: false,
    hide: false,
    fixedPrecision: 4,
    pricePrecision: 4
  };

  state: OrderBookState = {
    hoveredOrderIndex: null,
    hoveredSide: null
  };

  setHovers = (hoveredOrderIndex: number, hoveredSide: number) => {
    this.setState({
      hoveredOrderIndex: hoveredOrderIndex,
      hoveredSide: hoveredSide
    });
  };

  render() {
    const {
      pricePrecision,
      hasOrders,
      orderBookKeys,
      toggle,
      extend,
      hide
    } = this.props;
    const s = this.state;

    return (
      <section className={Styles.OrderBook}>
        <OrderHeader
          title="Order Book"
          headers={["quantity", "price", "my quantity"]}
          toggle={toggle}
          extended={extend}
          hide={hide}
        />
        <OrderBookSide
          {...this.props}
          setHovers={this.setHovers}
          hoveredSide={s.hoveredSide}
          hoveredOrderIndex={s.hoveredOrderIndex}
          type={ASKS}
          scrollToTop
        />
        {!hide && (
          <div className={Styles.Midmarket}>
            {hasOrders && (
              <div>
                <span>Spread:</span>
                {orderBookKeys.spread
                  ? orderBookKeys.spread.toFixed(pricePrecision)
                  : "—"}
                {orderBookKeys.spread && <span>ETH</span>}
              </div>
            )}
          </div>
        )}
        <OrderBookSide
          {...this.props}
          setHovers={this.setHovers}
          hoveredSide={s.hoveredSide}
          hoveredOrderIndex={s.hoveredOrderIndex}
          type={BIDS}
        />
      </section>
    );
  }
}
