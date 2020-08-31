import React from 'react';
import Row from 'modules/common/row';
import {
  COLUMN_TYPES,
  INVALID_OUTCOME_ID,
  YES_NO,
  SCALAR,
  SCALAR_INVALID_BEST_BID_ALERT_VALUE,
  INVALID_BEST_BID_ALERT_VALUE,
  SELL,
  BUY,
  CANCELORDER,
  DEFAULT_MAX_PRICE,
  DEFAULT_MIN_PRICE,
  OPEN,
  INVALID_OUTCOME_COMPARE,
  SHORT,
  ODDS_TYPE,
} from './constants';
import {
  formatNumber,
  formatBlank,
  calcPercentageFromPrice,
  formatMarketShares,
  formatDai,
} from 'utils/format-number';
import { convertUnixToFormattedDate } from 'utils/format-date';
import { formatOrderBook } from 'modules/create-market/helpers/format-order-book';
import { selectMarketOutcomeBestBidAsk } from 'modules/markets/selectors/select-market-outcome-best-bid-ask';
import { useMarketsStore } from 'modules/markets/store/markets';
import { useAppStatusStore } from 'modules/app/store/app-status';
import { OutcomeFormatted, UIOrder } from 'modules/types';
import { Getters } from '@augurproject/sdk';
import { TXEventName } from '@augurproject/sdk-lite';
import { removeCanceledOrder } from 'modules/pending-queue/actions/pending-queue-management';
import { removePendingOrder } from 'modules/orders/actions/pending-orders-management';
import { Properties } from './row-column';
import { convertToOdds } from 'utils/get-odds';
import { BET_STATUS } from 'modules/trading/store/constants';

interface MyBetsRowProps {
  outcome: Object;
  showExtraRow: Boolean;
  isEvent: Boolean;
}

export const MyBetsRow = ({
  outcome,
  showExtraRow,
  isEvent,
}: MyBetsRowProps) => {
  const { oddsType } = useAppStatusStore();
  const isFractional = oddsType === ODDS_TYPE.FRACTIONAL;
  const columnProperties = [
    {
      key: 'outcomeName',
      columnType: COLUMN_TYPES.TEXT,
      text: outcome.outcome,
      keyId: outcome.outcome,
      showExtraNumber: showExtraRow,
      value: isEvent ? outcome.description : outcome.sportsBook?.title,
      highRisk: outcome.highRisk,
      templateShield: isEvent,
      outcome: outcome,
      marketId: outcome.marketId,
    },
    {
      key: 'wager',
      columnType: COLUMN_TYPES.VALUE,
      value: formatNumber(outcome && outcome.wager),
      useFull: true,
      keyId: 'outcome-wager-' + outcome.outcome,
    },
    {
      key: 'odds',
      columnType: isFractional ? COLUMN_TYPES.TEXT : COLUMN_TYPES.VALUE,
      text: convertToOdds(outcome && outcome.normalizedPrice).full,
      value: isFractional ? null : convertToOdds(outcome && outcome.normalizedPrice),
      keyId: 'outcome-odds-' + outcome.outcome,
      useFull: true,
    },
    {
      key: 'toWin',
      columnType: COLUMN_TYPES.VALUE,
      value: formatDai(outcome && outcome.toWin),
      keyId: 'outcome-toWin-' + outcome.outcome,
    },
    {
      key: 'betDate',
      columnType: COLUMN_TYPES.TEXT,
      text: convertUnixToFormattedDate(outcome.timestamp).formattedUtc,
      keyId: 'outcome-betDate-' + outcome.outcome,
    },
  ];
  if (outcome.status === BET_STATUS.PENDING || outcome.status === BET_STATUS.FAILED) {
    columnProperties.push(
      {
        key: 'button',
        columnType: COLUMN_TYPES.PENDING_ICON_BUTTON,
        outcome: outcome,
        action: async (e: Event) => {},
      }
    );
  } else {
    columnProperties.push(
      {
        key: 'button',
        columnType: COLUMN_TYPES.CASHOUT_BUTTON,
        outcome: outcome,
        action: async (e: Event) => {},
      }
    );
  }
  return (
    <Row
      rowProperties={outcome}
      columnProperties={columnProperties}
      styleOptions={{
        noToggle: true,
        myBetRow: true,
      }}
    />
  );
};

