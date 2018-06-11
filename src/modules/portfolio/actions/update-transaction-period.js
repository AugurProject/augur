export const UPDATE_TRANSACTION_PERIOD = 'UPDATE_TRANSACTION_PERIOD'

export function updateTransactionPeriod(transactionPeriod) {
  return {
    type: UPDATE_TRANSACTION_PERIOD,
    data: transactionPeriod,
  }
}
