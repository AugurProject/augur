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
  INVALID_OUTCOME_ID,
} from 'modules/common/constants';
import { CancelTextButton } from 'modules/common/buttons';
import Styles from 'modules/market-charts/components/order-book/order-book.styles.less';
import {
  QuantityOutcomeOrderBook,
  QuantityOrderBookOrder,
  MarketData,
} from 'modules/types';
import { createBigNumber } from 'utils/create-big-number';
import { formatDai, formatMarketShares } from 'utils/format-number';
import { NUMBER_OF_SECONDS_IN_A_DAY } from 'utils/format-date';
import { useMarketsStore } from 'modules/markets/store/markets';
import { loadMarketOrderBook } from 'modules/orders/helpers/load-market-orderbook';
import { useAppStatusStore } from 'modules/app/store/app-status';
import {
  orderAndAssignCumulativeShares,
  calcOrderbookPercentages,
} from 'modules/markets/helpers/order-and-assign-cumulative-shares';
import { isEmpty } from 'utils/is-empty';
import { useLocation } from 'react-router';
import { getTutorialPreview } from 'modules/market/store/market-utils';

interface OrderBookSideProps {
  processedOrderbook: QuantityOutcomeOrderBook;
  updateSelectedOrderProperties: Function;
  pricePrecision: number;
  setHovers: Function;
  type: string;
  marketType: string;
  hoverState: {
    hoveredSide?: string;
    hoveredOrderIndex?: number;
  },
  showButtons: boolean;
  orderbookLoading: boolean;
  usePercent: boolean;
}

interface OrderBookProps {
  orderBook: QuantityOutcomeOrderBook;
  updateSelectedOrderProperties: Function;
  pricePrecision: number;
  toggle: Function;
  hide?: boolean;
  showButtons?: boolean;
  usePercent?: boolean;
  expirationTime: number;
  market: MarketData;
}
const LOADING = "Loading ...";
const ADD_OFFER = "Add Offer";
const ADD_BID = "Add Bid";

const OrderBookSide = ({
  pricePrecision = 4,
  processedOrderbook,
  updateSelectedOrderProperties,
  hoverState,
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
  const {
    hoveredSide,
    hoveredOrderIndex,
  } = hoverState;
  const isAsks = type === ASKS;
  const isScalar = marketType === SCALAR;
  const opts = { removeComma: true };
  const orderBookOrders = processedOrderbook[type] || [];
  const isScrollable =
    side.current && orderBookOrders.length * 20 >= side.current.clientHeight;

  useEffect(() => {
    side.current.scrollTop = type === BIDS ? 0 : side.current.scrollHeight;
  }, [processedOrderbook[type], side.current.clientHeight]);

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
          {orderbookLoading && LOADING}
          {!orderbookLoading &&
            !showButtons &&
            (isAsks ? ADD_OFFER : ADD_BID)}
          {!orderbookLoading &&
            showButtons &&
            (isAsks ? (
              <CancelTextButton
                text={ADD_OFFER}
                title={ADD_OFFER}
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
                text={ADD_BID}
                title={ADD_BID}
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
        const mySize = formatMarketShares(marketType, order.mySize)
          .formattedValue;
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
              useFull
            />
            {isScalar && !usePercent ? (
              <HoverValueLabel value={formatDai(order.price)} />
            ) : (
              <span>
                {usePercent
                  ? order.percent
                  : createBigNumber(order.price).toFixed(pricePrecision)}
              </span>
            )}
            <span>{hasSize ? mySize : '—'}</span>
          </div>
        );
      })}
    </div>
  );
};

const OrderBook = ({
  updateSelectedOrderProperties,
  pricePrecision = 2,
  toggle,
  hide = false,
  showButtons,
  orderBook,
  market: {
    id,
    marketType,
    minPrice,
    maxPrice,
    orderBook: marketOrderBook
  },
}: OrderBookProps) => {
  const {
    orderBooks,
    actions: { updateOrderBook },
  } = useMarketsStore();
  const location = useLocation();
  const {
    isPreview,
    preview: initialLiquidity
  } = getTutorialPreview(id, location);
  const orderbookLoading = isPreview ? !marketOrderBook : !(orderBooks[id] || {})?.orderBook;
  const {
    blockchain: { currentAugurTimestamp: currentTimeInSeconds },
  } = useAppStatusStore();
  const orderBookSelected = (orderBooks && orderBooks[id]) || {
    expirationTime: 0,
  };
  const outcomeOrderBook = orderBook || {};
  const usePercent =
    marketType === SCALAR &&
    orderBookSelected === INVALID_OUTCOME_ID;

  let processedOrderbook = orderAndAssignCumulativeShares(outcomeOrderBook);

  if (usePercent) {
    // calc percentages in orderbook
    processedOrderbook = calcOrderbookPercentages(
      processedOrderbook,
      minPrice,
      maxPrice
    );
  }

  const expirationTime =
    initialLiquidity || !!!orderBookSelected
      ? 0
      : orderBookSelected.expirationTime;
  const hasOrders =
    !isEmpty(processedOrderbook[BIDS]) || !isEmpty(processedOrderbook[ASKS]);

  const [hoverState, setHoverState] = useState({
    hoveredOrderIndex: null,
    hoveredSide: null,
  });

  useEffect(() => {
    const expirationMaxSeconds =
      expirationTime - currentTimeInSeconds - MIN_ORDER_LIFESPAN;
    if (
      expirationMaxSeconds > 0 &&
      expirationMaxSeconds < NUMBER_OF_SECONDS_IN_A_DAY
    ) {
      const timer = setTimeout(
        () => updateOrderBook(
          id,
          null,
          loadMarketOrderBook(id)
        ),
        expirationMaxSeconds * 1000
      );
      return () => clearTimeout(timer);
    }
  }, [expirationTime]);

  const sideProps = {
    pricePrecision,
    processedOrderbook,
    updateSelectedOrderProperties,
    marketType,
    setHovers: (hoveredOrderIndex: number, hoveredSide: string) =>
    setHoverState({ hoveredOrderIndex, hoveredSide }),
    hoverState,
    showButtons,
    orderbookLoading,
    usePercent,
  };

  return (
    <section className={Styles.OrderBook}>
      <OrderHeader
        title="Order Book"
        headers={['quantity', usePercent ? 'percent' : 'price', 'my quantity']}
        toggle={toggle}
        hide={hide}
      />
      <OrderBookSide
        type={ASKS}
        {...sideProps}
      />
      {!hide && (
        <div className={Styles.Midmarket}>
          {hasOrders &&
            `spread: ${
              orderBook.spread
                ? `${!usePercent ? '$' : ''}${createBigNumber(
                    orderBook.spread
                  ).toFixed(pricePrecision)} ${usePercent ? '%' : ''}`
                : '—'
            }`}
        </div>
      )}
      <OrderBookSide
        type={BIDS}
        {...sideProps}
      />
    </section>
  );
};

export default OrderBook;
