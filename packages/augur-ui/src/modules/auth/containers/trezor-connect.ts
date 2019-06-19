import { connect } from "react-redux";
import TrezorConnectWrapper from "modules/auth/components/trezor-connect/trezor-connect";
import loginWithTrezor from "modules/auth/actions/login-with-trezor";
import { logout } from "modules/auth/actions/logout";

const mapStateToProps = state => ({});

const mapDispatchToProps = (dispatch) => ({
  loginWithTrezor: (address, addressPath) =>
    dispatch(loginWithTrezor(address, addressPath)),
  logout: () => dispatch(logout()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TrezorConnectWrapper);
