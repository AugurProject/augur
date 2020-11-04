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
// @ts-ignore
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
import { Trading } from 'modules/trading/store/trading';

interface OrderBookSideProps {
  processedOrderbook: QuantityOutcomeOrderBook;
  pricePrecision: number;
  setHovers: Function;
  type: string;
  marketType: string;
  hoverState: {
    hoveredSide?: string;
    hoveredOrderIndex?: number;
  };
  showButtons: boolean;
  orderbookLoading: boolean;
  usePercent: boolean;
}

interface OrderBookProps {
  orderBook: QuantityOutcomeOrderBook;
  pricePrecision: number;
  toggle: Function;
  hide?: boolean;
  showButtons?: boolean;
  usePercent?: boolean;
  expirationTime: number;
  market: MarketData;
}
const LOADING = 'Loading ...';
const ADD_OFFER = 'Add Offer';
const ADD_BID = 'Add Bid';
const EMPTY_BUY = {
  orderPrice: '',
  orderQuantity: '',
  selectedNav: BUY,
};
const EMPTY_SELL = {
  orderPrice: '',
  orderQuantity: '',
  selectedNav: SELL,
};

const OrderBookSide = ({
  pricePrecision = 4,
  processedOrderbook,
  hoverState,
  setHovers,
  type,
  marketType,
  showButtons,
  orderbookLoading,
  usePercent,
}: OrderBookSideProps) => {
  const { updateOrderProperties } = Trading.actions;
  const side = useRef({ clientHeight: 0, scrollHeight: 0, scrollTop: 0 });
  const { hoveredSide, hoveredOrderIndex } = hoverState;
  const isAsks = type === ASKS;
  const isScalar = marketType === SCALAR;
  const opts = { removeComma: true };
  const orderBookOrders = processedOrderbook[type] || [];
  const { clientHeight, scrollHeight }  = side.current;
  const isScrollable = orderBookOrders.length * 20 >= clientHeight;

  useEffect(() => {
    side.current.scrollTop = !isAsks ? 0 : scrollHeight;
  }, [processedOrderbook[type], clientHeight]);

  const buttonProps = isAsks
    ? {
        text: ADD_OFFER,
        title: ADD_OFFER,
        action: () => updateOrderProperties(EMPTY_SELL),
      }
    : {
        text: ADD_BID,
        title: ADD_BID,
        action: () => updateOrderProperties(EMPTY_BUY),
      };

  return (
    <div
      className={classNames(Styles.Side, {
        [Styles.Asks]: isAsks,
        [Styles.Scrollable]: isScrollable,
      })}
      // @ts-ignore
      ref={side}
    >
      {orderBookOrders.length === 0 && (
        <div className={Styles.NoOrders}>
          {orderbookLoading ? (
            LOADING
          ) : !showButtons ? (
            buttonProps.text
          ) : (
            <CancelTextButton {...buttonProps} />
          )}
        </div>
      )}
      {orderBookOrders.map(
        (
          {
            mySize,
            cumulativeShares: orderQuantity,
            shares,
            price: orderPrice,
            quantityScale,
            percent,
          }: QuantityOrderBookOrder,
          i
        ) => {
          const isSideHovered = hoveredSide === type;
          const shouldEncompass = i < hoveredOrderIndex && isSideHovered;
          const isHovered = i === hoveredOrderIndex && isSideHovered;
          const mySizeFormatted = formatMarketShares(marketType, mySize)
            .formattedValue;
          return (
            <div
              key={`${orderQuantity}${i}`}
              className={classNames({
                [Styles.AskSide]: isAsks,
                [Styles.Hover]: isHovered,
                [Styles.EncompassedHover]: shouldEncompass,
              })}
              onMouseEnter={() => setHovers(i, type)}
              onMouseLeave={() => setHovers(null, null)}
              onClick={() =>
                updateOrderProperties({
                  orderPrice,
                  orderQuantity,
                  selectedNav: isAsks ? BUY : SELL,
                })
              }
            >
              <div>
                <div
                  className={classNames({ [Styles.Neg]: isAsks })}
                  style={{ width: `${100 - quantityScale}%` }}
                />
              </div>
              <HoverValueLabel
                value={formatMarketShares(marketType, shares, opts)}
                useFull
              />
              {isScalar && !usePercent ? (
                <HoverValueLabel value={formatDai(orderPrice)} />
              ) : (
                <span>
                  {usePercent
                    ? percent
                    : createBigNumber(orderPrice).toFixed(pricePrecision)}
                </span>
              )}
              <span>{mySize !== '0' ? mySizeFormatted : '—'}</span>
            </div>
          );
        }
      )}
    </div>
  );
};

const OrderBook = ({
  pricePrecision = 2,
  toggle,
  hide = false,
  showButtons,
  orderBook,
  market: { id, marketType, minPrice, maxPrice, orderBook: marketOrderBook },
}: OrderBookProps) => {
  const {
    orderBooks,
    actions: { updateOrderBook },
  } = useMarketsStore();
  const location = useLocation();
  const { isPreview, preview: initialLiquidity } = getTutorialPreview(
    id,
    location
  );
  const orderbookLoading = isPreview
    ? !marketOrderBook
    : !orderBooks[id]?.orderBook;
  const {
    blockchain: { currentAugurTimestamp: currentTimeInSeconds },
  } = useAppStatusStore();
  const orderBookSelected = (orderBooks && orderBooks[id]) || {
    expirationTime: 0,
  };
  const outcomeOrderBook = orderBook || {};
  const usePercent =
    marketType === SCALAR && orderBookSelected === INVALID_OUTCOME_ID;

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
      const timer = setTimeout(() => {
        return updateOrderBook(id, null, loadMarketOrderBook(id));
      }, expirationMaxSeconds * 1000);
      return () => clearTimeout(timer);
    }
    return () => {};
  }, [expirationTime]);

  const sideProps = {
    pricePrecision,
    processedOrderbook,
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
        {...{ toggle, hide }}
      />
      <OrderBookSide type={ASKS} {...sideProps} />
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
      <OrderBookSide type={BIDS} {...sideProps} />
    </section>
  );
};

export default OrderBook;
