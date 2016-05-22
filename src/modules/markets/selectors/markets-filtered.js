import memoizerific from 'memoizerific';

import { CleanKeywordsArray } from '../../../utils/clean-keywords';

import store from '../../../store';

export default function() {
	const { keywords, selectedFilters, selectedTags } = store.getState(),
		  { allMarkets } = require('../../../selectors');
	return selectFilteredMarkets(allMarkets, keywords, selectedFilters, selectedTags);
}

export const selectFilteredMarkets = memoizerific(3)(function(markets, keywords, selectedFilters, selectedTags) {
	return markets.filter(market => isMarketFiltersMatch(market, keywords, selectedFilters, selectedTags));
});

export const isMarketFiltersMatch = memoizerific(3)(function(market, keywords, selectedFilters, selectedTags) {
	return isMatchKeywords(market, keywords) && isMatchFilters(market, selectedFilters) && isMatchTags(market, selectedTags);

	function isMatchKeywords(market, keywords) {
		var keywordsArray = CleanKeywordsArray(keywords);
		if (!keywordsArray.length) {
			return true;
		}
		return keywordsArray.every(keyword => (
			market.description.toLowerCase().indexOf(keyword) >= 0 ||
			market.outcomes.some(outcome => outcome.name.indexOf(keyword) >= 0) ||
			market.tags.some(tag => tag.name.indexOf(keyword) >= 0)
		));
	}

	function isMatchFilters(market, selectedFilters) {
		var selectedStatusProps,
			selectedTypeProps;

		selectedStatusProps = ['isOpen', 'isExpired', 'isMissedOrReported', 'isPendingReport'].filter(statusProp => !!selectedFilters[statusProp]);
		selectedTypeProps = ['isBinary', 'isCategorical', 'isScalar'].filter(typeProp => !!selectedFilters[typeProp]);

		return (
			(!selectedStatusProps.length || selectedStatusProps.some(status => !!market[status])) &&
			(!selectedTypeProps.length || selectedTypeProps.some(type => !!market[type]))
		);
	}

	function isMatchTags(market, selectedTags) {
		if (!Object.keys(selectedTags).length) {
			return true;
		}
		return market.tags.some(tag => !!selectedTags[tag.name]);
	}
});