import { UPDATE_MARKETS_DATA, UPDATE_MARKET_DATA } from '../../markets/actions/markets-actions';

export default function(markets = {}, action) {
    switch (action.type) {
        case UPDATE_MARKETS_DATA:
            return {
                ...markets,
                ...action.marketsData
            };

        case UPDATE_MARKET_DATA:
            return {
                ...markets,
                [action.marketData.id]: {
                	...markets[action.marketData.id],
                	...action.marketData
                }
            };

        default:
            return markets;
    }
}