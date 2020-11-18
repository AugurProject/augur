import { BigNumber, createBigNumber } from 'utils/create-big-number';
import {
  BUY,
  INVALID_OUTCOME_ID,
  MODAL_ERROR,
  PUBLICTRADE,
  ZEROX_STATUSES,
} from 'modules/common/constants';
import {
  approveToTrade,
  placeTrade,
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
import { AppStatus } from 'modules/app/store/app-status';
import { Markets } from 'modules/markets/store/markets';
import { updateAlert } from 'modules/alerts/actions/alerts';
import { checkAccountApproval } from 'modules/auth/actions/approve-account';
import { augurSdk } from 'services/augursdk';

export const placeMarketTrade = async ({
  marketId,
  outcomeId,
  tradeInProgress,
  doNotCreateOrders,
  postOnly,
}: any) => {
  if (!marketId) return null;
  const { marketInfos } = Markets.get();
  // numFills is 0 and zerox mesh client has error auto fail processing order label
  const {
    loginAccount: { address, affiliate, tradingApproved },
    zeroXStatus,
    blockchain: { currentAugurTimestamp },
  } = AppStatus.get();
  const autoFailOrder = zeroXStatus === ZEROX_STATUSES.ERROR;
  const market: Getters.Markets.MarketInfo = marketInfos[marketId];
  if (!tradeInProgress || !market || outcomeId == null) {
    return console.error(
      `required parameters not found for market ${marketId} outcome ${outcomeId}`
    );
  }

  await checkAccountApproval();

  if (!tradingApproved) await approveToTrade(address, affiliate);
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
  );

  const Augur = augurSdk ? augurSdk.get() : undefined;

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
          timestamp: AppStatus.get().blockchain.currentAugurTimestamp * 1000,
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
              createBigNumber(tickSize),
              Augur.precision,
            ),
            marketId,
          },
        };
        updateAlert(undefined, alert, false);
      }
    })
    .catch(err => {
      console.log(err);
      const { setModal } = AppStatus.actions;
      setModal({
        type: MODAL_ERROR,
        error: err.message ? err.message : JSON.stringify(err),
      });
      updatePendingOrderStatus(
        tradeGroupId,
        marketId,
        TXEventName.Failure,
        null
      );
    });
};
