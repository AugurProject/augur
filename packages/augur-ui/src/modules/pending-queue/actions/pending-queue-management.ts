import { BaseAction, CreateMarketData } from "modules/types";
import { TransactionMetadata } from "contract-dependencies-ethers/build";
import { isTransactionConfirmed, transactionConfirmations } from 'modules/contracts/actions/contractCalls';
import { TXEventName } from '@augurproject/sdk';
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";
import { TRANSACTIONS, CANCELORDER, TX_CHECK_BLOCKNUMBER_LIMIT } from "modules/common/constants";
import { AppState } from "appStore";

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
  hash: string = null,
  info?: TransactionMetadata,
): BaseAction => (dispatch: ThunkDispatch<void, any, Action>) => {
  dispatch(addPendingDataWithBlockNumber(
    methodCall,
    TRANSACTIONS,
    status,
    hash,
    info,
  ));
  };


export const removePendingTransaction = (
  methodCall: string,
): BaseAction => removePendingData(methodCall, TRANSACTIONS);

export const addPendingData = (
  pendingId: string,
  queueName: string,
  status: string,
  hash: string,
  info?: CreateMarketData,
): BaseAction => (dispatch: ThunkDispatch<void, any, Action>) => {
    dispatch(addPendingDataWithBlockNumber(
      pendingId,
      queueName,
      status,
      hash,
      info,
  ));
  }

const addPendingDataWithBlockNumber = (
  pendingId: string,
  queueName: string,
  status: string,
  hash: string,
  info?: CreateMarketData | TransactionMetadata,
): BaseAction => (dispatch: ThunkDispatch<void, any, Action>, getState: () => AppState) => {
  const { blockchain } = getState();
  const blockNumber = blockchain.currentBlockNumber;
    dispatch({
      type: ADD_PENDING_DATA,
      data: {
        pendingId,
        queueName,
        status,
        hash,
        info,
        blockNumber,
      },
    });
};

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

export const addCanceledOrder = (orderId: string, status: string, hash: string) => (dispatch: ThunkDispatch<void, any, Action>) => {
  dispatch(addPendingData(orderId, CANCELORDER, status, hash));
}

export const removeCanceledOrder = (orderId: string) => (dispatch: ThunkDispatch<void, any, Action>) =>
  dispatch(removePendingData(orderId, CANCELORDER));

interface PendingItem {
  queueName: string;
  pendingId: string;
  status: string;
  blockNumber: number;
  hash: string;
  parameters?: any;
  data: CreateMarketData;
}

export const findAndSetTransactionsTimeouts = (blockNumber: number) => (dispatch: ThunkDispatch<void, any, Action>, getState: () => AppState) => {
  const { pendingQueue } = getState();
  const pending = TXEventName.Pending;
  const topBlockNumber = blockNumber - TX_CHECK_BLOCKNUMBER_LIMIT;
  const pendingItems: PendingItem[] = Object.keys(pendingQueue).reduce(
    (p, queueName) =>
      p.concat(Object.keys(pendingQueue[queueName]).map(
        pendingId => ({queueName, pendingId, ...pendingQueue[queueName][pendingId]}
      )).filter(pendingItem =>
        pendingItem.status === pending
          && pendingItem.hash
          && pendingItem.blockNumber < topBlockNumber
          )),
    [] as PendingItem[]
  );
  pendingItems.forEach(async queueItem => {
    const confirmations = await transactionConfirmations(queueItem.hash);
    if (confirmations === undefined) {
      dispatch(addPendingData(queueItem.pendingId,
        queueItem.queueName,
        TXEventName.Failure,
        queueItem.hash,
        queueItem?.data));
    } else if (confirmations > 0) {
      dispatch(addPendingData(queueItem.pendingId,
        queueItem.queueName,
        TXEventName.Success,
        queueItem.hash,
        queueItem?.data));
    }
  });
}
