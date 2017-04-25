import async from 'async';
import { clearReports } from 'modules/reports/actions/update-reports';
import { loadAccountTrades } from 'modules/my-positions/actions/load-account-trades';
import { loadBidsAsksHistory } from 'modules/bids-asks/actions/load-bids-asks-history';
import { loadCreateMarketHistory } from 'modules/create-market/actions/load-create-market-history';
import { loadFundingHistory, loadTransferHistory } from 'modules/account/actions/load-funding-history';
import { loadReportingHistory } from 'modules/my-reports/actions/load-reporting-history';
import { syncBranch } from 'modules/branch/actions/sync-branch';

export const loadAccountHistory = loadAllHistory => (dispatch, getState) => {
  const { transactionsOldestLoadedBlock, blockchain, loginAccount } = getState();

  console.log('state -- ', transactionsOldestLoadedBlock, blockchain, loginAccount);

  const blockChunkSize = 100;
  const transactionSoftLimit = 100;

  const registerBlock = loginAccount.registerBlockNumber;
  const oldestLoadedBlock = transactionsOldestLoadedBlock || blockchain.currentBlockNumber;

  console.log('### loadAllHistory -- ', blockChunkSize, transactionSoftLimit, registerBlock, oldestLoadedBlock);

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

    console.log('fromBlock -- ', options);
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
    ], (err, result) => {
      console.log('loadAccountHistory finished -- ', err, result);
    });
  }
};
