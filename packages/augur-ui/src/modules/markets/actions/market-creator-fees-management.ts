import logError from "utils/log-error";
import { augur } from "services/augurjs";
import { AppState } from "store";

export const collectMarketCreatorFees = (
  marketId: string,
  callback: Function = logError
) => (dispatch: Function, getState: () => AppState) => {
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
