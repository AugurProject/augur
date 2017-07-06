import { UPDATE_WILL_EXPORT_TRANSACTIONS } from 'modules/transactions/actions/trigger-transactions-export';

const DEFAULT_STATE = false;

export default function (willExportTransactions = DEFAULT_STATE, action) {
  switch (action.type) {
    case UPDATE_WILL_EXPORT_TRANSACTIONS:
      return action.data.willExportTransactions;

    default:
      return willExportTransactions;
  }
}
