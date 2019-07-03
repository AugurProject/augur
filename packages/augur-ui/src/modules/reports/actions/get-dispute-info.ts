import logError from "utils/log-error";
import { AppState } from "store";
import { NodeStyleCallback } from "modules/types";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";

export const getDisputeInfo = (
  marketIds: Array<string>,
  callback: NodeStyleCallback = logError,
) => (
  dispatch: ThunkDispatch<{}, {}, Action>,
  getState: () => AppState,
): void => {
  const { loginAccount } = getState();
  // TODO: get dispute information from middleware
  callback(null, []);
};
