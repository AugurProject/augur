import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import ConnectAccount from "modules/auth/components/connect-account/connect-account";

const mapStateToProps = state => ({
  isMobile: state.appStatus.isMobile,
  isLogged: state.authStatus.isLogged,
  address: state.loginAccount.address
});

export default withRouter(connect(mapStateToProps)(ConnectAccount));
