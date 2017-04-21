import { createSelector } from 'reselect';
import BigNumber from 'bignumber.js';
import store from 'src/store';
import { selectTransactionsDataState } from 'src/select-state';
import { selectMarketLink } from 'modules/link/selectors/links';

import { BUY } from 'modules/transactions/constants/types';
import { PENDING, SUCCESS, FAILED, SUBMITTED, INTERRUPTED } from 'modules/transactions/constants/statuses';

import getValue from 'utils/get-value';
import { formatShares, formatEther, formatRep } from 'utils/format-number';

export default function () {
  return selectTransactions(store.getState());
}

export const selectTransactions = createSelector(
  selectTransactionsDataState,
  (transactionsData) => {
    const tradeGroups = [];
    const formattedTransactions = Object.keys(transactionsData || {})
      .reduce((p, id) => {
        const tradeGroupID = transactionsData[id].tradeGroupID;
        if (tradeGroupID) {
          if (tradeGroups.indexOf(tradeGroupID) === -1) {
            tradeGroups.push(tradeGroupID);
            const filteredTransactions = Object.keys(transactionsData).filter(id => transactionsData[id].tradeGroupID === tradeGroupID).map(id => transactionsData[id]);

            if (filteredTransactions.length === 1) {
              p.push(formatTransaction(filteredTransactions[0]));
            } else {
              p.push(formatGroupedTransactions(filteredTransactions));
            }
          }

          return p;
        }

        p.push(formatTransaction(transactionsData[id]));
        return p;
      }, [])
      .sort((a, b) => getValue(b, 'timestamp.timestamp') - getValue(a, 'timestamp.timestamp'));

    let currentTransactionIndex = 1;
    formattedTransactions.forEach((transaction, i, transactions) => {
      const currentTransaction = transactions[(transactions.length - 1) - i];

      if (currentTransaction.transactions && currentTransaction.transactions.length > 1) {
        currentTransaction.transactions.forEach((groupedTransaction, groupedIndex) => {
          currentTransaction.transactions[(currentTransaction.transactions.length - 1) - groupedIndex].transactionIndex = currentTransactionIndex;
          currentTransactionIndex += 1;
        });
      } else {
        currentTransaction.transactionIndex = currentTransactionIndex;
        currentTransactionIndex += 1;
      }
    });

    return formattedTransactions;
  }
);

export function formatTransaction(transaction) {
  let marketLink = getValue(transaction, 'data.marketLink');
  if (marketLink === null && transaction.data && (transaction.data.id || transaction.data.marketID) && (transaction.data.description || transaction.description)) {
    marketLink = selectMarketLink({
      id: transaction.data.id || transaction.data.marketID,
      description: transaction.description
    }, store.dispatch);
  }

  return {
    ...transaction,
    data: {
      ...transaction.data,
      marketLink
    },
    gas: transaction.gas && formatEther(transaction.gas),
    ether: transaction.etherWithoutGas && formatEther(transaction.etherWithoutGas),
    shares: transaction.sharesChange && formatShares(transaction.sharesChange),
    rep: transaction.repChange && formatRep(transaction.repChange)
  };
}

export function formatGroupedTransactions(transactions) {
  const formattedTransactions = transactions.map(transaction => formatTransaction(transaction)).sort((a, b) => getValue(b, 'timestamp.timestamp') - getValue(a, 'timestamp.timestamp'));

  const status = formattedTransactions.reduce((p, transaction) => {
    if (p !== FAILED || p !== INTERRUPTED) {
      if (transaction.status === FAILED) return FAILED;
      if (transaction.status === INTERRUPTED) return INTERRUPTED;

      if (p !== PENDING) {
        if (transaction.status === PENDING) return PENDING;
        if (transaction.status === SUBMITTED) return SUBMITTED;
        if (transaction.status === SUCCESS) return SUCCESS;
      }
    }

    return p;
  }, null);

  const totalShares = formattedTransactions.reduce((p, transaction) => p.plus(new BigNumber(transaction.numShares.value)), new BigNumber(0));

  return {
    status,
    message: `${formattedTransactions[0].type === BUY ? 'Buy' : 'Sell'} ${totalShares.toNumber()} shares of ${formattedTransactions[0].data.outcomeName}`,
    description: formattedTransactions[0].description,
    timestamp: formattedTransactions[formattedTransactions.length - 1].timestamp,
    transactions: formattedTransactions
  };
}
