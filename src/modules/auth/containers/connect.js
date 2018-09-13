import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Connect from "modules/auth/components/connect/connect";

const mapStateToProps = state => ({
  isMobile: state.appStatus.isMobile
});

export default withRouter(connect(mapStateToProps)(Connect));
