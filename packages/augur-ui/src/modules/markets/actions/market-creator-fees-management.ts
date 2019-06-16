import logError from "utils/log-error";
import { augur } from "services/augurjs";
import { AppState } from "store";
import { NodeStyleCallback } from "modules/types";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";

export const collectMarketCreatorFees = (
  marketId: string,
  callback: NodeStyleCallback = logError
) => (dispatch: ThunkDispatch<void, any, Action>, getState: () => AppState) => {
  const { loginAccount } = getState();
  if (!loginAccount.address) return callback(null);
  augur.api.Market.marketCreatorFeesAttoCash(
    { tx: { to: marketId } },
    (err: any, creatorFees: any) => {
      if (err) return callback(err);
      // TODO: convert to display value
      callback(null, creatorFees);
    }
  );
};
