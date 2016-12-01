import { assert } from 'chai';
import sinon from 'sinon';
import proxyquire from 'proxyquire';
import { abi } from '../../../../src/services/augurjs';

describe('modules/trade/actions/helpers/calculate-trade-ids.js', () => {
	proxyquire.noPreserveCache();
	const mockAugur = { augur: { filterByPriceAndOutcomeAndUserSortByPrice: () => {} } };

	sinon.stub(mockAugur.augur, 'filterByPriceAndOutcomeAndUserSortByPrice', (orders, traderOrderType, limitPrice, outcomeId, userAddress) => {
		// assert types of all args
		assert.isObject(orders, `orders passed to filterByPriceAndOutcomeAndUserSortByPrice is not a Object as expected`);
		assert.isString(traderOrderType, `traderOrderType passed to filterByPriceAndOutcomeAndUserSortByPrice is not a String as expected`);
		assert.isString(limitPrice, `limitPrice passed to filterByPriceAndOutcomeAndUserSortByPrice is not a String as expected`);
		assert.isString(outcomeId, `outcomeId passed to filterByPriceAndOutcomeAndUserSortByPrice is not a String as expected`);
		assert.isString(userAddress, `userAddress passed to filterByPriceAndOutcomeAndUserSortByPrice is not a String as expected`);
		// mock functionality...
		let returnValue = [];

		switch (traderOrderType) {
			case 'buy':
				if (abi.bignum(limitPrice).gte('0.4')) {
					returnValue = [ { id: 3 }, { id: 4 } ];
				}
				break;
			default:
				if (abi.bignum(limitPrice).lte('0.45')) {
					returnValue = [ { id: 1 }, { id: 2 } ];
				}
				break;
		}

		return returnValue;
	});

	afterEach(() => {
		mockAugur.augur.filterByPriceAndOutcomeAndUserSortByPrice.reset();
	});

	const helper = proxyquire('../../../../src/modules/trade/actions/helpers/calculate-trade-ids', {
		'../../../../services/augurjs': mockAugur
	});
	const orderBook = {
		'market1': {
			buy: {
				'order1': {
					id: 1,
					price: '0.45',
					outcome: '1',
					owner: 'owner1'
				},
				'order2': {
					id: 2,
					price: '0.45',
					outcome: '1',
					owner: 'owner1'
				}
			},
			sell: {
				'order3': {
					id: 3,
					price: '0.4',
					outcome: '1',
					owner: 'owner1'
				},
				'order4': {
					id: 4,
					price: '0.4',
					outcome: '1',
					owner: 'owner1'
				}
			}
		}
	};

	it('should calculate trade ids for a Buy', () => {
		assert.deepEqual(helper.calculateBuyTradeIDs('market1', '1', '0.5', orderBook, 'taker1'), [ 3, 4 ], `Didn't return the expected tradeIDs`);
		assert(mockAugur.augur.filterByPriceAndOutcomeAndUserSortByPrice.calledOnce, `Didn't call augur.filterByPriceAndOutcomeAndUserSortByPrice exactly 1 time as expected`);
		assert(mockAugur.augur.filterByPriceAndOutcomeAndUserSortByPrice.calledWithExactly({
			order3: {
				id: 3,
				price: '0.4',
				outcome: '1',
				owner: 'owner1'
			},
			order4: {
				id: 4,
				price: '0.4',
				outcome: '1',
				owner: 'owner1'
			}
		}, 'buy', '0.5', '1', 'taker1'), `Didn't called augur.filterByPriceAndOutcomeAndUserSortByPrice with the expected args`);
	});

	it('should return an empty array if the trade ids for a buy at that rate are not found', () => {
		assert.deepEqual(helper.calculateBuyTradeIDs('market1', '1', '0.3', orderBook, 'taker1'), [ ], `Didn't return an empty array of tradeIDs as expected`);
		assert(mockAugur.augur.filterByPriceAndOutcomeAndUserSortByPrice.calledOnce, `Didn't call augur.filterByPriceAndOutcomeAndUserSortByPrice exactly 1 time as expected`);
		assert(mockAugur.augur.filterByPriceAndOutcomeAndUserSortByPrice.calledWithExactly({
			order3: {
				id: 3,
				price: '0.4',
				outcome: '1',
				owner: 'owner1'
			},
			order4: {
				id: 4,
				price: '0.4',
				outcome: '1',
				owner: 'owner1'
			}
		}, 'buy', '0.3', '1', 'taker1'), `Didn't called augur.filterByPriceAndOutcomeAndUserSortByPrice with the expected args`);
	});

	it('should calculate trade ids for a Sell', () => {
		assert.deepEqual(helper.calculateSellTradeIDs('market1', '1', '0.3', orderBook, 'taker1'), [ 1, 2 ], `Didn't return the expected tradeIDs`);
		assert(mockAugur.augur.filterByPriceAndOutcomeAndUserSortByPrice.calledOnce, `Didn't call augur.filterByPriceAndOutcomeAndUserSortByPrice exactly 1 time as expected`);
		assert(mockAugur.augur.filterByPriceAndOutcomeAndUserSortByPrice.calledWithExactly({
			order1: {
				id: 1,
				price: '0.45',
				outcome: '1',
				owner: 'owner1'
			},
			order2: {
				id: 2,
				price: '0.45',
				outcome: '1',
				owner: 'owner1'
			}
		}, 'sell', '0.3', '1', 'taker1'), `Didn't called augur.filterByPriceAndOutcomeAndUserSortByPrice with the expected args`);
	});

	it('should return an empty array if the trade IDs for a sell at the rate passed in are not found', () => {
		assert.deepEqual(helper.calculateSellTradeIDs('market1', '1', '0.7', orderBook, 'taker1'), [ ], `Didn't return an empty array of tradeIDs as expected`);
		assert(mockAugur.augur.filterByPriceAndOutcomeAndUserSortByPrice.calledOnce, `Didn't call augur.filterByPriceAndOutcomeAndUserSortByPrice exactly 1 time as expected`);
		assert(mockAugur.augur.filterByPriceAndOutcomeAndUserSortByPrice.calledWithExactly({
			order1: {
				id: 1,
				price: '0.45',
				outcome: '1',
				owner: 'owner1'
			},
			order2: {
				id: 2,
				price: '0.45',
				outcome: '1',
				owner: 'owner1'
			}
		}, 'sell', '0.7', '1', 'taker1'), `Didn't called augur.filterByPriceAndOutcomeAndUserSortByPrice with the expected args`);
	});
});
