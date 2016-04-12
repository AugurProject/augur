import memoizerific from 'memoizerific';

export default function() {
    var { filteredMarkets } = require('../../../selectors');
    return selectReportMarkets(filteredMarkets);
}

export const selectReportMarkets = memoizerific(1)(function(markets) {
    return markets.filter(market => !!market.isPendingReport);
});
