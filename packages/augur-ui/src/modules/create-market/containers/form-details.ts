import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { submitNewMarket } from "modules/markets/actions/submit-new-market";
import {
  addOrderToNewMarket,
  removeOrderFromNewMarket,
  updateNewMarket
} from "modules/markets/actions/update-new-market";
import FormDetails from "modules/create-market/components/form-details";
import { selectCurrentTimestamp } from "select-state";
import { estimateSubmitNewMarket } from "modules/markets/actions/estimate-submit-new-market";
import getValue from "utils/get-value";
import { getGasPrice } from "modules/auth/selectors/get-gas-price";

const mapStateToProps = state => ({
  universe: state.universe,
  availableEth: getValue(state, "loginAccount.eth"),
  availableRep: getValue(state, "loginAccount.rep"),
  meta: getValue(state, "loginAccount.meta"),
  newMarket: state.newMarket,
  categories: state.categories,
  isMobileSmall: state.appStatus.isMobileSmall,
  currentTimestamp: selectCurrentTimestamp(state),
  gasPrice: getGasPrice(state),
  address: getValue(state, "loginAccount.address"),
  currentTimestamp: getValue(state, "blockchain.currentAugurTimestamp")
});

const mapDispatchToProps = dispatch => ({
  addOrderToNewMarket: data => dispatch(addOrderToNewMarket(data)),
  removeOrderFromNewMarket: data => dispatch(removeOrderFromNewMarket(data)),
  updateNewMarket: data => dispatch(updateNewMarket(data)),
});

const FormDetailsContainer = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(FormDetails)
);

export default FormDetailsContainer;
