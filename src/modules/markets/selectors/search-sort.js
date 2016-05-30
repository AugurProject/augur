import memoizerific from 'memoizerific';
import { updateSelectedSort } from '../../markets/actions/update-selected-sort';
import store from '../../../store';

export default function () {
	const { selectedSort } = store.getState();
	return {
		selectedSort,
		sortOptions: selectSortOptions(selectedSort),
		onChangeSort: selectOnChangeSort(store.dispatch)
	};
}

export const selectSortOptions = memoizerific(10)((selectedSort = {}) => {
	const creationSortOrder = { label: 'Newest Market', value: 'creationSortOrder', isDesc: true };
	const endDate = { label: 'Soonest Expiry', value: 'endDate', isDesc: false };
	const volume = { label: 'Most Volume', value: 'volume', isDesc: true };
	const tradingFeePercent = { label: 'Lowest Fee', value: 'tradingFeePercent', isDesc: false };

	switch (selectedSort.prop) {
	case creationSortOrder.value:
		creationSortOrder.label = selectedSort.isDesc ? 'Newest Market' : 'Oldest Market';
		creationSortOrder.isDesc = selectedSort.isDesc;
		break;
	case endDate.value:
		endDate.label = selectedSort.isDesc ? 'Furthest Expiry' : 'Soonest Expiry';
		endDate.isDesc = selectedSort.isDesc;
		break;
	case volume.value:
		volume.label = selectedSort.isDesc ? 'Most Volume' : 'Least Volume';
		volume.isDesc = selectedSort.isDesc;
		break;
	case tradingFeePercent.value:
		tradingFeePercent.label = selectedSort.isDesc ? 'Highest Fee' : 'Lowest Fee';
		tradingFeePercent.isDesc = selectedSort.isDesc;
		break;
	default:
		break;
	}

	return [creationSortOrder, endDate, volume, tradingFeePercent];
});

export const selectOnChangeSort = memoizerific(1)((dispatch) => (prop, isDesc) => {
	const o = {};

	if (prop) {
		o.prop = prop;
	}
	if (isDesc || isDesc === false) {
		o.isDesc = isDesc;
	}

	dispatch(updateSelectedSort(o));
});
