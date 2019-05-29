import { connect } from "react-redux";
import { AppState } from "store";
import AlertsView from "modules/alerts/components/alerts-view";
import { selectInfoAlertsAndSeenCount } from "modules/alerts/selectors/alerts";
import {
  updateAlert,
  removeAlert,
  clearAlerts
} from "modules/alerts/actions/alerts";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";

const mapStateToProps = (state: AppState) => {
  const { alerts } = selectInfoAlertsAndSeenCount(state);
  return {
    alerts
  };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  updateAlert: (id: string, alert: any) => dispatch(updateAlert(id, alert)),
  removeAlert: (id: string) => dispatch(removeAlert(id)),
  clearAlerts: () => dispatch(clearAlerts())
});

const AlertsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(AlertsView);

export default AlertsContainer;
