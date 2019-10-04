import { connect } from 'react-redux';
import ConnectAccount from 'modules/auth/components/connect-account/connect-account';
import {
  updateAuthStatus,
  IS_CONNECTION_TRAY_OPEN,
} from 'modules/auth/actions/auth-status';
import { updateMobileMenuState } from 'modules/app/actions/update-sidebar-status';

const mapStateToProps = state => ({
  isLogged: state.authStatus.isLogged,
  userInfo: state.loginAccount.meta,
  isConnectionTrayOpen: state.authStatus.isConnectionTrayOpen,
  isMobile: state.appStatus.isMobile,
  mobileMenuState: state.sidebarStatus.mobileMenuState,
});

const mapDispatchToProps = dispatch => ({
  updateMobileMenuState: data => dispatch(updateMobileMenuState(data)),
  updateConnectionTray: value =>
    dispatch(updateAuthStatus(IS_CONNECTION_TRAY_OPEN, value)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConnectAccount);
