import { connect } from 'react-redux';
import ConnectAccount from 'modules/auth/components/connect-account/connect-account';
import {
  updateAuthStatus,
  IS_CONNECTION_TRAY_OPEN,
} from 'modules/auth/actions/auth-status';
import { updateMobileMenuState } from 'modules/app/actions/update-sidebar-status';
import { updateAppStatus, IS_HELP_MENU_OPEN } from 'modules/app/actions/update-app-status';

const mapStateToProps = state => ({
  isLogged: state.authStatus.isLogged,
  restoredAccount: state.authStatus.restoredAccount,
  universeId: state.universe.id,
  userInfo: state.loginAccount.meta,
  isConnectionTrayOpen: state.authStatus.isConnectionTrayOpen,
  mobileMenuState: state.sidebarStatus.mobileMenuState,
});

const mapDispatchToProps = dispatch => ({
  updateMobileMenuState: data => dispatch(updateMobileMenuState(data)),
  updateConnectionTray: value =>
    dispatch(updateAuthStatus(IS_CONNECTION_TRAY_OPEN, value)),
  updateHelpMenuState: (isHelpMenuOpen) => dispatch(updateAppStatus(IS_HELP_MENU_OPEN, isHelpMenuOpen)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ConnectAccount);
