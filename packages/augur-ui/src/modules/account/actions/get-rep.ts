import logError from "utils/log-error";
import { AppState } from "store";
import { Action } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { NodeStyleCallback } from "modules/types";
import { getRep } from "modules/contracts/actions/contractCalls";
import { updateAssets } from "modules/auth/actions/update-assets";

export default function(callback: NodeStyleCallback = logError) {
  return async (dispatch: ThunkDispatch<void, any, Action>, getState: () => AppState) => {
    await getRep().catch((err: Error) => {
      console.log("error could not get dai", err);
      logError(new Error("get-Dai"));
    });
    // TODO: this will change when pending tx exists
    dispatch(updateAssets());
    callback(null);
  };
}
