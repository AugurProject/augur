import logError from "utils/log-error";
import { AppState } from "store";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";
import { augurSdk } from "services/augursdk";

export default function getProfitLoss({
  universe,
  startTime = null,
  endTime = null,
  periodInterval = null,
  marketId = null,
  callback = logError,
}: any) {
  // NOTE: PL data isn't going to be saved to the application state
  // only the performanceGraph Component. Always pass a callback or you won't
  // have access to the data.
  return (dispatch: ThunkDispatch<void, any, Action>, getState: () => AppState) => {
    const { loginAccount } = getState();
    if (!loginAccount.address) return callback("not logged in");
    const Augur = augurSdk.get();
    // TODO: figure this out
    /*
    const result = Augur.getProfitLoss({
      universe,
      account: loginAccount.address,
      startTime,
      endTime,
      periodInterval,
      marketId,
    })
    callback(result);
    */
  };
}
