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
	const creationTime = { label: 'Newest Market', value: 'creationTime', isDesc: true };
	const endDate = { label: 'Soonest Expiry', value: 'endDate', isDesc: false };
	const volume = { label: 'Most Volume', value: 'volume', isDesc: true };
	const tradingFeePercent = { label: 'Lowest Fee', value: 'tradingFeePercent', isDesc: false };

	switch (selectedSort.prop) {
	case creationTime.value:
		creationTime.label = selectedSort.isDesc ? 'Newest Market' : 'Oldest Market';
		creationTime.isDesc = selectedSort.isDesc;
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

	return [creationTime, endDate, volume, tradingFeePercent];
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
