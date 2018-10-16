import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { selectCategories } from "modules/categories/selectors/categories";
import { submitNewMarket } from "modules/markets/actions/submit-new-market";
import {
  addOrderToNewMarket,
  removeOrderFromNewMarket,
  updateNewMarket,
  clearNewMarket
} from "modules/markets/actions/update-new-market";
import CreateMarketView from "modules/create-market/components/create-market-view/create-market-view";
import { selectCurrentTimestamp } from "src/select-state";
import { estimateSubmitNewMarket } from "modules/markets/actions/estimate-submit-new-market";

import getValue from "utils/get-value";
import { getGasPrice } from "modules/auth/selectors/get-gas-price";

const mapStateToProps = state => ({
  universe: state.universe,
  availableEth: getValue(state, "loginAccount.eth") || "0",
  availableRep: getValue(state, "loginAccount.rep") || "0",
  meta: getValue(state, "loginAccount.meta"),
  newMarket: state.newMarket,
  footerHeight: state.footerHeight,
  categories: selectCategories(state),
  isMobileSmall: state.appStatus.isMobileSmall,
  currentTimestamp: selectCurrentTimestamp(state),
  gasPrice: getGasPrice(state)
});

const mapDispatchToProps = dispatch => ({
  addOrderToNewMarket: data => dispatch(addOrderToNewMarket(data)),
  removeOrderFromNewMarket: data => dispatch(removeOrderFromNewMarket(data)),
  updateNewMarket: data => dispatch(updateNewMarket(data)),
  clearNewMarket: () => dispatch(clearNewMarket()),
  submitNewMarket: (data, history, cb) =>
    dispatch(submitNewMarket(data, history, cb)),
  estimateSubmitNewMarket: (data, callback) =>
    dispatch(estimateSubmitNewMarket(data, callback))
});

const CreateMarket = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(CreateMarketView)
);

export default CreateMarket;
