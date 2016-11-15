import memoizerific from 'memoizerific';
import { cleanKeywordsArray } from '../../../utils/clean-keywords';
import store from '../../../store';
import { FILTER_TYPE_OPEN, FILTER_TYPE_CLOSED, FILTER_TYPE_REPORTED } from '../../markets/constants/filter-sort';
import { isMarketDataExpired } from '../../../utils/is-market-data-open';

export default function () {
	const { keywords, selectedFilterSort, selectedTags } = store.getState();
	const { allMarkets } = require('../../../selectors');
	return selectFilteredMarkets(allMarkets, keywords, selectedFilterSort, selectedTags);
}

export const selectFilteredMarkets = memoizerific(3)((markets, keywords, selectedFilterSort, selectedTags) => {
	const currentTime = new Date().getTime();
	return markets.filter(market => isMarketFiltersMatch(market, keywords, selectedFilterSort, selectedTags, currentTime));
});

export const isMarketFiltersMatch = (market, keywords, selectedFilterSort, selectedTags, currentTime) => {

	const selectedTagsList = Object.keys(selectedTags);
	return isMatchKeywords(market, keywords) && isMatchTags(market, selectedTagsList) && isOfType(market, selectedFilterSort.type) && isDisplayable(market);

	function isMatchKeywords(market, keys) {
		const keywordsArray = cleanKeywordsArray(keys);
		if (!keywordsArray.length) {
			return true;
		}
		return keywordsArray.every(keyword => (
			market.description.toLowerCase().indexOf(keyword) >= 0 ||
			market.outcomes.some(outcome => outcome.name && outcome.name.indexOf(keyword) >= 0) ||
			market.tags.some(tag => tag.name.indexOf(keyword) >= 0)
		));
	}

	function isOfType(market, type) {
		switch (type) {
		case (FILTER_TYPE_CLOSED):
			return isMarketDataExpired(market, currentTime);
		case (FILTER_TYPE_REPORTED):
			return isMarketDataExpired(market, currentTime) && !!market.result;
		case (FILTER_TYPE_OPEN):
		default:
			return !isMarketDataExpired(market, currentTime);
		}
	}

	function isMatchTags(market, selectedTagsList) {
		if (!selectedTagsList.length) {
			return true;
		}
		return selectedTagsList.every(tag => market.tags.some(marketTag => marketTag.name === tag));
	}

	function isDisplayable(market) {
		if (!market.isMalFormed && !market.isRequiredToReportByAccount) {
			return true;
		}
	}
};
