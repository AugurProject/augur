import async from 'async';
import { clearReports } from 'modules/reports/actions/update-reports';
import { loadAccountTrades } from 'modules/my-positions/actions/load-account-trades';
import { loadBidsAsksHistory } from 'modules/bids-asks/actions/load-bids-asks-history';
import { loadCreateMarketHistory } from 'modules/create-market/actions/load-create-market-history';
import { loadFundingHistory, loadTransferHistory } from 'modules/account/actions/load-funding-history';
import { loadReportingHistory } from 'modules/my-reports/actions/load-reporting-history';
import { syncBranch } from 'modules/branch/actions/sync-branch';
import { updateTransactionsOldestLoadedBlock } from 'modules/transactions/actions/update-transactions-oldest-loaded-block';
import { updateTransactionsLoading } from 'modules/transactions/actions/update-transactions-loading';

export const loadAccountHistory = loadAllHistory => (dispatch, getState) => {
  const { transactionsOldestLoadedBlock, blockchain, loginAccount, transactionsData } = getState();
  const initialTransactionCount = Object.keys(transactionsData || {}).length;

  // Adjust these to constrain the effective loading amount
  const blockChunkSize = 5760; // ~1 Day based on 15 second blocks
  const transactionSoftLimit = 100; // Used if blockChunkSize does not load # of transactions up to the soft limit

  const registerBlock = loginAccount.registerBlockNumber;
  const oldestLoadedBlock = transactionsOldestLoadedBlock || blockchain.currentBlockNumber;

  if (!transactionsOldestLoadedBlock) { // Denotes nothing has loaded yet
    dispatch(clearReports());
    dispatch(syncBranch());
  }

  if (registerBlock && oldestLoadedBlock && oldestLoadedBlock !== registerBlock) {

    const options = {};
    if (!loadAllHistory) {
      options.toBlock = oldestLoadedBlock - 1;

      const prospectiveFromBlock = options.toBlock - blockChunkSize;
      options.fromBlock = prospectiveFromBlock < registerBlock ?
        registerBlock :
        prospectiveFromBlock;
    }

    const callback = (options) => {
      if (!loadAllHistory) {
        const { transactionsData } = getState();
        const updatedTransactionsCount = Object.keys(transactionsData || {}).length;
        const updatedOptions = {
          ...options
        };

        dispatch(updateTransactionsOldestLoadedBlock(options.fromBlock));

        if (!(updatedTransactionsCount - initialTransactionCount > transactionSoftLimit) && options.fromBlock !== registerBlock) {
          updatedOptions.toBlock = updatedOptions.fromBlock - 1;

          const prospectiveFromBlock = updatedOptions.toBlock - blockChunkSize;
          updatedOptions.fromBlock = prospectiveFromBlock < registerBlock ?
            registerBlock :
            prospectiveFromBlock;

          loadTransactions(dispatch, updatedOptions, callback);
        } else {
          dispatch(updateTransactionsLoading(false));
        }

        return;
      }

      dispatch(updateTransactionsOldestLoadedBlock(oldestLoadedBlock));
      dispatch(updateTransactionsLoading(false));
    };

    loadTransactions(dispatch, options, callback);
  }
};

export function loadTransactions(dispatch, options, cb) {
  dispatch(updateTransactionsLoading(true));

  async.parallel([
    next => dispatch(loadAccountTrades(options, (err) => {
      if (err) next(err);
      next(null);
    })),
    next => dispatch(loadBidsAsksHistory(options, (err) => {
      if (err) next(err);
      next(null);
    })),
    next => dispatch(loadFundingHistory(options, (err) => {
      if (err) next(err);
      next(null);
    })),
    next => dispatch(loadTransferHistory(options, (err) => {
      if (err) next(err);
      next(null);
    })),
    next => dispatch(loadCreateMarketHistory(options, (err) => {
      if (err) next(err);
      next(null);
    })),
    next => dispatch(loadReportingHistory(options, (err) => {
      if (err) next(err);
      next(null);
    }))
  ], (err) => {
    if (err) return console.error('ERROR loadTransactions: ', err);
    cb(options);
  });
}
