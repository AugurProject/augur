import {
  UPDATE_TRANSACTIONS_DATA,
  DELETE_TRANSACTION,
  DELETE_TRANSACTIONS_WITH_TRANSACTION_HASH,
  CLEAR_TRANSACTION_DATA
} from "modules/transactions/actions/update-transactions-data";
import { CLEAR_LOGIN_ACCOUNT } from "modules/auth/actions/update-login-account";
import { RESET_STATE } from "modules/app/actions/reset-state";
import { PENDING } from "modules/common-elements/constants";

const DEFAULT_STATE = {};

export default function(transactionsData = DEFAULT_STATE, { type, data }) {
  switch (type) {
    case UPDATE_TRANSACTIONS_DATA:
      return Object.keys(data.updatedTransactionsData).reduce(
        (p, transactionId) => {
          p[transactionId] = {
            ...transactionsData[transactionId],
            ...data.updatedTransactionsData[transactionId],
            id: transactionId
          };
          return p;
        },
        { ...transactionsData }
      );
    case DELETE_TRANSACTIONS_WITH_TRANSACTION_HASH:
      return Object.keys(transactionsData).reduce((p, transactionId) => {
        if (
          data.transactionHash !== (transactionsData[transactionId] || {}).hash
        ) {
          p[transactionId] = transactionsData[transactionId];
        }
        return p;
      }, {});
    case DELETE_TRANSACTION:
      return Object.keys(transactionsData).reduce((p, transactionId) => {
        if (data.transactionId !== transactionId) {
          p[transactionId] = transactionsData[transactionId];
        }
        return p;
      }, {});
    case CLEAR_TRANSACTION_DATA:
      return Object.keys(transactionsData).reduce((p, transactionId) => {
        if (transactionsData[transactionId].status === PENDING) {
          p[transactionId] = transactionsData[transactionId];
        }
        return p;
      }, {});
    case RESET_STATE:
    case CLEAR_LOGIN_ACCOUNT:
      return DEFAULT_STATE;
    default:
      return transactionsData;
  }
}
