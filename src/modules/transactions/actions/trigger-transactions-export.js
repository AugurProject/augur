import { loadAccountHistory } from 'modules/auth/actions/load-account-history';
import { selectTransactions } from 'modules/transactions/selectors/transactions';

export const UPDATE_WILL_EXPORT_TRANSACTIONS = 'UPDATE_WILL_EXPORT_TRANSACTIONS';

export const triggerTransactionsExport = () => (dispatch, getState) => {
  const { transactionsLoading, transactionsOldestLoadedBlock, loginAccount } = getState();
  const loadedAllTransactions = transactionsOldestLoadedBlock === loginAccount.registerBlockNumber;
  let willExportTransactions = false;

  if (!transactionsLoading && loadedAllTransactions) {
    // trigger download
    const transactions = selectTransactions(getState());
    const transactionsDataString = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(transactions));
    const a = document.createElement('a');

    a.setAttribute('href', transactionsDataString);
    a.setAttribute('download', 'AugurTransactions.json');
    a.click();
  } else {
    // trigger load all transactions and set the state of willExportTransactions to true.
    dispatch(loadAccountHistory(true));
    willExportTransactions = true;
  }
  // return the action to update willExportTransactions
  dispatch(updateWillExportTransactions(willExportTransactions));
};

export function updateWillExportTransactions(willExportTransactions) {
  return {
    type: UPDATE_WILL_EXPORT_TRANSACTIONS,
    data: {
      willExportTransactions
    }
  };
}
