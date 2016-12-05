import { assert } from 'chai';
export { BINARY, SCALAR, CATEGORICAL } from '../../src/modules/markets/constants/market-types';
export { BUY, SELL } from '../../src/modules/trade/constants/types';
export { BID, ASK } from '../../src/modules/bids-asks/constants/bids-asks-types';
import { formatPercent, formatShares, formatEther, formatRealEther } from '../../src/utils/format-number';
import { abi } from '../../src/services/augurjs';

export const tradeTestState = {
	loginAccount: {
		address: 'testUser1',
		id: 'testUser1',
		name: 'test',
		loginID: 'longLoginID',
		localNode: false,
		prettyAddress: '0000...ser1',
		prettyLoginID: 'long...inID',
		ether: '10000.00',
		realEther: '5.0',
		rep: '50.0',
		keystore: { id: 'testUser1' }
	},
	selectedMarketID: 'testBinaryMarketID',
	marketsData: {
		testBinaryMarketID: {
			author: 'testAuthor1',
			branchID: '0x010101',
			creationFee: '22.5',
			creationTime: 1475951522,
			cumulativeScale: '1',
			description: 'test binary market?',
			endDate: 1495317600,
			eventID: 'testEventID1',
			isEthical: undefined,
			isLoadedMarketInfo: true,
			makerFee: '0.002',
			maxValue: '2',
			minValue: '1',
			network: '2',
			numEvents: 1,
			numOutcomes: 2,
			reportedOutcome: undefined,
			sortOrder: 0,
			tags: [
				'binary',
				'markets',
				null
			],
			takerFee: '0.01',
			tradingFee: '0.008',
			tradingPeriod: 8653,
			type: 'binary',
			volume: '3030',
			winningOutcomes: []
		},
		testCategoricalMarketID: {
			author: 'testAuthor2',
			branchId: '0x010101',
			creationFee: '12.857142857142857142',
			creationTime: 1476694751,
			cumulativeScale: '1',
			description: 'test categorical market?',
			endDate: 2066554498,
			eventID: 'testEventID2',
			extraInfo: 'extra info',
			isEthical: undefined,
			isLoadedMarketInfo: true,
			makerFee: '0.001000000000000000006',
			maxValue: '2',
			minValue: '1',
			network: '2',
			numEvents: 1,
			numOutcomes: 4,
			reportedOutcome: undefined,
			resolution: 'http://lmgtfy.com',
			sortOrder: 7,
			tags: ['categorical', 'markets', 'test'],
			takerFee: '0.019999999999999999994',
			tradingFee: '0.014',
			tradingPeriod: 11959,
			type: 'categorical',
			volume: '0',
			winningOutcomes: []
		},
		testScalarMarketID: {
			author: 'testAuthor3',
			branchID: '0x010101',
			creationFee: '9',
			creationTime: 1476486515,
			cumulativeScale: '130',
			description: 'test scalar market?',
			endDate: 1496514800,
			eventID: 'testEventID3',
			isEthical: undefined,
			isLoadedMarketInfo: true,
			makerFee: '0.01',
			maxValue: '120',
			minValue: '-10',
			network: '2',
			numEvents: 1,
			numOutcomes: 2,
			reportedOutcome: undefined,
			resolution: 'https://www.resolution-of-market.com',
			sortOrder: 3,
			tags: [
				'scalar',
				'markets',
				'test'
			],
			takerFee: '0.02',
			tradingFee: '0.02',
			tradingPeriod: 8544,
			type: 'scalar',
			volume: '0',
			winningOutcomes: []
		},
	}, outcomesData: {
		testBinaryMarketID: {
			2: {
				id: 2,
				name: 'Yes',
				outstandingShares: '1005',
				price: '0.5',
				sharesPurchased: '0'
			},
			1: {
				id: 1,
				name: 'No',
				outstandingShares: '2025',
				price: '0.5',
				sharesPurchased: '0'
			}
		},
		testCategoricalMarketID: {
			1: {
				name: 'Democratic',
				outstandingShares: '0',
				price: '0',
				sharesPurchased: '0'
			},
			2: {
				name: 'Republican',
				outstandingShares: '0',
				price: '0',
				sharesPurchased: '0'
			},
			3: {
				name: 'Libertarian',
				outstandingShares: '0',
				price: '0',
				sharesPurchased: '0'
			},
			4: {
				name: 'Other',
				outstandingShares: '0',
				price: '0',
				sharesPurchased: '0'
			}
		},
		testScalarMarketID: {
			1: {
				id: 1,
				name: '',
				outstandingShares: '0',
				price: '65',
				sharesPurchased: '0'
			},
			2: {
				id: 2,
				name: '',
				outstandingShares: '0',
				price: '65',
				sharesPurchased: '0'
			}
		},
	},
	tradesInProgress: {},
	transactionsData: {
		trans1: {
			data: {
				marketID: 'testBinaryMarketID',
				outcomeID: '2',
				marketType: 'binary',
				marketDescription: 'test binary market',
				outcomeName: 'YES'
			},
			feePercent: {
				value: '0.199203187250996016'
			}
		},
		trans2: {
			data: {
				marketID: 'testCategoricalMarketID',
				outcomeID: '1',
				marketType: 'categorical',
				marketDescription: 'test categorical market',
				outcomeName: 'Democratic'
			},
			feePercent: {
				value: '0.099800399201596707'
			}
		},
		trans3: {
			data: {
				marketID: 'testScalarMarketID',
				outcomeID: '1',
				marketType: 'scalar',
				marketDescription: 'test scalar market',
				outcomeName: ''
			},
			feePercent: {
				value: '0.95763203714451532'
			}
		}
	},
};

