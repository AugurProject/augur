import {
  UPDATE_TRANSACTION_STATUS,
  CLEAR_TRANSACTION_STATUS
} from "modules/transactions/actions/update-transactions-status";
import { CLEAR_LOGIN_ACCOUNT } from "modules/account/actions/login-account";
import { RESET_STATE } from "modules/app/actions/reset-state";
import { TransacitonStatus, BaseAction } from "modules/types";

const DEFAULT_STATE: TransacitonStatus = {};

export default function(transactionsStatus: TransacitonStatus = DEFAULT_STATE, action: BaseAction) {
  switch (action.type) {
    case UPDATE_TRANSACTION_STATUS: {
      const { pendingId, transactionHash, status } = action.data;
      return {
        ...transactionsStatus,
        [pendingId]: {
          status,
          transactionHash,
        },
      };
    }
    case CLEAR_TRANSACTION_STATUS:
      delete transactionsStatus[action.data.pendingId];
      return transactionsStatus;
    case RESET_STATE:
    case CLEAR_LOGIN_ACCOUNT:
      return DEFAULT_STATE;
    default:
      return transactionsStatus;
  }
}
