import { augur } from 'services/augurjs'

export const UPDATE_ORPHANED_TRANSACTION = 'UPDATE_ORPHANED_TRANSACTION'


export const updateOrphanedTransactions = () => (dispatch, getState) => {
  augur.augurNode.submitRequest('' +
    '')
}
