import { addCanceledOrder, removeCanceledOrder } from 'modules/orders/actions/update-order-status';
import { TXStatus } from '@augurproject/sdk/build/events';
import { PUBLICTRADE, CANCELORDER, TX_ORDER_ID, TX_MARKET_ID, TX_TRADE_GROUP_ID } from 'modules/common/constants';
import { UIOrder } from 'modules/types';
import { convertTransactionOrderToUIOrder } from './transaction-conversions';
import { addPendingOrder, updatePendingOrderStatus, removePendingOrder } from 'modules/orders/actions/pending-orders-management';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { AppState } from 'store';
import { MarketInfo } from '@augurproject/sdk/build/state/getter/Markets';
import { TXEventName } from '@augurproject/sdk/build';

export const addUpdateTransaction = (txStatus: TXStatus) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const { status, transaction, hash } = txStatus;
  if (transaction) {
    const methodCall = transaction.name.toUpperCase();
    switch (methodCall) {
      case PUBLICTRADE: {
        const tradeGroupId = transaction.params[TX_TRADE_GROUP_ID];
        const marketId = transaction.params[TX_MARKET_ID];
        if (!hash && status === TXEventName.AwaitingSigning) {
          const { marketInfos } = getState();
          const market = marketInfos[marketId];
          return addOrder(txStatus, market, dispatch);
        }
        dispatch(updatePendingOrderStatus(tradeGroupId, marketId, status));
        if (status === TXEventName.Success) {
          dispatch(removePendingOrder(tradeGroupId, marketId));
        }
        break;
      }
      case CANCELORDER: {
        const orderId = transaction.params[TX_ORDER_ID];
        dispatch(addCanceledOrder(orderId, status));
        if (status === TXEventName.Success) {
          dispatch(removeCanceledOrder(orderId));
        }
        break;
      }
      default:
        return null;
    }
  }
};

function addOrder(tx: TXStatus, market: MarketInfo, dispatch) {
  if (!market) return console.log(`Could not find ${market.id} to process transaction`)
  const order: UIOrder = convertTransactionOrderToUIOrder(tx.transaction.params, tx.status, market);
  if (!order) return console.log(`Could not process order to add pending order for market ${market.id}`);
  dispatch(addPendingOrder(order, market.id));
}
