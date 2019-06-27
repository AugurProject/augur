import { connect } from "react-redux";
import ConnectDropdown from "modules/auth/components/connect-dropdown/connect-dropdown";
import { loginWithInjectedWeb3 } from "modules/auth/actions/login-with-injected-web3";
import { loginWithPortis } from "modules/auth/actions/login-with-portis";
import { loginWithFortmatic } from "modules/auth/actions/login-with-fortmatic";
import { logout } from "modules/auth/actions/logout";
import { showEdgeLogin } from "modules/auth/actions/show-edge-login";

const mapStateToProps = (state) => ({
  isMobile: state.appStatus.isMobile,
  isLogged: state.authStatus.isLogged,
  edgeLoading: state.authStatus.edgeLoading,
});

const mapDispatchToProps = (dispatch) => ({
  connectMetaMask: (cb) => dispatch(loginWithInjectedWeb3(cb)),
  connectPortis: (cb) => dispatch(loginWithPortis(cb)),
  connectFortmatic: (cb) => dispatch(loginWithFortmatic(cb)),
  logout: () => dispatch(logout()),
  edgeLoginLink: () => dispatch(showEdgeLogin()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConnectDropdown);
