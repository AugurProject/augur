import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import ModalDeleteConnection from "../components/modal-delete-connection/modal-delete-connection";

import { closeModal } from "../actions/close-modal";
import { removeConnection } from "../../../../app/actions/configuration";

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
  removeConnection: (key) => dispatch(removeConnection(key)),
});

export default withRouter(
  connect(
  	mapStateToProps,
    mapDispatchToProps
  )(ModalDeleteConnection)
);
