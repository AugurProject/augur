import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { AppState } from 'store';
import { COLUMN_TYPES, INVALID_OUTCOME_ID, BUY, SELL, SCALAR } from 'modules/common/constants';
import { selectMarketOutcomeBestBidAsk, selectBestBidAlert } from 'modules/markets/selectors/select-market-outcome-best-bid-ask';
import Row from 'modules/common/row';
import { formatOrderBook } from 'modules/create-market/helpers/format-order-book';
import { calcPercentageFromPrice } from 'utils/format-number';
import getPrecision from 'utils/get-number-precision';

const mapStateToProps = (state: AppState, ownProps) => {
  const { marketInfos, newMarket } = state;
  const market = marketInfos[ownProps.marketId] ? marketInfos[ownProps.marketId] : newMarket ? newMarket : null;
  // default values for create market preview
  const minPrice = market ? market.minPrice : 0;
  const maxPrice = market ? market.maxPrice : 1;
  const tickSize = market ? market.tickSize : 100;

  const showPercentages = ownProps.outcome && ownProps.outcome.id === INVALID_OUTCOME_ID && market.marketType === SCALAR;
  return {
    orderBook: ownProps.orderBook,
    minPrice,
    maxPrice,
    tickSize,
    preview: ownProps.preview,
    showPercentages
  };
};

const mapDispatchToProps = () => ({});

const mergeProps = (sP: any, dP: any, oP: any) => {
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
  const { topAsk, topBid } = selectMarketOutcomeBestBidAsk(outcomeOrderBook, sP.tickSize);
  const bestBidAlert = selectBestBidAlert(outcome.id, topBid.price.value, sP.minPrice, sP.maxPrice)
  const topBidShares = topBid.shares;
  const topAskShares = topAsk.shares;

  let topBidPrice = topBid.price;
  let topAskPrice = topAsk.price;
  let lastPrice = outcome.lastPrice;

  if (sP.showPercentages) {
    const topBidPercent = calcPercentageFromPrice(
      topBidPrice.value,
      sP.minPrice,
      sP.maxPrice
    );
    topBidPrice =
      topBidPrice.formatted !== '-'
        ? { ...topBidPrice, usePercent: true, percent: topBidPercent }
        : topBidPrice;

    const topAskPercent = calcPercentageFromPrice(
      topAskPrice.value,
      sP.minPrice,
      sP.maxPrice
    );
    topAskPrice =
      topAskPrice.formatted !== '-'
        ? { ...topAskPrice, usePercent: true, percent: topAskPercent }
        : topAskPrice;
    const lastPricePercent = calcPercentageFromPrice(
      lastPrice.value,
      sP.minPrice,
      sP.maxPrice
    );
    lastPrice =
      lastPrice.formatted !== '-'
        ? { ...lastPrice, usePercent: true, percent: lastPricePercent }
        : lastPrice;
  }

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
      useFull: true,
      showEmptyDash: true,
      usePercent: topBidPrice.usePercent,
      alert: bestBidAlert,
      action: (e) => {
        oP.updateSelectedOutcome(outcome.id, true);
        oP.updateSelectedOrderProperties({
          orderPrice: topBidPrice && topBidPrice.value.toString(),
          orderQuantity: topBidShares && topBidShares.value.toString(),
          selectedNav: SELL
        });
        e.stopPropagation();
      }
    },
    {
      key: "topAskPrice",
      columnType: COLUMN_TYPES.VALUE,
      value: topAskPrice,
      useFull: true,
      showEmptyDash: true,
      usePercent: topAskPrice.usePercent,
      action: (e) => {
        oP.updateSelectedOutcome(outcome.id, true);
        oP.updateSelectedOrderProperties({
          orderPrice: topAskPrice && topAskPrice.value.toString(),
          orderQuantity: topAskShares && topAskShares.value.toString(),
          selectedNav: BUY
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
      useFull: true,
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
