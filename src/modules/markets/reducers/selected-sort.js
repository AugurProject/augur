import { UPDATE_SELECTED_SORT } from '../../markets/actions/markets-actions';

export default function(selectedSort = { prop: 'creationSortOrder', isDesc: true }, action) {
    switch (action.type) {
        case UPDATE_SELECTED_SORT:
            return {
                ...selectedSort,
                ...action.selectedSort
            };

        default:
            return selectedSort;
    }
}