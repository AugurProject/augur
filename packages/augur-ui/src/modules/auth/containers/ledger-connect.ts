import { connect } from "react-redux";
import { logout } from "modules/auth/actions/logout";
import LedgerConnect from "modules/auth/components/ledger-connect/ledger-connect";

import loginWithLedger from "modules/auth/actions/login-with-ledger";

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({
  loginWithLedger: (address, lib, devPath) =>
    dispatch(loginWithLedger(address, lib, devPath)),
  logout: () => dispatch(logout()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LedgerConnect);
