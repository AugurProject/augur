import { connect } from "react-redux";

import Funds from "modules/account/components/funds";
import { formatEther, formatAttoRep, formatPercent } from "utils/format-number";
import {
  selectLoginAccount,
  selectAccountFunds
} from "modules/auth/selectors/login-account";

const mapStateToProps = (state: any) => {
  const loginAccount = selectLoginAccount(state);
  const {
    totalAvailableTradingBalance,
    totalFrozenFunds,
    totalAccountValue
  } = selectAccountFunds(state);
  const { reportingWindowStats } = state;
  const { rep, realizedPLPercent } = loginAccount;

  return {
    repStaked:
      formatAttoRep(reportingWindowStats.stake, {
        decimals: 4,
        denomination: " REP"
      }).formattedValue || 0,
    repBalance: rep.formatted || "0",
    totalFrozenFunds: formatEther(totalFrozenFunds).formatted,
    totalAvailableTradingBalance: formatEther(totalAvailableTradingBalance)
      .formatted,
    totalAccountValue: formatEther(totalAccountValue).formatted,
    realizedPLPercent: formatPercent(realizedPLPercent)
      .formattedValue
  };
};

export default connect(mapStateToProps)(Funds);
