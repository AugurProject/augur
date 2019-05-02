import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import MarketOutcomesList from "modules/market/components/market-outcomes-list/market-outcomes-list";
import { selectMarket } from "modules/markets/selectors/market";

const mapStateToProps = (state, ownProps) => {
  const market = selectMarket(ownProps.marketId);

  return {
    marketType: market.marketType,
    scalarDenomination: market.scalarDenomination,
    minPrice: market.minPrice,
    maxPrice: market.maxPrice
  };
};

const MarketOutcomesListContainer = withRouter(
  connect(mapStateToProps)(MarketOutcomesList)
);

export default MarketOutcomesListContainer;
