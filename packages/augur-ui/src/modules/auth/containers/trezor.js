import { connect } from "react-redux";
import Trezor from "modules/auth/components/trezor/trezor";
import loginWithTrezor from "src/modules/auth/actions/login-with-trezor";
import { updateModal } from "src/modules/modal/actions/update-modal";
import { MODAL_TREZOR } from "src/modules/modal/constants/modal-types";

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
  loginWithTrezor: (address, connect, addressPath) =>
    dispatch(loginWithTrezor(address, connect, addressPath)),
  showError: error =>
    dispatch(
      updateModal({
        type: MODAL_TREZOR,
        info: `Error authenticating with Trezor: "${error}"`,
        canClose: true
      })
    )
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Trezor);
