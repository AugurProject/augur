import { SHOW_LINK } from '../../link/actions/link-actions';
import { TOGGLE_FILTER } from '../../markets/actions/toggle-filter';

export default function(selectedFilters = { 'isOpen': true }, action) {
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