import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { AppState } from 'appStore';
import { COLUMN_TYPES, INVALID_OUTCOME_ID, BUY, SELL, SCALAR, INVALID_BEST_BID_ALERT_VALUE, SCALAR_INVALID_BEST_BID_ALERT_VALUE, YES_NO, PRICE_WIDTH_MIN, DEFAULT_MAX_PRICE, DEFAULT_MIN_PRICE } from 'modules/common/constants';
import { selectMarketOutcomeBestBidAsk } from 'modules/markets/selectors/select-market-outcome-best-bid-ask';
import Row from 'modules/common/row';
import { formatOrderBook } from 'modules/create-market/helpers/format-order-book';
import { calcPercentageFromPrice, formatBlank } from 'utils/format-number';

const mapStateToProps = (state: AppState, ownProps) => {
  const { marketInfos, newMarket } = state;
  const market = marketInfos[ownProps.marketId] ? marketInfos[ownProps.marketId] : newMarket ? newMarket : null;
  // default values for create market preview
  const minPrice = market ? market.minPrice : DEFAULT_MIN_PRICE;
  const maxPrice = market ? market.maxPrice : DEFAULT_MAX_PRICE;
  const tickSize = market ? market.tickSize : PRICE_WIDTH_MIN;
  const marketType = market ? market.marketType : YES_NO; // default to yes no. has to be something

  const usePercent = ownProps.outcome && ownProps.outcome.id === INVALID_OUTCOME_ID && market.marketType === SCALAR;
  return {
    orderBook: ownProps.orderBook,
    minPrice,
    maxPrice,
    tickSize,
    preview: ownProps.preview,
    usePercent,
    marketType
  };
};

const mapDispatchToProps = () => ({});

const mergeProps = (sP: any, dP: any, oP: any) => {
  const useFull = sP.marketType !== SCALAR || (sP.marketType === SCALAR && String(sP.tickSize).length < 5);
  const outcome = oP.outcome;
  const outcomeName = outcome.description;
  const orderBook = sP.orderBook;
  let outcomeOrderBook = orderBook;
  if (outcome && orderBook && orderBook[outcome.id]) {
    outcomeOrderBook = orderBook[outcome.id]
    if (sP.preview) {
      outcomeOrderBook = formatOrderBook(outcomeOrderBook);
    }
  }
  const { topAsk, topBid } = selectMarketOutcomeBestBidAsk(outcomeOrderBook, sP.marketType, sP.tickSize);
  const topBidShares = topBid.shares;
  const topAskShares = topAsk.shares;

  let topBidPrice = topBid.price;
  let topAskPrice = topAsk.price;
  let lastPrice = outcome.lastPrice || formatBlank();

  if (sP.usePercent) {
    const topBidPercent = calcPercentageFromPrice(
      topBidPrice.value,
      sP.minPrice,
      sP.maxPrice
    );
    topBidPrice =
      topBidPrice.formatted !== '-'
        ? { ...topBidPrice, percent: `${topBidPercent}%` }
        : topBidPrice;

    const topAskPercent = calcPercentageFromPrice(
      topAskPrice.value,
      sP.minPrice,
      sP.maxPrice
    );
    topAskPrice =
      topAskPrice.formatted !== '-'
        ? { ...topAskPrice, percent: `${topAskPercent}%` }
        : topAskPrice;
    const lastPricePercent = calcPercentageFromPrice(
      lastPrice.value,
      sP.minPrice,
      sP.maxPrice
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
      key: "outcomeName",
      columnType: outcome.id === INVALID_OUTCOME_ID ? COLUMN_TYPES.INVALID_LABEL : COLUMN_TYPES.TEXT,
      text: outcomeName,
      keyId: outcomeName,
      showExtraNumber: !oP.scalarDenomination,
    },
    {
      key: "topBidShares",
      columnType: COLUMN_TYPES.VALUE,
      value: topBidShares,
      showEmptyDash: true,
    },
    {
      key: "topBidPrice",
      columnType: COLUMN_TYPES.VALUE,
      value: topBidPrice,
      useFull,
      showEmptyDash: true,
      usePercent: !!topBidPrice.percent,
      alert: showInvalidAlert,
      action: (e) => {
        oP.updateSelectedOutcome(outcome.id, true);
        oP.updateSelectedOrderProperties({
          selectedOutcomeId: outcome.id,
          orderPrice: topBidPrice && topBidPrice.value.toString(),
          orderQuantity: topBidShares && topBidShares.value.toString(),
          selectedNav: SELL,
        });
        e.stopPropagation();
      }
    },
    {
      key: "topAskPrice",
      columnType: COLUMN_TYPES.VALUE,
      value: topAskPrice,
      useFull,
      showEmptyDash: true,
      usePercent: !!topAskPrice.percent,
      action: (e) => {
        oP.updateSelectedOutcome(outcome.id, true);
        oP.updateSelectedOrderProperties({
          selectedOutcomeId: outcome.id,
          orderPrice: topAskPrice && topAskPrice.value.toString(),
          orderQuantity: topAskShares && topAskShares.value.toString(),
          selectedNav: BUY,
        });
        e.stopPropagation();
      }
    },
    {
      key: "topAskShares",
      columnType: COLUMN_TYPES.VALUE,
      value: topAskShares,
      showEmptyDash: true,
    },
    {
      key: "lastPrice",
      columnType: COLUMN_TYPES.VALUE,
      value: lastPrice,
      usePercent: !!lastPrice.percent,
      useFull,
      addIndicator: true,
      outcome,
      location: "tradingPage",
    },
  ];
  return {
    ...oP,
    ...sP,
    ...dP,
    rowProperties: outcome,
    columnProperties,
    rowOnClick: (e: Event) => {oP.updateSelectedOutcome(outcome.id);},
    styleOptions: {
      outcome: true,
      isSingle: true,
      noToggle: true,
      colorId: outcome.id + 1,
      active: oP.selectedOutcomeId === outcome.id,
      isInvalid: outcome.id === INVALID_OUTCOME_ID,
    }
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
  )(Row)
);
