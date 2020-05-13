import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import ModalView from "modules/modal/components/modal-view";
import { AppState } from "appStore";
import { closeModal } from "modules/modal/actions/close-modal";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";
import { track, MODAL_VIEWED } from "services/analytics/helpers";

const mapStateToProps = (state: AppState) => ({
  modal: state.modal,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  closeModal: () => dispatch(closeModal()),
  trackModalViewed: (modalName, payload) => dispatch(track(modalName + ' - ' + MODAL_VIEWED, payload)),
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(ModalView),
);
