import { describe, it } from 'mocha';
import { assert } from 'chai';
import * as helper from '../../../../src/modules/trade/actions/helpers/calculate-trade-ids';

describe('modules/trade/actions/helpers/calculate-trade-ids.js', () => {

	it('should calculate trade ids for a Buy', () => {
		assert.deepEqual(helper.calculateBuyTradeIDs('market1', '1', '0.5', {
			market1: {
				buy: {
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
				},
				sell: {
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
				}
			}
		}, 'taker1'), [3, 4], `Didn't return the expected tradeIDs`);
	});

	it('should return an empty array if the trade ids for a buy at that rate are not found', () => {
		assert.deepEqual(helper.calculateBuyTradeIDs('market1', '1', '0.3', {
			market1: {
				buy: {
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
				},
				sell: {
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
				}
			}
		}, 'taker1'), [], `Didn't return an empty array of tradeIDs as expected`);
	});

	it('should calculate trade ids for a Sell', () => {
		assert.deepEqual(helper.calculateSellTradeIDs('market1', '1', '0.3', {
			market1: {
				buy: {
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
				},
				sell: {
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
				}
			}
		}, 'taker1'), [1, 2], `Didn't return the expected tradeIDs`);
	});

	it('should return an empty array if the trade IDs for a sell at the rate passed in are not found', () => {
		assert.deepEqual(helper.calculateSellTradeIDs('market1', '1', '0.7', {
			market1: {
				buy: {
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
				},
				sell: {
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
				}
			}
		}, 'taker1'), [], `Didn't return an empty array of tradeIDs as expected`);
	});
});
