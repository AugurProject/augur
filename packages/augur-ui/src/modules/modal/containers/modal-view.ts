import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import ModalView from "modules/modal/components/modal-view";
import { AppState } from "store";
import { closeModal } from "modules/modal/actions/close-modal";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";

const mapStateToProps = (state: AppState) => ({
  modal: state.modal
});

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  closeModal: () => dispatch(closeModal())
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ModalView)
);
