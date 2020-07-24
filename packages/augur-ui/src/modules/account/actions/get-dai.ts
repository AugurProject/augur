import logError from "utils/log-error";
import { getDai } from "modules/contracts/actions/contractCalls";
import { Action } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { NodeStyleCallback } from "modules/types";

export default function(callback: NodeStyleCallback = logError) {
  return async (dispatch: ThunkDispatch<void, any, Action>) => {
    // TODO: this will change when pending tx exists
    await getDai().catch((err: Error) => {
      console.log("error could not get dai", err);
      logError(new Error("get-DAI"));
    });
    callback(null);
  };
}
