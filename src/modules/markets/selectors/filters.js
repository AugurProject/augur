import memoizerific from 'memoizerific';
import { toggleTag } from '../../markets/actions/toggle-tag';
import store from '../../../store';

export default function () {
	const { selectedTags } = store.getState();
	const { filteredMarkets } = require('../../../selectors');

	return selectFilters(filteredMarkets, selectedTags, store.dispatch);
}

export const selectFilters = memoizerific(1)((markets, selectedTags, dispatch) => {
	const tagCounts = {};

	// count matches for each filter and tag
	markets.forEach(market => {
		market.tags.forEach(tag => {
			tagCounts[tag.name] = tagCounts[tag.name] || 0;
			tagCounts[tag.name]++;
		});
	});

	const filters = [];

	const tagOptions =
		Object.keys(tagCounts)
			.filter(tag => tagCounts[tag] > 0)
			.sort((a, b) => (tagCounts[b] - tagCounts[a]) || (a < b ? -1 : 1))
			.slice(0, 50)
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
