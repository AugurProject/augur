export const UPDATE_TRANSACTIONS_LOADING = 'UPDATE_TRANSACTIONS_LOADING'

export function updateTransactionsLoading(isLoading) {
  return {
    type: UPDATE_TRANSACTIONS_LOADING,
    data: {
      isLoading,
    },
  }
}
