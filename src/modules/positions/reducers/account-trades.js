import {
  UPDATE_ACCOUNT_TRADES_DATA,
  CLEAR_ACCOUNT_TRADES
} from "modules/positions/actions/update-account-trades-data";
import { CLEAR_LOGIN_ACCOUNT } from "modules/auth/actions/update-login-account";
import { RESET_STATE } from "modules/app/actions/reset-state";

const DEFAULT_STATE = {};

export default function(accountTrades = DEFAULT_STATE, { type, data }) {
  switch (type) {
    case UPDATE_ACCOUNT_TRADES_DATA: {
      const { tradeData, market } = data;
      const updatedMarketOutcomes = Object.keys(tradeData || {}).reduce(
        (p, outcome) => {
          const filteredTrades = tradeData[outcome].filter(actionTrade => {
            const hasIdenticalTrade = (
              (!!accountTrades[market] && accountTrades[market][outcome]) ||
              []
            ).find(
              trade => trade.transactionHash === actionTrade.transactionHash
            );
            if (hasIdenticalTrade) return false;
            return true;
          });

          return {
            ...p,
            [outcome]: [
              ...((!!accountTrades[market] && accountTrades[market][outcome]) ||
                []),
              ...filteredTrades
            ]
          };
        },
        accountTrades[market] || {}
      );

      return {
        ...accountTrades,
        [market]: {
          ...updatedMarketOutcomes
        }
      };
    }
    case RESET_STATE:
    case CLEAR_LOGIN_ACCOUNT:
    case CLEAR_ACCOUNT_TRADES:
      return DEFAULT_STATE;
    default:
      return accountTrades;
  }
}
