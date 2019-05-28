import { loadAccountDataFromLocalStorage } from "modules/auth/actions/load-account-data-from-local-storage";
import { updateLoginAccount } from "modules/account/actions/login-account";
import { checkAccountAllowance } from "modules/auth/actions/approve-account";
import { loadAccountHistory } from "modules/auth/actions/load-account-history";
import { updateAssets } from "modules/auth/actions/update-assets";
import { loadReportingWindowBounds } from "modules/reports/actions/load-reporting-window-bounds";
import { windowRef } from "utils/window-ref";
import getValue from "utils/get-value";
import logError from "utils/log-error";
import { loadDesignatedReporterMarkets } from "modules/reports/actions/load-designated-reporter-markets";
import { loadDisputing } from "modules/reports/actions/load-disputing";
import { loadGasPriceInfo } from "modules/app/actions/load-gas-price-info";
import { getReportingFees } from "modules/reports/actions/get-reporting-fees";
import { ACCOUNT_TYPES } from "modules/common-elements/constants";
import { LoginAccount } from "modules/types";



export const loadAccountData = (
  account: LoginAccount,
  callback: Function = logError
) => (dispatch: Function) => {
  const address: string = getValue(account, "address");
  if (!address) return callback("account address required");
  if (
    windowRef &&
    windowRef.localStorage.setItem && account && account.meta &&
    account.meta.accountType === ACCOUNT_TYPES.METAMASK
  ) {
    windowRef.localStorage.setItem("loggedInAccount", address);
  }
  dispatch(loadAccountDataFromLocalStorage(address));
  dispatch(updateLoginAccount(account));
  dispatch(loadAccountHistory());
  dispatch(checkAccountAllowance());
  dispatch(updateAssets());
  dispatch(loadReportingWindowBounds());
  dispatch(loadDesignatedReporterMarkets());
  dispatch(loadDisputing());
  dispatch(loadGasPriceInfo());
  dispatch(getReportingFees());
};
