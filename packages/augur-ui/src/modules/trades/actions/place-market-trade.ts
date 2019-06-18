import { createBigNumber } from "utils/create-big-number";
import {
  BUY,
} from "modules/common/constants";
import logError from "utils/log-error";
import noop from "utils/noop";
import { AppState } from "store";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";
import { MarketData } from "modules/types";
import { placeTrade } from "modules/contracts/actions/contractCalls";

export const placeMarketTrade = ({
  marketId,
  outcomeId,
  tradeInProgress,
  doNotCreateOrders,
  callback = logError,
  onComplete = noop,
}: any) => async (dispatch: ThunkDispatch<void, any, Action>, getState: () => AppState) => {
  if (!marketId) return null;
  const { marketsData } = getState();
  const market: MarketData = marketsData[marketId];
  if (!tradeInProgress || !market || outcomeId == null) {
    return console.error(
      `required parameters not found for market ${marketId} outcome ${outcomeId}`,
    );
  }

  const userShares = createBigNumber(tradeInProgress.sharesDepleted, 10);

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

  /*
  // make sure that we actually have an updated allowance.
  const placeTradeParams: any = {
    meta: loginAccount.meta,
    amount: tradeInProgress.numShares,
    limitPrice: tradeInProgress.limitPrice,
    sharesProvided,
    minPrice: market.minPrice,
    maxPrice: market.maxPrice,
    numTicks: market.numTicks,
    _direction: tradeInProgress.side === BUY ? 0 : 1,
    _market: marketId,
    _outcome: parseInt(outcomeId, 10),
    _tradeGroupId: tradeInProgress.tradeGroupId,
    doNotCreateOrders,
    onSent: (res: any) => {
      ({ hash } = res);
      dispatch(checkAccountAllowance());

      dispatch(
        addPendingOrder(
          {
            id: hash,
            // @ts-ignore
            avgPrice: formatEther(tradeInProgress.limitPrice),
            unmatchedShares: formatShares(tradeInProgress.numShares),
            name: getOutcomeName(
              outcomesData[marketId],
              { id: outcomeId },
            ),
            type: tradeInProgress.side,
            pendingOrder: true,
            pending: false,
            blockNumber: blockchain.currentBlockNumber,
          },
          marketId,
        ),
      );

      callback(null, tradeInProgress.tradeGroupId);
    },
    onFailed: () => {
      if (hash) {
        dispatch(removePendingOrder(hash, marketId));
      }
      callback();
    },
    onSuccess: (res: any) => {
      if (bnAllowance.lte(0)) dispatch(checkAccountAllowance());
      onComplete({
        res,
        sharesToFill: sharesToFill.toString(),
        tradeInProgress,
      });
    },
  };

  const sendTrade = () => {
    augur.trading.placeTrade(placeTradeParams);
  };

  const promptApprovalandSend = () => {
    dispatch(
      updateModal({
        type: MODAL_ACCOUNT_APPROVAL,
        approveOnSent: () => {
          // This is done since the approval likely hasn't been minded yet so otherwise an eth_call for a trade will fail.
          // NOTE: augur.js is looking for specifically the string "null", not the actual null.
          placeTradeParams.tx = { returns: "null" };
          sendTrade();
        },
        approveCallback: (err: any, res: any) => {
          if (err) return callback(err);
        },
      }),
    );
  };

  if (
    bnAllowance === undefined ||
    bnAllowance.lte(0) ||
    bnAllowance.lte(createBigNumber(tradeInProgress.totalCost.value))
  ) {
    dispatch(
      checkAccountAllowance((err: any, allowance: string) => {
        if (allowance === "0") {
          promptApprovalandSend();
        } else {
          sendTrade();
        }
      }),
    );
  } else {
    sendTrade();
  }
*/
};
