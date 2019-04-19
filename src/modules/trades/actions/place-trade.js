import { augur } from "services/augurjs";
import { createBigNumber } from "utils/create-big-number";
import { updateModal } from "modules/modal/actions/update-modal";
import { checkAccountAllowance } from "modules/auth/actions/approve-account";
import {
  BUY,
  ZERO,
  MODAL_ACCOUNT_APPROVAL
} from "modules/common-elements/constants";
import logError from "utils/log-error";
import noop from "utils/noop";
import {
  addPendingOrder,
  removePendingOrder
} from "modules/orders/actions/pending-orders-management";
import { formatEther, formatShares } from "utils/format-number";

function getOutcomeName(outcomesData, outcomeId) {
  return outcomesData[outcomeId].name || outcomesData[outcomeId].description;
}

export const placeTrade = ({
  marketId,
  outcomeId,
  tradeInProgress,
  doNotCreateOrders,
  callback = logError,
  onComplete = noop
}) => (dispatch, getState) => {
  if (!marketId) return null;
  const { loginAccount, marketsData, blockchain, outcomesData } = getState();
  const market = marketsData[marketId];
  if (!tradeInProgress || !market || outcomeId == null) {
    return console.error(
      `required parameters not found for market ${marketId} outcome ${outcomeId}`
    );
  }
  const bnAllowance = createBigNumber(loginAccount.allowance, 10);
  const sharesDepleted = createBigNumber(tradeInProgress.sharesDepleted, 10);
  const otherSharesDepleted = createBigNumber(
    tradeInProgress.otherSharesDepleted,
    10
  );
  const sharesProvided = sharesDepleted.eq(ZERO)
    ? otherSharesDepleted.toFixed()
    : sharesDepleted.toFixed();
  const tradeCost = augur.trading.calculateTradeCost({
    displayPrice: tradeInProgress.limitPrice,
    displayAmount: tradeInProgress.numShares,
    sharesProvided,
    numTicks: market.numTicks,
    orderType: tradeInProgress.side === BUY ? 0 : 1,
    minDisplayPrice: market.minPrice,
    maxDisplayPrice: market.maxPrice
  });
  const sharesToFill = tradeCost.onChainAmount;
  let hash = null;
  // make sure that we actually have an updated allowance.
  const placeTradeParams = {
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
    onSent: res => {
      ({ hash } = res);
      dispatch(checkAccountAllowance());

      dispatch(
        addPendingOrder(
          {
            id: hash,
            avgPrice: formatEther(tradeInProgress.limitPrice),
            unmatchedShares: formatShares(tradeInProgress.numShares),
            name: getOutcomeName(
              outcomesData[marketId],
              parseInt(outcomeId, 10)
            ),
            type: tradeInProgress.side,
            pendingOrder: true,
            pending: false,
            blockNumber: blockchain.currentBlockNumber
          },
          marketId
        )
      );

      callback(null, tradeInProgress.tradeGroupId);
    },
    onFailed: () => {
      if (hash) {
        dispatch(removePendingOrder(hash, marketId));
      }
      callback();
    },
    onSuccess: res => {
      if (bnAllowance.lte(0)) dispatch(checkAccountAllowance());
      onComplete({
        res,
        sharesToFill: sharesToFill.toString(),
        tradeInProgress
      });
    }
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
        approveCallback: (err, res) => {
          if (err) return callback(err);
        }
      })
    );
  };

  if (
    bnAllowance === undefined ||
    bnAllowance.lte(0) ||
    bnAllowance.lte(createBigNumber(tradeInProgress.totalCost.value))
  ) {
    dispatch(
      checkAccountAllowance((err, allowance) => {
        if (allowance === "0") {
          promptApprovalandSend();
        } else {
          sendTrade();
        }
      })
    );
  } else {
    sendTrade();
  }
};
