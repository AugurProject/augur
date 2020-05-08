import { connect } from "react-redux";
import { AppState } from "appStore";
import AlertsView from "modules/alerts/components/alerts-view";
import {
  updateExistingAlert,
} from "modules/alerts/actions/alerts";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";

const mapStateToProps = (state: AppState) => {
  return {
  };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  updateExistingAlert: (id: string, alert: any) => dispatch(updateExistingAlert(id, alert))
});

const AlertsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(AlertsView);

export default AlertsContainer;
