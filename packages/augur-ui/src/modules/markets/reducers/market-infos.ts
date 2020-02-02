import immutableDelete from "immutable-delete";
import {
  UPDATE_MARKETS_DATA,
  CLEAR_MARKETS_DATA,
  UPDATE_MARKET_CATEGORY,
  UPDATE_MARKET_REP_BALANCE,
  UPDATE_MARKET_FROZEN_SHARES_VALUE,
  REMOVE_MARKET,
  UPDATE_MARKET_ETH_BALANCE,
  SET_MARKET_ORDERBOOK_DIRTY
} from "modules/markets/actions/update-markets-data";

import { RESET_STATE, SWITCH_UNIVERSE } from "modules/app/actions/reset-state";
import { MarketInfos, BaseAction } from "modules/types";

const DEFAULT_STATE: MarketInfos = {};

export default function(marketInfos: MarketInfos = DEFAULT_STATE, { type, data }: BaseAction): MarketInfos {
  switch (type) {
    case UPDATE_MARKETS_DATA: // TODO -- allow for the consumption of partial market objects
      return {
        ...marketInfos,
        ...processMarketsData(data.marketInfos, marketInfos)
      };
    case UPDATE_MARKET_CATEGORY: {
      const { marketId, category } = data;
      if (!marketId) return marketInfos;
      return {
        ...marketInfos,
        [marketId]: {
          ...marketInfos[marketId],
          category
        }
      };
    }
    case UPDATE_MARKET_REP_BALANCE: {
      const { marketId, repBalance } = data;
      if (!marketId) return marketInfos;
      return {
        ...marketInfos,
        [marketId]: {
          ...marketInfos[marketId],
          repBalance
        }
      };
    }
    case UPDATE_MARKET_ETH_BALANCE: {
      const { marketId, ethBalance } = data;
      if (!marketId) return marketInfos;
      return {
        ...marketInfos,
        [marketId]: {
          ...marketInfos[marketId],
          ethBalance
        }
      };
    }
    case UPDATE_MARKET_FROZEN_SHARES_VALUE: {
      const { marketId, frozenSharesValue } = data;
      if (!marketId) return marketInfos;
      return {
        ...marketInfos,
        [marketId]: {
          ...marketInfos[marketId],
          frozenSharesValue
        }
      };
    }
    case SET_MARKET_ORDERBOOK_DIRTY: {
      const { marketId } = data;
      if (!marketId) return marketInfos;
      if (!marketInfos[marketId]) return marketInfos;
      return {
        ...marketInfos,
        [marketId]: {
          ...marketInfos[marketId],
          orderBookDirtyCounter: (marketInfos[marketId].orderBookDirtyCounter || 0) + 1,
        }
      };
    }
    case REMOVE_MARKET:
      return immutableDelete(marketInfos, data.marketId);
    case SWITCH_UNIVERSE:
    case RESET_STATE:
    case CLEAR_MARKETS_DATA:
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
