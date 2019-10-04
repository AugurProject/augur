import { connect } from 'react-redux';
import ConnectAccount from 'modules/auth/components/connect-account/connect-account';
import {
  updateAuthStatus,
  IS_CONNECTION_TRAY_OPEN,
} from 'modules/auth/actions/auth-status';
import { loadUniverseDetails } from 'modules/universe/actions/load-universe-details';

const mapStateToProps = state => ({
  isLogged: state.authStatus.isLogged,
  universeId: state.universe.id,
  userInfo: state.loginAccount.meta,
  isConnectionTrayOpen: state.authStatus.isConnectionTrayOpen,
});

const mapDispatchToProps = dispatch => ({
  updateConnectionTray: value =>
    dispatch(updateAuthStatus(IS_CONNECTION_TRAY_OPEN, value)),
  loadUniverseDetails: (universe, account) =>
    dispatch(loadUniverseDetails(universe, account))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConnectAccount);
