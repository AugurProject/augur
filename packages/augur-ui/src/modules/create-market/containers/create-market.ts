import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { submitNewMarket } from "modules/markets/actions/submit-new-market";
import {
  addOrderToNewMarket,
  removeOrderFromNewMarket,
  updateNewMarket
} from "modules/markets/actions/update-new-market";
import CreateMarketView from "modules/create-market/components/create-market-view/create-market-view";
import { selectCurrentTimestamp } from "store/select-state";
import { estimateSubmitNewMarket } from "modules/markets/actions/estimate-submit-new-market";
import getValue from "utils/get-value";
import { getGasPrice } from "modules/auth/selectors/get-gas-price";
import { loadUniverseDetails } from 'modules/universe/actions/load-universe-details';

const mapStateToProps = state => ({
  universe: state.universe,
  loginAccount: state.loginAccount.address,
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
  loadUniverseDetails: (universe, account) =>
    dispatch(loadUniverseDetails(universe, account))
});

const mergeProps = (sP: any, dP: any, oP: any) => {
  // TODO: Remove call to loadUniverseDetails once modal is ready
  dP.loadUniverseDetails(sP.universe.id, sP.loginAccount);
  return {
    ...sP,
    ...dP,
    ...oP,
  };
};

const CreateMarket = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps,
  )(CreateMarketView)
);

export default CreateMarket;
