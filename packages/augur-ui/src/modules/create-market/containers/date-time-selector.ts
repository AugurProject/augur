import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {
  updateNewMarket,
  clearNewMarket
} from "modules/markets/actions/update-new-market";
import { DateTimeSelector } from "modules/create-market/components/common";
import { AppStatusState } from "modules/app/store/app-status";

const mapStateToProps = state => ({
  currentTimestamp: AppStatusState.get().blockchain.currentAugurTimestamp,
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

