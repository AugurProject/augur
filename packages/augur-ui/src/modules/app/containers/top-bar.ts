import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import TopBar from "modules/app/components/top-bar";
import { selectCoreStats } from "modules/account/selectors/core-stats";
import {
  updateIsAlertVisible
} from "modules/app/actions/update-sidebar-status";
import { selectInfoAlertsAndSeenCount } from "modules/alerts/selectors/alerts";

const mapStateToProps = (state: any) => {
  const { sidebarStatus, authStatus } = state;
  const { unseenCount } = selectInfoAlertsAndSeenCount(state);
  return {
    stats: selectCoreStats(state),
    sidebarStatus,
    unseenCount,
    isLogged: authStatus.isLogged,
    alertsVisible: authStatus.isLogged && sidebarStatus.isAlertsVisible
  };
};

const mapDispatchToProps = (dispatch: Function) => ({
  updateIsAlertVisible: (data: Boolean) => dispatch(updateIsAlertVisible(data))
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(TopBar)
);
