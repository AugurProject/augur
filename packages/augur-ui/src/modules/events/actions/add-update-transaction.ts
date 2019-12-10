import store, { AppState } from 'store';
import {
  addCanceledOrder,
  removeCanceledOrder,
} from 'modules/orders/actions/update-order-status';
import {
  PUBLICTRADE,
  CANCELORDER,
  CANCELORDERS,
  TX_ORDER_ID,
  TX_ORDER_IDS,
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
  PUBLICCREATEORDERS,
  APPROVE,
  DOINITIALREPORT,
  ZERO,
  PREFILLEDSTAKE,
  PUBLICFILLBESTORDER,
  PUBLICFILLORDER,
} from 'modules/common/constants';
import { UIOrder, CreateMarketData } from 'modules/types';
import { convertTransactionOrderToUIOrder } from 'modules/events/actions/transaction-conversions';
import {
  addPendingOrder,
  updatePendingOrderStatus,
  removePendingOrder,
} from 'modules/orders/actions/pending-orders-management';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { AppState } from 'store';
import { Events, Getters, TXEventName } from '@augurproject/sdk';
import {
  addPendingData,
  removePendingData,
} from 'modules/pending-queue/actions/pending-queue-management';
import { convertUnixToFormattedDate } from 'utils/format-date';
import { TransactionMetadataParams } from 'contract-dependencies-ethers/build';
import { generateTxParameterId } from 'utils/generate-tx-parameter-id';
import { updateLiqTransactionParamHash } from 'modules/orders/actions/liquidity-management';
import {
  setLiquidityMultipleOrdersStatus,
  deleteMultipleLiquidityOrders,
  setLiquidityOrderStatus,
  deleteLiquidityOrder,
} from 'modules/events/actions/liquidity-transactions';
import { addAlert, updateAlert } from 'modules/alerts/actions/alerts';
import { getDeconstructedMarketId } from 'modules/create-market/helpers/construct-market-params';
import { orderCreated } from 'services/analytics/helpers';

export const addUpdateTransaction = (txStatus: Events.TXStatus) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const { eventName, transaction, hash } = txStatus;
  if (transaction) {
    const methodCall = transaction.name.toUpperCase();
    const { blockchain, alerts } = getState();

    if (eventName === TXEventName.Failure) {
      const genHash = hash ? hash : generateTxParameterId(transaction.params);
      dispatch(
        addAlert({
          id: genHash,
          uniqueId: genHash,
          params: transaction.params,
          status: eventName,
          timestamp: blockchain.currentAugurTimestamp * 1000,
          name: methodCall,
        })
      );
    } else if (
      hash &&
      eventName === TXEventName.Success &&
      methodCall &&
      methodCall !== '' &&
      methodCall !== CANCELORDER &&
      methodCall !== PUBLICFILLORDER
    ) {
      if (
        methodCall === CREATEMARKET ||
        methodCall === CREATECATEGORICALMARKET ||
        methodCall === CREATEYESNOMARKET ||
        methodCall === CREATESCALARMARKET
      ) {
        dispatch(
          updateAlert(hash, {
            params: transaction.params,
            status: TXEventName.Success,
            timestamp: blockchain.currentAugurTimestamp * 1000,
            name: CREATEMARKET,
          })
        );
      } else {
        dispatch(
          updateAlert(hash, {
            params: transaction.params,
            status: TXEventName.Success,
            toast: methodCall === PUBLICFILLORDER,
            timestamp: blockchain.currentAugurTimestamp * 1000,
            name: methodCall,
          })
        );
      }
    }

    switch (methodCall) {
      case PUBLICCREATEORDERS: {
        const { marketInfos } = getState();
        const marketId = transaction.params[TX_MARKET_ID];
        const market = marketInfos[marketId];
        setLiquidityMultipleOrdersStatus(txStatus, market, dispatch);

        if (eventName === TXEventName.Success) {
          deleteMultipleLiquidityOrders(txStatus, market, dispatch);
        }
        break;
      }
      case PUBLICCREATEORDER: {
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
          const order: UIOrder = convertTransactionOrderToUIOrder(
            txStatus.hash,
            txStatus.transaction.params,
            txStatus.eventName,
            market
          );
          dispatch(orderCreated(marketId, order));
          dispatch(removePendingOrder(tradeGroupId, marketId));
        }
        break;
      }
      case CREATEMARKET:
      case CREATECATEGORICALMARKET:
      case CREATESCALARMARKET:
      case CREATEYESNOMARKET: {
        const id = getDeconstructedMarketId(transaction.params);
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
      case CANCELORDERS: {
        const orderIds = transaction.params[TX_ORDER_IDS];
        orderIds.map(id => dispatch(addCanceledOrder(id, eventName)));
        if (eventName === TXEventName.Success) {
          orderIds.map(id => dispatch(removeCanceledOrder(id)));
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

  const { blockchain } = store.getState() as AppState;

  dispatch(
    addPendingOrder(
      {
        ...order,
        creationTime: convertUnixToFormattedDate(
          blockchain.currentAugurTimestamp
        ),
      },
      market.id
    )
  );
}
