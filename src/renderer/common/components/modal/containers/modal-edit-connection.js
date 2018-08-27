import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import ModalEditConnection from "../components/modal-edit-connection/modal-edit-connection";

import { closeModal } from "../actions/close-modal";
import { addConnection } from "../../../../app/actions/configuration";

const mapStateToProps = state => ({
  modal: state.modal
});

const mapDispatchToProps = dispatch => ({
  closeModal: () => dispatch(closeModal()),
  addUpdateConnection: (connection) => dispatch(addConnection(connection)),
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ModalEditConnection)
);
