import { BaseAction, UIOrder, CreateMarketData } from "modules/types";
import { isTransactionConfirmed } from 'modules/contracts/actions/contractCalls';

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
      if (!pendingData.id) return;
      const confirmed = await isTransactionConfirmed(pendingData.id);
      confirmed
        ? dispatch(removePendingData(d, queue))
      : dispatch(addPendingData(d, queue, pendingData.status, pendingData.data));
    });
  });
};

export const addPendingData = (
  pendingId: string,
  queueName: string,
  status: string,
  info?: CreateMarketData,
): BaseAction => ({
  type: ADD_PENDING_DATA,
  data: {
    pendingId,
    queueName,
    status,
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
