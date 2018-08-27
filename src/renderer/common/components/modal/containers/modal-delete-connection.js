import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import ModalDeleteConnection from "../components/modal-delete-connection/modal-delete-connection";

import { closeModal } from "../actions/close-modal";
import { removeConnection } from "../../../../app/actions/configuration";

const mapStateToProps = state => ({
  modal: state.modal
});

const mapDispatchToProps = dispatch => ({
  closeModal: () => dispatch(closeModal()),
  removeConnection: (key) => dispatch(removeConnection(key)),
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ModalDeleteConnection)
);
