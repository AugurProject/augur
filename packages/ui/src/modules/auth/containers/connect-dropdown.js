import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import ConnectDropdown from "modules/auth/components/connect-dropdown/connect-dropdown";
import { loginWithMetaMask } from "src/modules/auth/actions/login-with-metamask";
import { logout } from "modules/auth/actions/logout";
import { showEdgeLogin } from "modules/auth/actions/show-edge-login";
import { selectEdgeLoadingState } from "src/select-state";

const mapStateToProps = state => ({
  isMobile: state.appStatus.isMobile,
  isLogged: state.authStatus.isLogged,
  edgeLoading: selectEdgeLoadingState(state)
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
