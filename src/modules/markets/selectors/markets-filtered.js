import memoizerific from 'memoizerific';
import { cleanKeywordsArray } from '../../../utils/clean-keywords';
import store from '../../../store';

export default function () {
	const { keywords, selectedFilters, selectedTags } = store.getState();
	const { allMarkets } = require('../../../selectors');
	return selectFilteredMarkets(allMarkets, keywords, selectedFilters, selectedTags);
}

export const selectFilteredMarkets = memoizerific(3)((markets, keywords, selectedFilters, selectedTags) =>
	markets.filter(market => isMarketFiltersMatch(market, keywords, selectedFilters, selectedTags))
);

export const isMarketFiltersMatch = memoizerific(3)((market, keywords, selectedFilters, selectedTags) => {
	return isMatchKeywords(market, keywords) && isMatchFilters(market, selectedFilters) && isMatchTags(market, selectedTags);

	function isMatchKeywords(market, keys) {
		const keywordsArray = cleanKeywordsArray(keys);
		if (!keywordsArray.length) {
			return true;
		}
		return keywordsArray.every(keyword => (
			market.description.toLowerCase().indexOf(keyword) >= 0 ||
			market.outcomes.some(outcome => outcome.name.indexOf(keyword) >= 0) ||
			market.tags.some(tag => tag.name.indexOf(keyword) >= 0)
		));
	}

	function isMatchFilters(market, selFilters) {
		const selectedStatusProps = ['isOpen', 'isExpired', 'isMissedOrReported', 'isPendingReport'].filter(statusProp => !!selFilters[statusProp]);
		const selectedTypeProps = ['isBinary', 'isCategorical', 'isScalar'].filter(typeProp => !!selFilters[typeProp]);

		return (
			(!selectedStatusProps.length || selectedStatusProps.some(status => !!market[status])) &&
			(!selectedTypeProps.length || selectedTypeProps.some(type => !!market[type]))
		);
	}

	function isMatchTags(market, selTags) {
		if (!Object.keys(selTags).length) {
			return true;
		}
		return market.tags.some(tag => !!selTags[tag.name]);
	}
});
