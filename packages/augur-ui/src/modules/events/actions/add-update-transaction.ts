import { addCanceledOrder } from 'modules/orders/actions/update-order-status';
import { TXStatus } from '@augurproject/sdk/build/events';
import { PUBLICTRADE, CANCELORDER, ORDER_ID, TRADE_GROUP_ID } from 'modules/common/constants';
import { addPendingOrderCancellation, addPendingCreateOrder } from 'modules/pending-queue/actions/pending-queue-management';
import { UIOrder } from 'modules/types';
import { convertOnChainOrderToPlaceTradeParams } from './transaction-conversions';

export const addUpdateTransaction = (txStatus: TXStatus) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const { currentBlockNumber } = getState().blockchain;
  const { status, transaction, hash } = txStatus;
  if (transaction) {
    const methodCall = transaction.name.toUpperCase();
    switch (methodCall) {
      case PUBLICTRADE: {
        // create open order
        const tradeGroupId = transaction.params[TRADE_GROUP_ID];
        const order: UIOrder = convertOnChainOrderToPlaceTradeParams(transaction.params);
        dispatch(addPendingCreateOrder(tradeGroupId, status, order, currentBlockNumber));
        break;
      }
      case CANCELORDER: {
        const orderId = transaction.params[ORDER_ID];
        dispatch(addCanceledOrder(orderId, status));
        dispatch(addPendingOrderCancellation(orderId, status, currentBlockNumber));
        break;
      }
      default:
        return null;
    }
  }
};
