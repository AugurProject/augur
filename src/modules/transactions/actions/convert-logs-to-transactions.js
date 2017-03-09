import async from 'async';
import { augur } from '../../../services/augurjs';
import { SUCCESS } from '../../transactions/constants/statuses';
import { updateTransactionsData } from '../../transactions/actions/update-transactions-data';
import { updateMarketsData } from '../../markets/actions/update-markets-data';
import { constructTransaction, constructTradingTransaction, constructBasicTransaction } from '../../transactions/actions/construct-transaction';

export function convertTradeLogToTransaction(label, data, marketID) {
  return (dispatch, getState) => {
    console.log('convertTradeLogToTransaction', label);
    console.log(data);
    const outcomeIDs = Object.keys(data[marketID]);
    const numOutcomes = outcomeIDs.length;
    const { address } = getState().loginAccount;
    for (let j = 0; j < numOutcomes; ++j) {
      const outcomeID = outcomeIDs[j];
      const numTrades = data[marketID][outcomeID].length;
      if (numTrades) {
        for (let k = 0; k < numTrades; ++k) {
          const trade = data[marketID][outcomeID][k];
          const tradeLabel = trade.isShortSell && trade.sender === address ? 'log_short_fill_tx' : label;
          const transaction = dispatch(constructTradingTransaction(tradeLabel, trade, marketID, outcomeID, SUCCESS));
          if (transaction) dispatch(updateTransactionsData(transaction));
        }
      }
    }
  };
}

export function convertTradeLogsToTransactions(label, data, marketID) {
  return (dispatch, getState) => {
    const { marketsData } = getState();
    async.forEachOfSeries(data, (marketTrades, marketID, next) => {
      if (marketsData[marketID]) {
        dispatch(convertTradeLogToTransaction(label, data, marketID));
        return next();
      }
      console.log('getting market info for', marketID);
      augur.getMarketInfo(marketID, (marketInfo) => {
        if (!marketInfo || marketInfo.error) {
          if (marketInfo && marketInfo.error) console.error('augur.getMarketInfo:', marketInfo);
          return next(`[${label}] couldn't load market info for market ${marketID}: ${JSON.stringify(data)}`);
        }
        dispatch(updateMarketsData({ [marketID]: marketInfo }));
        dispatch(convertTradeLogToTransaction(label, data, marketID));
        next();
      });
    }, err => (err && console.error('convertTradeLogsToTransactions:', err)));
  };
}

export const convertLogToTransaction = (label, log, status, isRetry, cb) => (dispatch, getState) => {
  console.log('convertLogToTransaction', label);
  console.log(log);
  const callback = cb || (e => e && console.error('convertLogToTransaction:', e));
  const hash = log.transactionHash;
  if (hash) {
    const transactionData = getState().transactionsData[hash];
    const gasFees = (transactionData && transactionData.gasFees) ? transactionData.gasFees.value : null;
    if (log.removed) {
      // TODO rollback
      console.debug('!!! log removed:', log);
    }
    const transaction = dispatch(constructTransaction(label, log, isRetry, callback));
    if (transaction) {
      const { currentBlockNumber } = getState().blockchain;
      const confirmations = currentBlockNumber - log.blockNumber;
      console.debug('log confirmations:', confirmations);
      dispatch(updateTransactionsData({
        [hash]: {
          ...constructBasicTransaction(hash, status, log.blockNumber, log.timestamp, gasFees, confirmations),
          ...transaction
        }
      }));
      return callback();
    }
  }
};

export const convertLogsToTransactions = (label, logs, isRetry) => (dispatch, getState) => (
  async.eachSeries(logs, (log, nextLog) => (
    dispatch(convertLogToTransaction(label, log, SUCCESS, isRetry, nextLog))
  ), err => (err && console.error(err)))
);
