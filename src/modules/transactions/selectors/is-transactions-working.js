import { createSelector } from 'reselect';
import store from '../../../store';
import { PENDING, SUCCESS, FAILED, INTERRUPTED } from '../../transactions/constants/statuses';

export default function () {
  return selectIsWorking(store.getState());
}

export const selectIsWorking = createSelector(
  state => state.transactionsData,
  transactionsData => Object.keys(transactionsData || {}).some(id =>
    [PENDING, SUCCESS, FAILED, INTERRUPTED].indexOf(transactionsData[id].status) < 0
  )
);
