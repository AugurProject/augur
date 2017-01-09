import { describe, it } from 'mocha';
import BigNumber from 'bignumber.js';
import { assert } from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';

describe(`modules/my-positions/selectors/winning-positions.js`, () => {
	proxyquire.noPreserveCache().noCallThru();
	const test = (t) => {
		it(t.description, () => {
			const AugurJS = { abi: { bignum: () => {} } };
			const Selectors = t.selectors;
			const selector = proxyquire('../../../src/modules/my-positions/selectors/winning-positions.js', {
				'../../../services/augurjs': AugurJS,
				'../../../selectors': Selectors
			});
			sinon.stub(AugurJS.abi, 'bignum', n => new BigNumber(n, 10));
			t.assertions(selector.default(t.state.outcomesData));
		});
	};
	test({
		description: 'no positions',
		state: {
			outcomesData: {}
		},
		selectors: {
			portfolio: {
				positions: {
					markets: []
				}
			}
		},
		assertions: (selection) => {
			assert.deepEqual(selection, []);
		}
	});
	test({
		description: '1 position in closed market',
		state: {
			outcomesData: {
				'0xa1': {
					2: {
						sharesPurchased: 1
					}
				}
			}
		},
		selectors: {
			portfolio: {
				positions: {
					markets: [{
						id: '0xa1',
						isOpen: false,
						description: 'test market 1',
						reportedOutcome: '2'
					}]
				}
			}
		},
		assertions: (selection) => {
			assert.deepEqual(selection, [{
				id: '0xa1',
				description: 'test market 1',
				shares: '1'
			}]);
		}
	});
	test({
		description: '1 position in open market',
		state: {
			outcomesData: {}
		},
		selectors: {
			portfolio: {
				positions: {
					markets: [{
						id: '0xa1',
						isOpen: true
					}]
				}
			}
		},
		assertions: (selection) => {
			assert.deepEqual(selection, []);
		}
	});
	test({
		description: '1 position in open market, 1 position in closed market',
		state: {
			outcomesData: {
				'0xa1': {
					2: {
						sharesPurchased: 1
					}
				},
				'0xa2': {
					2: {
						sharesPurchased: 1
					}
				}
			}
		},
		selectors: {
			portfolio: {
				positions: {
					markets: [{
						id: '0xa1',
						isOpen: true
					}, {
						id: '0xa2',
						isOpen: false,
						description: 'test market 2',
						reportedOutcome: '2'
					}]
				}
			}
		},
		assertions: (selection) => {
			assert.deepEqual(selection, [{
				id: '0xa2',
				description: 'test market 2',
				shares: '1'
			}]);
		}
	});
	test({
		description: '1 position in open market, 2 positions in closed markets',
		state: {
			outcomesData: {
				'0xa1': {
					2: {
						sharesPurchased: 1
					}
				},
				'0xa2': {
					2: {
						sharesPurchased: 1
					}
				},
				'0xa3': {
					2: {
						sharesPurchased: 1
					}
				}
			}
		},
		selectors: {
			portfolio: {
				positions: {
					markets: [{
						id: '0xa1',
						isOpen: true
					}, {
						id: '0xa2',
						isOpen: false,
						description: 'test market 2',
						reportedOutcome: '2'
					}, {
						id: '0xa3',
						isOpen: false,
						description: 'test market 3',
						reportedOutcome: '2'
					}]
				}
			}
		},
		assertions: (selection) => {
			assert.deepEqual(selection, [{
				id: '0xa2',
				description: 'test market 2',
				shares: '1'
			}, {
				id: '0xa3',
				description: 'test market 3',
				shares: '1'
			}]);
		}
	});
	test({
		description: '2 position in open markets, 1 position in closed market',
		state: {
			outcomesData: {
				'0xa1': {
					2: {
						sharesPurchased: 1
					}
				},
				'0xa2': {
					2: {
						sharesPurchased: 1
					}
				},
				'0xa3': {
					2: {
						sharesPurchased: 1
					}
				}
			}
		},
		selectors: {
			portfolio: {
				positions: {
					markets: [{
						id: '0xa1',
						isOpen: true
					}, {
						id: '0xa2',
						isOpen: true
					}, {
						id: '0xa3',
						isOpen: false,
						description: 'test market 3',
						reportedOutcome: '2'
					}]
				}
			}
		},
		assertions: (selection) => {
			assert.deepEqual(selection, [{
				id: '0xa3',
				description: 'test market 3',
				shares: '1'
			}]);
		}
	});
});
