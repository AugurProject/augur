import memoizerific from 'memoizerific';
import { cleanKeywordsArray } from '../../../utils/clean-keywords';
import store from '../../../store';

export const isMarketFiltersMatch = memoizerific(3)(
(market, keywords, selectedFilters, selectedTags) => {
	function isMatchKeywords(mark, keys) {
		const keywordsArray = cleanKeywordsArray(keys);
		if (!keywordsArray.length) {
			return true;
		}
		return keywordsArray.every(keyword => (
			mark.description.toLowerCase().indexOf(keyword) >= 0 ||
			mark.outcomes.some(outcome => outcome.name.indexOf(keyword) >= 0) ||
			mark.tags.some(tag => tag.name.indexOf(keyword) >= 0)
		));
	}

	function isMatchFilters(mark, selFilters) {
		const selectedStatusProps = [
			'isOpen',
			'isExpired',
			'isMissedOrReported',
			'isPendingReport'
		].filter(statusProp => !!selFilters[statusProp]);
		const selectedTypeProps = [
			'isBinary',
			'isCategorical',
			'isScalar'
		].filter(typeProp => !!selFilters[typeProp]);

		return (
			(!selectedStatusProps.length || selectedStatusProps.some(status => !!mark[status])) &&
			(!selectedTypeProps.length || selectedTypeProps.some(type => !!mark[type]))
		);
	}

	function isMatchTags(mark, selTags) {
		if (!Object.keys(selTags).length) {
			return true;
		}
		return mark.tags.some(tag => !!selTags[tag.name]);
	}

	return isMatchKeywords(market, keywords) &&
		isMatchFilters(market, selectedFilters) &&
		isMatchTags(market, selectedTags);
});

export const selectFilteredMarkets = memoizerific(3)(
(markets, keywords, selectedFilters, selectedTags) =>
	markets.filter(market =>
		isMarketFiltersMatch(market, keywords, selectedFilters, selectedTags)));

export default function () {
	const { keywords, selectedFilters, selectedTags } = store.getState();
	const	{ allMarkets } = require('../../../selectors');
	return selectFilteredMarkets(allMarkets, keywords, selectedFilters, selectedTags);
}
