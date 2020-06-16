import { connect } from "react-redux";

import Funds from "modules/account/components/funds";
import { formatDai } from "utils/format-number";
import {
  selectLoginAccount,
  selectAccountFunds,
} from "modules/auth/selectors/login-account";
import { AppState } from "appStore";

const mapStateToProps = (state: AppState) => {
  const loginAccount = selectLoginAccount(state);
  const {
    totalAvailableTradingBalance,
    totalFrozenFunds,
    totalAccountValue,
  } = selectAccountFunds(state);

  return {
    totalFrozenFunds: formatDai(totalFrozenFunds, { removeComma: true }),
    totalAvailableTradingBalance: formatDai(totalAvailableTradingBalance, { removeComma: true }),
    totalAccountValue: formatDai(totalAccountValue, { removeComma: true }),
  };
};

export default connect(mapStateToProps)(Funds);
