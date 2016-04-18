import memoizerific from 'memoizerific';

import * as MarketsActions from '../actions/markets-actions';

import store from '../../../store';

export default function() {
	var { selectedSort } = store.getState();
	return {
		selectedSort,
		sortOptions: selectSortOptions(),
		onChangeSort: selectOnChangeSort(store.dispatch),
		onChangeKeywords: selectOnChangeKeywords(store.dispatch)
	};
}

export const selectSortOptions = memoizerific(1)(function() {
	return [
		{ label: 'Creation Date', value: 'creationSortOrder' },
		{ label: 'End Date', value: 'endBlock' },
		{ label: 'Volume', value: 'volume' },
		{ label: 'Fee', value: 'tradingFeePercent' },
		{ label: 'Description', value: 'description' }
	];
});

export const selectOnChangeSort = memoizerific(1)(function(dispatch) {
    return (prop, isDesc) => {
        var o = {};
        if (prop) {
            o.prop = prop;
        }
        if (isDesc || isDesc === false) {
            o.isDesc = isDesc;
        }
        dispatch(MarketsActions.updateSelectedSort(o));
    };
});

export const selectOnChangeKeywords = memoizerific(1)(function(dispatch) {
    return (keywords) => dispatch(MarketsActions.updateKeywords(keywords));
});