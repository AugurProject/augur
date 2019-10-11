import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {
  updateNewMarket,
  clearNewMarket
} from "modules/markets/actions/update-new-market";
import { DateTimeSelector } from "modules/create-market/components/common";
import getValue from "utils/get-value";

const mapStateToProps = state => ({
  currentTimestamp: getValue(state, "blockchain.currentAugurTimestamp"),
});

const mapDispatchToProps = dispatch => ({
  updateNewMarket: data => dispatch(updateNewMarket(data)),
  clearNewMarket: () => dispatch(clearNewMarket()),
});

const DateTimeSelectorContainer = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(DateTimeSelector)
);

export default DateTimeSelectorContainer;