export const tradeConstOrderBooks = {
	testBinaryMarketID: {
		buy: {
			orderID1: {
				id: 'orderID1',
				price: '0.45',
				numShares: '10',
				outcome: '2',
				owner: 'owner1'
			},
			orderID2: {
				id: 'orderID2',
				price: '0.45',
				numShares: '5',
				outcome: '2',
				owner: 'owner2'
			},
			orderID3: {
				id: 'orderID3',
				price: '0.45',
				numShares: '3',
				outcome: '2',
				owner: 'owner3'
			},
			orderID4: {
				id: 'orderID4',
				price: '0.44',
				numShares: '10',
				outcome: '2',
				owner: 'owner4'
			},
			orderID5: {
				id: 'orderID5',
				price: '0.46',
				numShares: '15',
				outcome: '2',
				owner: 'owner5'
			},
			orderID6: {
				id: 'orderID6',
				price: '0.43',
				numShares: '5',
				outcome: '2',
				owner: 'owner6'
			}
		},
		sell: {
			orderID1: {
				id: 'orderID1',
				price: '0.4',
				numShares: '10',
				outcome: '2',
				owner: 'owner1'
			},
			orderID2: {
				id: 'orderID2',
				price: '0.4',
				numShares: '5',
				outcome: '2',
				owner: 'owner2'
			},
			orderID3: {
				id: 'orderID3',
				price: '0.4',
				numShares: '10',
				outcome: '2',
				owner: 'owner3'
			},
			orderID4: {
				id: 'orderID4',
				price: '0.39',
				numShares: '3',
				outcome: '2',
				owner: 'owner4'
			},
			orderID5: {
				id: 'orderID5',
				price: '0.41',
				numShares: '15',
				outcome: '2',
				owner: 'owner5'
			},
			orderID6: {
				id: 'orderID6',
				price: '0.415',
				numShares: '20',
				outcome: '2',
				owner: 'owner6'
			}
		}
	},
	testCategoricalMarketID: {
		buy: {
			orderID1: {
				id: 'orderID1',
				price: '0.45',
				outcome: '1',
				owner: 'owner1'
			},
			orderID2: {
				id: 'orderID2',
				price: '0.45',
				outcome: '1',
				owner: 'owner1'
			},
			orderID3: {
				id: 'orderID3',
				price: '0.45',
				numShares: '3',
				outcome: '1',
				owner: 'owner3'
			},
			orderID4: {
				id: 'orderID4',
				price: '0.44',
				numShares: '10',
				outcome: '1',
				owner: 'owner4'
			},
			orderID5: {
				id: 'orderID5',
				price: '0.46',
				numShares: '15',
				outcome: '1',
				owner: 'owner5'
			},
			orderID6: {
				id: 'orderID6',
				price: '0.43',
				numShares: '5',
				outcome: '1',
				owner: 'owner6'
			}
		},
		sell: {
			orderID1: {
				id: 'orderID1',
				price: '0.4',
				numShares: '10',
				outcome: '1',
				owner: 'owner1'
			},
			orderID2: {
				id: 'orderID2',
				price: '0.4',
				numShares: '5',
				outcome: '1',
				owner: 'owner2'
			},
			orderID3: {
				id: 'orderID3',
				price: '0.4',
				numShares: '10',
				outcome: '1',
				owner: 'owner3'
			},
			orderID4: {
				id: 'orderID4',
				price: '0.39',
				numShares: '3',
				outcome: '1',
				owner: 'owner4'
			},
			orderID5: {
				id: 'orderID5',
				price: '0.41',
				numShares: '15',
				outcome: '1',
				owner: 'owner5'
			},
			orderID6: {
				id: 'orderID6',
				price: '0.415',
				numShares: '20',
				outcome: '1',
				owner: 'owner6'
			}
		}
	},
	testScalarMarketID: {
		buy: {
			orderID1: {
				id: 'orderID1',
				price: '45',
				outcome: '1',
				owner: 'owner1'
			},
			orderID2: {
				id: 'orderID2',
				price: '45',
				outcome: '1',
				owner: 'owner1'
			},
			orderID3: {
				id: 'orderID3',
				price: '45',
				numShares: '3',
				outcome: '1',
				owner: 'owner3'
			},
			orderID4: {
				id: 'orderID4',
				price: '44',
				numShares: '10',
				outcome: '1',
				owner: 'owner4'
			},
			orderID5: {
				id: 'orderID5',
				price: '46',
				numShares: '15',
				outcome: '1',
				owner: 'owner5'
			},
			orderID6: {
				id: 'orderID6',
				price: '43',
				numShares: '5',
				outcome: '1',
				owner: 'owner6'
			}
		},
		sell: {
			orderID1: {
				id: 'orderID1',
				price: '40',
				numShares: '10',
				outcome: '1',
				owner: 'owner1'
			},
			orderID2: {
				id: 'orderID2',
				price: '40',
				numShares: '5',
				outcome: '1',
				owner: 'owner2'
			},
			orderID3: {
				id: 'orderID3',
				price: '40',
				numShares: '10',
				outcome: '1',
				owner: 'owner3'
			},
			orderID4: {
				id: 'orderID4',
				price: '39',
				numShares: '3',
				outcome: '1',
				owner: 'owner4'
			},
			orderID5: {
				id: 'orderID5',
				price: '41',
				numShares: '15',
				outcome: '1',
				owner: 'owner5'
			},
			orderID6: {
				id: 'orderID6',
				price: '415',
				numShares: '20',
				outcome: '1',
				owner: 'owner6'
			}
		}
	}
};
// lifted directly from augur.js with a slight change to use abi.bignum instead of BigNumber
const filterByPriceAndOutcomeAndUserSortByPrice = (orders, traderOrderType, limitPrice, outcomeId, userAddress) => {
	if (!orders) return [];
	const isMarketOrder = limitPrice === null || limitPrice === undefined;
	return Object.keys(orders)
		.map(orderId => orders[orderId])
		.filter((order) => {
			let isMatchingPrice;
			if (isMarketOrder) {
				isMatchingPrice = true;
			} else {
				isMatchingPrice = traderOrderType === 'buy' ? new abi.bignum(order.price, 10).lte(limitPrice) : new abi.bignum(order.price, 10).gte(limitPrice); // eslint-disable-line new-cap
			}
			return order.outcome === outcomeId && order.owner !== userAddress && isMatchingPrice;
		})
		.sort((order1, order2) => (traderOrderType === 'buy' ? order1.price - order2.price : order2.price - order1.price));
};

