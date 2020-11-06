import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { AppState } from "appStore";
import { MarketPositionsTable } from "modules/portfolio/components/common/market-positions-table";
import { selectUserMarketPositions } from "modules/markets/selectors/select-user-market-positions";
import { createBigNumber } from "utils/create-big-number";
import { formatDai } from "utils/format-number";
import { SHORT } from "modules/common/constants";

const mapStateToProps = (state: AppState, ownProps: any) => {
  let marketId = ownProps.marketId;
  if (!marketId) {
    marketId = ownProps.market.id;
  }
  let positions = selectUserMarketPositions(state, marketId);

  if (ownProps.positions) {
    positions = mergePositions(ownProps.positions, positions);
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

const mergePositions = (propertyPos, selectedPos) => {
  const hasShort = selectedPos.find(s => s.type === SHORT)
  if (hasShort) return selectedPos;
  return propertyPos.reduce((p, r) => {
    const sPosition = p.find(pos => pos.outcomeId === r.outcomeId)
    if (!sPosition) return [...p, r]
    if (createBigNumber(sPosition.quantity.value).lt(createBigNumber(r.quantity.value))) {
      sPosition.quantity = formatDai(createBigNumber(sPosition.quantity.value).plus(createBigNumber(r.quantity.value)))
    }
    return p
  }, selectedPos)

}
