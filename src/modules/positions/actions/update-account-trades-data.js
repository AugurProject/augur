export const UPDATE_ACCOUNT_TRADES_DATA = 'UPDATE_ACCOUNT_TRADES_DATA';

export function updateAccountTradesData(data) {
    return { type: UPDATE_ACCOUNT_TRADES_DATA, data };
}