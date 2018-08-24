import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import ModalEditConnection from "../components/modal-edit-connection/modal-edit-connection";

import { closeModal } from "../actions/close-modal";

const mapStateToProps = state => ({
  modal: state.modal
});

const mapDispatchToProps = dispatch => ({
  closeModal: () => dispatch(closeModal())
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ModalEditConnection)
);
