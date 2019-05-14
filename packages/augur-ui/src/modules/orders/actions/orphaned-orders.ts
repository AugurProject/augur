import { augur } from "services/augurjs";
import logError from "utils/log-error";
import { CONFIRMED, FAILED } from "modules/common-elements/constants";
import { addAlert, updateAlert } from "modules/alerts/actions/alerts";
import { selectCurrentTimestampInSeconds } from "src/select-state";

export const ADD_ORPHANED_ORDER = "ADD_ORPHANED_ORDER";
export const REMOVE_ORPHANED_ORDER = "REMOVE_ORPHANED_ORDER";

export const DISMISS_ORPHANED_ORDER = "DISMISS_ORPHANED_ORDER";
export const CLEAR_ORPHANED_ORDER_DATA = "CLEAR_TRANSACTION_DATA";

export const addOrphanedOrder = (order: any) => ({
  type: ADD_ORPHANED_ORDER,
  data: { order }
});

export const removeOrphanedOrder = (orderId: String) => ({
  type: REMOVE_ORPHANED_ORDER,
  data: { orderId }
});

export const dismissOrphanedOrder = ({ orderId }: any) => ({
  type: DISMISS_ORPHANED_ORDER,
  data: { orderId }
});

export const cancelOrphanedOrder = (
  { orderId, marketId, outcome, orderTypeLabel }: any,
  callback = logError
) => (dispatch: Function, getState: Function) => {
  const { loginAccount } = getState();

  const timestamp = selectCurrentTimestampInSeconds(getState());
  const update = (id: String, status: String) => dispatch(
    updateAlert(id, {
      id,
      timestamp,
      status
    })
  );

  augur.api.CancelOrder.cancelOrder({
    meta: loginAccount.meta,
    _orderId: orderId,
    onSent: (res: any) => {
      // Trigger the alert addition/updates in the callback functions
      // because there is no other way to distinguish between canceling
      // regular orders and orphaned orders.
      dispatch(
        addAlert({
          id: res.hash,
          params: {
            type: "cancelOrphanedOrder"
          },
          timestamp,
          status: "Pending",
          title: "Cancel orphaned order"
        })
      );
    },
    onSuccess: (res: any) => {
      dispatch(removeOrphanedOrder(orderId));
      update(res.hash, CONFIRMED);
      callback(null);
    },
    onFailed: (err: any) => {
      update(orderId, FAILED);
      callback(err);
    }
  });
};

export const clearOrphanedOrderData = () => ({
  type: CLEAR_ORPHANED_ORDER_DATA
});
