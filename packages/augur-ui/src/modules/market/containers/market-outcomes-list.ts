import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import MarketOutcomesList from "modules/market/components/market-outcomes-list/market-outcomes-list";
import { selectMarket, selectSortedMarketOutcomes } from "modules/markets/selectors/market";

const mapStateToProps = (state, ownProps) => {
  const market = ownProps.market || selectMarket(ownProps.marketId);

  return {
    scalarDenomination: market.scalarDenomination,
    outcomesFormatted: selectSortedMarketOutcomes(market.marketType, market.outcomesFormatted),
    marketType: market.marketType,
    marketId: market.id
  };
};

const MarketOutcomesListContainer = withRouter(
  connect(mapStateToProps)(MarketOutcomesList)
);

export default MarketOutcomesListContainer;
