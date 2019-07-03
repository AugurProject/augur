import { updateAlert } from "modules/alerts/actions/alerts";
import { selectCurrentTimestampInSeconds as getTime } from "store/select-state";
import logError from "utils/log-error";
import { AppState } from "store";
import { Action } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { NodeStyleCallback } from "modules/types";
import { getRep } from "modules/contracts/actions/contractCalls";

export default function(callback: NodeStyleCallback = logError) {
  return (dispatch: ThunkDispatch<void, any, Action>, getState: () => AppState) => {
    const update = (id: string, status: string) =>
      dispatch(
        updateAlert(id, {
          id,
          status,
          timestamp: getTime(getState()),
        }),
      );
      getRep();
  };
}
