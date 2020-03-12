import { BaseAction, CreateMarketData } from "modules/types";
import { TransactionMetadata } from "contract-dependencies-ethers/build";
import { isTransactionConfirmed } from 'modules/contracts/actions/contractCalls';
import { TXEventName } from '@augurproject/sdk';
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";
import { TRANSACTIONS, CANCELORDER } from "modules/common/constants";

export const ADD_PENDING_DATA = "ADD_PENDING_DATA";
export const REMOVE_PENDING_DATA = "REMOVE_PENDING_DATA";
export const REMOVE_PENDING_DATA_BY_HASH = 'REMOVE_PENDING_DATA_BY_HASH';

export const loadPendingQueue = (pendingQueue: any) => (
  dispatch: ThunkDispatch<void, any, Action>
) => {
  if (!pendingQueue) return;
  Object.keys(pendingQueue).map(async queue => {
    const data = pendingQueue[queue];
    if (!data) return;
    Object.keys(data).map(async (d: any) => {
      const pendingData = data[d];
      if (!pendingData.pendingId || !pendingData.hash) return;
      if (pendingData.status === TXEventName.Failure) dispatch(addPendingData(d, queue, pendingData.status, pendingData.hash, pendingData.data));;
      const confirmed = await isTransactionConfirmed(pendingData.hash);
      confirmed
        ? dispatch(removePendingData(d, queue))
      : dispatch(addPendingData(d, queue, pendingData.status, pendingData.hash, pendingData.data));
    });
  });
};

export const addUpdatePendingTransaction = (
  methodCall: string,
  status: string,
  blockNumber: number = 0,
  hash: string = null,
  info?: TransactionMetadata,
): BaseAction => ({
  type: ADD_PENDING_DATA,
  data: {
    pendingId: methodCall,
    queueName: TRANSACTIONS,
    blockNumber,
    status,
    hash,
    info
  },
});

export const removePendingTransaction = (
  methodCall: string,
): BaseAction => removePendingData(methodCall, TRANSACTIONS);

export const addPendingData = (
  pendingId: string,
  queueName: string,
  status: string,
  hash: string,
  info?: CreateMarketData,
): BaseAction => ({
  type: ADD_PENDING_DATA,
  data: {
    pendingId,
    queueName,
    status,
    hash,
    info
  },
});

export const removePendingData = (
  pendingId: string,
  queueName: string,
): BaseAction => ({
  type: REMOVE_PENDING_DATA,
  data: { pendingId, queueName },
});

export const removePendingDataByHash = (
  hash: string,
  queueName: string,
): BaseAction => ({
  type: REMOVE_PENDING_DATA_BY_HASH,
  data: { hash, queueName },
});

export const addCanceledOrder = (orderId: string, status: string, hash: string) => (dispatch: ThunkDispatch<void, any, Action>) =>
  dispatch(addPendingData(orderId, CANCELORDER, status, hash));

export const removeCanceledOrder = (orderId: string) => (dispatch: ThunkDispatch<void, any, Action>) =>
  dispatch(removePendingData(orderId, CANCELORDER));
