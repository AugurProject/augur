import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import ConnectDropdown from "modules/auth/components/connect-dropdown/connect-dropdown";
import { loginWithInjectedWeb3 } from "modules/auth/actions/login-with-injected-web3";
import { loginWithPortis } from "modules/auth/actions/login-with-portis";
import { logout } from "modules/auth/actions/logout";
import { showEdgeLogin } from "modules/auth/actions/show-edge-login";

const mapStateToProps = (state) => ({
  isMobile: state.appStatus.isMobile,
  isLogged: state.authStatus.isLogged,
  edgeLoading: state.authStatus.edgeLoading,
});

const mapDispatchToProps = (dispatch, { history }) => ({
  connectMetaMask: (cb) => dispatch(loginWithInjectedWeb3(cb)),
  connectPortis: (cb) => dispatch(loginWithPortis(cb)),
  logout: () => dispatch(logout()),
  edgeLoginLink: (history) => dispatch(showEdgeLogin(history)),
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(ConnectDropdown),
);
