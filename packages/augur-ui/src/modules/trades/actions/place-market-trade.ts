import { createBigNumber } from 'utils/create-big-number';
import {
  BUY,
  INVALID_OUTCOME_ID,
  MODAL_ERROR,
  ZEROX_STATUSES,
} from 'modules/common/constants';
import { AppState } from 'appStore';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import {
  placeTrade,
  approveToTrade,
} from 'modules/contracts/actions/contractCalls';
import { Getters, TXEventName } from '@augurproject/sdk';
import {
  addPendingOrder,
  updatePendingOrderStatus,
  generatePendingOrderId,
} from 'modules/orders/actions/pending-orders-management';
import { convertUnixToFormattedDate } from 'utils/format-date';
import { getOutcomeNameWithOutcome } from 'utils/get-outcome';
import { AppStatus } from 'modules/app/store/app-status';
import { Markets } from 'modules/markets/store/markets';

export const placeMarketTrade = ({
  marketId,
  outcomeId,
  tradeInProgress,
  doNotCreateOrders,
}: any) => async (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  if (!marketId) return null;
  const { marketInfos } = Markets.get();
  // numFills is 0 and zerox mesh client has error auto fail processing order label
  const {
    loginAccount: { allowance }, 
    zeroXStatus,
    gsnEnabled,
    blockchain: { currentAugurTimestamp },
  } = AppStatus.get();
  const autoFailOrder = zeroXStatus === ZEROX_STATUSES.ERROR;
  const market: Getters.Markets.MarketInfo = marketInfos[marketId];
  if (!tradeInProgress || !market || outcomeId == null) {
    return console.error(
      `required parameters not found for market ${marketId} outcome ${outcomeId}`
    );
  }

  // If GSN is enabled no need to call the below since this will be handled by the proxy contract during initalization
  let needsApproval = false;

  if (!gsnEnabled) {
    needsApproval = createBigNumber(allowance).lt(
      tradeInProgress.totalCost.value
    );
  }

  if (needsApproval) await approveToTrade();
  // we need to make sure approvals went through before doing trade / the rest of this function
  const userShares = createBigNumber(tradeInProgress.shareCost || 0, 10);

  const displayPrice = tradeInProgress.limitPrice;
  const displayAmount = tradeInProgress.numShares;
  const orderType = tradeInProgress.side === BUY ? 0 : 1;
  const expirationTime = tradeInProgress.expirationTime
    ? createBigNumber(tradeInProgress.expirationTime)
    : undefined;
  const tradeGroupId = generatePendingOrderId(
    displayAmount,
    displayPrice,
    outcomeId,
    marketId,
    market.tickSize,
    market.minPrice
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
        creationTime: convertUnixToFormattedDate(currentAugurTimestamp),
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
    tradeGroupId
  ).catch(err => {
    console.log(err);
    const { setModal } = AppStatus.actions;
    setModal({
      type: MODAL_ERROR,
      error: err.message ? err.message : JSON.stringify(err),
    });
    console.log('placeTradeCatch failure');
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
