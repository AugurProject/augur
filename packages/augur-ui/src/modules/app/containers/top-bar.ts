import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import TopBar from 'modules/app/components/top-bar';
import { selectCoreStats } from 'modules/account/selectors/core-stats';
import { selectInfoAlertsAndSeenCount } from 'modules/alerts/selectors/alerts';
import { AppState } from 'appStore';
import { ThunkDispatch } from 'redux-thunk';
import { MODAL_LOGIN, MODAL_SIGNUP, MODAL_HELP } from 'modules/common/constants';
import { Action } from 'redux';
import { AppStatus } from 'modules/app/store/app-status';

const mapStateToProps = (state: AppState) => {
  const { unseenCount } = selectInfoAlertsAndSeenCount(state);
  return {
    stats: selectCoreStats(state),
    unseenCount,
  };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => {
  const { setModal } = AppStatus.actions;
  return ({
    loginModal: () => setModal({ type: MODAL_LOGIN }),
    signupModal: () => setModal({ type: MODAL_SIGNUP }),
    helpModal: () => setModal({ type: MODAL_HELP }),
  });
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(TopBar)
);
