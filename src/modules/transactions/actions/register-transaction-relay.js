import { abi, augur, rpc } from 'services/augurjs'
import { SUBMITTED, SUCCESS } from 'modules/transactions/constants/statuses'
import { NO_RELAY } from 'modules/transactions/constants/no-relay'
import { COMMIT_TRADE, SHORT_SELL, TRADE } from 'modules/transactions/constants/types'
import { formatEther } from 'utils/format-number'
import { updateTransactionsData } from 'modules/transactions/actions/update-transactions-data'
import { constructRelayTransaction } from 'modules/transactions/actions/construct-relay-transaction'

export const handleRelayTransaction = tx => (dispatch, getState) => {
  if (tx && tx.response && tx.data) {
    console.log('txRelay:', tx)
    const hash = tx.hash
    const { loginAccount, transactionsData } = getState()
    if (tx.data.from === loginAccount.address) {
      const gasPrice = rpc.gasPrice || augur.constants.DEFAULT_GASPRICE
      const gasFees = tx.response.gasFees || augur.trading.simulation.getTxGasEth({ ...tx.data }, gasPrice).toFixed()
      if (hash) {
        switch (tx.data.method) {
          case COMMIT_TRADE:
          case SHORT_SELL:
          case TRADE: {
            const status = tx.response.blockHash ? SUCCESS : SUBMITTED
            const relayTransaction = dispatch(constructRelayTransaction(tx, status))
            if (relayTransaction) {
              const numTransactions = relayTransaction.length
              for (let i = 0; i < numTransactions; ++i) {
                if (relayTransaction[i]) {
                  const id = Object.keys(relayTransaction[i])[0]
                  if (transactionsData[id]) {
                    dispatch(updateTransactionsData({
                      [id]: { ...transactionsData[id], gasFees: formatEther(gasFees) }
                    }))
                  }
                  if (!transactionsData[id] || transactionsData[id].status !== SUCCESS) {
                    dispatch(updateTransactionsData(relayTransaction[i]))
                  }
                }
              }
            }
            break
          }
          default: {
            if (transactionsData[hash]) {
              dispatch(constructRelayTransaction(tx, status))
              dispatch(updateTransactionsData({
                [hash]: { ...transactionsData[hash], gasFees: formatEther(gasFees) }
              }))
            }
            if (!transactionsData[hash] || transactionsData[hash].status !== SUCCESS) {
              const status = tx.response.blockHash ? SUCCESS : SUBMITTED
              const relayTransaction = dispatch(constructRelayTransaction(tx, status))
              if (relayTransaction) {
                dispatch(updateTransactionsData(relayTransaction))
              }
            }
          }
        }
      } else {
        console.debug('***UNCAUGHT RELAYED TRANSACTION:', tx)
        tx.hash = Date.now().toString() + '-' + abi.unfork(augur.utils.sha256(JSON.stringify(tx)))
        console.debug('assigned txid:', tx.hash)
        const relayTransaction = dispatch(constructRelayTransaction(tx, status))
        if (relayTransaction) {
          const numTransactions = relayTransaction.length
          for (let i = 0; i < numTransactions; ++i) {
            if (relayTransaction[i]) {
              const id = Object.keys(relayTransaction[i])[0]
              if (transactionsData[id]) {
                dispatch(updateTransactionsData({
                  [id]: { ...transactionsData[id], gasFees: formatEther(gasFees) }
                }))
              }
              if (!transactionsData[id] || transactionsData[id].status !== SUCCESS) {
                dispatch(updateTransactionsData(relayTransaction[i]))
              }
            }
          }
        }
      }
    }
  }
}

export const registerTransactionRelay = () => (dispatch) => {
  rpc.excludeFromTransactionRelay(NO_RELAY)
  rpc.registerTransactionRelay(transaction => dispatch(handleRelayTransaction(transaction)))
}
