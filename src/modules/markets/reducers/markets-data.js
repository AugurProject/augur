import { UPDATE_MARKETS_DATA, UPDATE_MARKET_DATA } from '../../markets/actions/update-markets-data';

export default function(marketsData = {}, action) {
    switch (action.type) {
        case UPDATE_MARKETS_DATA:
            return {
                ...marketsData,
                ...action.marketsData
            };

        case UPDATE_MARKET_DATA:
            return {
                ...marketsData,
                [action.marketData.id]: {
                	...marketsData[action.marketData.id],
                	...action.marketData
                }
            };

        default:
            return marketsData;
    }
}