import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { submitNewMarket } from "modules/markets/actions/submit-new-market";
import {
  updateNewMarket
} from "modules/markets/actions/update-new-market";
import Review from "modules/create-market/components/review";
import getValue from "utils/get-value";
import { getGasPrice } from "modules/auth/selectors/get-gas-price";
import { estimateSubmitNewMarket } from "modules/markets/actions/estimate-submit-new-market";
import { formatDai, formatRep, formatEther } from "utils/format-number";

const mapStateToProps = state => ({
  newMarket: state.newMarket,
  currentTimestamp: getValue(state, "blockchain.currentAugurTimestamp"),
  address: getValue(state, "loginAccount.address"),
  gasPrice: getGasPrice(state),
  availableEthFormatted: formatEther(state.loginAccount.balances.eth),
  availableRepFormatted: formatRep(state.loginAccount.balances.rep),
  availableDaiFormatted: formatDai(state.loginAccount.balances.dai),
});

const mapDispatchToProps = dispatch => ({
  updateNewMarket: data => dispatch(updateNewMarket(data)),
  submitNewMarket: (data, history, cb) =>
    dispatch(submitNewMarket(data, history, cb)),
  estimateSubmitNewMarket: (data, callback) =>
    dispatch(estimateSubmitNewMarket(data, callback))
});

const ReviewContainer = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Review)
);

export default ReviewContainer;
