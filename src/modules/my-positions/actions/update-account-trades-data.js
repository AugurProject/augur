import { abi } from '../../../services/augurjs';
import { SUCCESS } from '../../transactions/constants/statuses';
import { BINARY, SCALAR } from '../../markets/constants/market-types';
import { CATEGORICAL_SCALAR_INDETERMINATE_OUTCOME_ID, INDETERMINATE_OUTCOME_NAME, BINARY_NO_OUTCOME_NAME, BINARY_YES_OUTCOME_NAME } from '../../markets/constants/market-outcomes';
import { formatEther, formatPercent, formatShares } from '../../../utils/format-number';
import { formatDate } from '../../../utils/format-date';
import { updateTransactionsData } from '../../transactions/actions/update-transactions-data';
import { selectMarketLink } from '../../link/selectors/links';

export const UPDATE_ACCOUNT_TRADES_DATA = 'UPDATE_ACCOUNT_TRADES_DATA';
export const UPDATE_ACCOUNT_POSITIONS_DATA = 'UPDATE_ACCOUNT_POSITIONS_DATA';
export const UPDATE_COMPLETE_SETS_BOUGHT = 'UPDATE_COMPLETE_SETS_BOUGHT';
export const UPDATE_NET_EFFECTIVE_TRADES_DATA = 'UPDATE_NET_EFFECTIVE_TRADES_DATA';
export const UPDATE_SELL_COMPLETE_SETS_LOCK = 'UPDATE_SELL_COMPLETE_SETS_LOCK';
export const UPDATE_SMALLEST_POSITIONS = 'UPDATE_SMALLEST_POSITIONS';

export function updateSmallestPositions(marketID, smallestPosition) {
	return (dispatch) => {
		dispatch({ type: UPDATE_SMALLEST_POSITIONS, marketID, smallestPosition });
	};
}

export function updateSellCompleteSetsLock(marketID, isLocked) {
	return (dispatch) => {
		dispatch({ type: UPDATE_SELL_COMPLETE_SETS_LOCK, marketID, isLocked });
	};
}

export function updateAccountTradesData(data, marketID) {
	return (dispatch, getState) => {
		const { marketsData, outcomesData } = getState();
		const marketIDs = Object.keys(data);
		const numMarkets = marketIDs.length;
		let marketID;
		let outcomeIDs;
		let numOutcomes;
		let outcomeID;
		let trade;
		let numTrades;
		let description;
		let outcome;
		let marketType;
		let marketOutcomesData;
		for (let i = 0; i < numMarkets; ++i) {
			marketID = marketIDs[i];
			outcomeIDs = Object.keys(data[marketID]);
			numOutcomes = outcomeIDs.length;
			for (let j = 0; j < numOutcomes; ++j) {
				outcomeID = outcomeIDs[j];
				numTrades = data[marketID][outcomeID].length;
				marketOutcomesData = outcomesData[marketID];
				if (numTrades) {
					for (let k = 0; k < numTrades; ++k) {
						trade = data[marketID][outcomeID][k];
						marketType = marketsData[marketID] && marketsData[marketID].type;
						if (marketType === BINARY) {
							if (outcomeID === '1') {
								outcome = { name: BINARY_NO_OUTCOME_NAME };
							} else if (outcomeID === '2') {
								outcome = { name: BINARY_YES_OUTCOME_NAME };
							} else {
								outcome = { name: INDETERMINATE_OUTCOME_NAME };
							}
						} else {
							if (outcomeID === CATEGORICAL_SCALAR_INDETERMINATE_OUTCOME_ID) {
								outcome = { name: INDETERMINATE_OUTCOME_NAME };
							} else {
								if (marketType === SCALAR) {
									outcome = marketOutcomesData ? marketOutcomesData[1] : {};
								} else {
									outcome = marketOutcomesData ? marketOutcomesData[outcomeID] : {};
								}
							}
						}
						description = marketsData[marketID] && marketsData[marketID].description;
						console.log('trade:', trade);
						const type = trade.type === 1 ? 'buy' : 'sell';
						const perfectType = trade.type === 1 ? 'bought' : 'sold';
						const price = formatEther(trade.price);
						const shares = formatShares(trade.shares);
						const tradingFees = abi.bignum(trade.takerFee);
						const bnShares = abi.bignum(trade.shares);
						const bnPrice = abi.bignum(trade.price);
						const totalCost = bnPrice.times(bnShares).plus(tradingFees);
						const totalCostPerShare = totalCost.dividedBy(bnShares);
						const totalReturn = bnPrice.times(bnShares).minus(tradingFees);
						const utd = {
							[trade.transactionHash]: {
								type,
								status: SUCCESS,
								data: {
									marketDescription: description,
									marketType: marketsData[marketID] && marketsData[marketID].type,
									outcomeName: outcome.name || outcomeID,
									marketLink: selectMarketLink({ id: marketID, description }, dispatch)
								},
								message: `${perfectType} ${shares.full} for ${formatEther(totalCostPerShare).full} / share`,
								numShares: shares,
								noFeePrice: price,
								avgPrice: price,
								timestamp: formatDate(new Date(trade.timestamp * 1000)),
								hash: trade.transactionHash,
								tradingFees: formatEther(tradingFees),
								feePercent: formatPercent(tradingFees.dividedBy(totalCost).times(100)),
								totalCost: trade.type === 1 ? formatEther(totalCost) : undefined,
								totalReturn: trade.type === 2 ? formatEther(totalReturn) : undefined
							}
						};
						console.log(JSON.stringify(utd, null, 2));
						dispatch(updateTransactionsData(utd));
					}
				}
			}
		}
		dispatch({ type: UPDATE_ACCOUNT_TRADES_DATA, data, marketID });
	};
}

export function updateAccountPositionsData(data, marketID) {
	return (dispatch) => {
		dispatch({ type: UPDATE_ACCOUNT_POSITIONS_DATA, data, marketID });
	};
}

export function updateNetEffectiveTradesData(data, marketID) {
	return (dispatch) => {
		dispatch({ type: UPDATE_NET_EFFECTIVE_TRADES_DATA, data, marketID });
	};
}

export function updateCompleteSetsBought(data, marketID) {
	return (dispatch) => {
		dispatch({ type: UPDATE_COMPLETE_SETS_BOUGHT, data, marketID });
	};
}