// direct copy of calculate-trade-ids helper function but without calling augur.js
export const stubCalculateBuyTradeIDs = (marketID, outcomeID, limitPrice, orderBooks, takerAddress) => {
	const orders = orderBooks[marketID] && orderBooks[marketID].sell || {};
	return filterByPriceAndOutcomeAndUserSortByPrice(orders, 'buy', limitPrice, outcomeID, takerAddress).map(order => order.id);
};

// direct copy of calculate-trade-ids helper function but without calling augur.js
export const stubCalculateSellTradeIDs = (marketID, outcomeID, limitPrice, orderBooks, takerAddress) => {
	const orders = orderBooks[marketID] && orderBooks[marketID].buy || {};
	return filterByPriceAndOutcomeAndUserSortByPrice(orders, 'sell', limitPrice, outcomeID, takerAddress).map(order => order.id);
};

export const stubAddBidTransaction = (marketID, outcomeID, marketType, marketDescription, outcomeName, numShares, limitPrice, totalCost, tradingFeesEth, feePercent, gasFeesRealEth) => {
	const transaction = {
		type: 'bid',
		data: {
			marketID,
			outcomeID,
			marketType,
			marketDescription,
			outcomeName
		},
		numShares: formatShares(numShares),
		noFeePrice: formatEther(limitPrice),
		avgPrice: formatEther(abi.bignum(totalCost).dividedBy(abi.bignum(numShares))),
		tradingFees: formatEther(tradingFeesEth),
		feePercent: formatPercent(feePercent),
		gasFees: formatRealEther(gasFeesRealEth)
	};
	return transaction;
};

