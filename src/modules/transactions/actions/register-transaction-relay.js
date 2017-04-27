import { abi, augur, rpc } from '../../../services/augurjs';
import { SUBMITTED, SUCCESS } from '../../transactions/constants/statuses';
import { NO_RELAY } from '../../transactions/constants/no-relay';
import { formatRealEther } from '../../../utils/format-number';
import { updateTransactionsData } from '../../transactions/actions/update-transactions-data';
import { constructRelayTransaction } from '../../transactions/actions/construct-relay-transaction';

export const handleRelayTransaction = tx => (dispatch, getState) => {
  if (tx && tx.response && tx.data) {
    console.log('txRelay:', tx);
    const hash = tx.response.hash;
    const { loginAccount, transactionsData } = getState();
    if (tx.data.from === loginAccount.address) {
      const gasPrice = rpc.gasPrice || augur.constants.DEFAULT_GASPRICE;
      const gasFees = tx.response.gasFees || augur.trading.simulation.getTxGasEth({ ...tx.data }, gasPrice).toFixed();
      if (hash) {
        switch (tx.data.method) {
          case 'commitTrade':
          case 'short_sell':
          case 'trade': {
            const status = tx.response.blockHash ? SUCCESS : SUBMITTED;
            const relayTransaction = dispatch(constructRelayTransaction(tx, status));
            if (relayTransaction) {
              const numTransactions = relayTransaction.length;
              for (let i = 0; i < numTransactions; ++i) {
                if (relayTransaction[i]) {
                  const id = Object.keys(relayTransaction[i])[0];
                  if (transactionsData[id]) {
                    dispatch(updateTransactionsData({
                      [id]: { ...transactionsData[id], gasFees: formatRealEther(gasFees) }
                    }));
                  }
                  if (!transactionsData[id] || transactionsData[id].status !== SUCCESS) {
                    dispatch(updateTransactionsData(relayTransaction[i]));
                  }
                }
              }
            }
            break;
          }
          default: {
            if (transactionsData[hash]) {
              dispatch(updateTransactionsData({
                [hash]: { ...transactionsData[hash], gasFees: formatRealEther(gasFees) }
              }));
            }
            if (!transactionsData[hash] || transactionsData[hash].status !== SUCCESS) {
              const status = tx.response.blockHash ? SUCCESS : SUBMITTED;
              const relayTransaction = dispatch(constructRelayTransaction(tx, status));
              if (relayTransaction) {
                dispatch(updateTransactionsData(relayTransaction));
              }
            }
          }
        }
      } else {
        console.debug('***UNCAUGHT RELAYED TRANSACTION:', tx);
        tx.hash = Date.now().toString() + '-' + abi.unfork(augur.utils.sha256(JSON.stringify(tx)));
        console.debug('assigned txid:', tx.hash);
        const relayTransaction = dispatch(constructRelayTransaction(tx, status));
        if (relayTransaction) {
          const numTransactions = relayTransaction.length;
          for (let i = 0; i < numTransactions; ++i) {
            if (relayTransaction[i]) {
              const id = Object.keys(relayTransaction[i])[0];
              if (transactionsData[id]) {
                dispatch(updateTransactionsData({
                  [id]: { ...transactionsData[id], gasFees: formatRealEther(gasFees) }
                }));
              }
              if (!transactionsData[id] || transactionsData[id].status !== SUCCESS) {
                dispatch(updateTransactionsData(relayTransaction[i]));
              }
            }
          }
        }
      }
    }
  }
};

export const registerTransactionRelay = () => (dispatch) => {
  rpc.excludeFromTransactionRelay(NO_RELAY);
  rpc.registerTransactionRelay(transaction => dispatch(handleRelayTransaction(transaction)));
};
