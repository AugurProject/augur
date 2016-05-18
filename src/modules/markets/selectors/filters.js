import memoizerific from 'memoizerific';

import { MARKET_TYPES, BINARY, CATEGORICAL, SCALAR, COMBINATORIAL } from '../../markets/constants/market-types';

import { toggleFilter } from '../../markets/actions/toggle-filter';

import store from '../../../store';

export default function() {
	var { selectedFilters } = store.getState();
	return selectFilters(selectedFilters, store.dispatch);
}

export const selectFilters = memoizerific(10)(function(selectedFilters, dispatch) {
	return [
		{
			title: 'Status',
			options: [
				{ name: 'Open', value: 'Open', numMatched: 1, isSelected: !!selectedFilters['isOpen'], onClick: () => dispatch(toggleFilter('isOpen')) },
				{ name: 'Expired', value: 'Expired', numMatched: 1, isSelected: !!selectedFilters['isExpired'], onClick: () => dispatch(toggleFilter('isExpired')) },
				{ name: 'Reported / Missed', value: 'Reported / Missed', numMatched: 1, isSelected: !!selectedFilters['isMissedOrReported'], onClick: () => dispatch(toggleFilter('isMissedOrReported')) }
			]
		},
		{
			title: 'Type',
			options: [
				{ name: 'Yes / No', value: 'Yes / No', numMatched: 145, isSelected: !!selectedFilters['isBinary'], onClick: () => dispatch(toggleFilter('isBinary')) },
				{ name: 'Categorical', value: 'Categorical', numMatched: 124, isSelected: !!selectedFilters['isCategorical'], onClick: () => dispatch(toggleFilter('isCategorical')) },
				{ name: 'Numerical', value: 'Numerical', numMatched: 70, isSelected: !!selectedFilters['isScalar'], onClick: () => dispatch(toggleFilter('isScalar')) }
			]
		}
	];
});