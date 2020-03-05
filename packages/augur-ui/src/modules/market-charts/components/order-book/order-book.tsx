import React, { Component, useRef, useEffect } from 'react';
import classNames from 'classnames';

import OrderHeader from 'modules/market-charts/components/order-header/order-header';
import { HoverValueLabel } from 'modules/common/labels';
import {
  ASKS,
  BIDS,
  BUY,
  SELL,
  SCALAR,
  BINARY_CATEGORICAL_FORMAT_OPTIONS,
} from 'modules/common/constants';
import { CancelTextButton } from 'modules/common/buttons';
import Styles from 'modules/market-charts/components/order-book/order-book.styles.less';
import {
  OutcomeFormatted,
  QuantityOutcomeOrderBook,
  QuantityOrderBookOrder,
} from 'modules/types';
import { createBigNumber } from 'utils/create-big-number';
import { formatShares } from 'utils/format-number';

interface OrderBookSideProps {
  orderBook: QuantityOutcomeOrderBook;
  updateSelectedOrderProperties: Function;
  hasOrders: boolean;
  orderBookKeys: object;
  fixedPrecision: number;
  pricePrecision: number;
  setHovers: Function;
  type: string;
  marketType: string;
  hoveredSide?: string;
  hoveredOrderIndex?: number;
  showButtons: boolean;
  orderbookLoading: boolean;
}

interface OrderBookProps {
  orderBook: QuantityOutcomeOrderBook;
  updateSelectedOrderProperties: Function;
  hasOrders: boolean;
  orderBookKeys: object;
  fixedPrecision: number;
  pricePrecision: number;
  toggle: boolean;
  hide: boolean;
  marketId: string;
  initialLiquidity: boolean;
  marketType: string;
  account: string;
  selectedOutcome: OutcomeFormatted;
  showButtons: boolean;
  orderbookLoading: boolean;
}

interface OrderBookState {
  hoveredOrderIndex?: number;
  hoveredSide?: string;
}

