import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import MarketView from "modules/market/components/market-view/market-view";
import { loadFullMarket } from "modules/markets/actions/load-full-market";
import { selectMarket } from "modules/markets/selectors/market";
import parseQuery from "modules/routes/helpers/parse-query";
import { MARKET_ID_PARAM_NAME } from "modules/routes/constants/param-names";
import getPrecision from "utils/get-number-precision";

const mapStateToProps = (state, ownProps) => {
  const {
    marketsData,
    authStatus,
    appStatus,
    connection,
    universe,
    orderBooks
  } = state;
  const marketId = parseQuery(ownProps.location.search)[MARKET_ID_PARAM_NAME];
  const market = selectMarket(marketId);
  const pricePrecision = market && getPrecision(market.tickSize, 4);

  return {
    isConnected: connection.isConnected && universe.id != null,
    marketType: market.marketType,
    description: market.description || "",
    loadingState: market.loadingState || null,
    isLogged: authStatus.isLogged,
    universe,
    orderBooks,
    isMobile: appStatus.isMobile,
    marketId,
    marketsData,
    pricePrecision
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  loadFullMarket: marketId => dispatch(loadFullMarket(marketId))
});

const Market = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(MarketView)
);

export default Market;
