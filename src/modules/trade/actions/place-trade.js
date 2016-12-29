import BigNumber from 'bignumber.js';
import { BUY, SELL } from '../../trade/constants/types';
import { SCALAR } from '../../markets/constants/market-types';
import { augur, abi, constants } from '../../../services/augurjs';
import { selectMarket } from '../../market/selectors/market';
import { clearTradeInProgress } from '../../trade/actions/update-trades-in-progress';
import { updateTradeCommitLock } from '../../trade/actions/update-trade-commit-lock';
import { calculateSellTradeIDs, calculateBuyTradeIDs } from '../../trade/actions/helpers/calculate-trade-ids';
import { addTradeTransaction } from '../../transactions/actions/add-trade-transaction';
import { addShortSellTransaction } from '../../transactions/actions/add-short-sell-transaction';

export function placeTrade(marketID, outcomeID) {
	return (dispatch, getState) => {
		const { loginAccount, orderBooks, outcomesData, tradesInProgress } = getState();
		const outcomeTradeInProgress = tradesInProgress[marketID];
		const market = selectMarket(marketID);
		if (!outcomeTradeInProgress || !market || !outcomeTradeInProgress.limitPrice || !outcomeTradeInProgress.numShares || !outcomeTradeInProgress.totalCost) {
			return console.error(outcomeTradeInProgress || 'outcome trade in progress not found');
		}
		console.log('outcomeTradeInProgress:', outcomeTradeInProgress);
		const marketData = getState().marketsData[marketID];
		const scalarMinMax = {};
		if (marketData && marketData.type === SCALAR) {
			scalarMinMax.minValue = marketData.minValue;
		}
		const totalCost = abi.bignum(outcomeTradeInProgress.totalCost).abs().toFixed();
		if (outcomeTradeInProgress.side === BUY) {
			const tradeIDs = calculateBuyTradeIDs(marketID, outcomeID, outcomeTradeInProgress.limitPrice, orderBooks, loginAccount.address);
			if (tradeIDs && tradeIDs.length) {
				dispatch(updateTradeCommitLock(true));
				dispatch(addTradeTransaction(
					BUY,
					marketID,
					outcomeID,
					market.type,
					market.description,
					outcomesData[marketID][outcomeID].name,
					outcomeTradeInProgress.numShares,
					outcomeTradeInProgress.limitPrice,
					totalCost,
					outcomeTradeInProgress.tradingFeesEth,
					outcomeTradeInProgress.feePercent,
					outcomeTradeInProgress.gasFeesRealEth));
			} else {
				augur.buy({
					amount: outcomeTradeInProgress.numShares,
					price: outcomeTradeInProgress.limitPrice,
					market: marketID,
					outcome: outcomeID,
					scalarMinMax,
					onSent: res => console.log('bid sent:', res),
					onSuccess: res => console.log('bid success:', res),
					onFailed: err => console.error('bid failed:', err)
				});
			}
		} else if (outcomeTradeInProgress.side === SELL) {

			// check if user has position
			//  - if so, sell/ask
			//  - if not, short sell/short ask
			augur.getParticipantSharesPurchased(marketID, loginAccount.address, outcomeID, (sharesPurchased) => {
				if (!sharesPurchased || sharesPurchased.error) {
					return console.error('getParticipantSharesPurchased:', sharesPurchased);
				}
				const position = abi.bignum(sharesPurchased).round(constants.PRECISION.decimals, BigNumber.ROUND_DOWN);
				const tradeIDs = calculateSellTradeIDs(marketID, outcomeID, outcomeTradeInProgress.limitPrice, orderBooks, loginAccount.address);
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
							outcomeTradeInProgress.numShares,
							outcomeTradeInProgress.limitPrice,
							totalCost,
							outcomeTradeInProgress.tradingFeesEth,
							outcomeTradeInProgress.feePercent,
							outcomeTradeInProgress.gasFeesRealEth));
					} else {
						let askShares;
						let shortAskShares;
						const numShares = abi.bignum(outcomeTradeInProgress.numShares);
						if (position.gt(numShares)) {
							askShares = outcomeTradeInProgress.numShares;
							shortAskShares = '0';
						} else {
							askShares = position.toFixed();
							shortAskShares = numShares.minus(position).toFixed();
						}
						augur.sell({
							amount: askShares,
							price: outcomeTradeInProgress.limitPrice,
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
								price: outcomeTradeInProgress.limitPrice,
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
							outcomeTradeInProgress.numShares,
							outcomeTradeInProgress.limitPrice,
							totalCost,
							outcomeTradeInProgress.tradingFeesEth,
							outcomeTradeInProgress.feePercent,
							outcomeTradeInProgress.gasFeesRealEth));
				} else {
					augur.shortAsk({
						amount: outcomeTradeInProgress.numShares,
						price: outcomeTradeInProgress.limitPrice,
						market: marketID,
						outcome: outcomeID,
						scalarMinMax,
						onSent: res => console.log('shortAsk sent:', res),
						onSuccess: res => console.log('shortAsk success:', res),
						onFailed: err => console.error('shortAsk failed:', err)
					});
				}
			});
		}
		dispatch(clearTradeInProgress(marketID));
	};
}