interface MarketOutcomeProps {
  outcome: OutcomeFormatted;
  orderBook: Getters.Markets.OutcomeOrderBook;
  preview: Boolean;
  marketId: string;
  updateSelectedOutcome: Function;
  updateSelectedOrderProperties: Function;
  scalarDenomination: string;
  selectedOutcomeId: number;
}

export const MarketOutcome = ({
  outcome,
  orderBook,
  preview,
  marketId,
  updateSelectedOutcome,
  updateSelectedOrderProperties,
  scalarDenomination,
  selectedOutcomeId,
}: MarketOutcomeProps) => {
  const outcomeName = outcome.description;
  let outcomeOrderBook = orderBook;
  if (outcome && orderBook && orderBook[outcome.id]) {
    outcomeOrderBook = orderBook[outcome.id];
    if (preview) {
      outcomeOrderBook = formatOrderBook(outcomeOrderBook);
    }
  }
  const { marketInfos } = useMarketsStore();

  const { newMarket } = useAppStatusStore();
  const market = marketInfos[marketId]
    ? marketInfos[marketId]
    : newMarket
    ? newMarket
    : null;
  // default values for create market preview
  const minPrice = market ? market.minPrice : 0;
  const maxPrice = market ? market.maxPrice : 1;
  const tickSize = market ? market.tickSize : 100;
  const marketType = market ? market.marketType : YES_NO; // default to yes no. has to be something

  const usePercent =
    outcome &&
    outcome.id === INVALID_OUTCOME_ID &&
    market.marketType === SCALAR;

  const { topAsk, topBid } = selectMarketOutcomeBestBidAsk(
    outcomeOrderBook,
    marketType,
    tickSize
  );
  const topBidShares = topBid.shares;
  const topAskShares = topAsk.shares;

  let topBidPrice = topBid.price;
  let topAskPrice = topAsk.price;
  let lastPrice = outcome.lastPrice || formatBlank();

  if (usePercent) {
    const topBidPercent = calcPercentageFromPrice(
      topBidPrice.value,
      minPrice,
      maxPrice
    );
    topBidPrice =
      topBidPrice.formatted !== '-'
        ? { ...topBidPrice, percent: `${topBidPercent}%` }
        : topBidPrice;

    const topAskPercent = calcPercentageFromPrice(
      topAskPrice.value,
      minPrice,
      maxPrice
    );
    topAskPrice =
      topAskPrice.formatted !== '-'
        ? { ...topAskPrice, percent: `${topAskPercent}%` }
        : topAskPrice;
    const lastPricePercent = calcPercentageFromPrice(
      lastPrice.value,
      minPrice,
      maxPrice
    );
    lastPrice =
      lastPrice.formatted !== '-'
        ? { ...lastPrice, percent: `${lastPricePercent}%` }
        : lastPrice;
  }

  const showInvalidAlert =
    outcome.id === INVALID_OUTCOME_ID
      ? !!topBidPrice.percent
        ? topBidPrice.percent >= SCALAR_INVALID_BEST_BID_ALERT_VALUE
        : topBidPrice.value >= INVALID_BEST_BID_ALERT_VALUE
      : false;
  const columnProperties = [
    {
      key: 'outcomeName',
      columnType:
        outcome.id === INVALID_OUTCOME_ID
          ? COLUMN_TYPES.INVALID_LABEL
          : COLUMN_TYPES.TEXT,
      text: outcomeName,
      keyId: outcomeName,
      showExtraNumber: !scalarDenomination,
    },
    {
      key: 'topBidShares',
      columnType: COLUMN_TYPES.VALUE,
      value: topBidShares,
      showEmptyDash: true,
    },
    {
      key: 'topBidPrice',
      columnType: COLUMN_TYPES.VALUE,
      value: topBidPrice,
      useFull: true,
      showEmptyDash: true,
      usePercent: !!topBidPrice.percent,
      alert: showInvalidAlert,
      action: e => {
        updateSelectedOutcome(outcome.id, true);
        updateSelectedOrderProperties({
          selectedOutcomeId: outcome.id,
          orderPrice: topBidPrice && topBidPrice.value.toString(),
          orderQuantity: topBidShares && topBidShares.value.toString(),
          selectedNav: SELL,
        });
        e.stopPropagation();
      },
    },
    {
      key: 'topAskPrice',
      columnType: COLUMN_TYPES.VALUE,
      value: topAskPrice,
      useFull: true,
      showEmptyDash: true,
      usePercent: !!topAskPrice.percent,
      action: e => {
        updateSelectedOutcome(outcome.id, true);
        updateSelectedOrderProperties({
          selectedOutcomeId: outcome.id,
          orderPrice: topAskPrice && topAskPrice.value.toString(),
          orderQuantity: topAskShares && topAskShares.value.toString(),
          selectedNav: BUY,
        });
        e.stopPropagation();
      },
    },
    {
      key: 'topAskShares',
      columnType: COLUMN_TYPES.VALUE,
      value: topAskShares,
      showEmptyDash: true,
    },
    {
      key: 'lastPrice',
      columnType: COLUMN_TYPES.VALUE,
      value: lastPrice,
      usePercent: !!lastPrice.percent,
      useFull: true,
      addIndicator: true,
      outcome,
      location: 'tradingPage',
    },
  ];
  return (
    <Row
      rowProperties={outcome}
      columnProperties={columnProperties}
      rowOnClick={(e: Event) => {
        updateSelectedOutcome(outcome.id);
      }}
      styleOptions={{
        outcome: true,
        isSingle: true,
        noToggle: true,
        colorId: outcome.id + 1,
        active: selectedOutcomeId === outcome.id,
        isInvalid: outcome.id === INVALID_OUTCOME_ID,
      }}
    />
  );
};

