import memoizerific from 'memoizerific';

export default function() {
    var { filteredMarkets } = require('../../../selectors');
    return selectFavoriteMarkets(filteredMarkets);
}

export const selectFavoriteMarkets = memoizerific(1)(function(markets) {
    return markets.filter(market => !!market.isFavorite);
});
