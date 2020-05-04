import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import ModalNetworkDisconnected from "modules/modal/components/modal-network-disconnected";
import { AppState } from "appStore";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";
import { AppStatus } from "modules/app/store/app-status";

const mapStateToProps = (state: AppState) => ({
  modal: AppStatus.get().modal,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(ModalNetworkDisconnected),
);
