import { showLink } from '../../link/actions/show-link';
import { PAGES_PATHS } from '../../link/constants/paths';
import { MARKETS } from '../../app/constants/pages';

import { MakeLocation as makeUrl } from "../../../utils/parse-url";

export const TOGGLE_FILTER = 'TOGGLE_FILTER';

export function toggleFilter(filterID) {
	return (dispatch, getState) => {
		dispatch({type: TOGGLE_FILTER, filterID});

		// todo: somehow make this nicer
		let s = getState();
		let filtersParams = Object.keys(s.selectedFilters)
			.filter(filterName => s.selectedFilters[filterName])
			.reduce((activeFilters, filterName) => {
				activeFilters[filterName] = s.selectedFilters[filterName];
				return activeFilters;
			}, {});
		let sortParam = {
			sort: `${s.selectedSort.prop}|${s.selectedSort.isDesc}`
		};
		let searchParam;
		if (s.keywords != null && s.keywords.length > 0) {
			searchParam = {
				search: s.keywords
			};
		}

		dispatch(showLink(makeUrl([PAGES_PATHS[MARKETS]], Object.assign({}, filtersParams, sortParam, searchParam)).url));
	}
}