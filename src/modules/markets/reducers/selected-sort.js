import { UPDATE_SELECTED_SORT } from '../../markets/actions/update-selected-sort';

export default function(selectedSort = { prop: 'volume', isDesc: true }, action) {
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