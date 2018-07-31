import { createSelector } from 'reselect'
import store from 'src/store'
import { selectTransactionsDataState } from 'src/select-state'
import { PENDING, SUCCESS, FAILED, INTERRUPTED } from 'modules/transactions/constants/statuses'

export default function () {
  return selectIsWorking(store.getState())
}

export const selectIsWorking = createSelector(
  selectTransactionsDataState,
  transactionsData => Object.keys(transactionsData || {}).some(id =>
    [PENDING, SUCCESS, FAILED, INTERRUPTED].indexOf(transactionsData[id].status) < 0),
)
