import { UPDATE_ACCOUNT_TRADES_DATA } from '../../positions/actions/update-account-trades-data';
import { CLEAR_LOGIN_ACCOUNT } from '../../auth/actions/update-login-account';

export default function(accountTrades = {}, action) {
    switch (action.type) {
        case UPDATE_ACCOUNT_TRADES_DATA:
            return {
                ...accountTrades,
                ...action.data
            };

        case CLEAR_LOGIN_ACCOUNT:
            return {};

        default:
            return accountTrades;
    }
}