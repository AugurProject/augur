import { connect } from "react-redux";

import Funds from "modules/account/components/funds";
import { formatEther, formatAttoRep, formatPercent } from "utils/format-number";
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
  const { reportingWindowStats } = state;
  const { rep, tradingPositionsTotal } = loginAccount;

  return {
    repStaked:
      formatAttoRep(reportingWindowStats.stake, {
        decimals: 4,
        denomination: " REP",
      }).formattedValue || 0,
    repBalance: rep.formatted || "0",
    totalFrozenFunds: formatEther(totalFrozenFunds).formatted,
    totalAvailableTradingBalance: formatEther(totalAvailableTradingBalance)
      .formatted,
    totalAccountValue: formatEther(totalAccountValue).formatted,
    realizedPLPercent: formatPercent(tradingPositionsTotal.unrealizedRevenue24hChangePercent)
      .formattedValue,
  };
};

export default connect(mapStateToProps)(Funds);
