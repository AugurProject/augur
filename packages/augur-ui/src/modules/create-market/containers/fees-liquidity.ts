import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {
  addOrderToNewMarket,
  removeOrderFromNewMarket,
  updateNewMarket,
  clearNewMarket
} from "modules/markets/actions/update-new-market";
import FeesLiquidity from "modules/create-market/fees-liquidity";
import getValue from "utils/get-value";
import { AppStatus } from "modules/app/store/app-status";

const mapStateToProps = state => ({
  newMarket: state.newMarket,
  currentTimestamp: AppStatus.get().blockchain.currentAugurTimestamp,
  address: getValue(state, "loginAccount.address"),
});

const mapDispatchToProps = dispatch => ({
  updateNewMarket: data => dispatch(updateNewMarket(data)),
  clearNewMarket: () => dispatch(clearNewMarket()),
  addOrderToNewMarket: data => dispatch(addOrderToNewMarket(data)),
  removeOrderFromNewMarket: data => dispatch(removeOrderFromNewMarket(data)),
});

const FeesLiquidityContainer = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(FeesLiquidity)
);

export default FeesLiquidityContainer;
