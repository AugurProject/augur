import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import ModalMigrateMarket from "modules/modal/components/modal-migrate-market";
import { migrateMarketThroughFork } from "modules/forking/actions/migrate-market-through-fork";
import { closeModal } from "modules/modal/actions/close-modal";
import { AppState } from "store";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";

const mapStateToProps = (state: AppState) => ({
  ...state.modal,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  closeModal: () => dispatch(closeModal()),
  migrateMarketThroughFork: (marketId, estimateGas, callback) =>
    dispatch(migrateMarketThroughFork(marketId, estimateGas, callback)),
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(ModalMigrateMarket),
);
