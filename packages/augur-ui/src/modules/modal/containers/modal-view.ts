import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import ModalView from "modules/modal/components/modal-view";
import { AppState } from "appStore";
import { closeModal } from "modules/modal/actions/close-modal";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";
import { track, MODAL_VIEWED } from "services/analytics/helpers";
import { AppStatus } from "modules/app/store/app-status";

const mapStateToProps = (state: AppState) => ({
  modal: AppStatus.get().modal,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  closeModal: () => closeModal(),
  trackModalViewed: (modalName, payload) => track(modalName + ' - ' + MODAL_VIEWED, payload),
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(ModalView),
);
