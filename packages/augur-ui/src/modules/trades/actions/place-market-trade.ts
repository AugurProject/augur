import { createBigNumber } from "utils/create-big-number";
import {
  BUY,
} from "modules/common/constants";
import logError from "utils/log-error";
import noop from "utils/noop";
import { AppState } from "store";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";
import { placeTrade, approveToTrade } from "modules/contracts/actions/contractCalls";
import { Getters } from "@augurproject/sdk";

export const placeMarketTrade = ({
  marketId,
  outcomeId,
  tradeInProgress,
  doNotCreateOrders,
  callback = logError,
  onComplete = noop,
}: any) => async (dispatch: ThunkDispatch<void, any, Action>, getState: () => AppState) => {
  if (!marketId) return null;
  const { marketInfos, loginAccount } = getState();
  const market: Getters.Markets.MarketInfo = marketInfos[marketId];
  if (!tradeInProgress || !market || outcomeId == null) {
    return console.error(
      `required parameters not found for market ${marketId} outcome ${outcomeId}`,
    );
  }

  const needsApproval = createBigNumber(loginAccount.allowance).lt(tradeInProgress.totalCost.value);
  if (needsApproval) await approveToTrade();
  const userShares = createBigNumber(tradeInProgress.sharesDepleted || 0, 10);

  const displayPrice = tradeInProgress.limitPrice;
  const displayAmount = tradeInProgress.numShares;
  const orderType = tradeInProgress.side === BUY ? 0 : 1;

  const fingerprint = undefined; // TODO: get this from state
  const kycToken = undefined; // TODO: figure out how kyc tokens are going to be handled

  placeTrade(
    orderType,
    market.id,
    market.numOutcomes,
    parseInt(outcomeId, 10),
    fingerprint,
    kycToken,
    doNotCreateOrders,
    market.numTicks,
    market.minPrice,
    market.maxPrice,
    displayAmount,
    displayPrice,
    userShares
  ).then(() => callback(null, null))
    .catch((err) => callback(err, null));
};
