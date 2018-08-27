import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import ModalEditConnection from "../components/modal-edit-connection/modal-edit-connection";
import { updateModal } from "../actions/update-modal";
import { MODAL_DELETE_CONNECTION } from "../constants/modal-types";

import { closeModal } from "../actions/close-modal";
import { addUpdateConnection } from "../../../../app/actions/configuration";

const mapStateToProps = state => ({
  modal: state.modal,
});

const mapDispatchToProps = dispatch => ({
  closeModal: () => dispatch(closeModal()),
  updateModal: data => dispatch(updateModal({ type: MODAL_DELETE_CONNECTION, ...data })),
  addUpdateConnection: (key, connection) => dispatch(addUpdateConnection(key, connection)),
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ModalEditConnection)
);
