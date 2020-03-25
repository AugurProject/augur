import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { submitNewMarket } from "modules/markets/actions/submit-new-market";
import {
  addOrderToNewMarket,
  removeOrderFromNewMarket,
  updateNewMarket
} from "modules/markets/actions/update-new-market";
import CreateMarketView from "modules/create-market/components/create-market-view/create-market-view";
import { selectCurrentTimestamp } from "appStore/select-state";
import { estimateSubmitNewMarket } from "modules/markets/actions/estimate-submit-new-market";
import getValue from "utils/get-value";
import { getGasPrice } from "modules/auth/selectors/get-gas-price";

const mapStateToProps = state => ({
  categoryStats: state.categoryStats,
  universe: state.universe,
  availableEth: state.loginAccount.balances.eth,
  availableRep: state.loginAccount.balances.rep,
  meta: getValue(state, "loginAccount.meta"),
  newMarket: state.newMarket,
  isMobileSmall: state.appStatus.isMobileSmall,
  currentTimestamp: selectCurrentTimestamp(state),
  gasPrice: getGasPrice(state)
});

const mapDispatchToProps = dispatch => ({
  addOrderToNewMarket: data => dispatch(addOrderToNewMarket(data)),
  removeOrderFromNewMarket: data => dispatch(removeOrderFromNewMarket(data)),
  updateNewMarket: data => dispatch(updateNewMarket(data)),
  submitNewMarket: (data, cb) =>
    dispatch(submitNewMarket(data, cb)),
  estimateSubmitNewMarket: (data, callback) =>
    dispatch(estimateSubmitNewMarket(data, callback)),
});

const CreateMarket = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(CreateMarketView)
);

export default CreateMarket;
