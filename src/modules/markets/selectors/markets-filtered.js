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
	const selectedTagsList = Object.keys(selectedTags);
	return isMatchKeywords(market, keywords) && isMatchTags(market, selectedTagsList) && canDisplay(market);

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

	function isMatchTags(market, selectedTagsList) {
		if (!selectedTagsList.length) {
			return true;
		}
		return selectedTagsList.every(tag => market.tags.some(marketTag => marketTag.name === tag));
	}

	function canDisplay(market) {
		if (!market.malFormed && !market.isRequiredToReportByAccount) {
			return true;
		}
	}
});
