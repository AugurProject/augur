import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import ModalNetworkDisconnected from "modules/modal/components/modal-network-disconnected";
import { AppState } from "appStore";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";

const mapStateToProps = (state: AppState) => ({
  modal: state.modal,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(ModalNetworkDisconnected),
);
