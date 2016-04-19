import memoizerific from 'memoizerific';

import { MARKET_TYPES, BINARY, CATEGORICAL, SCALAR, COMBINATORIAL } from '../../markets/constants/market-types';

import * as MarketsActions from '../actions/markets-actions';

import store from '../../../store';

export default function() {
	var { selectedFilters } = store.getState();
	return selectFiltersProps(selectedFilters, store.dispatch);
}

export const selectFiltersProps = memoizerific(10)(function(selectedFilters, dispatch) {
    return {
		isCheckedOpen: !!selectedFilters['isOpen'],
		isCheckedExpired: !!selectedFilters['isExpired'],

		isCheckedBinary: !!selectedFilters['isBinary'],
		isCheckedCategorical: !!selectedFilters['isCategorical'],
		isCheckedScalar: !!selectedFilters['isScalar'],

		onClickFilterOpen: () => dispatch(MarketsActions.toggleFilter('isOpen')),
		onClickFilterExpired: () => dispatch(MarketsActions.toggleFilter('isExpired')),

		onClickFilterBinary: () => dispatch(MarketsActions.toggleFilter('isBinary')),
		onClickFilterCategorical: () => dispatch(MarketsActions.toggleFilter('isCategorical')),
		onClickFilterScalar: () => dispatch(MarketsActions.toggleFilter('isScalar'))
    };
});