import { assert } from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

describe(`modules/reports/actions/next-report-page.js`, () => {
	proxyquire.noPreserveCache().noCallThru();
	const middlewares = [thunk];
	const mockStore = configureMockStore(middlewares);

	const test = (t) => {
		it(t.description, () => {
			const store = mockStore(t.state);
			const Links = {
				selectMarketLink: () => {},
				selectMarketsLink: () => {}
			};
			const Market = {
				selectMarketFromEventID: () => {}
			};
			const action = proxyquire('../../../src/modules/reports/actions/next-report-page.js', {
				'../../link/selectors/links': Links,
				'../../market/selectors/market': Market
			});
			sinon.stub(Links, 'selectMarketLink', (market, dispatch) => {
				return {
					onClick: () => dispatch({ type: 'UPDATE_URL', market })
				};
			});
			sinon.stub(Links, 'selectMarketsLink', (dispatch) => {
				return {
					onClick: () => dispatch({ type: 'UPDATE_URL', href: '/' })
				};
			});
			sinon.stub(Market, 'selectMarketFromEventID', (eventID) => {
				const marketID = Object.keys(t.state.marketsData).find(marketID =>
					t.state.marketsData[marketID].eventID === eventID);
				return {
					id: marketID,
					...t.state.marketsData[marketID]
				};
			});
			store.dispatch(action.nextReportPage());
			t.assertions(store.getActions());
			store.clearActions();
		});
	};
	test({
		description: 'submitted only report',
		state: {
			branch: {
				id: '0xb1',
				reportPeriod: 7
			},
			marketsData: {
				'0xa1': {
					eventID: '0xe1',
					type: 'binary',
					description: 'Market 1'
				}
			},
			reports: {
				'0xb1': {
					'0xe1': {
						eventID: '0xe1',
						period: 7,
						marketID: '0xa1',
						reportHash: '0xdeadbeef',
						reportedOutcomeID: '2',
						salt: '0x1337',
						isScalar: false,
						isCategorical: false,
						isIndeterminate: false,
						isUnethical: false,
						isCommitted: false,
						isRevealed: false
					}
				}
			}
		},
		assertions: (actions) => {
			assert.deepEqual(actions, [{
				type: 'UPDATE_URL',
				href: '/'
			}]);
		}
	});
	test({
		description: 'submitted first of two reports',
		state: {
			branch: {
				id: '0xb1',
				reportPeriod: 7
			},
			marketsData: {
				'0xa1': {
					eventID: '0xe1',
					type: 'binary',
					description: 'Market 1'
				},
				'0xa2': {
					eventID: '0xe2',
					type: 'binary',
					description: 'Market 2'
				}
			},
			reports: {
				'0xb1': {
					'0xe1': {
						eventID: '0xe1',
						period: 7,
						marketID: '0xa1',
						reportHash: '0xdeadbeef',
						reportedOutcomeID: '2',
						salt: '0x1337',
						isScalar: false,
						isCategorical: false,
						isIndeterminate: false,
						isUnethical: false,
						isCommitted: false,
						isRevealed: false
					},
					'0xe2': {
						eventID: '0xe2',
						period: 7,
						marketID: '0xa2',
						reportHash: null,
						reportedOutcomeID: null,
						salt: null,
						isScalar: false,
						isCategorical: false,
						isIndeterminate: false,
						isUnethical: false,
						isCommitted: false,
						isRevealed: false
					}
				}
			}
		},
		assertions: (actions) => {
			assert.deepEqual(actions, [{
				type: 'UPDATE_URL',
				market: {
					id: '0xa2',
					eventID: '0xe2',
					type: 'binary',
					description: 'Market 2'
				}
			}]);
		}
	});
	test({
		description: 'submitted second of two reports',
		state: {
			branch: {
				id: '0xb1',
				reportPeriod: 7
			},
			marketsData: {
				'0xa1': {
					eventID: '0xe1',
					type: 'binary',
					description: 'Market 1'
				},
				'0xa2': {
					eventID: '0xe2',
					type: 'binary',
					description: 'Market 2'
				}
			},
			reports: {
				'0xb1': {
					'0xe1': {
						eventID: '0xe1',
						period: 7,
						marketID: '0xa1',
						reportHash: null,
						reportedOutcomeID: null,
						salt: null,
						isScalar: false,
						isCategorical: false,
						isIndeterminate: false,
						isUnethical: false,
						isCommitted: false,
						isRevealed: false
					},
					'0xe2': {
						eventID: '0xe2',
						period: 7,
						marketID: '0xa2',
						reportHash: '0xdeadbeef',
						reportedOutcomeID: '2',
						salt: '0x1337',
						isScalar: false,
						isCategorical: false,
						isIndeterminate: false,
						isUnethical: false,
						isCommitted: false,
						isRevealed: false
					}
				}
			}
		},
		assertions: (actions) => {
			assert.deepEqual(actions, [{
				type: 'UPDATE_URL',
				market: {
					id: '0xa1',
					eventID: '0xe1',
					type: 'binary',
					description: 'Market 1'
				}
			}]);
		}
	});
	test({
		description: 'submitted all two reports',
		state: {
			branch: {
				id: '0xb1',
				reportPeriod: 7
			},
			marketsData: {
				'0xa1': {
					eventID: '0xe1',
					type: 'binary',
					description: 'Market 1'
				},
				'0xa2': {
					eventID: '0xe2',
					type: 'binary',
					description: 'Market 2'
				}
			},
			reports: {
				'0xb1': {
					'0xe1': {
						eventID: '0xe1',
						period: 7,
						marketID: '0xa1',
						reportHash: '0xfeeddaed',
						reportedOutcomeID: '1',
						salt: '0x7331',
						isScalar: false,
						isCategorical: false,
						isIndeterminate: false,
						isUnethical: false,
						isCommitted: false,
						isRevealed: false
					},
					'0xe2': {
						eventID: '0xe2',
						period: 7,
						marketID: '0xa2',
						reportHash: '0xdeadbeef',
						reportedOutcomeID: '2',
						salt: '0x1337',
						isScalar: false,
						isCategorical: false,
						isIndeterminate: false,
						isUnethical: false,
						isCommitted: false,
						isRevealed: false
					}
				}
			}
		},
		assertions: (actions) => {
			assert.deepEqual(actions, [{
				type: 'UPDATE_URL',
				href: '/'
			}]);
		}
	});
	test({
		description: 'submitted first and third of three reports',
		state: {
			branch: {
				id: '0xb1',
				reportPeriod: 7
			},
			marketsData: {
				'0xa1': {
					eventID: '0xe1',
					type: 'binary',
					description: 'Market 1'
				},
				'0xa2': {
					eventID: '0xe2',
					type: 'binary',
					description: 'Market 2'
				},
				'0xa3': {
					eventID: '0xe3',
					type: 'scalar',
					description: 'Market 3'
				}
			},
			reports: {
				'0xb1': {
					'0xe1': {
						eventID: '0xe1',
						period: 7,
						marketID: '0xa1',
						reportHash: '0xfeeddaed',
						reportedOutcomeID: '1',
						salt: '0x7331',
						isScalar: false,
						isCategorical: false,
						isIndeterminate: false,
						isUnethical: false,
						isCommitted: false,
						isRevealed: false
					},
					'0xe2': {
						eventID: '0xe2',
						period: 7,
						marketID: '0xa2',
						reportHash: null,
						reportedOutcomeID: null,
						salt: null,
						isScalar: false,
						isCategorical: false,
						isIndeterminate: false,
						isUnethical: false,
						isCommitted: false,
						isRevealed: false
					},
					'0xe3': {
						eventID: '0xe3',
						period: 7,
						marketID: '0xa3',
						reportHash: '0xdeadbeef',
						reportedOutcomeID: '2',
						salt: '0x1337',
						isScalar: true,
						isCategorical: false,
						isIndeterminate: false,
						isUnethical: false,
						isCommitted: false,
						isRevealed: false
					}
				}
			}
		},
		assertions: (actions) => {
			assert.deepEqual(actions, [{
				type: 'UPDATE_URL',
				market: {
					id: '0xa2',
					eventID: '0xe2',
					type: 'binary',
					description: 'Market 2'
				}
			}]);
		}
	});
	test({
		description: 'submitted all three reports',
		state: {
			branch: {
				id: '0xb1',
				reportPeriod: 7
			},
			marketsData: {
				'0xa1': {
					eventID: '0xe1',
					type: 'binary',
					description: 'Market 1'
				},
				'0xa2': {
					eventID: '0xe2',
					type: 'binary',
					description: 'Market 2'
				},
				'0xa3': {
					eventID: '0xe3',
					type: 'scalar',
					description: 'Market 3'
				}
			},
			reports: {
				'0xb1': {
					'0xe1': {
						eventID: '0xe1',
						period: 7,
						marketID: '0xa1',
						reportHash: '0xfeeddaed',
						reportedOutcomeID: '1',
						salt: '0x7331',
						isScalar: false,
						isCategorical: false,
						isIndeterminate: false,
						isUnethical: false,
						isCommitted: false,
						isRevealed: false
					},
					'0xe2': {
						eventID: '0xe2',
						period: 7,
						marketID: '0xa2',
						reportHash: '0xbeefdead',
						reportedOutcomeID: '2',
						salt: '0x9000',
						isScalar: false,
						isCategorical: false,
						isIndeterminate: false,
						isUnethical: false,
						isCommitted: false,
						isRevealed: false
					},
					'0xe3': {
						eventID: '0xe3',
						period: 7,
						marketID: '0xa3',
						reportHash: '0xdeadbeef',
						reportedOutcomeID: '2.1234',
						salt: '0x1337',
						isScalar: true,
						isCategorical: false,
						isIndeterminate: false,
						isUnethical: false,
						isCommitted: false,
						isRevealed: false
					}
				}
			}
		},
		assertions: (actions) => {
			assert.deepEqual(actions, [{
				type: 'UPDATE_URL',
				href: '/'
			}]);
		}
	});
});
