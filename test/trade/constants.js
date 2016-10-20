import { assert } from 'chai';
export { BINARY, SCALAR, CATEGORICAL } from '../../src/modules/markets/constants/market-types';
export { BUY, SELL } from '../../src/modules/trade/constants/types';
export { BID, ASK } from '../../src/modules/bids-asks/constants/bids-asks-types';

export const tradeTestState = {
	loginAccount: {
		address: '0x00000000000000000000000000000000000user1',
		id: '0x00000000000000000000000000000000000user1',
		name: 'test',
		loginID: 'longLoginID',
		localNode: false,
		prettyAddress: '0000...ser1',
		prettyLoginID: 'long...inID',
		ether: '10000.00',
		realEther: '5.0',
		rep: '50.0',
		keystore: { id: '0x00000000000000000000000000000000000user1' }
	},
	selectedMarketID: '0x000000000000000000000000000000000binary1',
	marketsData: {
		'0x000000000000000000000000000000000binary1': {
			author: '0x000000000000000000000000000000000author1',
			branchID: '0x010101',
			creationFee: '22.5',
			creationTime: 1475951522,
			cumulativeScale: '1',
			description: 'test binary market?',
			endDate: 1495317600,
			eventID: '0x0000000000000000000000000000000000event1',
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
			tags: [ 'binary', 'markets', null ],
			takerFee: '0.01',
			tradingFee: '0.008',
			tradingPeriod: 8653,
			type: 'binary',
			volume: '3030',
			winningOutcomes: []
		},
		'0x0000000000000000000000000000categorical1': {
			author: '0x000000000000000000000000000000000author2',
			branchId: '0x010101',
			creationFee: '12.857142857142857142',
			creationTime: 1476694751,
			cumulativeScale: '1',
			description: 'test categorical market?',
			endDate: 2066554498,
			eventID: '0x0000000000000000000000000000000000event2',
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
		'0x000000000000000000000000000000000scalar1': {
			author: '0x000000000000000000000000000000000author3',
			branchID: '0x010101',
			creationFee: '9',
			creationTime: 1476486515,
			cumulativeScale: '130',
			description: 'test scalar market?',
			endDate: 1496514800,
			eventID: '0x0000000000000000000000000000000000event3',
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
			tags: [ 'scalar', 'markets', 'test' ],
			takerFee: '0.02',
			tradingFee: '0.02',
			tradingPeriod: 8544,
			type: 'scalar',
			volume: '0',
			winningOutcomes: []
		},
	}, outcomesData: {
		'0x000000000000000000000000000000000binary1': {
			'2': {
				id: 2,
				name: 'Yes',
				outstandingShares: '1005',
				price: '0.5',
				sharesPurchased: '0'
			},
			'1': {
				id: 1,
				name: 'No',
				outstandingShares: '2025',
				price: '0.5',
				sharesPurchased: '0'
			}
		},
		'0x0000000000000000000000000000categorical1': {
			'1': {
				name: 'Democratic',
				outstandingShares: '0',
				price: '0',
				sharesPurchased: '0'
			},
			'2': {
				name: 'Republican',
				outstandingShares: '0',
				price: '0',
				sharesPurchased: '0'
			},
			'3': {
				name: 'Libertarian',
				outstandingShares: '0',
				price: '0',
				sharesPurchased: '0'
			},
			'4': {
				name: 'Other',
				outstandingShares: '0',
				price: '0',
				sharesPurchased: '0'
			}
		},
		'0x000000000000000000000000000000000scalar1': {
			'2': {
				id: 2,
				name: '',
				outstandingShares: '0',
				price: '65',
				sharesPurchased: '0'
			}
		},
	},
	tradesInProgress: {}
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
