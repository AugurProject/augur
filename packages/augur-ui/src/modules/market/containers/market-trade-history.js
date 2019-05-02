import { connect } from "react-redux";
import MarketTradeHistory from "modules/market/components/market-trade-history/market-trade-history";
import { marketTradingPriceTimeSeries } from "modules/markets/selectors/market-trading-price-time-series";
import { createBigNumber } from "utils/create-big-number";

const mapStateToProps = state => ({
  isMobile: state.appStatus.isMobile,
  isMobileSmall: state.appStatus.isMobileSmall,
  marketTradingHistory: state.marketTradingHistory
});

const mergeProps = (sP, dP, oP) => {
  let groupedTradeHistory = {};
  const groupedTradeHistoryVolume = {};
  const tradeHistory = sP.marketTradingHistory[oP.marketId] || [];

  if (tradeHistory.length > 0) {
    groupedTradeHistory = marketTradingPriceTimeSeries(
      tradeHistory,
      oP.outcome
    );
    Object.keys(groupedTradeHistory).forEach(key => {
      groupedTradeHistoryVolume[key] = groupedTradeHistory[key].reduce(
        (p, item) =>
          createBigNumber(p)
            .plus(createBigNumber(item.amount))
            .toFixed(4),
        "0"
      );
    });
  }

  return {
    ...oP,
    ...sP,
    ...dP,
    groupedTradeHistory,
    groupedTradeHistoryVolume
  };
};

const MarketTradeHistoryContainer = connect(
  mapStateToProps,
  null,
  mergeProps
)(MarketTradeHistory);

export default MarketTradeHistoryContainer;
