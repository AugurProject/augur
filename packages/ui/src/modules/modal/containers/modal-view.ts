import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import ModalView from "modules/modal/components/modal-view";

import { closeModal } from "modules/modal/actions/close-modal";

const mapStateToProps = (state: any) => ({
  modal: state.modal
});

const mapDispatchToProps = (dispatch: Function) => ({
  closeModal: () => dispatch(closeModal())
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ModalView)
);
