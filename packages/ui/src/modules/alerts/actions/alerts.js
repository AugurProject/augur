import store from "src/store";
import { augur } from "services/augurjs";
import * as constants from "modules/common-elements/constants";
import setAlertText from "modules/alerts/actions/set-alert-text";
import { createBigNumber } from "utils/create-big-number";
import makePath from "modules/routes/helpers/make-path";
import { TRANSACTIONS } from "modules/routes/constants/views";
import { selectCurrentTimestampInSeconds } from "src/select-state";
import { updateAlert as updateAlertAction } from "modules/alerts/actions/alerts";

export const ADD_ALERT = "ADD_ALERT";
export const REMOVE_ALERT = "REMOVE_ALERT";
export const UPDATE_ALERT = "UPDATE_ALERT";
export const CLEAR_ALERTS = "CLEAR_ALERTS";

function packageAlertInfo(alertId, timestamp, transaction) {
  return {
    id: alertId,
    timestamp,
    status: "Confirmed",
    linkPath: makePath(TRANSACTIONS),
    seen: false,
    log: {
      price: transaction && transaction.price,
      outcome: transaction && transaction.outcome,
      amount: transaction && transaction.amount,
      marketId: transaction && transaction.market && transaction.market.id,
      quantity: transaction && transaction.quantity,
      value: transaction && transaction.value
    }
  };
}

export function handleFilledOnly(tradeInProgress = null) {
  return (dispatch, getState) => {
    const { alerts, transactionsData } = store.getState();
    for (let i = 0; i < alerts.length; i++) {
      if (alerts[i].status.toLowerCase() === constants.PENDING) {
        const tradeGroupId = alerts[i].params._tradeGroupId;
        if (
          tradeInProgress &&
          tradeInProgress.tradeGroupId === tradeGroupId &&
          alerts[i].params.type.toUpperCase() ===
            constants.PUBLICFILLBESTORDERWITHLIMIT &&
          alerts[i].description === ""
        ) {
          const difference = createBigNumber(tradeInProgress.numShares).minus(
            tradeInProgress.sharesFilled
          );
          // handle fill only orders alerts updates.
          dispatch(
            updateAlertAction(alerts[i].id, {
              id: alerts[i].id,
              status: "Confirmed",
              timestamp:
                selectCurrentTimestampInSeconds(getState()) || Date.now(),
              seen: false,
              log: {
                noFill: true,
                orderType:
                  alerts[i].params._direction === "0x1"
                    ? constants.BUY
                    : constants.SELL,
                difference: difference.toFixed()
              }
            })
          );
        } else {
          Object.keys(transactionsData).some(key => {
            if (
              transactionsData[key].transactions &&
              transactionsData[key].transactions.length &&
              transactionsData[key].transactions[0].tradeGroupId ===
                tradeGroupId &&
              transactionsData[key].status.toLowerCase() ===
                constants.SUCCESS &&
              alerts[i].params.type.toUpperCase() ===
                constants.PUBLICFILLBESTORDERWITHLIMIT &&
              alerts[i].description === ""
            ) {
              // handle fill only orders alerts updates.
              dispatch(
                updateAlertAction(alerts[i].id, {
                  id: alerts[i].id,
                  status: "Confirmed",
                  timestamp:
                    selectCurrentTimestampInSeconds(getState()) ||
                    transactionsData[key].timestamp.timestamp,
                  seen: false,
                  log: {
                    noFill: true,
                    orderType:
                      alerts[i].params._direction === "0x1"
                        ? constants.BUY
                        : constants.SELL
                  }
                })
              );
              return true;
            }
            return false;
          });
        }
      }
    }
  };
}

