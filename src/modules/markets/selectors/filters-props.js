import memoizerific from 'memoizerific';

import { MARKET_TYPES, BINARY, CATEGORICAL, SCALAR, COMBINATORIAL } from '../../markets/constants/market-types';

import { toggleFilter } from '../../markets/actions/toggle-filter';

import store from '../../../store';

export default function() {
	var { selectedFilters } = store.getState();
	return selectFiltersProps(selectedFilters, store.dispatch);
}

export const selectFiltersProps = memoizerific(10)(function(selectedFilters, dispatch) {
    return {
		isCheckedOpen: !!selectedFilters['isOpen'],
		isCheckedExpired: !!selectedFilters['isExpired'],
		isCheckedPendingReport: !!selectedFilters['isPendingReport'],
		isCheckedMissedOrReported: !!selectedFilters['isMissedOrReported'],

		isCheckedBinary: !!selectedFilters['isBinary'],
		isCheckedCategorical: !!selectedFilters['isCategorical'],
		isCheckedScalar: !!selectedFilters['isScalar'],

		onClickFilterOpen: () => dispatch(toggleFilter('isOpen')),
		onClickFilterExpired: () => dispatch(toggleFilter('isExpired')),
		onClickFilterPendingReport: () => dispatch(toggleFilter('isPendingReport')),
		onClickFilterMissedOrReported: () => dispatch(toggleFilter('isMissedOrReported')),

		onClickFilterBinary: () => dispatch(toggleFilter('isBinary')),
		onClickFilterCategorical: () => dispatch(toggleFilter('isCategorical')),
		onClickFilterScalar: () => dispatch(toggleFilter('isScalar'))
    };
});