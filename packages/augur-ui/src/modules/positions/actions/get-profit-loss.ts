import { AppState } from "appStore";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";
import { augurSdk } from "services/augursdk";
import { AppStatus } from "modules/app/store/app-status";

interface ProfitLoss {
  universe: string;
  startTime: number;
  endTime: number;
}

export default function getProfitLoss({
  universe,
  startTime,
  endTime,
}: ProfitLoss) {
  return async (dispatch: ThunkDispatch<void, any, Action>, getState: () => AppState) => {
    const { loginAccount: { address: account }} = AppStatus.get();
    if (!account) return false;
    const Augur = augurSdk.get();
    return Augur.getProfitLoss({
        universe,
        account,
        endTime,
        startTime,
      });
  };
}
