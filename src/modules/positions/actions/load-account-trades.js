import * as AugurJS from '../../../services/augurjs';

import { updateAccountTradesData } from '../../positions/actions/update-account-trades-data';

export function loadAccountTrades() {
	return (dispatch, getState) => {
		AugurJS.loadAccountTrades(getState().loginAccount.id, (err, accountTrades) => {
			if (err) {
				console.log('ERROR loadAccountTrades', err);
				return;
			}
			if (!accountTrades) {
				return;
			}
			dispatch(updateAccountTradesData(accountTrades || null));
		});
	};
}

/*
export function loadMeanTradePrices() {
    return (dispatch, getState) => {
        var { loginAccount } = getState();
        AugurJS.loadMeanTradePrices(loginAccount.id, (err, meanTradePrices) => {
console.log('========loadMeanTradePrices>>>>', err, meanTradePrices);
            if (err) {
                return console.info('ERR loadMeanTradePrices():', err);
            }

            if (meanTradePrices) {
                dispatch(updatePositionsData(meanTradePrices));
            }
        });
    };
}
*/
