import immutableDelete from "immutable-delete";
import {
  UPDATE_MARKETS_DATA,
  CLEAR_MARKETS_DATA,
  UPDATE_MARKET_CATEGORY,
  UPDATE_MARKET_REP_BALANCE,
  UPDATE_MARKET_FROZEN_SHARES_VALUE,
  UPDATE_MARKETS_DISPUTE_INFO,
  REMOVE_MARKET,
  UPDATE_MARKET_ETH_BALANCE
} from "modules/markets/actions/update-markets-data";
import { CLEAR_LOGIN_ACCOUNT } from "modules/auth/actions/update-login-account";
import { RESET_STATE } from "modules/app/actions/reset-state";

const DEFAULT_STATE = {};

export default function(marketsData = DEFAULT_STATE, action) {
  switch (action.type) {
    case UPDATE_MARKETS_DATA: // TODO -- allow for the consumption of partial market objects
      return {
        ...marketsData,
        ...processMarketsData(action.data.marketsData, marketsData)
      };
    case UPDATE_MARKETS_DISPUTE_INFO:
      return {
        ...marketsData,
        ...processMarketsDisputeInfo(
          action.data.marketsDisputeInfo,
          marketsData
        )
      };
    case UPDATE_MARKET_CATEGORY: {
      const { marketId, category } = action.data;
      if (!marketId) return marketsData;
      return {
        ...marketsData,
        [marketId]: {
          ...marketsData[marketId],
          category
        }
      };
    }
    case UPDATE_MARKET_REP_BALANCE: {
      const { marketId, repBalance } = action.data;
      if (!marketId) return marketsData;
      return {
        ...marketsData,
        [marketId]: {
          ...marketsData[marketId],
          repBalance
        }
      };
    }
    case UPDATE_MARKET_ETH_BALANCE: {
      const { marketId, ethBalance } = action.data;
      if (!marketId) return marketsData;
      return {
        ...marketsData,
        [marketId]: {
          ...marketsData[marketId],
          ethBalance
        }
      };
    }
    case UPDATE_MARKET_FROZEN_SHARES_VALUE: {
      const { marketId, frozenSharesValue } = action.data;
      if (!marketId) return marketsData;
      return {
        ...marketsData,
        [marketId]: {
          ...marketsData[marketId],
          frozenSharesValue
        }
      };
    }
    case REMOVE_MARKET:
      return immutableDelete(marketsData, action.data.marketId);
    case RESET_STATE:
    case CLEAR_MARKETS_DATA:
      return DEFAULT_STATE;
    default:
      return marketsData;
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

function processMarketsDisputeInfo(newMarketsDisputeInfo, existingMarketsData) {
  return Object.keys(newMarketsDisputeInfo).reduce((p, marketId) => {
    const marketData = {
      ...existingMarketsData[marketId],
      disputeInfo: { ...newMarketsDisputeInfo[marketId] }
    };

    p[marketId] = marketData;

    return p;
  }, {});
}
