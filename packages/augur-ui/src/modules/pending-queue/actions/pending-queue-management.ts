import { BaseAction, CreateMarketData } from "modules/types";
import { isTransactionConfirmed } from 'modules/contracts/actions/contractCalls';
import { TXEventName } from '@augurproject/sdk';
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";

export const ADD_PENDING_DATA = "ADD_PENDING_DATA";
export const REMOVE_PENDING_DATA = "REMOVE_PENDING_DATA";

export const loadPendingQueue = (pendingQueue: any) => (
  dispatch: ThunkDispatch<void, any, Action>
) => {
  if (!pendingQueue) return;
  Object.keys(pendingQueue).map(async queue => {
    const data = pendingQueue[queue];
    if (!data) return;
    Object.keys(data).map(async (d: any) => {
      const pendingData = data[d];
      if (!pendingData.pendingId) return;
      if (pendingData.status === TXEventName.Failure) dispatch(addPendingData(d, queue, pendingData.status, pendingData.hash, pendingData.data));;
      const confirmed = await isTransactionConfirmed(pendingData.hash);
      confirmed
        ? dispatch(removePendingData(d, queue))
      : dispatch(addPendingData(d, queue, pendingData.status, pendingData.hash, pendingData.data));
    });
  });
};

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
