import async from 'async';
import BigNumber from 'bignumber.js';
import { BUY, SELL } from '../../trade/constants/types';
import { SCALAR } from '../../markets/constants/market-types';
import { augur, abi, constants } from '../../../services/augurjs';
import { selectMarket } from '../../market/selectors/market';
import { clearTradeInProgress } from '../../trade/actions/update-trades-in-progress';
import { updateTradeCommitLock } from '../../trade/actions/update-trade-commit-lock';
import { calculateSellTradeIDs, calculateBuyTradeIDs } from '../../trade/actions/helpers/calculate-trade-ids';
import { addShortSellTransaction } from '../../transactions/actions/add-short-sell-transaction';
import { addTradeTransaction } from '../../transactions/actions/add-trade-transaction';

export function placeTrade(marketID, outcomeID) {
	return (dispatch, getState) => {
		const { loginAccount, orderBooks, outcomesData, tradesInProgress } = getState();
		const outcomeTradeInProgress = tradesInProgress[marketID];
		const market = selectMarket(marketID);
		if (!outcomeTradeInProgress || !market) {
			return console.error(`trade-in-progress not found for ${marketID} ${outcomeID}`);
		}
		async.eachSeries(tradesInProgress[marketID], (tradeInProgress, nextTradeInProgress) => {
			if (!tradeInProgress.limitPrice || !tradeInProgress.numShares || !tradeInProgress.totalCost) {
				return nextTradeInProgress();
			}
			console.log('tradeInProgress:', tradeInProgress);
			const marketData = getState().marketsData[marketID];
			const scalarMinMax = {};
			if (marketData && marketData.type === SCALAR) {
				scalarMinMax.minValue = marketData.minValue;
			}
			const address = loginAccount.address;
			const totalCost = abi.bignum(tradeInProgress.totalCost).abs().toFixed();
			const limitPrice = tradeInProgress.limitPrice;
			const numShares = tradeInProgress.numShares;
			const feePercent = tradeInProgress.feePercent;
			const gasFeesRealEth = tradeInProgress.gasFeesRealEth;
			const tradingFeesEth = tradeInProgress.tradingFeesEth;
			if (tradeInProgress.side === BUY) {
				const tradeIDs = calculateBuyTradeIDs(marketID, outcomeID, limitPrice, orderBooks, address);
				if (tradeIDs && tradeIDs.length) {
					dispatch(updateTradeCommitLock(true));
					dispatch(addTradeTransaction(
						BUY,
						marketID,
						outcomeID,
						market.type,
						market.description,
						outcomesData[marketID][outcomeID].name,
						numShares,
						limitPrice,
						totalCost,
						tradingFeesEth,
						feePercent,
						gasFeesRealEth));
				} else {
					augur.buy({
						amount: numShares,
						price: limitPrice,
						market: marketID,
						outcome: outcomeID,
						scalarMinMax,
						onSent: res => console.log('bid sent:', res),
						onSuccess: res => console.log('bid success:', res),
						onFailed: err => console.error('bid failed:', err)
					});
				}
				nextTradeInProgress();
			} else if (tradeInProgress.side === SELL) {

				// check if user has position
				//  - if so, sell/ask
				//  - if not, short sell/short ask
				augur.getParticipantSharesPurchased(marketID, address, outcomeID, (sharesPurchased) => {
					if (!sharesPurchased || sharesPurchased.error) {
						return nextTradeInProgress('getParticipantSharesPurchased:', sharesPurchased);
					}
					const position = abi.bignum(sharesPurchased).round(constants.PRECISION.decimals, BigNumber.ROUND_DOWN);
					const tradeIDs = calculateSellTradeIDs(marketID, outcomeID, limitPrice, orderBooks, address);
					if (position && position.gt(constants.PRECISION.zero)) {
						if (tradeIDs && tradeIDs.length) {
							dispatch(updateTradeCommitLock(true));
							dispatch(addTradeTransaction(
								SELL,
								marketID,
								outcomeID,
								market.type,
								market.description,
								outcomesData[marketID][outcomeID].name,
								numShares,
								limitPrice,
								totalCost,
								tradingFeesEth,
								feePercent,
								gasFeesRealEth));
						} else {
							let askShares;
							let shortAskShares;
							const numShares = abi.bignum(numShares);
							if (position.gt(numShares)) {
								askShares = numShares;
								shortAskShares = '0';
							} else {
								askShares = position.toFixed();
								shortAskShares = numShares.minus(position).toFixed();
							}
							augur.sell({
								amount: askShares,
								price: limitPrice,
								market: marketID,
								outcome: outcomeID,
								scalarMinMax,
								onSent: res => console.log('ask sent:', res),
								onSuccess: res => console.log('ask success:', res),
								onFailed: err => console.error('ask failed:', err)
							});
							if (abi.bignum(shortAskShares).gt(constants.PRECISION.zero)) {
								augur.shortAsk({
									amount: shortAskShares,
									price: limitPrice,
									market: marketID,
									outcome: outcomeID,
									scalarMinMax,
									onSent: res => console.log('shortAsk sent:', res),
									onSuccess: res => console.log('shortAsk success:', res),
									onFailed: err => console.error('shortAsk failed:', err)
								});
							}
						}
					} else if (tradeIDs && tradeIDs.length) {
						dispatch(updateTradeCommitLock(true));
						dispatch(addShortSellTransaction(
								marketID,
								outcomeID,
								market.type,
								market.description,
								outcomesData[marketID][outcomeID].name,
								numShares,
								limitPrice,
								totalCost,
								tradingFeesEth,
								feePercent,
								gasFeesRealEth));
					} else {
						augur.shortAsk({
							amount: numShares,
							price: limitPrice,
							market: marketID,
							outcome: outcomeID,
							scalarMinMax,
							onSent: res => console.log('shortAsk sent:', res),
							onSuccess: res => console.log('shortAsk success:', res),
							onFailed: err => console.error('shortAsk failed:', err)
						});
					}
					nextTradeInProgress();
				});
			}
		}, (err) => {
			if (err) console.error('place trade:', err);
			dispatch(clearTradeInProgress(marketID));
		});
	};
}
