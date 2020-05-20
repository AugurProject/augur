import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import TopBar from 'modules/app/components/top-bar';
import { selectCoreStats } from 'modules/account/selectors/core-stats';
import { updateIsAlertVisible } from 'modules/app/actions/update-sidebar-status';
import { selectInfoAlertsAndSeenCount } from 'modules/alerts/selectors/alerts';
import { AppState } from 'appStore';
import { ThunkDispatch } from 'redux-thunk';
import { updateModal } from 'modules/modal/actions/update-modal';
import { MODAL_LOGIN, MODAL_SIGNUP, MODAL_HELP, WALLET_STATUS_VALUES, MODAL_ADD_FUNDS } from 'modules/common/constants';
import { Action } from 'redux';
import { getEthReserveInDai } from 'modules/auth/selectors/get-eth-reserve';
import { createFundedGsnWallet } from 'modules/auth/actions/update-sdk';

const mapStateToProps = (state: AppState) => {
  const { sidebarStatus, authStatus, appStatus } = state;
  const { unseenCount } = selectInfoAlertsAndSeenCount(state);
  const ethReserveInDai = getEthReserveInDai(state);

  return {
    stats: selectCoreStats(state),
    unseenCount,
    isMobile: appStatus.isMobile,
    isLogged: authStatus.isLogged,
    restoredAccount: authStatus.restoredAccount,
    alertsVisible: authStatus.isLogged && sidebarStatus.isAlertsVisible,
    ethReserveInDai,
    showAddFundsButton: authStatus.isLogged && appStatus.walletStatus === WALLET_STATUS_VALUES.WAITING_FOR_FUNDING,
    showActivationButton: authStatus.isLogged && appStatus.walletStatus === WALLET_STATUS_VALUES.FUNDED_NEED_CREATE,
  };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  updateIsAlertVisible: (data: boolean) => dispatch(updateIsAlertVisible(data)),
  loginModal: () => dispatch(updateModal({ type: MODAL_LOGIN })),
  signupModal: () => dispatch(updateModal({ type: MODAL_SIGNUP })),
  helpModal: () => dispatch(updateModal({ type: MODAL_HELP })),
  addFundsModal: () => dispatch(updateModal({ type: MODAL_ADD_FUNDS })),
  createFundedGsnWallet: () => dispatch(createFundedGsnWallet()),
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(TopBar)
);
