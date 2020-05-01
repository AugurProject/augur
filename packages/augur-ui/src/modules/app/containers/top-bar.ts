import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import TopBar from 'modules/app/components/top-bar';
import { selectCoreStats } from 'modules/account/selectors/core-stats';
import { selectInfoAlertsAndSeenCount } from 'modules/alerts/selectors/alerts';
import { AppState } from 'appStore';
import { ThunkDispatch } from 'redux-thunk';
import { MODAL_LOGIN, MODAL_SIGNUP } from 'modules/common/constants';
import { Action } from 'redux';
import { AppStatusActions } from 'modules/app/store/app-status';

const mapStateToProps = (state: AppState) => {
  const { unseenCount } = selectInfoAlertsAndSeenCount(state);
  return {
    stats: selectCoreStats(state),
    unseenCount,
  };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => {
  const { setModal } = AppStatusActions.actions;
  return ({
    loginModal: () => setModal({ type: MODAL_LOGIN }),
    signupModal: () => setModal({ type: MODAL_SIGNUP }),
  });
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(TopBar)
);
