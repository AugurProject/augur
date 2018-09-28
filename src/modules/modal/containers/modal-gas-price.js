import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import ModalGasPrice from "modules/modal/components/modal-gas-price/modal-gas-price";
import { updateLoginAccount } from "modules/auth/actions/update-login-account";
import { closeModal } from "modules/modal/actions/close-modal";

const mapStateToProps = state => ({
  modal: state.modal,
  userDefinedGasPrice:
    state.loginAccount.userDefinedGasPrice || state.gasPriceInfo.average,
  ...state.gasPriceInfo
});

const mapDispatchToProps = dispatch => ({
  closeModal: () => dispatch(closeModal()),
  saveModal: gasPrice => {
    dispatch(updateLoginAccount({ userDefinedGasPrice: gasPrice }));
    dispatch(closeModal());
  }
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ModalGasPrice)
);
