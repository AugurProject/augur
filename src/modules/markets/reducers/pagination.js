import { UPDATE_SELECTED_PAGE_NUM } from 'modules/markets/actions/update-selected-page-num';
import { UPDATE_SELECTED_FILTER_SORT } from 'modules/markets/actions/update-selected-filter-sort';
import { UPDATE_KEYWORDS } from 'modules/markets/actions/update-keywords';
import { TOGGLE_TAG } from 'modules/markets/actions/toggle-tag';
import { UPDATE_SELECTED_MARKETS_HEADER } from 'modules/markets/actions/update-selected-markets-header';
import { PAGINATION_PARAM_NAME } from 'modules/app/constants/param-names';
import { DEFAULT_PAGE } from 'modules/markets/constants/pagination';

import { UPDATE_URL } from 'modules/link/actions/update-url';

export default function (pagination = { selectedPageNum: DEFAULT_PAGE, numPerPage: 10 }, action) {
  let newPageNum;
  switch (action.type) {
    case UPDATE_SELECTED_PAGE_NUM:
      return {
        ...pagination,
        selectedPageNum: action.selectedPageNum
      };

    case UPDATE_SELECTED_FILTER_SORT:
    case UPDATE_KEYWORDS:
    case TOGGLE_TAG:
    case UPDATE_SELECTED_MARKETS_HEADER:
      return {
        ...pagination,
        selectedPageNum: DEFAULT_PAGE
      };

    case UPDATE_URL:
      newPageNum = parseInt(action.parsedURL.searchParams[PAGINATION_PARAM_NAME], 10) || DEFAULT_PAGE;
      return {
        ...pagination,
        selectedPageNum: parseInt(newPageNum, 10)
      };


    default:
      return pagination;
  }
}
