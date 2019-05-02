import { connect } from "react-redux";

import OverviewFunds from "modules/account/components/overview-funds/overview-funds";
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

  return {
    repStaked:
      formatAttoRep(state.reportingWindowStats.stake, {
        decimals: 4,
        denomination: " REP"
      }).formattedValue || 0,
    repBalance: loginAccount.rep.formatted || "0",
    totalFrozenFunds: formatEther(totalFrozenFunds).formatted,
    totalAvailableTradingBalance: formatEther(totalAvailableTradingBalance)
      .formatted,
    totalAccountValue: formatEther(totalAccountValue).formatted,
    realizedPLPercent: formatPercent(loginAccount.realizedPLPercent)
      .formattedValue
  };
};

export default connect(mapStateToProps)(OverviewFunds);
