import { createBigNumber } from "utils/create-big-number";
import {
  BUY,
} from "modules/common/constants";
import logError from "utils/log-error";
import noop from "utils/noop";
import { AppState } from "store";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";
import { placeTrade } from "modules/contracts/actions/contractCalls";
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
  const { marketInfos } = getState();
  const market: Getters.Markets.MarketInfo = marketInfos[marketId];
  if (!tradeInProgress || !market || outcomeId == null) {
    return console.error(
      `required parameters not found for market ${marketId} outcome ${outcomeId}`,
    );
  }

  const userShares = createBigNumber(tradeInProgress.sharesDepleted || 0, 10);

  const displayPrice = tradeInProgress.limitPrice;
  const displayAmount = tradeInProgress.numShares;
  const orderType = tradeInProgress.side === BUY ? 0 : 1;

  const ignoreShares = false; // TODO: get this from order form
  const affiliateAddress = undefined; // TODO: get this from state
  const kycToken = undefined; // TODO: figure out how kyc tokens are going to be handled

  placeTrade(
    orderType,
    market.id,
    market.numOutcomes,
    parseInt(outcomeId, 10),
    ignoreShares,
    affiliateAddress,
    kycToken,
    doNotCreateOrders,
    market.numTicks,
    market.minPrice,
    market.maxPrice,
    displayAmount,
    displayPrice,
    userShares
  );

  // TODO: figure out Error handling
  callback(null, null);
};