export function loadAlerts() {
  return (dispatch, getState) => {
    const { alerts, transactionsData } = store.getState();
    for (let i = 0; i < alerts.length; i++) {
      if (alerts[i].status.toLowerCase() === constants.PENDING) {
        const regex = new RegExp(alerts[i].id, "g");
        const tradeGroupId = alerts[i].params._tradeGroupId;
        Object.keys(transactionsData).some(key => {
          if (
            transactionsData[key].transactions &&
            transactionsData[key].transactions.length &&
            transactionsData[key].transactions[0].tradeGroupId ===
              tradeGroupId &&
            transactionsData[key].status.toLowerCase() === constants.SUCCESS &&
            alerts[i].params.type.toUpperCase() ===
              constants.PUBLICFILLBESTORDERWITHLIMIT &&
            alerts[i].description === ""
          ) {
            // handle fill only orders alerts updates.
            dispatch(
              updateAlertAction(alerts[i].id, {
                id: alerts[i].id,
                status: "Confirmed",
                timestamp:
                  selectCurrentTimestampInSeconds(getState()) ||
                  transactionsData[key].timestamp.timestamp,
                seen: false,
                log: {
                  noFill: true,
                  orderType:
                    alerts[i].params._direction === "0x1"
                      ? constants.BUY
                      : constants.SELL
                }
              })
            );
            return true;
          }
          if (
            key.match(regex) !== null &&
            transactionsData[key].status.toLowerCase() === constants.SUCCESS
          ) {
            const transaction =
              transactionsData[key].transactions &&
              transactionsData[key].transactions[0];
            dispatch(
              updateAlert(
                alerts[i].id,
                packageAlertInfo(
                  alerts[i].id,
                  transactionsData[key].timestamp.timestamp,
                  transaction
                )
              )
            );
            return true;
          } else if (
            alerts[i].params.type.toUpperCase() === constants.CANCELORDER &&
            transactionsData[key].status.toLowerCase() === constants.SUCCESS
          ) {
            const groupedTransactions = transactionsData[key].transactions;
            groupedTransactions.forEach(transaction => {
              if (
                transaction.meta &&
                transaction.meta.canceledTransactionHash === alerts[i].id
              ) {
                dispatch(
                  updateAlert(
                    alerts[i].id,
                    packageAlertInfo(
                      alerts[i].id,
                      transaction.creationTime,
                      transaction
                    )
                  )
                );
                return true;
              }
            });
          } else if (
            transactionsData[key].status.toLowerCase() === constants.SUCCESS
          ) {
            const groupedTransactions = transactionsData[key].transactions;
            groupedTransactions.forEach(transaction => {
              if (
                transaction.meta &&
                transaction.meta.txhash === alerts[i].id
              ) {
                dispatch(
                  updateAlert(
                    alerts[i].id,
                    packageAlertInfo(
                      alerts[i].id,
                      transaction.creationTime,
                      transaction
                    )
                  )
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

export function addCriticalAlert(alert) {
  return addAlert({
    level: constants.CRITICAL,
    ...alert
  });
}

export function addAlert(alert) {
  return (dispatch, getState) => {
    if (alert != null) {
      const { universe } = store.getState();
      const callback = alert => {
        const fullAlert = {
          type: ADD_ALERT,
          data: {
            alert: {
              seen: false,
              level: constants.INFO,
              networkId: augur.rpc.getNetworkID(),
              universe: universe.id,
              ...alert
            }
          }
        };
        return fullAlert;
      };
      return dispatch(setAlertText(alert, callback));
    }
  };
}

export function removeAlert(id) {
  return {
    type: REMOVE_ALERT,
    data: { id }
  };
}

export function updateAlert(id, alert) {
  return (dispatch, getState) => {
    const callback = alert => {
      const fullAlert = {
        type: UPDATE_ALERT,
        data: {
          id,
          alert
        }
      };
      return fullAlert;
    };

    // Set alert.params if it is not already set.
    // (This occurs the first time the alert is updated.)
    if (alert && !alert.params) {
      const { alerts } = store.getState();
      for (let index = Object.keys(alerts).length - 1; index >= 0; index--) {
        if (alerts[index].id === alert.id) {
          alert.params = alerts[index].params;
          alert.to = alerts[index].to;
          if (alert.log && alert.log.amount) {
            alert.amount = createBigNumber(alerts[index].amount || 0)
              .plus(createBigNumber(alert.log.amount))
              .toFixed();
          }
          if (
            alert.log &&
            alerts[index].log &&
            alert.log.eventName !== alerts[index].log.eventName &&
            alerts[index].log.orderId &&
            alert.log.orderId !== alerts[index].log.orderId &&
            alert.log.eventName === "OrderCreated"
          ) {
            return dispatch(
              addAlert({
                id: `${alert.log.transactionHash}-${alert.log.orderId}`,
                timestamp: alert.timestamp,
                blockNumber: alert.log.blockNumber,
                log: alert.log,
                status: "Confirmed",
                linkPath: makePath(TRANSACTIONS),
                params: alert.params
              })
            );
          }
        }
      }
    }
    return dispatch(setAlertText(alert, callback));
  };
}
// We clear by 'alert level'.
// This will not surface in the UI just yet.
export function clearAlerts(alertLevel = constants.INFO) {
  return {
    type: CLEAR_ALERTS,
    data: {
      level: alertLevel
    }
  };
}
