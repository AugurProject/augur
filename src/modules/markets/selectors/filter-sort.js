import { createSelector } from 'reselect';
import { selectSelectedFilterSortState } from 'src/select-state';
import { updateSelectedFilterSort } from 'modules/markets/actions/update-selected-filter-sort';
import { SELECT_TYPE_OPTIONS, SELECT_SORT_OPTIONS, SELECT_ORDER_OPTIONS } from 'modules/markets/constants/filter-sort';
import store from 'src/store';

// NOTE -- the filtering + sorting of the markets are separated respectively
//  filtering: `markets/selectores/markets-filtered.js`
//  sorting: `markets/selectors/markets-all.js`
export default function () {
  return selectFilterSort(store.getState());
}

export const selectFilterSort = createSelector(
  selectSelectedFilterSortState,
  selectedFilterSort => ({
    types: SELECT_TYPE_OPTIONS,
    sorts: SELECT_SORT_OPTIONS,
    order: SELECT_ORDER_OPTIONS,
    onChange: selectOnChange,
    selectedFilterSort
  })
);

function selectOnChange(type, sort, order) {
  const { selectedFilterSort } = store.getState();
  const isDesc = (order !== null && order !== selectedFilterSort.isDesc) ? order : null;
  const selections = { type, sort, isDesc };
  const changes = Object.keys(selections).reduce((prev, item) => {
    if (selections[item] !== null) {
      return { ...prev, [item]: selections[item] };
    }
    return { ...prev };
  }, {});
  store.dispatch(updateSelectedFilterSort(changes));
}
