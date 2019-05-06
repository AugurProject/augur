export const UPDATE_CURRENT_BASE_PATH = "UPDATE_CURRENT_BASE_PATH";
export const UPDATE_CURRENT_INNER_NAV_TYPE = "UPDATE_CURRENT_INNER_NAV_TYPE";
export const UPDATE_MOBILE_MENU_STATE = "UPDATE_MOBILE_MENU_STATE";
export const UPDATE_SIDEBAR_STATUS = "UPDATE_SIDEBAR_STATUS";
export const UPDATE_IS_ALERT_VISIBLE = "UPDATE_IS_ALERT_VISIBLE";

export function updateCurrentBasePath(data: string) {
  return {
    type: UPDATE_CURRENT_BASE_PATH,
    data
  };
}

export function updateCurrentInnerNavType(data: any) {
  return {
    type: UPDATE_CURRENT_INNER_NAV_TYPE,
    data
  };
}

export function updateMobileMenuState(data: number) {
  return {
    type: UPDATE_MOBILE_MENU_STATE,
    data
  };
}

export function updateIsAlertVisible(data: boolean) {
  return {
    type: UPDATE_IS_ALERT_VISIBLE,
    data
  };
}

export function updateSidebarStatus(data: any) {
  return {
    type: UPDATE_SIDEBAR_STATUS,
    data
  };
}