interface OpenOrderProps {
  openOrder: UIOrder;
  extendedViewNotOnMobile: Boolean;
  marketId: string;
}

export const OpenOrder = ({
  openOrder,
  extendedViewNotOnMobile,
  marketId,
}: OpenOrderProps) => {
  const {
    tokensEscrowed,
    sharesEscrowed,
    outcomeId,
    unmatchedShares,
    id,
    description,
    name,
    outcomeName,
    expiry,
  } = openOrder;

  let { avgPrice } = openOrder;
  const {
    pendingQueue,
    blockchain: { currentAugurTimestamp: currentTimestamp },
  } = useAppStatusStore();
  const pendingOrderCancellations = pendingQueue[CANCELORDER];
  const isCanceling =
    pendingOrderCancellations && pendingOrderCancellations[id];

  const orderLabel = description || name || outcomeName;

  const { marketInfos } = useMarketsStore();
  const market = marketInfos[marketId];
  let usePercent = false;
  const minPrice = market ? market.minPrice : DEFAULT_MIN_PRICE;
  const maxPrice = market ? market.maxPrice : DEFAULT_MAX_PRICE;
  const marketType = market ? market.marketType : YES_NO;
  if (market) {
    usePercent =
      !!market &&
      outcomeId === INVALID_OUTCOME_ID &&
      market.marketType === SCALAR;
  }

  if (usePercent) {
    const avgPricePercent = calcPercentageFromPrice(
      avgPrice.value,
      minPrice,
      maxPrice
    );
    avgPrice = { ...avgPrice, percent: `${avgPricePercent}%` };
  }
  const columnProperties = [
    {
      key: 'orderName',
      columnType: COLUMN_TYPES.TEXT,
      text: orderLabel,
      keyId: openOrder.id,
    },
    {
      key: 'orderType',
      columnType: COLUMN_TYPES.POSITION_TYPE,
      type: openOrder.type,
      showCountdown: true,
      expiry: expiry,
      currentTimestamp: currentTimestamp,
    },
    {
      key: 'unmatchedShares',
      columnType: COLUMN_TYPES.VALUE,
      value: unmatchedShares,
      keyId: 'openOrder-unmatchedShares-' + openOrder.id,
    },
    {
      key: 'avgPrice',
      columnType: COLUMN_TYPES.VALUE,
      value: avgPrice,
      usePercent: !!avgPrice.percent,
      useFull: marketType === SCALAR ? false : true,
      showFullPrecision: marketType === SCALAR ? true : false,
      showDenomination: marketType === SCALAR ? true : false,
      keyId: 'openOrder-price-' + openOrder.id,
    },
    {
      key: 'tokensEscrowed',
      columnType: COLUMN_TYPES.VALUE,
      value: tokensEscrowed,
      useFull: true,
      showEmptyDash: true,
      keyId: 'openOrder-tokensEscrowed-' + openOrder.id,
    },
    {
      key: 'sharesEscrowed',
      columnType: COLUMN_TYPES.VALUE,
      value: sharesEscrowed,
      showEmptyDash: true,
      keyId: 'openOrder-sharesEscrowed-' + openOrder.id,
    },
    {
      key: 'cancel',
      columnType: COLUMN_TYPES.CANCEL_TEXT_BUTTON,
      disabled: !!isCanceling,
      text: null,
      showCountdown: true,
      expiry: expiry,
      currentTimestamp: currentTimestamp,
      pending: !!isCanceling || (openOrder.status && openOrder.status !== OPEN),
      status: !!isCanceling ? isCanceling.status : openOrder.status,
      action: async (e: Event) => {
        e.stopPropagation();
        if (!!isCanceling) {
          removeCanceledOrder(openOrder.id);
        } else if (
          openOrder.status === TXEventName.Failure ||
          openOrder.status === TXEventName.Success
        ) {
          removePendingOrder(openOrder.id, marketId);
        } else {
          await openOrder.cancelOrder(openOrder);
        }
      },
    },
  ];
  return (
    <Row
      extendedViewNotOnMobile={extendedViewNotOnMobile}
      rowProperties={openOrder}
      columnProperties={columnProperties}
      styleOptions={{
        noToggle: extendedViewNotOnMobile,
        openOrder: true,
      }}
    />
  );
};

