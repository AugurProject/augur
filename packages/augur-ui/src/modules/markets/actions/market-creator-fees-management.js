import logError from "utils/log-error";
import { augur } from "services/augurjs";

export const collectMarketCreatorFees = (marketId, callback = logError) => (
  dispatch,
  getState
) => {
  const { loginAccount } = getState();
  if (!loginAccount.address) return callback(null);
  augur.api.Market.marketCreatorFeesAttoCash(
    { tx: { to: marketId } },
    (err, creatorFees) => {
      if (err) return callback(err);
      // todo: convert to display value
      callback(null, creatorFees);
    }
  );
};
