import { connect } from "react-redux";
import { AppState } from "store";
import ToastsView from "modules/alerts/components/toasts-view";
import { selectInfoAlertsAndSeenCount } from "modules/alerts/selectors/alerts";
import {
  updateAlert,
  removeAlert,
} from "modules/alerts/actions/alerts";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";

const mapStateToProps = (state: AppState) => {
  const { alerts } = selectInfoAlertsAndSeenCount(state);
  return {
    toasts: alerts.filter(alert => alert.toast && !alert.seen)
  };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  removeAlert: (id: string) => dispatch(removeAlert(id)),
  updateAlert: (id: string, alert: any) => dispatch(updateAlert(id, alert)),
});

const ToastsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ToastsView);

export default ToastsContainer;
