import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import ConnectAccount from "modules/auth/components/connect-account/connect-account";
import {
  updateAuthStatus,
  IS_CONNECTION_TRAY_OPEN
} from "modules/auth/actions/update-auth-status";

const mapStateToProps = state => ({
  isLogged: state.authStatus.isLogged,
  address: state.loginAccount.address,
  isConnectionTrayOpen: state.authStatus.isConnectionTrayOpen
});

const mapDispatchToProps = dispatch => ({
  updateConnectionTray: value =>
    dispatch(updateAuthStatus(IS_CONNECTION_TRAY_OPEN, value))
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ConnectAccount)
);
