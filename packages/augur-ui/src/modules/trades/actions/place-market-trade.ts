import { BigNumber, createBigNumber } from 'utils/create-big-number';
import {
  BUY,
  INVALID_OUTCOME_ID,
  MODAL_ERROR,
  PUBLICTRADE,
  ZEROX_STATUSES,
  BUY_INDEX,
  SELL,
} from 'modules/common/constants';
import { AppState } from 'appStore';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import {
  placeTrade,
  approveToTrade,
} from 'modules/contracts/actions/contractCalls';
import type { Getters } from '@augurproject/sdk';
import { TXEventName } from '@augurproject/sdk-lite'
import {
  convertDisplayAmountToOnChainAmount,
  convertDisplayPriceToOnChainPrice,
} from "@augurproject/utils"
import {
  addPendingOrder,
  updatePendingOrderStatus,
  generatePendingOrderId,
} from 'modules/orders/actions/pending-orders-management';
import { convertUnixToFormattedDate } from 'utils/format-date';
import { getOutcomeNameWithOutcome } from 'utils/get-outcome';
import { updateModal } from 'modules/modal/actions/update-modal';
import { Ox_STATUS } from 'modules/app/actions/update-app-status';
import { updateAlert } from 'modules/alerts/actions/alerts';
import { checkAccountApproval } from 'modules/auth/actions/approve-account';

export const placeMarketTrade = ({
  marketId,
  outcomeId,
  tradeInProgress,
  doNotCreateOrders,
  postOnly,
}: any) => async (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  if (!marketId) return null;
  const { marketInfos, loginAccount, blockchain, appStatus } = getState();
  // numFills is 0 and zerox mesh client has error auto fail processing order label
  const autoFailOrder = appStatus[Ox_STATUS] === ZEROX_STATUSES.ERROR;
  const market: Getters.Markets.MarketInfo = marketInfos[marketId];
  if (!tradeInProgress || !market || outcomeId == null) {
    return console.error(
      `required parameters not found for market ${marketId} outcome ${outcomeId}`
    );
  }
  dispatch(checkAccountApproval());
  // we need to make sure approvals went through before doing trade / the rest of this function
  const userShares = createBigNumber(tradeInProgress.shareCost || 0, 10);
  const { tickSize, minPrice } = market;
  const displayPrice = tradeInProgress.limitPrice;
  const displayAmount = tradeInProgress.numShares;
  const orderType = tradeInProgress.side === BUY ? 0 : 1;
  const expirationTime = tradeInProgress.expirationTime
    ? createBigNumber(tradeInProgress.expirationTime)
    : undefined;
  const tradeGroupId = generatePendingOrderId(
    displayPrice,
    outcomeId,
    marketId,
    tickSize,
    minPrice,
    String(orderType),
  );
  dispatch(
    addPendingOrder(
      {
        ...tradeInProgress,
        type: tradeInProgress.side,
        name: getOutcomeNameWithOutcome(
          market,
          outcomeId.toString(),
          outcomeId === INVALID_OUTCOME_ID
        ),
        pending: true,
        fullPrecisionPrice: tradeInProgress.limitPrice,
        id: tradeGroupId,
        amount: tradeInProgress.numShares,
        status:
          autoFailOrder && tradeInProgress.numFills === 0
            ? TXEventName.Failure
            : TXEventName.Pending,
        creationTime: convertUnixToFormattedDate(
          blockchain.currentAugurTimestamp
        ),
      },
      market.id
    )
  );

  placeTrade(
    orderType,
    market.id,
    market.numOutcomes,
    parseInt(outcomeId, 10),
    doNotCreateOrders,
    market.numTicks,
    market.minPrice,
    market.maxPrice,
    displayAmount,
    displayPrice,
    userShares,
    expirationTime,
    tradeGroupId,
    postOnly,
  )
    .then(result => {
      if (tradeInProgress.numFills === 0) {
        const alert = {
          eventType: orderType,
          market: marketId,
          name: PUBLICTRADE,
          status: TXEventName.Success,
          timestamp: blockchain.currentAugurTimestamp * 1000,
          params: {
            outcome: '0x0'.concat(outcomeId),
            price: convertDisplayPriceToOnChainPrice(
              createBigNumber(displayPrice),
              createBigNumber(minPrice),
              createBigNumber(tickSize)
            ),
            orderType,
            amount: convertDisplayAmountToOnChainAmount(
              createBigNumber(tradeInProgress.numShares),
              createBigNumber(tickSize)
            ),
            marketId,
          },
        };
        dispatch(updateAlert(undefined, alert, false));
      }
    })
    .catch(err => {
      console.log(err);
      dispatch(
        updateModal({
          type: MODAL_ERROR,
          error: err.message ? err.message : JSON.stringify(err),
        })
      );
      dispatch(
        updatePendingOrderStatus(
          tradeGroupId,
          marketId,
          TXEventName.Failure,
          null
        )
      );
    });
};