export const stubAddTradeTransaction = (tradeType, marketID, outcomeID, marketType, marketDescription, outcomeName, numShares, limitPrice, totalCost, tradingFeesEth, feePercent, gasFeesRealEth) => {
	const transaction = {
		type: tradeType,
		data: {
			marketID,
			outcomeID,
			marketType,
			marketDescription,
			outcomeName
		},
		numShares: formatShares(numShares),
		noFeePrice: formatEther(limitPrice),
		avgPrice: formatEther(abi.bignum(totalCost).dividedBy(abi.bignum(numShares))),
		tradingFees: formatEther(tradingFeesEth),
		feePercent: formatPercent(feePercent),
		gasFees: formatRealEther(gasFeesRealEth)
	};
	return transaction;
};

export const stubAddAskTransaction = (marketID, outcomeID, marketType, marketDescription, outcomeName, numShares, limitPrice, totalCost, tradingFeesEth, feePercent, gasFeesRealEth) => {
	const transaction = {
		type: 'ask',
		data: {
			marketID,
			outcomeID,
			marketType,
			marketDescription,
			outcomeName
		},
		numShares: formatShares(numShares),
		noFeePrice: formatEther(limitPrice),
		avgPrice: formatEther(abi.bignum(totalCost).dividedBy(abi.bignum(numShares))),
		tradingFees: formatEther(tradingFeesEth),
		feePercent: formatPercent(feePercent),
		gasFees: formatRealEther(gasFeesRealEth)
	};
	return transaction;
};

export const stubAddShortAskTransaction = (marketID, outcomeID, marketType, marketDescription, outcomeName, numShares, limitPrice, totalCost, tradingFeesEth, feePercent, gasFeesRealEth) => {
	const transaction = {
		type: 'short_ask',
		data: {
			marketID,
			outcomeID,
			marketType,
			marketDescription,
			outcomeName
		},
		numShares: formatShares(numShares),
		noFeePrice: formatEther(limitPrice),
		avgPrice: formatEther(abi.bignum(totalCost).dividedBy(abi.bignum(numShares))),
		tradingFees: formatEther(tradingFeesEth),
		feePercent: formatPercent(feePercent),
		gasFees: formatRealEther(gasFeesRealEth)
	};
	return transaction;
};

export const stubAddShortSellTransaction = (marketID, outcomeID, marketType, marketDescription, outcomeName, numShares, limitPrice, totalCost, tradingFeesEth, feePercent, gasFeesRealEth) => {
	const transaction = {
		type: 'short_sell',
		data: {
			marketID,
			outcomeID,
			marketType,
			marketDescription,
			outcomeName
		},
		numShares: formatShares(numShares),
		noFeePrice: formatEther(limitPrice),
		avgPrice: formatEther(abi.bignum(totalCost).dividedBy(abi.bignum(numShares))),
		tradingFees: formatEther(tradingFeesEth),
		feePercent: formatPercent(feePercent),
		gasFees: formatRealEther(gasFeesRealEth)
	};
	return transaction;
};

export const stubUpdateExistingTransaction = (transactionID, data) => ({
	type: 'UPDATE_EXISTING_TRANSACTION',
	transactionID, data
});

export const stubLoadAccountTrades = (marketID, cb) => {
	assert.isString(marketID, `didn't pass a marketID as a string to loadAccountTrades`);
	// originally some of my tests returned the order books but it turns out this isn't required, left this here just incase...
	// cb(undefined, store.getState().orderBooks[marketID]);
	cb();
	return { type: 'LOAD_ACCOUNT_TRADES', marketID };
};

