import store from "src/store";
import { augur } from "services/augurjs";
import * as notificationLevels from "modules/notifications/constants/notifications";
import setNotificationText from "modules/notifications/actions/set-notification-text";
import { createBigNumber } from "utils/create-big-number";
import makePath from "modules/routes/helpers/make-path";
import { TRANSACTIONS } from "modules/routes/constants/views";
import { PENDING, SUCCESS } from "modules/transactions/constants/statuses";

export const ADD_NOTIFICATION = "ADD_NOTIFICATION";
export const REMOVE_NOTIFICATION = "REMOVE_NOTIFICATION";
export const UPDATE_NOTIFICATION = "UPDATE_NOTIFICATION";
export const CLEAR_NOTIFICATIONS = "CLEAR_NOTIFICATIONS";

export function loadNotifications() {
  return (dispatch, getState) => {
    const { notifications, transactionsData } = store.getState();
    for (let i = 0; i < notifications.length; i++) {
      if (notifications[i].status.toLowerCase() === PENDING) {
        const regex = new RegExp(notifications[i].id, "g");
        Object.keys(transactionsData).some(key => {
          if (
            key.match(regex) !== null &&
            transactionsData[key].status.toLowerCase() === SUCCESS
          ) {
            const transaction =
              transactionsData[key].transactions &&
              transactionsData[key].transactions[0];
            dispatch(
              updateNotification(notifications[i].id, {
                id: notifications[i].id,
                timestamp: transactionsData[key].timestamp.timestamp,
                status: "Confirmed",
                linkPath: makePath(TRANSACTIONS),
                seen: false,
                log: {
                  price: transaction && transaction.price,
                  outcome: transaction && transaction.outcome,
                  amount: transaction && transaction.amount,
                  marketId:
                    transaction && transaction.market && transaction.market.id,
                  quantity: transaction && transaction.quantity
                }
              })
            );
            return true;
          } else if (transactionsData[key].status.toLowerCase() === SUCCESS) {
            const groupedTransactions = transactionsData[key].transactions;
            groupedTransactions.forEach(transaction => {
              if (
                transaction.meta &&
                transaction.meta.txhash === notifications[i].id
              ) {
                dispatch(
                  updateNotification(notifications[i].id, {
                    id: notifications[i].id,
                    timestamp: transaction.creationTime,
                    status: "Confirmed",
                    linkPath: makePath(TRANSACTIONS),
                    seen: false,
                    log: {
                      price: transaction.price,
                      outcome: transaction.meta && transaction.meta.outcome,
                      amount: transaction.amount,
                      marketId: transaction.marketId
                    }
                  })
                );
                return true;
              }
            });
          }
          return false;
        });
      }
    }
  };
}

export function addCriticalNotification(notification) {
  return addNotification({
    level: notificationLevels.CRITICAL,
    ...notification
  });
}

export function addNotification(notification) {
  return (dispatch, getState) => {
    if (notification != null) {
      const { universe } = store.getState();
      const callback = notification => {
        const fullNotification = {
          type: ADD_NOTIFICATION,
          data: {
            notification: {
              seen: false,
              level: notificationLevels.INFO,
              networkId: augur.rpc.getNetworkID(),
              universe: universe.id,
              ...notification
            }
          }
        };
        return fullNotification;
      };
      return dispatch(setNotificationText(notification, callback));
    }
  };
}

export function removeNotification(id) {
  return {
    type: REMOVE_NOTIFICATION,
    data: { id }
  };
}

export function updateNotification(id, notification) {
  return (dispatch, getState) => {
    const callback = notification => {
      const fullNotification = {
        type: UPDATE_NOTIFICATION,
        data: {
          id,
          notification
        }
      };
      return fullNotification;
    };

    // Set notification.params if it is not already set.
    // (This occurs the first time the notification is updated.)
    if (notification && !notification.params) {
      const { notifications } = store.getState();
      for (
        let index = Object.keys(notifications).length - 1;
        index >= 0;
        index--
      ) {
        if (notifications[index].id === notification.id) {
          notification.params = notifications[index].params;
          notification.to = notifications[index].to;
          if (notification.log && notification.log.amount) {
            notification.amount = createBigNumber(
              notifications[index].amount || 0
            )
              .plus(createBigNumber(notification.log.amount))
              .toFixed();
          }
          if (
            notification.log &&
            notifications[index].log &&
            notification.log.eventName !== notifications[index].log.eventName &&
            notifications[index].log.orderId &&
            notification.log.orderId !== notifications[index].log.orderId &&
            notification.log.eventName === "OrderCreated"
          ) {
            return dispatch(
              addNotification({
                id:
                  notification.log.transactionHash +
                  "-" +
                  notification.log.orderId,
                timestamp: notification.timestamp,
                blockNumber: notification.log.blockNumber,
                log: notification.log,
                status: "Confirmed",
                linkPath: makePath(TRANSACTIONS),
                params: notification.params
              })
            );
          }
        }
      }
    }
    return dispatch(setNotificationText(notification, callback));
  };
}
// We clear by 'notification level'.
// This will not surface in the UI just yet.
export function clearNotifications(
  notificationLevel = notificationLevels.INFO
) {
  return {
    type: CLEAR_NOTIFICATIONS,
    data: {
      level: notificationLevel
    }
  };
}
