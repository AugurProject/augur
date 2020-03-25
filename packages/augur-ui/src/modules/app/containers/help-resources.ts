import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { HelpResources } from 'modules/app/components/help-resources';
import { AppState } from 'appStore';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { updateAppStatus, IS_HELP_MENU_OPEN } from 'modules/app/actions/update-app-status';
import { updateAuthStatus, IS_CONNECTION_TRAY_OPEN } from 'modules/auth/actions/auth-status';

const mapStateToProps = (state: AppState) => {
  return {
    isHelpMenuOpen: state.appStatus.isHelpMenuOpen,
  };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  updateHelpMenuState: (isHelpMenuOpen) => dispatch(updateAppStatus(IS_HELP_MENU_OPEN, isHelpMenuOpen)),
  updateConnectionTray: value =>
    dispatch(updateAuthStatus(IS_CONNECTION_TRAY_OPEN, value)),
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(HelpResources)
);
