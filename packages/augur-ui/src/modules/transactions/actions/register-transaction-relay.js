import { augur } from 'services/augurjs'
import { SUCCESS } from 'modules/transactions/constants/statuses'
import { NO_RELAY } from 'modules/transactions/constants/no-relay'
import { formatEther } from 'utils/format-number'
import { updateTransactionsData } from 'modules/transactions/actions/update-transactions-data'
import { constructRelayTransaction } from 'modules/transactions/actions/construct-relay-transaction'

export const handleRelayTransaction = tx => (dispatch, getState) => {
  if (tx && tx.response && tx.data) {
    const { hash } = tx
    if (!hash) return console.error('uncaught relayed transaction', tx)
    const { loginAccount, transactionsData } = getState()
    if (tx.data.from === loginAccount.address) {
      // const gasPrice = augur.rpc.gasPrice || augur.constants.DEFAULT_GASPRICE
      // const gasFees = tx.response.gasFees || augur.trading.simulation.getTxGasEth({ ...tx.data }, gasPrice).toFixed()
      const gasFees = tx.response.gasFees || 0
      if (hash) {
        if (transactionsData[hash]) {
          dispatch(constructRelayTransaction(tx))
          dispatch(updateTransactionsData({
            [hash]: { ...transactionsData[hash], gasFees: formatEther(gasFees) },
          }))
        }
        if (!transactionsData[hash] || transactionsData[hash].status !== SUCCESS) {
          const relayTransaction = dispatch(constructRelayTransaction(tx))
          if (relayTransaction) {
            dispatch(updateTransactionsData(relayTransaction))
          }
        }
      }
    }
  }
}

export const registerTransactionRelay = () => (dispatch) => {
  augur.rpc.excludeFromTransactionRelay(NO_RELAY)
  augur.rpc.registerTransactionRelay(transaction => dispatch(handleRelayTransaction(transaction)))
}
