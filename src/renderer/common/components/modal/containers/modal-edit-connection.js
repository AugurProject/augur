import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import ModalEditConnection from "../components/modal-edit-connection/modal-edit-connection";

import { closeModal } from "../actions/close-modal";
import { addUpdateConnection, removeConnection } from "../../../../app/actions/configuration";

const mapStateToProps = state => ({
  modal: state.modal,
  numberConnections: state.configuration.networks && state.configuration.networks.length,
});

const mapDispatchToProps = dispatch => ({
  closeModal: () => dispatch(closeModal()),
  addUpdateConnection: (key, connection) => dispatch(addUpdateConnection(key, connection)),
  removeConnection: (key) => dispatch(removeConnection(key)),
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ModalEditConnection)
);
