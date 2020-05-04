import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {
  addOrderToNewMarket,
  removeOrderFromNewMarket,
  updateNewMarket
} from "modules/markets/actions/update-new-market";
import FormDetails from "modules/create-market/components/form-details";
import getValue from "utils/get-value";
import getGasPrice from "modules/auth/selectors/get-gas-price";
import { AppStatus } from "modules/app/store/app-status";

const mapStateToProps = state => ({
  universe: state.universe,
  availableEth: state.loginAccount.balances.eth,
  availableRep: state.loginAccount.balances.rep,
  meta: getValue(state, "loginAccount.meta"),
  newMarket: state.newMarket,
  categories: state.categories,
  gasPrice: getGasPrice(),
  address: getValue(state, "loginAccount.address"),
  currentTimestamp: AppStatus.get().blockchain.currentAugurTimestamp,
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
