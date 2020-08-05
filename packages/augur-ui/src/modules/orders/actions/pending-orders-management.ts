import { UIOrder } from 'modules/types';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { isTransactionConfirmed } from 'modules/contracts/actions/contractCalls';
import {
  convertDisplayAmountToOnChainAmount,
  convertDisplayPriceToOnChainPrice,
} from '@augurproject/utils';
import { createBigNumber } from 'utils/create-big-number';
import { TransactionMetadataParams } from '@augurproject/contract-dependencies-ethers';
import { generateTxParameterId } from 'utils/generate-tx-parameter-id';
import { AppState } from 'appStore';

export const ADD_PENDING_ORDER = 'ADD_PENDING_ORDER';
export const REMOVE_PENDING_ORDER = 'REMOVE_PENDING_ORDER';
export const UPDATE_PENDING_ORDER = 'UPDATE_PENDING_ORDER';

export const addPendingOrder = (pendingOrder: UIOrder, marketId: string) =>
  addPendingOrderWithBlockNumber(pendingOrder, marketId);

export const removePendingOrder = (id: string, marketId: string) => ({
  type: REMOVE_PENDING_ORDER,
  data: { id, marketId },
});

export const updatePendingOrderStatus = (
  id: string,
  marketId: string,
  status: string,
  hash: string
) => updatePendingOrderStatusWithBlockNumber(id, marketId, status, hash);

export const addPendingOrderWithBlockNumber = (
  pendingOrder: UIOrder,
  marketId: string
) => (dispatch: ThunkDispatch<void, any, Action>, getState: () => AppState) => {
  const { blockchain } = getState();
  pendingOrder.blockNumber = blockchain.currentBlockNumber;

  dispatch({
    type: ADD_PENDING_ORDER,
    data: {
      pendingOrder,
      marketId,
    },
  });
};

const updatePendingOrderStatusWithBlockNumber = (
  id: string,
  marketId: string,
  status: string,
  hash: string
) => (dispatch: ThunkDispatch<void, any, Action>, getState: () => AppState) => {
  const { blockchain } = getState();
  const blockNumber = blockchain.currentBlockNumber;

  dispatch({
    type: UPDATE_PENDING_ORDER,
    data: { id, marketId, status, hash, blockNumber },
  });
};

export const loadPendingOrdersTransactions = (pendingOrders: UIOrder[]) => (
  dispatch: ThunkDispatch<void, any, Action>
) => {
  if (!pendingOrders || Object.keys(pendingOrders).length === 0) return;
  Object.keys(pendingOrders).map(async marketId => {
    const orders = pendingOrders[marketId];
    if (!orders || orders.length === 0) return;
    orders.map(async (o: UIOrder) => {
      if (!o.hash) return;
      const confirmed = await isTransactionConfirmed(o.hash);
      confirmed
        ? dispatch(removePendingOrder(o.id, marketId))
        : dispatch(addPendingOrder(o, marketId));
    });
  });
};

export const constructPendingOrderid = (
  onChainPrice: string,
  onchainOutcome: string,
  market: string,
  orderType: string,
) => {
  const params: TransactionMetadataParams = {
    price: createBigNumber(onChainPrice).toString(16),
    outcome: onchainOutcome,
    market,
    orderType,
  };
  return generateTxParameterId(params);
};

export const generatePendingOrderId = (
  price: string,
  outcome: string,
  marketId: string,
  tickSize: string,
  minPrice: string,
  orderType: string,
) => {
  const bnTickSize = createBigNumber(tickSize);
  const bnMinPrice = createBigNumber(minPrice);
  const bnPrice = createBigNumber(price);
  const onChainPrice = convertDisplayPriceToOnChainPrice(
    bnPrice,
    bnMinPrice,
    bnTickSize
  );
  const hexOutcome = `0x0${outcome}`;
  const hexOrderType = `0x0${orderType}`;

  const params: TransactionMetadataParams = {
    price: onChainPrice.toString(16),
    outcome: hexOutcome,
    market: marketId,
    orderType: hexOrderType,
  };
  return generateTxParameterId(params);
};
