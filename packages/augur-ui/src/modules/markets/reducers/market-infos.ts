import immutableDelete from "immutable-delete";
import {
  UPDATE_MARKETS_DATA,
  REMOVE_MARKET,
} from "modules/markets/actions/update-markets-data";

import { RESET_STATE, SWITCH_UNIVERSE } from "modules/app/actions/reset-state";
import { MarketInfos, BaseAction } from "modules/types";

const DEFAULT_STATE: MarketInfos = {};

export default function(marketInfos: MarketInfos = DEFAULT_STATE, { type, data }: BaseAction): MarketInfos {
  switch (type) {
    case UPDATE_MARKETS_DATA:
      return {
        ...marketInfos,
        ...processMarketsData(data.marketInfos, marketInfos)
      };
    case REMOVE_MARKET:
      return immutableDelete(marketInfos, data.marketId);
    case SWITCH_UNIVERSE:
    case RESET_STATE:
      return DEFAULT_STATE;
    default:
      return marketInfos;
  }
}

function processMarketsData(newMarketsData, existingMarketsData) {
  return Object.keys(newMarketsData).reduce((p, marketId) => {
    const marketData = {
      ...existingMarketsData[marketId],
      ...newMarketsData[marketId]
    };

    p[marketId] = marketData;

    return p;
  }, {});
}
