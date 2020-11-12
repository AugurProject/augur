import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { AppState } from "appStore";
import { MarketPositionsTable } from "modules/portfolio/components/common/market-positions-table";
import { selectUserMarketPositions, selectUserMarketRawPositions } from "modules/markets/selectors/select-user-market-positions";

const mapStateToProps = (state: AppState, ownProps: any) => {
  let marketId = ownProps.marketId;
  if (!marketId) {
    marketId = ownProps.market.id;
  }
  let positions = [];
  if (ownProps.positions) {
    positions = ownProps.positions;
  } else if (marketId) {
    positions = selectUserMarketPositions(state, marketId);
  }

  if (ownProps.showRawPositions) {
    positions = selectUserMarketRawPositions(state, marketId);
  }

  return {
    positions
  };
};

const PositionsTable = withRouter(
  connect(
    mapStateToProps
  )(MarketPositionsTable)
);

export default PositionsTable;
