import { UPDATE_ACCOUNT_TRADES_DATA } from '../../../modules/my-positions/actions/update-account-trades-data';
import { CLEAR_ACCOUNT_TRADES } from '../../../modules/my-positions/actions/clear-account-trades';
import { CLEAR_LOGIN_ACCOUNT } from '../../auth/actions/update-login-account';

const DEFAULT_STATE = {};

export default function (accountTrades = DEFAULT_STATE, action) {
  switch (action.type) {
    case UPDATE_ACCOUNT_TRADES_DATA: {
      const updatedMarketOutcomes = Object.keys(action.data || {}).reduce((p, outcome) => {
        const filteredTrades = action.data[outcome].filter((actionTrade) => {
          const hasIdenticalTrade = (p[outcome] || []).find(trade => trade.tradid === actionTrade.tradeid);
          if (hasIdenticalTrade) return false;
          return true;
        });

        console.log(action.data.outcome === filteredTrades);

        return {
          ...p,
          [outcome]: [
            ...((!!accountTrades[action.market] && accountTrades[action.market][outcome]) || []),
            ...filteredTrades
          ]
        };
      }, (accountTrades[action.market] || {}));

      return {
        ...accountTrades,
        [action.market]: {
          ...updatedMarketOutcomes
        }
      };
    }
    case CLEAR_LOGIN_ACCOUNT:
      return DEFAULT_STATE;
    case CLEAR_ACCOUNT_TRADES:
      return DEFAULT_STATE;
    default:
      return accountTrades;
  }
}
