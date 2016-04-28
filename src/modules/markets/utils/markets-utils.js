/**
 * Author: priecint
 */
import { MakeLocation as makeUrl } from "../../../utils/parse-url";

import { PAGES_PATHS } from '../../link/constants/paths';
import { MARKETS } from '../../app/constants/pages';
import { SEARCH_PARAM_NAME, SORT_PARAM_NAME, PAGE_PARAM_NAME } from '../../markets/constants/param-names';
import { DEFAULT_SORT_PROP, DEFAULT_IS_SORT_DESC } from '../../markets/constants/sort';

/**
 * Creates URL to reflect all state values that should be in URL
 *
 * @param {Object} state
 * @return {string}
 */
export function prepareUrl(state) {
    let filtersParams = Object.keys(state.selectedFilters)
        .filter(filterName => state.selectedFilters[filterName])
        .reduce((activeFilters, filterName) => {
            activeFilters[filterName] = state.selectedFilters[filterName];
            return activeFilters;
        }, {});

    let sortParams;
    if (state.selectedSort.prop != DEFAULT_SORT_PROP || state.selectedSort.isDesc != DEFAULT_IS_SORT_DESC) {
        sortParams = {
            [SORT_PARAM_NAME]: `${state.selectedSort.prop}|${state.selectedSort.isDesc}`
        };
    }

    let searchParam;
    if (state.keywords != null && state.keywords.length > 0) {
        searchParam = {
            [SEARCH_PARAM_NAME]: state.keywords
        };
    }

    let paginationParams;
    if (state.pagination.selectedPageNum > 1) {
        paginationParams = {
            [PAGE_PARAM_NAME]: state.pagination.selectedPageNum
        }
    }

    let params = Object.assign({}, filtersParams, sortParams, searchParam, paginationParams);
    return makeUrl([PAGES_PATHS[MARKETS]], params).url;
}