import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import TopBar from 'modules/app/components/top-bar';
import { selectCoreStats } from 'modules/account/selectors/core-stats';
import { updateIsAlertVisible } from 'modules/app/actions/update-sidebar-status';
import { selectInfoAlertsAndSeenCount } from 'modules/alerts/selectors/alerts';
import { AppState } from 'appStore';
import { ThunkDispatch } from 'redux-thunk';
import { updateModal } from 'modules/modal/actions/update-modal';
import { MODAL_LOGIN, MODAL_SIGNUP, MODAL_HELP, WALLET_STATUS_VALUES, MODAL_AUGUR_P2P, MODAL_BUY_DAI } from 'modules/common/constants';
import { Action } from 'redux';

const mapStateToProps = (state: AppState) => {
  const { sidebarStatus, authStatus, appStatus } = state;
  const { unseenCount } = selectInfoAlertsAndSeenCount(state);

  return {
    stats: selectCoreStats(state),
    unseenCount,
    isMobile: appStatus.isMobile,
    isLogged: authStatus.isLogged,
    restoredAccount: authStatus.restoredAccount,
    alertsVisible: authStatus.isLogged && sidebarStatus.isAlertsVisible,
    showAddFundsButton: authStatus.isLogged && appStatus.walletStatus === WALLET_STATUS_VALUES.WAITING_FOR_FUNDING,
    walletStatus: appStatus.walletStatus,
  };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  updateIsAlertVisible: (data: boolean) => dispatch(updateIsAlertVisible(data)),
  loginModal: () => dispatch(updateModal({ type: MODAL_LOGIN })),
  signupModal: () => dispatch(updateModal({ type: MODAL_SIGNUP })),
  helpModal: () => dispatch(updateModal({ type: MODAL_HELP })),
  buyDaiModal: () => dispatch(updateModal({ type: MODAL_BUY_DAI })),
  activateWalletModal: () => dispatch(updateModal({ type: MODAL_AUGUR_P2P })),
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(TopBar)
);
