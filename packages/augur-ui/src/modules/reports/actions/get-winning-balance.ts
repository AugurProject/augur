import { augur } from "services/augurjs";
import logError from "utils/log-error";
import * as speedomatic from "speedomatic";
import { updateMarketsData } from "modules/markets/actions/update-markets-data";

export const getWinningBalance = (marketIds = [], callback: NodeStyleCallback = logError) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const { loginAccount } = getState();
  augur.augurNode.submitRequest(
    "getWinningBalance",
    { marketIds, account: loginAccount.address },
    (err: any, winningBalance: Array<any>) => {
      if (err) return callback(err);

      const { marketsData } = getState();

      // clear out outstandingReturns
      marketIds.forEach(marketId => {
        if (marketsData[marketId] && marketsData[marketId].outstandingReturns) {
          delete marketsData[marketId].outstandingReturns;
        }
      });

      const balances = winningBalance.filter(
        balance => balance.winnings !== "0"
      );
      if (balances.length === 0) return callback(null, {});
      const updatedMarketsData = balances.reduce(
        (p, balance) => ({
          ...p,
          [balance.marketId]: {
            outstandingReturns: speedomatic.unfix(balance.winnings, "string")
          }
        }),
        {}
      );

      dispatch(updateMarketsData(updatedMarketsData));
      callback(null, updatedMarketsData);
    }
  );
};
