import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import ModalGasPrice from "modules/modal/components/modal-gas-price/modal-gas-price";

import { closeModal } from "modules/modal/actions/close-modal";

const mapStateToProps = state => ({
  modal: state.modal,
});

const mapDispatchToProps = dispatch => ({
  closeModal: () => dispatch(closeModal()),
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ModalGasPrice)
);
