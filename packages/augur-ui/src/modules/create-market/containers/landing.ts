import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {
  updateNewMarket,
  clearNewMarket
} from "modules/markets/actions/update-new-market";
import Landing from "modules/create-market/landing";
import getValue from "utils/get-value";
import { marketCreationStarted } from "services/analytics/helpers";
import { AppStatus } from "modules/app/store/app-status";

const mapStateToProps = state => ({
  newMarket: state.newMarket,
  currentTimestamp: AppStatus.get().blockchain.currentAugurTimestamp,
  address: getValue(state, "loginAccount.address"),
});

const mapDispatchToProps = dispatch => ({
  updateNewMarket: data => dispatch(updateNewMarket(data)),
  clearNewMarket: () => dispatch(clearNewMarket()),
  marketCreationStarted: (templateName, isTemplate) => dispatch(marketCreationStarted(templateName, isTemplate)),
});

const LandingContainer = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Landing)
);

export default LandingContainer;
