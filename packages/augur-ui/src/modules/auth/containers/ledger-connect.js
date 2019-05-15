import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { logout } from "modules/auth/actions/logout";
import LedgerConnect from "modules/auth/components/ledger-connect/ledger-connect";

import loginWithLedger from "modules/auth/actions/login-with-ledger";
import {
  updateAuthStatus,
  LEDGER_STATUS
} from "modules/auth/actions/update-auth-status";

const mapStateToProps = state => ({
  ledgerStatus: state.authStatus.ledgerStatus
});

const mapDispatchToProps = dispatch => ({
  loginWithLedger: (address, lib, devPath) =>
    dispatch(loginWithLedger(address, lib, devPath)),
  updateLedgerStatus: status =>
    dispatch(updateAuthStatus(LEDGER_STATUS, status)),
  logout: () => dispatch(logout())
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(LedgerConnect)
);