const OrderBookSide = ({
  fixedPrecision = 4,
  pricePrecision = 4,
  orderBook,
  updateSelectedOrderProperties,
  hoveredSide,
  hoveredOrderIndex,
  setHovers,
  type,
  marketType,
  showButtons,
  orderbookLoading,
}: OrderBookSideProps) => {
  const side = useRef({
    current: { clientHeight: 0, scrollHeight: 0, scrollTop: 0 },
  });
  const isAsks = type === ASKS;
  const opts =
    marketType === SCALAR
      ? { removeComma: true }
      : { ...BINARY_CATEGORICAL_FORMAT_OPTIONS, removeComma: true };
  const orderBookOrders = orderBook[type] || [];
  const isScrollable =
    side.current && orderBookOrders.length * 20 >= side.current.clientHeight;

  useEffect(() => {
    side.current.scrollTop =
      type === BIDS ? 0 : side.current.scrollHeight;
  }, [orderBook[type], side.current.clientHeight]);

  return (
    <div
      className={classNames(Styles.Side, {
        [Styles.Asks]: isAsks,
        [Styles.Scrollable]: isScrollable,
      })}
      ref={side}
    >
      {orderBookOrders.length === 0 && (
        <div className={Styles.NoOrders}>
          {orderbookLoading && `Loading ...`}
          {!orderbookLoading &&
            !showButtons &&
            (isAsks ? `Add Offer` : `Add Bid`)}
          {!orderbookLoading &&
            showButtons &&
            (isAsks ? (
              <CancelTextButton
                text="Add Offer"
                title="Add Offer"
                action={() =>
                  updateSelectedOrderProperties({
                    orderPrice: '0',
                    orderQuantity: '0',
                    selectedNav: SELL,
                    selfTrade: false,
                  })
                }
              />
            ) : (
              <CancelTextButton
                text="Add Bid"
                title="Add Bid"
                action={() =>
                  updateSelectedOrderProperties({
                    orderPrice: '0',
                    orderQuantity: '0',
                    selectedNav: BUY,
                    selfTrade: false,
                  })
                }
              />
            ))}
        </div>
      )}
      {orderBookOrders.map((order: QuantityOrderBookOrder, i) => {
        const hasSize = order.mySize !== '0';
        const shouldEncompass =
          (hoveredOrderIndex !== null &&
            isAsks &&
            hoveredSide === ASKS &&
            i > hoveredOrderIndex) ||
          (hoveredOrderIndex !== null &&
            !isAsks &&
            hoveredSide === BIDS &&
            i < hoveredOrderIndex);
        const isHovered = i === hoveredOrderIndex && hoveredSide === type;

        return (
          <div
            key={order.cumulativeShares + i}
            className={classNames({
              [Styles.AskSide]: isAsks,
              [Styles.Hover]: isHovered,
              [Styles.EncompassedHover]: shouldEncompass,
            })}
            onMouseEnter={() => setHovers(i, type)}
            onMouseLeave={() => setHovers(null, null)}
            onClick={() =>
              updateSelectedOrderProperties({
                orderPrice: order.price,
                orderQuantity: order.cumulativeShares,
                selectedNav: isAsks ? BUY : SELL,
                selfTrade: hasSize,
              })
            }
          >
            <div>
              <div
                className={classNames({ [Styles.Neg]: isAsks })}
                style={{ width: 100 - order.quantityScale + '%' }}
              />
            </div>
            <HoverValueLabel
              value={formatShares(order.shares, opts)}
              useFull={true}
              showEmptyDash={true}
              showDenomination={false}
            />
            <span>{createBigNumber(order.price).toFixed(pricePrecision)}</span>
            <span>
              {hasSize
                ? createBigNumber(order.mySize).toFixed(fixedPrecision)
                : '—'}
            </span>
          </div>
        );
      })}
    </div>
  );
};

// tslint:disable-next-line: max-classes-per-file
export default class OrderBook extends Component<
  OrderBookProps,
  OrderBookState
> {
  static defaultProps = {
    extend: false,
    hide: false,
    fixedPrecision: 2,
    pricePrecision: 2,
  };

  state: OrderBookState = {
    hoveredOrderIndex: null,
    hoveredSide: null,
  };

  setHovers = (hoveredOrderIndex: number, hoveredSide: string) => {
    this.setState({
      hoveredOrderIndex,
      hoveredSide,
    });
  };

  render() {
    const {
      pricePrecision,
      toggle,
      hide,
      marketType,
      hasOrders,
      orderBook,
      showButtons,
      orderbookLoading,
    } = this.props;
    const { hoveredSide, hoveredOrderIndex } = this.state;

    return (
      <section className={Styles.OrderBook}>
        <OrderHeader
          title="Order Book"
          headers={['quantity', 'price', 'my quantity']}
          toggle={toggle}
          hide={hide}
        />
        <OrderBookSide
          {...this.props}
          marketType={marketType}
          setHovers={this.setHovers}
          hoveredSide={hoveredSide}
          hoveredOrderIndex={hoveredOrderIndex}
          type={ASKS}
          showButtons={showButtons}
          orderbookLoading={orderbookLoading}
        />
        {!hide && (
          <div className={Styles.Midmarket}>
            {hasOrders &&
              `spread: ${
                orderBook.spread
                  ? `$${createBigNumber(orderBook.spread).toFixed(
                      pricePrecision
                    )}`
                  : '—'
              }`}
          </div>
        )}
        <OrderBookSide
          {...this.props}
          marketType={marketType}
          setHovers={this.setHovers}
          hoveredSide={hoveredSide}
          hoveredOrderIndex={hoveredOrderIndex}
          type={BIDS}
          showButtons={showButtons}
          orderbookLoading={orderbookLoading}
        />
      </section>
    );
  }
}
