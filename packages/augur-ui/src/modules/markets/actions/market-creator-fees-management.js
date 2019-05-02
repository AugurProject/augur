import async from "async";
import logError from "utils/log-error";
import noop from "utils/noop";
import speedomatic from "speedomatic";
import { augur } from "services/augurjs";
import { updateMarketsData } from "modules/markets/actions/update-markets-data";
import { selectCurrentTimestampInSeconds } from "src/select-state";
import { updateAlert } from "modules/alerts/actions/alerts";

export const UPDATE_MARKET_CREATOR_FEES = "UPDATE_MARKET_CREATOR_FEES";

export function updateMarketCreatorFees(marketCreatorFees) {
  return { type: UPDATE_MARKET_CREATOR_FEES, data: { marketCreatorFees } };
}

export const loadUnclaimedFees = (marketIds = [], callback = logError) => (
  dispatch,
  getState
) => {
  if (marketIds == null || marketIds.length === 0) return callback(null, []);
  const unclaimedFees = {};
  async.eachSeries(
    marketIds,
    (marketId, nextMarket) => {
      dispatch(
        collectMarketCreatorFees(true, marketId, (err, balance) => {
          if (err) return nextMarket(err);
          unclaimedFees[marketId] = balance;
          nextMarket();
        })
      );
    },
    err => {
      // log error, but don't stop updating markets unclaimedFees
      if (err) console.error(err);
      const updatedMarketsData = marketIds.reduce(
        (p, marketId, index) => ({
          ...p,
          [marketId]: {
            id: marketId,
            unclaimedCreatorFees: unclaimedFees[marketId] || "0"
          }
        }),
        {}
      );
      dispatch(updateMarketsData(updatedMarketsData));
      callback(null, updatedMarketsData);
    }
  );
};

export const collectMarketCreatorFees = (
  getBalanceOnly,
  marketId,
  callback = logError
) => (dispatch, getState) => {
  const { loginAccount } = getState();
  if (!loginAccount.address) return callback(null);
  augur.api.Market.getMarketCreatorMailbox(
    { tx: { to: marketId } },
    (err, marketMailboxAddress) => {
      if (err) return callback(err);
      if (marketMailboxAddress == null)
        return callback(
          `no market mailbox address found for market ${marketId}`
        );
      augur.api.Cash.balanceOf(
        { _owner: marketMailboxAddress },
        (err, cashBalance) => {
          if (err) return callback(err);
          if (cashBalance == null)
            return callback("Cash.balanceOf request failed");
          const bnCashBalance = speedomatic.bignum(cashBalance);
          augur.rpc.eth.getBalance(
            [marketMailboxAddress, "latest"],
            (err, attoEthBalance) => {
              if (err) return callback(err);
              if (attoEthBalance === null)
                return callback("No market mailbox balance found");
              const bnAttoEthBalance = speedomatic.bignum(attoEthBalance);
              const combined = speedomatic.unfix(
                bnAttoEthBalance.plus(bnCashBalance),
                "string"
              );
              if (getBalanceOnly) {
                return callback(null, combined);
              }
              if (combined > 0) {
                // something to collect? sendTransaction to withdrawEther
                augur.api.Mailbox.withdrawEther({
                  tx: { to: marketMailboxAddress },
                  meta: loginAccount.meta,
                  onSent: noop,
                  onSuccess: res => {
                    dispatch(loadUnclaimedFees([marketId]));
                    callback(null, combined);
                    dispatch(
                      updateAlert(res.hash, {
                        id: res.hash,
                        status: "Confirmed",
                        timestamp: selectCurrentTimestampInSeconds(getState())
                      })
                    );
                  },
                  onFailed: err => callback(err)
                });
              } else {
                // else callback to let the callback know there is 0 to collect.
                callback(null, combined);
              }
            }
          );
        }
      );
    }
  );
};
