import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Visibility from "modules/create-market/components/visibility";
import { AppStatus } from "modules/app/store/app-status";

const mapStateToProps = state => ({
  newMarket: AppStatus.get().newMarket
});

const mapDispatchToProps = dispatch => ({});

const VisibilityContainer = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Visibility)
);

export default VisibilityContainer;