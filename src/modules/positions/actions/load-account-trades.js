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

			const trades = Object.keys(accountTrades).reduce((p, accountTradeID) => {
				Object.keys(accountTrades[accountTradeID]).forEach(outcomeID => {
					accountTrades[accountTradeID][outcomeID].forEach(trade => {
						if (!p[trade.market]) {
							p[trade.market] = {};
						}
						if (!p[trade.market][outcomeID]) {
							p[trade.market][outcomeID] = [];
						}

						p[trade.market][outcomeID].push({
							qtyShares: parseFloat(trade.shares),
							purchasePrice: Math.abs(trade.cost)
						});
					});
				});
				return p;
			}, {});

			dispatch(updateAccountTradesData(trades));
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
