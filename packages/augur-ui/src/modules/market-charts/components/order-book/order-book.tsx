import React, { useRef, useEffect, useState } from 'react';
import classNames from 'classnames';

import OrderHeader from 'modules/market-charts/components/order-header/order-header';
import { HoverValueLabel } from 'modules/common/labels';
import {
  ASKS,
  BIDS,
  BUY,
  SELL,
  SCALAR,
  MIN_ORDER_LIFESPAN,
} from 'modules/common/constants';
import { CancelTextButton } from 'modules/common/buttons';
import Styles from 'modules/market-charts/components/order-book/order-book.styles.less';
import {
  QuantityOutcomeOrderBook,
  QuantityOrderBookOrder,
} from 'modules/types';
import { createBigNumber } from 'utils/create-big-number';
import { formatDaiPrice, formatMarketShares } from 'utils/format-number';
import { NUMBER_OF_SECONDS_IN_A_DAY } from 'utils/format-date';

interface OrderBookSideProps {
  orderBook: QuantityOutcomeOrderBook;
  updateSelectedOrderProperties: Function;
  fixedPrecision: number;
  pricePrecision: number;
  setHovers: Function;
  type: string;
  marketType: string;
  hoveredSide?: string;
  hoveredOrderIndex?: number;
  showButtons: boolean;
  orderbookLoading: boolean;
  usePercent: boolean;
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
  marketType: string;
  showButtons: boolean;
  orderbookLoading: boolean;
  usePercent: boolean;
  expirationTime: number;
  currentTimeInSeconds: number;
  loadMarketOrderBook: Function;
  status: string;
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
  usePercent,
}: OrderBookSideProps) => {
  const side = useRef({
    current: { clientHeight: 0, scrollHeight: 0, scrollTop: 0 },
  });
  const isAsks = type === ASKS;
  const isScalar = marketType === SCALAR;
  const opts = { removeComma: true };
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
                    orderPrice: '',
                    orderQuantity: '',
                    selectedNav: SELL,
                  })
                }
              />
            ) : (
              <CancelTextButton
                text="Add Bid"
                title="Add Bid"
                action={() =>
                  updateSelectedOrderProperties({
                    orderPrice: '',
                    orderQuantity: '',
                    selectedNav: BUY,
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
        const mySize = formatMarketShares(marketType, order.mySize).formattedValue;
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
              value={formatMarketShares(marketType, order.shares, opts)}
              useFull={true}
              showEmptyDash={true}
              showDenomination={false}
            />
            {isScalar && !usePercent ?
              <HoverValueLabel value={formatDaiPrice(order.price)}/> :
              <span>{usePercent ? order.percent : createBigNumber(order.price).toFixed(pricePrecision)}</span>
            }
            <span>
              {hasSize
                ? mySize
                : '—'}
            </span>
          </div>
        );
      })}
    </div>
  );
};

const OrderBook = ({
  orderBook,
  updateSelectedOrderProperties,
  hasOrders,
  fixedPrecision = 3,
  pricePrecision = 3,
  toggle,
  hide = false,
  marketType,
  showButtons,
  orderbookLoading,
  usePercent,
  expirationTime,
  currentTimeInSeconds,
  loadMarketOrderBook,
  status,
}: OrderBookProps) => {
  const [hoverState, setHoverState] = useState({ hoveredOrderIndex: null, hoveredSide: null });
  const setHovers = (hoveredOrderIndex: number, hoveredSide: string) => setHoverState({ hoveredOrderIndex, hoveredSide });

  useEffect(() => {
    const expirationMaxSeconds =
      expirationTime - currentTimeInSeconds - MIN_ORDER_LIFESPAN;
    if (expirationMaxSeconds > 0 && expirationMaxSeconds < NUMBER_OF_SECONDS_IN_A_DAY) {
      const timer = setTimeout(() => loadMarketOrderBook(), expirationMaxSeconds * 1000);
      return () => clearTimeout(timer);
    }
    return () => {};
  }, [expirationTime]);

  return (
    <section className={Styles.OrderBook}>
      <OrderHeader
        title="Order Book"
        headers={['quantity', usePercent ? 'percent' : 'price', 'my quantity']}
        toggle={toggle}
        hide={hide}
        status={status}
      />
      <OrderBookSide
        fixedPrecision={fixedPrecision}
        pricePrecision={pricePrecision}
        orderBook={orderBook}
        updateSelectedOrderProperties={updateSelectedOrderProperties}
        marketType={marketType}
        setHovers={setHovers}
        hoveredSide={hoverState.hoveredSide}
        hoveredOrderIndex={hoverState.hoveredOrderIndex}
        type={ASKS}
        showButtons={showButtons}
        orderbookLoading={orderbookLoading}
        usePercent={usePercent}
      />
      {!hide && (
        <div className={Styles.Midmarket}>
          {hasOrders &&
            `spread: ${
              orderBook.spread
                ? `${!usePercent ? '$' : ''}${createBigNumber(orderBook.spread).toFixed(
                    pricePrecision
                  )} ${usePercent ? '%' : ''}`
                : '—'
            }`}
        </div>
      )}
      <OrderBookSide
        fixedPrecision={fixedPrecision}
        pricePrecision={pricePrecision}
        orderBook={orderBook}
        updateSelectedOrderProperties={updateSelectedOrderProperties}
        marketType={marketType}
        setHovers={setHovers}
        hoveredSide={hoverState.hoveredSide}
        hoveredOrderIndex={hoverState.hoveredOrderIndex}
        type={BIDS}
        showButtons={showButtons}
        orderbookLoading={orderbookLoading}
        usePercent={usePercent}
      />
    </section>
  );
};

export default OrderBook;