interface FilledOrderProps {
  filledOrder: UIOrder;
  extendedViewNotOnMobile: Boolean;
}

export const FilledOrder = ({
  filledOrder,
  extendedViewNotOnMobile,
}: FilledOrderProps) => {
  const { marketInfos } = useMarketsStore();
  const {
    marketType,
    amount,
    originalQuantity,
    outcome,
    id,
    timestamp,
    trades,
    price,
    type,
  } = filledOrder;
  const orderQuantity = formatMarketShares(marketType, amount);
  let orderPrice = formatDai(price, { roundDown: true });
  const orderType = type;

  const formatOriginalQuantity = formatMarketShares(
    marketType,
    originalQuantity
  );
  const usePercent = outcome === INVALID_OUTCOME_COMPARE && marketType === SCALAR;
  if (usePercent) {
    const market = marketInfos[filledOrder.marketId];
    const orderPricePercent = calcPercentageFromPrice(
      String(orderPrice.value),
      market.minPrice,
      market.maxPrice
    );
    orderPrice = { ...orderPrice, percent: `${orderPricePercent}%` };
  }
  const columnProperties = [
    {
      key: 'orderName',
      columnType: COLUMN_TYPES.TEXT,
      text: outcome,
      keyId: `${outcome}-${outcome}-${orderPrice}`,
    },
    {
      key: 'orderType',
      columnType: COLUMN_TYPES.POSITION_TYPE,
      type: orderType,
      pastTense: true,
    },
    {
      key: 'originalQuantity',
      columnType: COLUMN_TYPES.VALUE,
      value: formatOriginalQuantity,
      keyId: 'filledOrder-originalQuantity-' + id,
    },
    {
      key: 'orderQuantity',
      columnType: COLUMN_TYPES.VALUE,
      value: orderQuantity,
      keyId: 'filledOrder-orderQuantity-' + id,
    },
    {
      key: 'orderPrice',
      columnType: COLUMN_TYPES.VALUE,
      value: orderPrice,
      usePercent: !!orderPrice.percent,
      useFull: marketType === SCALAR ? false : true,
      showFullPrecision: marketType === SCALAR ? true : false,
      showDenomination: marketType === SCALAR ? true : false,
      keyId: 'filledOrder-orderPrice-' + id,
    },
    {
      key: 'formattedLocalShortDate',
      columnType: COLUMN_TYPES.PLAIN,
      value: timestamp.formattedLocalShortDate,
    },
    {
      key: 'length',
      columnType: COLUMN_TYPES.PLAIN,
      value: trades.length,
    },
  ];
  return (
    <Row
      rowProperties={filledOrder}
      columnProperties={columnProperties}
      extendedViewNotOnMobile={extendedViewNotOnMobile}
      styleOptions={{
        filledOrder: true,
      }}
    />
  );
};

