import { AccountPosition, BaseAction } from "modules/types";

export const UPDATE_ACCOUNT_POSITIONS_DATA = "UPDATE_ACCOUNT_POSITIONS_DATA";

export function updateAccountPositionsData(
  data: AccountPosition,
): BaseAction {
  return {
    type: UPDATE_ACCOUNT_POSITIONS_DATA,
    data,
  };
}
