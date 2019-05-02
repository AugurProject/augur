import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { submitNewMarket } from "modules/markets/actions/submit-new-market";
import {
  addOrderToNewMarket,
  removeOrderFromNewMarket,
  updateNewMarket
} from "modules/markets/actions/update-new-market";
import CreateMarketView from "modules/create-market/components/create-market-view/create-market-view";
import {
  selectCategoriesState,
  selectCurrentTimestamp
} from "src/select-state";
import { estimateSubmitNewMarket } from "modules/markets/actions/estimate-submit-new-market";

import getValue from "utils/get-value";
import { getGasPrice } from "modules/auth/selectors/get-gas-price";

const mapStateToProps = state => ({
  universe: state.universe,
  availableEth: getValue(state, "loginAccount.eth"),
  availableRep: getValue(state, "loginAccount.rep"),
  meta: getValue(state, "loginAccount.meta"),
  newMarket: state.newMarket,
  categories: selectCategoriesState(state),
  isMobileSmall: state.appStatus.isMobileSmall,
  currentTimestamp: selectCurrentTimestamp(state),
  gasPrice: getGasPrice(state)
});

const mapDispatchToProps = dispatch => ({
  addOrderToNewMarket: data => dispatch(addOrderToNewMarket(data)),
  removeOrderFromNewMarket: data => dispatch(removeOrderFromNewMarket(data)),
  updateNewMarket: data => dispatch(updateNewMarket(data)),
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
