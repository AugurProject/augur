export const IS_MOBILE = "isMobile";
export const IS_MOBILE_SMALL = "isMobileSmall";
export const UPDATE_APP_STATUS = "UPDATE_APP_STATUS";

export function updateAppStatus(statusKey: string, value: boolean) {
  return {
    type: UPDATE_APP_STATUS,
    data: {
      statusKey,
      value
    }
  };
}
