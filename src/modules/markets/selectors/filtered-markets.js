import memoizerific from 'memoizerific';

import { CleanKeywordsArray } from '../../../utils/clean-keywords';

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
            (market.tags || []).some(tag => tag.toLowerCase().indexOf(keyword) >= 0)
        ));
    }

    function isMatchFilters(market, selectedFilters) {
        var selectedStatusProps,
            selectedTypeProps;

        selectedStatusProps = ['isOpen', 'isExpired'].filter(statusProp => !!selectedFilters[statusProp]);
        selectedTypeProps = ['isBinary', 'isCategorical', 'isScalar'].filter(typeProp => !!selectedFilters[typeProp]);

        return (
            (!selectedStatusProps.length || selectedStatusProps.some(status => !!market[status])) &&
            (!selectedTypeProps.length || selectedTypeProps.some(type => !!market[type]))
        );
    }
});