export const updateTradesInProgressActionShapeAssertion = (UpdateTradesInProgressAction) => {
	const Data = UpdateTradesInProgressAction.data;
	const tradeDetails = Data.details;
	const action = tradeDetails.tradeActions[0];

	assert.isDefined(UpdateTradesInProgressAction.type, `UpdateTradesInProgressAction.type isn't defined`);
	assert.isString(UpdateTradesInProgressAction.type, `UpdateTradesInProgressAction.type isn't a String`);
	assert.isDefined(UpdateTradesInProgressAction.data, `UpdateTradesInProgressAction.data isn't defined`);
	assert.isObject(UpdateTradesInProgressAction.data, `UpdateTradesInProgressAction.data isn't a Object`);

	assert.isDefined(Data.marketID, `UpdateTradesInProgressAction.data.marketID isn't defined`);
	assert.isString(Data.marketID, `UpdateTradesInProgressAction.data.marketID isn't a String`);
	assert.isDefined(Data.outcomeID, `UpdateTradesInProgressAction.data.outcomeID isn't defined`);
	assert.isString(Data.outcomeID, `UpdateTradesInProgressAction.data.outcomeID isn't a String`);
	assert.isDefined(Data.details, `UpdateTradesInProgressAction.data.details isn't defined`);
	assert.isObject(Data.details, `UpdateTradesInProgressAction.data.details isn't a Object`);

	assert.isDefined(tradeDetails.side, `tradeDetails.side isn't defined`);
	assert.isString(tradeDetails.side, `tradeDetails.side isn't a string`);
	assert.isDefined(tradeDetails.numShares, `tradeDetails.numShares isn't defined`);
	assert.isString(tradeDetails.numShares, `tradeDetails.numShares isn't a string`);
	assert.isDefined(tradeDetails.limitPrice, `tradeDetails.limitPrice isn't defined`);
	assert.isString(tradeDetails.limitPrice, `tradeDetails.limitPrice isn't a string`);
	assert.isDefined(tradeDetails.totalFee, `tradeDetails.totalFee isn't defined`);
	assert.isString(tradeDetails.totalFee, `tradeDetails.totalFee isn't a string`);
	assert.isDefined(tradeDetails.totalCost, `tradeDetails.totalCost isn't defined`);
	assert.isString(tradeDetails.totalCost, `tradeDetails.totalCost isn't a string`);
	assert.isDefined(tradeDetails.tradingFeesEth, `tradeDetails.tradingFeesEth isn't defined`);
	assert.isString(tradeDetails.tradingFeesEth, `tradeDetails.tradingFeesEth isn't a string`);
	assert.isDefined(tradeDetails.gasFeesRealEth, `tradeDetails.gasFeesRealEth isn't defined`);
	assert.isString(tradeDetails.gasFeesRealEth, `tradeDetails.gasFeesRealEth isn't a string`);
	assert.isDefined(tradeDetails.feePercent, `tradeDetails.feePercent isn't defined`);
	assert.isString(tradeDetails.feePercent, `tradeDetails.feePercent isn't a string`);

	assert.isDefined(tradeDetails.tradeActions, `tradeDetails.tradeActions isn't defined`);
	assert.isArray(tradeDetails.tradeActions, `tradeDetails.tradeActions isn't an array`);

	assert.isDefined(action, `tradeDetails.tradeActions[0] isn't defined`);
	assert.isObject(action, `tradeDetails.tradeActions[0] isn't an object`);

	assert.isDefined(action.action, `tradeDetails.tradeActions[0].action isn't defined`);
	assert.isString(action.action, `tradeDetails.tradeActions[0].action isn't a string`);

	assert.isDefined(action.shares, `tradeDetails.tradeActions[0].shares isn't defined`);
	assert.isString(action.shares, `tradeDetails.tradeActions[0].shares isn't a string`);

	assert.isDefined(action.gasEth, `tradeDetails.tradeActions[0].gasEth isn't defined`);
	assert.isString(action.gasEth, `tradeDetails.tradeActions[0].gasEth isn't a string`);

	assert.isDefined(action.feeEth, `tradeDetails.tradeActions[0].feeEth isn't defined`);
	assert.isString(action.feeEth, `tradeDetails.tradeActions[0].feeEth isn't a string`);

	assert.isDefined(action.feePercent, `tradeDetails.tradeActions[0].feePercent isn't defined`);
	assert.isString(action.feePercent, `tradeDetails.tradeActions[0].feePercent isn't a string`);

	assert.isDefined(action.costEth, `tradeDetails.tradeActions[0].costEth isn't defined`);
	assert.isString(action.costEth, `tradeDetails.tradeActions[0].costEth isn't a string`);

	assert.isDefined(action.avgPrice, `tradeDetails.tradeActions[0].avgPrice isn't defined`);
	assert.isString(action.avgPrice, `tradeDetails.tradeActions[0].avgPrice isn't a string`);

	assert.isDefined(action.noFeePrice, `tradeDetails.tradeActions[0].noFeePrice isn't defined`);
	assert.isString(action.noFeePrice, `tradeDetails.tradeActions[0].noFeePrice isn't a string`);
};
