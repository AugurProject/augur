import { UPDATE_SELECTED_PAGE_NUM, UPDATE_SELECTED_SORT, UPDATE_KEYWORDS, TOGGLE_FILTER, UPDATED_SELECTED_MARKETS_HEADER } from '../../markets/actions/markets-actions';
import { SHOW_LINK } from '../../link/actions/link-actions';

export default function(pagination = { selectedPageNum: 1, numPerPage: 10 }, action) {
    switch (action.type) {
        case UPDATE_SELECTED_PAGE_NUM:
            return {
                ...pagination,
                selectedPageNum: action.selectedPageNum
            };

        case UPDATE_SELECTED_SORT:
        case UPDATE_KEYWORDS:
        case TOGGLE_FILTER:
        case UPDATED_SELECTED_MARKETS_HEADER:
        case SHOW_LINK:
            return {
                ...pagination,
                selectedPageNum: 1
            };

        default:
            return pagination;
    }
}