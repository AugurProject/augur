import memoizerific from 'memoizerific';

import { CleanKeywordsArray } from '../../../utils/clean-keywords';

import { MARKET_TYPES, BINARY, CATEGORICAL, SCALAR, COMBINATORIAL } from '../../markets/constants/market-types';
import { MARKET_STATUSES, OPEN, RECENTLY_EXPIRED } from '../../markets/constants/market-statuses';

import store from '../../../store';


export const selectFilteredMarkets = memoizerific(3)(function(markets, keywords, selectedFilters) {
    return markets.filter(market => isMarketFiltersMatch(market, keywords, selectedFilters));
});

export const isMarketFiltersMatch = memoizerific(3)(function(market, keywords, selectedFilters) {
    return isMatchKeywords(market, keywords) && isMatchFilters(market, selectedFilters);

    function isMatchKeywords(market, keywords) {
        var keywordsArray = CleanKeywordsArray(keywords);
        if (!keywordsArray.length) {
            return true;
        }
        return keywordsArray.every(keyword => (
            market.description.toLowerCase().indexOf(keyword) >= 0 ||
            market.outcomes.some(outcome => outcome.name.indexOf(keyword) >= 0) ||
            market.tags.some(tag => tag.toLowerCase().indexOf(keyword) >= 0)
        ));
    }

    function isMatchFilters(market, selectedFilters) {
        var isMatch = false,
            atleastOneSelected = false;

        // statuses (open, recently_expired, etc.)
        atleastOneSelected = false;

        isMatch = Object.keys(MARKET_STATUSES).some(marketStatus => {
        	if (!selectedFilters[marketStatus]) {
        		return false;
        	}
        	atleastOneSelected = true;
            if (market.isOpen === (marketStatus === OPEN)) {
                return true;
            }
        });

        if (atleastOneSelected && !isMatch) {
        	return false;
        }

        // types (yes/no, categorical, scalar, etc.)
        atleastOneSelected = false;
        isMatch = Object.keys(MARKET_TYPES).some(marketType => {
        	if (!selectedFilters[marketType]) {
        		return false;
        	}
        	atleastOneSelected = true;
            if (market.type === marketType) {
                return true;
            }
        });

        if (atleastOneSelected && !isMatch) {
        	return false;
        }

        return true;
    }
});