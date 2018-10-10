import { augur } from "services/augurjs";
import { loadAccountDataFromLocalStorage } from "modules/auth/actions/load-account-data-from-local-storage";
import { updateLoginAccount } from "modules/auth/actions/update-login-account";
import { checkAccountAllowance } from "modules/auth/actions/approve-account";
import { loadAccountTrades } from "modules/positions/actions/load-account-trades";
import { updateAssets } from "modules/auth/actions/update-assets";
import { loadReportingWindowBounds } from "modules/reports/actions/load-reporting-window-bounds";
import { clearOrphanedOrderData } from "modules/orders/actions/orphaned-orders";

import getValue from "utils/get-value";
import logError from "utils/log-error";

const { ACCOUNT_TYPES } = augur.rpc.constants;

export const loadAccountData = (account, callback = logError) => dispatch => {
  const address = getValue(account, "address");
  if (!address) return callback("account address required");

  const localStorageRef = typeof window !== "undefined" && window.localStorage;
  if (
    localStorageRef &&
    localStorageRef.setItem &&
    account.meta.accountType === ACCOUNT_TYPES.META_MASK
  ) {
    localStorageRef.setItem("loggedInAccount", account.address);
  }

  dispatch(loadAccountDataFromLocalStorage(account.address));
  dispatch(clearOrphanedOrderData());
  dispatch(updateLoginAccount(account));
  dispatch(loadAccountTrades());
  dispatch(checkAccountAllowance());
  dispatch(updateAssets());
  dispatch(loadReportingWindowBounds());
};
