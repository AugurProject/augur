import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import ModalGasPrice from "modules/modal/components/modal-gas-price/modal-gas-price";
import { closeModal } from "modules/modal/actions/close-modal";
import { updateGasPriceInfo } from "modules/app/actions/update-gas-price-info";

const mapStateToProps = state => ({
  modal: state.modal,
  ...state.gasPriceInfo
});

const mapDispatchToProps = dispatch => ({
  closeModal: () => dispatch(closeModal()),
  saveModal: gasPrice => {
    dispatch(updateGasPriceInfo({ userDefinedGasPrice: gasPrice }));
    dispatch(closeModal());
  }
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ModalGasPrice)
);
