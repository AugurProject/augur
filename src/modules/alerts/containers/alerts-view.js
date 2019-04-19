import { connect } from "react-redux";

import AlertsView from "modules/alerts/components/alerts-view/alerts-view";
import { selectInfoAlertsAndSeenCount } from "modules/alerts/selectors/alerts";
import {
  updateAlert,
  removeAlert,
  clearAlerts
} from "modules/alerts/actions/alerts";

const mapStateToProps = state => {
  const { alerts } = selectInfoAlertsAndSeenCount(state);
  return {
    alerts
  };
};

const mapDispatchToProps = dispatch => ({
  updateAlert: (id, alert) => dispatch(updateAlert(id, alert)),
  removeAlert: id => dispatch(removeAlert(id)),
  clearAlerts: () => dispatch(clearAlerts())
});

const AlertsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(AlertsView);

export default AlertsContainer;
