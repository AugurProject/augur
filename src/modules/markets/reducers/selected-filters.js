import { SHOW_LINK } from '../../link/actions/link-actions';
import { TOGGLE_FILTER } from '../actions/markets-actions';

export default function(selectedFilters = { }, action) {
    var newSelectedFilters;

    switch (action.type) {
        case TOGGLE_FILTER:
            newSelectedFilters = {
                ...selectedFilters
            };
            if (newSelectedFilters[action.filterID]) {
                delete newSelectedFilters[action.filterID];
            }
            else {
                newSelectedFilters[action.filterID] = true;
            }
            return newSelectedFilters;

        default:
            return selectedFilters;
    }
}