import memoizerific from 'memoizerific';
import { cleanKeywordsArray } from '../../../utils/clean-keywords';
// import store from '../../../store';

export const isMarketFiltersMatch = memoizerific(3)((market, keywords, selectedFilters) => {
	function isMatchKeywords(mark, keys) {
		const keywordsArray = cleanKeywordsArray(keys);
		if (!keywordsArray.length) {
			return true;
		}
		return keywordsArray.every(keyword => (
			mark.description.toLowerCase().indexOf(keyword) >= 0 ||
			mark.outcomes.some(outcome => outcome.name.indexOf(keyword) >= 0) ||
			(mark.tags || []).some(tag => tag && tag.toLowerCase().indexOf(keyword) >= 0)
		));
	}

	function isMatchFilters(mark, selFilters) {
		const selectedStatusProps = ['isOpen', 'isExpired', 'isMissedOrReported', 'isPendingReport']
			.filter(statusProp => !!selFilters[statusProp]);
		const selectedTypeProps = ['isBinary', 'isCategorical', 'isScalar']
			.filter(typeProp => !!selFilters[typeProp]);

		return (
		(!selectedStatusProps.length || selectedStatusProps.some(status => !!mark[status])) &&
		(!selectedTypeProps.length || selectedTypeProps.some(type => !!mark[type]))
		);
	}

	return isMatchKeywords(market, keywords) && isMatchFilters(market, selectedFilters);
});

export const selectFilteredMarkets = memoizerific(3)((markets, keywords,
selectedFilters) =>
	markets.filter(market =>
		isMarketFiltersMatch(market, keywords, selectedFilters))
);