interface PositionRowProps {
  position: Getters.Users.TradingPosition;
  showExpandedToggleOnMobile: Boolean;
  extendedView: Boolean;
  isFirst: Boolean;
  showPercent: Boolean;
  updateSelectedOrderProperties: Function;
}

export const PositionRow = ({
  position,
  showExpandedToggleOnMobile,
  extendedView,
  isFirst,
  updateSelectedOrderProperties,
  showPercent,
}: PositionRowProps) => {
  const { marketInfos } = useMarketsStore();

  let { lastPrice, purchasePrice } = position;

  const market = marketInfos[position.marketId];
  const usePercent =
    position.outcomeId === INVALID_OUTCOME_ID && market.marketType === SCALAR;
  if (usePercent) {
    const lastPricePercent = calcPercentageFromPrice(
      String(lastPrice.value),
      market.minPrice,
      market.maxPrice
    );
    lastPrice = { ...lastPrice, percent: `${lastPricePercent}%` };

    const purchasePricePercent = calcPercentageFromPrice(
      String(purchasePrice.value),
      market.minPrice,
      market.maxPrice
    );
    purchasePrice = { ...purchasePrice, percent: `${purchasePricePercent}%` };
  }
  const columnProperties: Array<Properties> = [
    {
      key: 'orderName',
      columnType: COLUMN_TYPES.TEXT,
      text: position.outcomeName,
      keyId: position.totalCost,
    },
    {
      key: 'orderType',
      columnType: COLUMN_TYPES.POSITION_TYPE,
      type: position.type,
    },
    {
      key: 'originalQuantity',
      columnType: COLUMN_TYPES.VALUE,
      value: position.quantity,
      keyId: 'position-quantity-' + position.id,
      action: () => {
        updateSelectedOrderProperties({
          orderQuantity: position.quantity.value,
          selectedNav: position.type === SHORT ? BUY : SELL,
          orderPrice: '',
        });
      },
    },
    {
      key: 'averagePrice',
      columnType: COLUMN_TYPES.VALUE,
      value: purchasePrice,
      usePercent: purchasePrice && !!purchasePrice.percent,
      useFull: market?.marketType === SCALAR ? false : true,
      showFullPrecision: market?.marketType === SCALAR ? true : false,
      showDenomination: market?.marketType === SCALAR ? true : false,
      keyId: 'position-price-' + position.id,
    },
    {
      hide: extendedView,
      key: 'totalCost',
      columnType: COLUMN_TYPES.VALUE,
      value: position.totalCost,
      useFull: true,
      keyId: 'position-totalCost-' + position.id,
    },
    {
      hide: extendedView,
      key: 'totalValue',
      columnType: COLUMN_TYPES.VALUE,
      value: position.totalValue,
      useFull: true,
      keyId: 'position-totalValue-' + position.id,
    },
    {
      hide: extendedView,
      key: 'lastPrice',
      columnType: COLUMN_TYPES.VALUE,
      value: lastPrice,
      usePercent: lastPrice && !!lastPrice.percent,
      useFull: true,
      keyId: 'position-lastPrice-' + position.id,
    },
  ];
  if (!showPercent) {
    columnProperties.push({
      key: 'totalPercent',
      useFull: true,
      showBrackets: true,
      showPlusMinus: true,
      hide: extendedView,
      columnType: COLUMN_TYPES.MOVEMENT_LABEL,
      value: position.totalPercent,
    });
  } else {
    columnProperties.push({
      key: 'totalReturns',
      hide: extendedView,
      columnType: COLUMN_TYPES.VALUE,
      useFull: true,
      value: position.totalReturns,
    });
  }
  columnProperties.push({
    key: 'unrealizedNet',
    hide: !extendedView,
    columnType: COLUMN_TYPES.VALUE,
    useFull: true,
    value: position.unrealizedNet,
  });
  columnProperties.push({
    key: 'realizedNet',
    hide: !extendedView,
    columnType: COLUMN_TYPES.VALUE,
    useFull: true,
    value: position.realizedNet,
  });
  return (
    <Row
      showExpandedToggleOnMobile={showExpandedToggleOnMobile}
      extendedView={extendedView}
      isFirst={isFirst}
      rowProperties={position}
      columnProperties={columnProperties}
      styleOptions={{
        position: true,
        showExpandedToggleOnMobile,
        noToggle: extendedView,
        isFirst,
      }}
    />
  );
};
