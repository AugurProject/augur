import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Visibility from "modules/create-market/components/visibility";

const mapStateToProps = state => ({
  newMarket: state.newMarket
});

const mapDispatchToProps = dispatch => ({});

const VisibilityContainer = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Visibility)
);

export default VisibilityContainer;