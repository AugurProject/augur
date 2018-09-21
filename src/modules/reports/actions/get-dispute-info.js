import { augur } from "services/augurjs";
import logError from "utils/log-error";

export const getDisputeInfo = (marketIds, callback = logError) => (
  dispatch,
  getState
) => {
  const { loginAccount } = getState();
  augur.augurNode.submitRequest(
    "getDisputeInfo",
    {
      marketIds,
      account: loginAccount.address
    },
    (err, result) => {
      if (err) return callback(err);
      // Increment disputeRound by 1 since Augur Node starts
      // numbering at 0, but UI should start numbering at 1
      for (let i = 0; i < result.length; i++) {
        if (typeof result[i].disputeRound === "number") {
          result[i].disputeRound += 1;
        }
      }
      callback(null, result);
    }
  );
};
