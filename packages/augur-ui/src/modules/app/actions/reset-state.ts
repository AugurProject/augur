export const RESET_STATE = "RESET_STATE";

export interface  ResetStateAction {
  type: typeof RESET_STATE;
  data: null;
}

export const resetState = ():ResetStateAction => ({ type: RESET_STATE, data: null });
