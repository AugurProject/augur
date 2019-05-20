export const IS_MOBILE = "isMobile";
export const IS_MOBILE_SMALL = "isMobileSmall";
export const TRANSACTIONS_LOADING = "transactionsLoading";
export const UPDATE_APP_STATUS = "UPDATE_APP_STATUS";

export function updateAppStatus(statusKey: String, value: Boolean) {
  return {
    type: UPDATE_APP_STATUS,
    data: {
      statusKey,
      value
    }
  };
}
