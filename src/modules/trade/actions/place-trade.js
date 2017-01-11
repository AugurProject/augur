import async from 'async';
import BigNumber from 'bignumber.js';
import uuid from 'uuid';
import uuidParse from 'uuid-parse';
import { BUY, SELL } from '../../trade/constants/types';
import { augur, abi, constants } from '../../../services/augurjs';
import { clearTradeInProgress } from '../../trade/actions/update-trades-in-progress';
import { calculateSellTradeIDs, calculateBuyTradeIDs } from '../../trade/actions/helpers/calculate-trade-ids';
import { placeAsk, placeBid, placeShortAsk } from '../../trade/actions/make-order';
import { placeBuy, placeSell, placeShortSell } from '../../trade/actions/take-order';

export function placeTrade(marketID, outcomeID) {
	return (dispatch, getState) => {
		const { loginAccount, marketsData, orderBooks, tradesInProgress } = getState();
		const market = marketsData[marketID];
		if (!tradesInProgress[marketID] || !market) {
			return console.error(`trade-in-progress not found for ${marketID} ${outcomeID}`);
		}
		async.eachSeries(tradesInProgress[marketID], (tradeInProgress, nextTradeInProgress) => {
			if (!tradeInProgress.limitPrice || !tradeInProgress.numShares || !tradeInProgress.totalCost) {
				return nextTradeInProgress();
			}
			console.debug('tradeInProgress:', tradeInProgress);
			const totalCost = abi.bignum(tradeInProgress.totalCost).abs().toFixed();
			const limitPrice = tradeInProgress.limitPrice;
			const numShares = tradeInProgress.numShares;
			const tradingFees = tradeInProgress.tradingFeesEth;
			const tradeGroupID = abi.format_int256(new Buffer(uuidParse.parse(uuid.v4())).toString('hex'));
			if (tradeInProgress.side === BUY) {
				const tradeIDs = calculateBuyTradeIDs(marketID, outcomeID, limitPrice, orderBooks, loginAccount.address);
				if (tradeIDs && tradeIDs.length) {
					dispatch(placeBuy(market, outcomeID, numShares, limitPrice, totalCost, tradingFees, tradeGroupID));
				} else {
					placeBid(market, outcomeID, numShares, limitPrice, tradeGroupID);
				}
				nextTradeInProgress();
			} else if (tradeInProgress.side === SELL) {

				// check if user has position
				//  - if so, sell/ask
				//  - if not, short sell/short ask
				augur.getParticipantSharesPurchased(marketID, loginAccount.address, outcomeID, (sharesPurchased) => {
					if (!sharesPurchased || sharesPurchased.error) {
						return nextTradeInProgress('getParticipantSharesPurchased:', sharesPurchased);
					}
					const position = abi.bignum(sharesPurchased).round(constants.PRECISION.decimals, BigNumber.ROUND_DOWN);
					const tradeIDs = calculateSellTradeIDs(marketID, outcomeID, limitPrice, orderBooks, loginAccount.address);
					if (position && position.gt(constants.PRECISION.zero)) {
						if (tradeIDs && tradeIDs.length) {
							dispatch(placeSell(market, outcomeID, numShares, limitPrice, totalCost, tradingFees, tradeGroupID));
						} else {
							let askShares;
							let shortAskShares;
							const bnNumShares = abi.bignum(numShares);
							if (position.gt(bnNumShares)) {
								askShares = numShares;
								shortAskShares = '0';
							} else {
								askShares = position.toFixed();
								shortAskShares = bnNumShares.minus(position).toFixed();
							}
							placeAsk(market, outcomeID, askShares, limitPrice, tradeGroupID);
							if (abi.bignum(shortAskShares).gt(constants.PRECISION.zero)) {
								placeShortAsk(market, outcomeID, shortAskShares, limitPrice, tradeGroupID);
							}
						}
					} else if (tradeIDs && tradeIDs.length) {
						dispatch(placeShortSell(market, outcomeID, numShares, limitPrice, totalCost, tradingFees, tradeGroupID));
					} else {
						placeShortAsk(market, outcomeID, numShares, limitPrice, tradeGroupID);
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
