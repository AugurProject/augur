import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { AppState } from "store";
import { MarketPositionsTable } from "modules/portfolio/components/common/market-positions-table";
import { updateModal } from "modules/modal/actions/update-modal";
import { MODAL_SELL_COMPLETE_SETS } from "modules/common/constants";
import { selectUserMarketPositions } from "modules/markets/selectors/select-user-market-positions";

const mapStateToProps = (state: AppState, ownProps: any) => {
  let marketId = ownProps.marketId;
  if (!marketId) {
    marketId = ownProps.market.id;
  }
  const positions = selectUserMarketPositions(state, marketId);

  return {
    positions,
    numCompleteSets: undefined,
    transactionsStatus: state.transactionsStatus
  };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  sellCompleteSets: (marketId: string, numCompleteSets: any, cb: Function) =>
    dispatch(
      updateModal({
        type: MODAL_SELL_COMPLETE_SETS,
        marketId,
        numCompleteSets,
        cb
      })
    )
});

const PositionsTable = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(MarketPositionsTable)
);

export default PositionsTable;
