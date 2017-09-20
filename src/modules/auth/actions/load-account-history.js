import async from 'async';
import { clearReports } from 'modules/reports/actions/update-reports';
import { loadAccountTrades } from 'modules/my-positions/actions/load-account-trades';
import { loadBidsAsksHistory } from 'modules/bids-asks/actions/load-bids-asks-history';
import { loadCreateMarketHistory } from 'modules/create-market/actions/load-create-market-history';
import { loadFundingHistory } from 'modules/account/actions/load-funding-history';
import { loadReportingHistory } from 'modules/my-reports/actions/load-reporting-history';
import syncBranch from 'modules/branch/actions/sync-branch';
import { updateTransactionsOldestLoadedBlock } from 'modules/transactions/actions/update-transactions-oldest-loaded-block';
import { updateTransactionsLoading } from 'modules/transactions/actions/update-transactions-loading';

export const loadAccountHistory = (loadAllHistory, triggerTransactionsExport) => (dispatch, getState) => {
  const { transactionsOldestLoadedBlock, blockchain, loginAccount, transactionsData } = getState();
  const initialTransactionCount = Object.keys(transactionsData || {}).length;

  // Adjust these to constrain the loading boundaries
  const blockChunkSize = 5760; // ~1 Day based on 15 second blocks
  const transactionSoftLimit = 40; // Used if blockChunkSize does not load # of transactions up to the soft limit (approximately two UI pages of transactions)

  const registerBlock = loginAccount.registerBlockNumber;
  const oldestLoadedBlock = transactionsOldestLoadedBlock || blockchain.currentBlockNumber;

  if (!transactionsOldestLoadedBlock) { // Denotes nothing has loaded yet
    dispatch(clearReports());
    dispatch(syncBranch());
  }

  if (registerBlock && oldestLoadedBlock && oldestLoadedBlock !== registerBlock) {
    const options = {};
    if (!loadAllHistory) {
      options.toBlock = oldestLoadedBlock === blockchain.currentBlockNumber ? oldestLoadedBlock : oldestLoadedBlock - 1;

      const prospectiveFromBlock = options.toBlock - blockChunkSize;
      options.fromBlock = prospectiveFromBlock < registerBlock ?
        registerBlock :
        prospectiveFromBlock;
    }

    const constraints = {
      loadAllHistory,
      initialTransactionCount,
      transactionSoftLimit,
      registerBlock,
      blockChunkSize,
      triggerTransactionsExport
    };

    loadTransactions(dispatch, getState, options, constraints, loadMoreTransactions);
  }
};

export function loadMoreTransactions(dispatch, getState, options, constraints) {
  if (!constraints.loadAllHistory) {
    const { transactionsData } = getState();

    const updatedTransactionsCount = Object.keys(transactionsData || {}).length;
    const updatedOptions = {
      ...options
    };

    dispatch(updateTransactionsOldestLoadedBlock(options.fromBlock));

    if (!(updatedTransactionsCount - constraints.initialTransactionCount >= constraints.transactionSoftLimit) && options.fromBlock !== constraints.registerBlock) {
      updatedOptions.toBlock = updatedOptions.fromBlock - 1;

      const prospectiveFromBlock = updatedOptions.toBlock - constraints.blockChunkSize;
      updatedOptions.fromBlock = prospectiveFromBlock < constraints.registerBlock ?
        constraints.registerBlock :
        prospectiveFromBlock;

      loadTransactions(dispatch, getState, updatedOptions, constraints, loadMoreTransactions);
    } else {
      dispatch(updateTransactionsLoading(false));
      if (constraints.triggerTransactionsExport) {
        dispatch(constraints.triggerTransactionsExport());
      }
    }

    return;
  }

  dispatch(updateTransactionsOldestLoadedBlock(constraints.registerBlock));
  dispatch(updateTransactionsLoading(false));
  constraints.triggerTransactionsExport && dispatch(constraints.triggerTransactionsExport());
}

function loadTransactions(dispatch, getState, options, constraints, cb) {
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
    cb(dispatch, getState, options, constraints);
  });
}
