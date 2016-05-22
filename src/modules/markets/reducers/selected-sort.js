import { SHOW_LINK } from '../../link/actions/show-link';
import { SORT_PARAM_NAME } from '../../link/constants/param-names';
import { DEFAULT_SORT_PROP, DEFAULT_IS_SORT_DESC } from '../../markets/constants/sort';

import { UPDATE_SELECTED_SORT } from '../../markets/actions/update-selected-sort';

export default function(selectedSort = { prop: DEFAULT_SORT_PROP, isDesc: DEFAULT_IS_SORT_DESC }, action) {
    switch (action.type) {
        case UPDATE_SELECTED_SORT:
            return {
                ...selectedSort,
                ...action.selectedSort
            };

        case SHOW_LINK:
            let params = action.parsedURL.searchParams;
            if (params[SORT_PARAM_NAME] != null && params[SORT_PARAM_NAME] !== "") {
                let sortSplit = params[SORT_PARAM_NAME].split("|");
                return {
                    ...selectedSort,
                    prop: sortSplit[0],
                    isDesc: sortSplit[1] === "true"
                };
            }

            return selectedSort;

        default:
            return selectedSort;
    }
}