import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import ConnectDropdown from "modules/auth/components/connect-dropdown/connect-dropdown";
import { loginWithMetaMask } from "modules/auth/actions/login-with-metamask";
import { logout } from "modules/auth/actions/logout";
import { showEdgeLogin } from "modules/auth/actions/show-edge-login";

const mapStateToProps = state => ({
  isMobile: state.appStatus.isMobile,
  isLogged: state.authStatus.isLogged,
  edgeLoading: state.authStatus.edgeLoading,
});

const mapDispatchToProps = (dispatch, { history }) => ({
  connectMetaMask: cb => dispatch(loginWithMetaMask(cb)),
  logout: () => dispatch(logout()),
  edgeLoginLink: history => dispatch(showEdgeLogin(history))
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ConnectDropdown)
);
