import { connect } from "react-redux";
import TrezorConnect from "modules/auth/components/trezor-connect/trezor-connect";
import loginWithTrezor from "src/modules/auth/actions/login-with-trezor";

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
  loginWithTrezor: (address, connect, addressPath) =>
    dispatch(loginWithTrezor(address, connect, addressPath))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TrezorConnect);
