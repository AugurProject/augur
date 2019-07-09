import React, { Component } from 'react';
import classNames from 'classnames';

import OrderHeader from 'modules/market-charts/components/order-header/order-header';
import { HoverValueLabel } from 'modules/common/labels';
import { ASKS, BIDS, BUY, SELL } from 'modules/common/constants';

import Styles from 'modules/market-charts/components/order-book/order-book.styles.less';
import { OutcomeOrderBook } from 'modules/types';
import { createBigNumber } from 'utils/create-big-number';
import { formatShares } from 'utils/format-number';

interface OrderBookSideProps {
  orderBook: OutcomeOrderBook;
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
  orderBook: OutcomeOrderBook;
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
    scrollToTop: false,
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
      type,
    } = this.props;

    const orderBookOrders =
      type === ASKS ? orderBook.asks || [] : orderBook.bids || [];

    return (
      <div className={Styles.Side}>
        {orderBookOrders.length === 0 &&
          <div className={Styles.NoOrders}>{type === ASKS ? `Add Offer` : `Add Bid`} </div>
        }
        <div
          className={classNames({ [Styles.Asks]: type === ASKS })}
          ref={side => {
            this.side = side;
          }}
        >
          {orderBookOrders.map((order, i) => (
            <button
              key={order.cumulativeShares + i}
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
                    i < hoveredOrderIndex),
              })}
              onMouseEnter={() => {
                setHovers(i, type);
              }}
              onMouseLeave={() => {
                setHovers(null, null);
              }}
              onClick={() =>
                updateSelectedOrderProperties({
                  orderPrice: order.price,
                  orderQuantity: order.cumulativeShares,
                  selectedNav: type === ASKS ? BUY : SELL,
                  selfTrade: order.mySize !== '0',
                })
              }
            >
              <div
                className={classNames({ [Styles.Neg]: type === ASKS })}
                style={{ right: order.quantityScale + '%' }}
              />
              <div
                className={classNames({
                  [Styles.Ask]: type === ASKS,
                  [Styles.Bid]: type === BIDS,
                })}
              >
                <HoverValueLabel
                  value={formatShares(order.shares)}
                  showEmptyDash={true}
                  showDenomination={false}
                />
              </div>
              <div
                className={classNames({
                  [Styles.Ask]: type === ASKS,
                  [Styles.Bid]: type === BIDS,
                })}
              >
                {createBigNumber(order.price).toFixed(pricePrecision)}
              </div>
              <div
                className={classNames({
                  [Styles.Ask]: type === ASKS,
                  [Styles.Bid]: type === BIDS,
                })}
              >
                {order.mySize !== '0'
                  ? createBigNumber(order.mySize)
                      .toFixed(fixedPrecision)
                      .toString()
                  : '—'}
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
    fixedPrecision: 2,
    pricePrecision: 2,
  };

  state: OrderBookState = {
    hoveredOrderIndex: null,
    hoveredSide: null,
  };

  setHovers = (hoveredOrderIndex: number, hoveredSide: number) => {
    this.setState({
      hoveredOrderIndex: hoveredOrderIndex,
      hoveredSide: hoveredSide,
    });
  };

  render() {
    const {
      pricePrecision,
      hasOrders,
      toggle,
      extend,
      hide,
      orderBook
    } = this.props;
    const s = this.state;

    return (
      <section className={Styles.OrderBook}>
        <OrderHeader
          title="Order Book"
          headers={['quantity', 'price', 'my quantity']}
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
                {orderBook.spread
                  ? createBigNumber(orderBook.spread).toFixed(
                      pricePrecision
                    )
                  : '—'}
                {orderBook.spread && <span>DAI</span>}
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
