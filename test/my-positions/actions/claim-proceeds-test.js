import { describe, it } from 'mocha';
import { assert } from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

describe(`modules/my-positions/actions/claim-proceeds.js`, () => {
	proxyquire.noPreserveCache().noCallThru();
	const middlewares = [thunk];
	const mockStore = configureMockStore(middlewares);

	const test = (t) => {
		it(t.description, () => {
			const store = mockStore(t.state);
			const AugurJS = {
				augur: {
					claimMarketsProceeds: () => {}
				}
			};
			const ListenToUpdates = {
				refreshMarket: () => {}
			};
			const Selectors = t.selectors;
			const UpdateAssets = {};
			const action = proxyquire('../../../src/modules/my-positions/actions/claim-proceeds.js', {
				'../../../services/augurjs': AugurJS,
				'../../app/actions/listen-to-updates': ListenToUpdates,
				'../../../selectors': Selectors,
				'../../auth/actions/update-assets': UpdateAssets
			});
			sinon.stub(AugurJS.augur, 'claimMarketsProceeds', (branchID, marketIDs, cb) => {
				cb(null, marketIDs);
			});
			sinon.stub(ListenToUpdates, 'refreshMarket', (marketID) => ({
				type: 'REFRESH_MARKET',
				marketID
			}));
			UpdateAssets.updateAssets = sinon.stub().returns({ type: 'UPDATE_ASSETS' });
			store.dispatch(action.claimProceeds());
			t.assertions(store.getActions());
			store.clearActions();
		});
	};
	test({
		description: 'no positions',
		state: {
			branch: {
				id: '0xb1',
				reportPeriod: 7
			}
		},
		selectors: {
			portfolio: {
				positions: {
					markets: []
				}
			}
		},
		assertions: (actions) => {
			assert.deepEqual(actions, []);
		}
	});
	test({
		description: '1 position in closed market',
		state: {
			branch: {
				id: '0xb1',
				reportPeriod: 7
			}
		},
		selectors: {
			portfolio: {
				positions: {
					markets: [{
						id: '0xa1',
						isOpen: false
					}]
				}
			}
		},
		assertions: (actions) => {
			assert.deepEqual(actions, [{
				type: 'UPDATE_ASSETS'
			}, {
				type: 'REFRESH_MARKET',
				marketID: '0xa1'
			}]);
		}
	});
	test({
		description: '1 position in open market',
		state: {
			branch: {
				id: '0xb1',
				reportPeriod: 7
			}
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
		assertions: (actions) => {
			assert.deepEqual(actions, []);
		}
	});
	test({
		description: '1 position in open market, 1 position in closed market',
		state: {
			branch: {
				id: '0xb1',
				reportPeriod: 7
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
						isOpen: false
					}]
				}
			}
		},
		assertions: (actions) => {
			assert.deepEqual(actions, [{
				type: 'UPDATE_ASSETS'
			}, {
				type: 'REFRESH_MARKET',
				marketID: '0xa2'
			}]);
		}
	});
	test({
		description: '1 position in open market, 2 positions in closed markets',
		state: {
			branch: {
				id: '0xb1',
				reportPeriod: 7
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
						isOpen: false
					}, {
						id: '0xa3',
						isOpen: false
					}]
				}
			}
		},
		assertions: (actions) => {
			assert.deepEqual(actions, [{
				type: 'UPDATE_ASSETS'
			}, {
				type: 'REFRESH_MARKET',
				marketID: '0xa2'
			}, {
				type: 'REFRESH_MARKET',
				marketID: '0xa3'
			}]);
		}
	});
	test({
		description: '2 position in open markets, 1 position in closed market',
		state: {
			branch: {
				id: '0xb1',
				reportPeriod: 7
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
						isOpen: false
					}]
				}
			}
		},
		assertions: (actions) => {
			assert.deepEqual(actions, [{
				type: 'UPDATE_ASSETS'
			}, {
				type: 'REFRESH_MARKET',
				marketID: '0xa3'
			}]);
		}
	});
});
