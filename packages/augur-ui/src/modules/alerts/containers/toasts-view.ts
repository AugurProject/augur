import { connect } from "react-redux";
import { AppState } from "appStore";
import ToastsView from "modules/alerts/components/toasts-view";
import { selectInfoAlertsAndSeenCount } from "modules/alerts/selectors/alerts";
import {
  removeAlert,
  updateExistingAlert,
} from "modules/alerts/actions/alerts";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";

const mapStateToProps = (state: AppState) => ({});

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  removeAlert: (id: string, name: string) => dispatch(removeAlert(id, name)),
  updateExistingAlert: (id: string, alert: any) => dispatch(updateExistingAlert(id, alert)),
});

const ToastsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ToastsView);

export default ToastsContainer;
