import memoizerific from 'memoizerific';

import { updateKeywords } from '../../markets/actions/update-keywords';
import { updateSelectedSort } from '../../markets/actions/update-selected-sort';

import store from '../../../store';

export default function() {
	var { selectedSort } = store.getState();
	return {
		selectedSort,
		sortOptions: selectSortOptions(selectedSort),
		onChangeSort: selectOnChangeSort(store.dispatch),
		onChangeKeywords: selectOnChangeKeywords(store.dispatch)
	};
}

export const selectSortOptions = memoizerific(10)(function(selectedSort = {}) {
	var creationSortOrder = { label: 'Newest Market', value: 'creationSortOrder', isDesc: true },
		endBlock = { label: 'Soonest Expiry', value: 'endBlock', isDesc: false },
		volume = { label: 'Most Volume', value: 'volume', isDesc: true },
		tradingFeePercent = { label: 'Lowest Fee', value: 'tradingFeePercent', isDesc: false };

	switch (selectedSort.prop) {
		case creationSortOrder.value:
			creationSortOrder.label = selectedSort.isDesc ? 'Newest Market' : 'Oldest Market';
			creationSortOrder.isDesc = selectedSort.isDesc;
			break;
		case endBlock.value:
			endBlock.label = selectedSort.isDesc ? 'Furthest Expiry' : 'Soonest Expiry';
			endBlock.isDesc = selectedSort.isDesc;
			break;
		case volume.value:
			volume.label = selectedSort.isDesc ? 'Most Volume' : 'Least Volume';
			volume.isDesc = selectedSort.isDesc;
			break;
		case tradingFeePercent.value:
			tradingFeePercent.label = selectedSort.isDesc ? 'Highest Fee' : 'Lowest Fee';
			tradingFeePercent.isDesc = selectedSort.isDesc;
			break;
	}

	return [creationSortOrder, endBlock, volume, tradingFeePercent];
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

        dispatch(updateSelectedSort(o));
    };
});

export const selectOnChangeKeywords = memoizerific(1)(function(dispatch) {
    return (keywords) => dispatch(updateKeywords(keywords));
});