export const UPDATE_TRANSACTIONS_OLDEST_LOADED_BLOCK = 'UPDATE_TRANSACTIONS_OLDEST_LOADED_BLOCK'

export function updateTransactionsOldestLoadedBlock(block) {
  return {
    type: UPDATE_TRANSACTIONS_OLDEST_LOADED_BLOCK,
    data: {
      block,
    },
  }
}
