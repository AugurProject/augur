import {
  addCanceledOrder,
  removeCanceledOrder,
} from 'modules/orders/actions/update-order-status';
import {
  PUBLICTRADE,
  CANCELORDER,
  TX_ORDER_ID,
  TX_MARKET_ID,
  TX_TRADE_GROUP_ID,
  CREATEMARKET,
  CREATECATEGORICALMARKET,
  CREATESCALARMARKET,
  CREATEYESNOMARKET,
  CREATE_MARKET,
  CATEGORICAL,
  SCALAR,
  YES_NO,
  PUBLICCREATEORDER,
  TX_OUTCOME_ID,
  TX_NUM_SHARES,
  TX_DIRECTION,
  TX_ORDER_TYPE,
  BUY,
  SELL,
  ZERO,
} from 'modules/common/constants';
import { UIOrder, CreateMarketData } from 'modules/types';
import { convertTransactionOrderToUIOrder } from './transaction-conversions';
import {
  addPendingOrder,
  updatePendingOrderStatus,
  removePendingOrder,
} from 'modules/orders/actions/pending-orders-management';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { AppState } from 'store';
import {
  Events,
  Getters,
  TXEventName,
  QUINTILLION,
  convertOnChainAmountToDisplayAmount,
} from '@augurproject/sdk';
import {
  addPendingData,
  removePendingData,
} from 'modules/pending-queue/actions/pending-queue-management';
import { convertUnixToFormattedDate } from 'utils/format-date';
import { TransactionMetadataParams } from 'contract-dependencies-ethers/build';
import { generateTxParameterId } from 'utils/generate-tx-parameter-id';
import {
  updateLiqTransactionParamHash,
  updateLiquidityOrderStatus,
  deleteSuccessfulLiquidityOrder,
} from 'modules/orders/actions/liquidity-management';
import { createBigNumber } from 'utils/create-big-number';

export const addUpdateTransaction = (txStatus: Events.TXStatus) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const { eventName, transaction, hash } = txStatus;
  if (transaction) {
    const methodCall = transaction.name.toUpperCase();
    switch (methodCall) {
      case PUBLICCREATEORDER: {
        console.log(JSON.stringify(transaction.params));
        const { marketInfos } = getState();
        const marketId = transaction.params[TX_MARKET_ID];
        const market = marketInfos[marketId];
        setLiquidityOrderStatus(txStatus, market, dispatch);
        if (eventName === TXEventName.Success) {
          deleteLiquidityOrder(txStatus, market, dispatch);
        }
        break;
      }
      case PUBLICTRADE: {
        const tradeGroupId = transaction.params[TX_TRADE_GROUP_ID];
        const marketId = transaction.params[TX_MARKET_ID];
        const { marketInfos } = getState();
        const market = marketInfos[marketId];
        if (!hash && eventName === TXEventName.AwaitingSigning) {
          return addOrder(txStatus, market, dispatch);
        }
        dispatch(
          updatePendingOrderStatus(tradeGroupId, marketId, eventName, hash)
        );
        if (eventName === TXEventName.Success) {
          dispatch(removePendingOrder(tradeGroupId, marketId));
        }
        break;
      }
      case CREATEMARKET:
      case CREATECATEGORICALMARKET:
      case CREATESCALARMARKET:
      case CREATEYESNOMARKET: {
        const id = generateTxParameterId(transaction.params);
        const { blockchain } = getState();
        const data = createMarketData(
          transaction.params,
          id,
          hash,
          blockchain.currentAugurTimestamp * 1000,
          methodCall
        );
        dispatch(addPendingData(id, CREATE_MARKET, eventName, hash, data));
        if (hash)
          dispatch(
            updateLiqTransactionParamHash({ txParamHash: id, txHash: hash })
          );
        if (hash && eventName === TXEventName.Success) {
          dispatch(removePendingData(id, CREATE_MARKET));
        }
        if (hash && eventName === TXEventName.Failure) {
          // if tx fails, revert hash to generated tx id, for retry
          dispatch(
            updateLiqTransactionParamHash({ txParamHash: hash, txHash: id })
          );
        }
        break;
      }
      case CANCELORDER: {
        const orderId = transaction.params[TX_ORDER_ID];
        dispatch(addCanceledOrder(orderId, eventName));
        if (eventName === TXEventName.Success) {
          dispatch(removeCanceledOrder(orderId));
        }
        break;
      }
      default:
        return null;
    }
  }
};

function createMarketData(
  params: TransactionMetadataParams,
  id: string,
  hash: string,
  currentTimestamp: number,
  methodCall: string
): CreateMarketData {
  const extraInfo = JSON.parse(params._extraInfo);
  let data: CreateMarketData = {
    hash,
    pendingId: id,
    description: extraInfo.description,
    pending: true,
    endTime: convertUnixToFormattedDate(params._endTime),
    recentlyTraded: convertUnixToFormattedDate(currentTimestamp),
    creationTime: convertUnixToFormattedDate(currentTimestamp),
    txParams: params,
    marketType: YES_NO,
  };

  if (methodCall === CREATECATEGORICALMARKET) {
    data.marketType = CATEGORICAL;
  } else if (methodCall === CREATESCALARMARKET) {
    data.marketType = SCALAR;
  }
  return data;
}

function addOrder(
  tx: Events.TXStatus,
  market: Getters.Markets.MarketInfo,
  dispatch
) {
  if (!market)
    return console.log(`Could not find ${market.id} to process transaction`);
  const order: UIOrder = convertTransactionOrderToUIOrder(
    tx.hash,
    tx.transaction.params,
    tx.eventName,
    market
  );
  if (!order)
    return console.log(
      `Could not process order to add pending order for market ${market.id}`
    );
  dispatch(addPendingOrder(order, market.id));
}

function deleteLiquidityOrder(
  tx: Events.TXStatus,
  market: Getters.Markets.MarketInfo,
  dispatch
) {
  const properties = processLiquidityOrder(tx, market);
  dispatch(
    deleteSuccessfulLiquidityOrder({
      txParamHash: properties.transactionHash,
      ...properties,
    })
  );
}

function setLiquidityOrderStatus(
  tx: Events.TXStatus,
  market: Getters.Markets.MarketInfo,
  dispatch
) {
  const properties = processLiquidityOrder(tx, market);
  dispatch(
    updateLiquidityOrderStatus({
      txParamHash: properties.transactionHash,
      ...properties,
      eventName: tx.eventName,
      hash: tx.hash,
    })
  );
}

function processLiquidityOrder(
  tx: Events.TXStatus,
  market: Getters.Markets.MarketInfo
) {
  const { transaction } = tx;
  const { transactionHash, tickSize } = market;
  const outcomeId = transaction.params[TX_OUTCOME_ID];
  const orderType = transaction.params[TX_ORDER_TYPE];
  const attoShares = transaction.params[TX_NUM_SHARES];
  const quantity = convertOnChainAmountToDisplayAmount(
    createBigNumber(attoShares),
    createBigNumber(tickSize)
  ).toString();
  const type = orderType.eq(ZERO) ? BUY : SELL;
  return { outcomeId, type, quantity, transactionHash };
}
