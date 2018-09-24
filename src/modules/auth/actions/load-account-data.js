import { loadAccountDataFromLocalStorage } from "modules/auth/actions/load-account-data-from-local-storage";
import { updateLoginAccount } from "modules/auth/actions/update-login-account";
import { checkAccountAllowance } from "modules/auth/actions/approve-account";
import { loadAccountTrades } from "modules/positions/actions/load-account-trades";
import { updateAssets } from "modules/auth/actions/update-assets";
import { loadReportingWindowBounds } from "modules/reports/actions/load-reporting-window-bounds";
import { clearOrphanedOrderData } from "modules/orders/actions/orphaned-orders";

import getValue from "utils/get-value";
import logError from "utils/log-error";

export const loadAccountData = (account, callback = logError) => dispatch => {
  const address = getValue(account, "address");
  if (!address) return callback("account address required");
  dispatch(clearOrphanedOrderData());
  dispatch(updateLoginAccount(account));
  dispatch(loadAccountTrades());
  dispatch(checkAccountAllowance());
  dispatch(updateAssets());
  dispatch(loadReportingWindowBounds());
  dispatch(loadAccountDataFromLocalStorage(account.address));
};
