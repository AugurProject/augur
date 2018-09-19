import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import ModalView from "../components/modal-view/modal-view";

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
  )(ModalView)
);
