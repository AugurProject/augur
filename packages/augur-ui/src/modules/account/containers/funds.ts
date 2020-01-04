import { connect } from "react-redux";

import Funds from "modules/account/components/funds";
import { formatDai, formatPercent } from "utils/format-number";
import {
  selectLoginAccount,
  selectAccountFunds,
} from "modules/auth/selectors/login-account";
import { AppState } from "store";

const mapStateToProps = (state: AppState) => {
  const loginAccount = selectLoginAccount(state);
  const {
    totalAvailableTradingBalance,
    totalFrozenFunds,
    totalAccountValue,
  } = selectAccountFunds(state);
  const { tradingPositionsTotal } = loginAccount;

  return {
    totalFrozenFunds: formatDai(totalFrozenFunds).formatted,
    totalAvailableTradingBalance: formatDai(totalAvailableTradingBalance)
      .formatted,
    totalAccountValue: formatDai(totalAccountValue).formatted,
    realizedPLPercent: formatPercent(tradingPositionsTotal.unrealizedRevenue24hChangePercent)
      .formattedValue,
  };
};

export default connect(mapStateToProps)(Funds);
