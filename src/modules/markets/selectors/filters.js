import memoizerific from 'memoizerific';
import { toggleFilter } from '../../markets/actions/toggle-filter';
import { toggleTag } from '../../markets/actions/toggle-tag';
import store from '../../../store';

export const selectFilters = memoizerific(1)(
(markets, selectedFilters, selectedTags, dispatch) => {
	const basicCounts = {
		isOpen: 0,
		isExpired: 0,
		isMissedOrReported: 0,
		isBinary: 0,
		isCategorical: 0,
		isScalar: 0
	};
	const tagCounts = {};

	// count matches for each filter and tag
	markets.forEach(market => {
		if (market.isOpen) { basicCounts.isOpen++; }
		if (market.isExpired) { basicCounts.isExpired++; }
		if (market.isMissedOrReported) { basicCounts.isMissedOrReported++; }
		if (market.isBinary) { basicCounts.isBinary++; }
		if (market.isCategorical) { basicCounts.isCategorical++; }
		if (market.isScalar) { basicCounts.isScalar++; }

		market.tags.forEach(tag => {
			tagCounts[tag.name] = tagCounts[tag.name] || 0;
			tagCounts[tag.name]++;
		});
	});

	const filters = [
		{
			title: 'Status',
			className: 'status',
			options: [
				{
					name: 'Open',
					value: 'Open',
					numMatched: basicCounts.isOpen,
					isSelected: !!selectedFilters.isOpen,
					onClick: () => dispatch(toggleFilter('isOpen'))
				},
				{
					name: 'Expired',
					value: 'Expired',
					numMatched: basicCounts.isOpen,
					isSelected: !!selectedFilters.isExpired,
					onClick: () => dispatch(toggleFilter('isExpired'))
				},
				{
					name: 'Reported / Missed',
					value: 'Reported / Missed',
					numMatched: basicCounts.isOpen,
					isSelected: !!selectedFilters.isMissedOrReported,
					onClick: () => dispatch(toggleFilter('isMissedOrReported'))
				}
			]
		},

		{
			title: 'Type',
			className: 'type',
			options: [
				{
					name: 'Yes / No',
					value: 'Yes / No',
					numMatched: basicCounts.isBinary,
					isSelected: !!selectedFilters.isBinary,
					onClick: () => dispatch(toggleFilter('isBinary'))
				},
				{
					name: 'Categorical',
					value: 'Categorical',
					numMatched: basicCounts.isCategorical,
					isSelected: !!selectedFilters.isCategorical,
					onClick: () => dispatch(toggleFilter('isCategorical'))
				},
				{
					name: 'Numerical',
					value: 'Numerical',
					numMatched: basicCounts.isScalar,
					isSelected: !!selectedFilters.isScalar,
					onClick: () => dispatch(toggleFilter('isScalar'))
				}
			]
		}
	];

	const tagOptions =
		Object.keys(tagCounts)
			.filter(tag => tagCounts[tag] > 0)
			.sort((a, b) => (tagCounts[b] - tagCounts[a]) || (a < b ? -1 : 1))
			.map(tag => {
				const obj = {
					name: tag,
					value: tag,
					numMatched: tagCounts[tag],
					isSelected: !!selectedTags[tag],
					onClick: () => dispatch(toggleTag(tag))
				};
				return obj;
			});

	if (tagOptions.length) {
		filters.push({
			title: 'Tags',
			className: 'tags',
			options: tagOptions
		});
	}

	return filters;
});

export default function () {
	const { selectedFilters, selectedTags } = store.getState();
	const { filteredMarkets } = require('../../../selectors');

	return selectFilters(filteredMarkets, selectedFilters, selectedTags, store.dispatch);
}
