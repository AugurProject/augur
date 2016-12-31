import { describe, it } from 'mocha';
import { assert } from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

describe(`modules/reports/actions/commit-report.js`, () => {
	proxyquire.noPreserveCache().noCallThru();
	const middlewares = [thunk];
	const mockStore = configureMockStore(middlewares);

	const test = (t) => {
		it(t.description, () => {
			const store = mockStore(t.state);
			const AugurJS = { augur: {} };
			const BytesToHex = {};
			const NextReportPage = {};
			const action = proxyquire('../../../src/modules/reports/actions/commit-report.js', {
				'../../../services/augurjs': AugurJS,
				'../../../utils/bytes-to-hex': BytesToHex,
				'../../reports/actions/next-report-page': NextReportPage
			});
			AugurJS.augur.fixReport = sinon.stub().returns('0xde0b6b3a7640000');
			AugurJS.augur.makeHash = sinon.stub().returns('0xdeadbeef');
			BytesToHex.bytesToHex = sinon.stub().returns('0x1337');
			NextReportPage.nextReportPage = sinon.stub().returns({ type: 'NEXT_REPORT_PAGE' });
			store.dispatch(action.commitReport(t.params.market, t.params.reportedOutcomeID, t.params.isUnethical, t.params.isIndeterminate));
			t.assertions(store.getActions());
			store.clearActions();
		});
	};
	test({
		description: 'commit to report outcome 1 for binary event',
		params: {
			market: {
				id: '0xa1',
				eventID: '0xe1',
				type: 'binary',
				description: 'Market 1'
			},
			reportedOutcomeID: '1',
			isUnethical: false,
			isIndeterminate: false
		},
		state: {
			branch: {
				id: '0xb1',
				reportPeriod: 7
			},
			loginAccount: {
				address: '0x0000000000000000000000000000000000000b0b'
			},
			reports: {}
		},
		assertions: (actions) => {
			assert.deepEqual(actions, [{
				type: 'UPDATE_REPORTS',
				reports: {
					'0xb1': {
						'0xe1': {
							eventID: '0xe1',
							period: 7,
							marketID: '0xa1',
							reportHash: '0xdeadbeef',
							reportedOutcomeID: '1',
							salt: '0x1337',
							isIndeterminate: false,
							isUnethical: false,
							isCommitted: false,
							isRevealed: false,
							isCategorical: false,
							isScalar: false
						}
					}
				}
			}, {
				type: 'ADD_COMMIT_REPORT_TRANSACTION',
				market: {
					id: '0xa1',
					eventID: '0xe1',
					type: 'binary',
					description: 'Market 1'
				},
				reportedOutcomeID: '1',
				isUnethical: false,
				isIndeterminate: false
			}, {
				type: 'NEXT_REPORT_PAGE'
			}]);
		}
	});
	test({
		description: 'commit to report outcome 2 for binary event',
		params: {
			market: {
				id: '0xa1',
				eventID: '0xe1',
				type: 'binary',
				description: 'Market 1'
			},
			reportedOutcomeID: '2',
			isUnethical: false,
			isIndeterminate: false
		},
		state: {
			branch: {
				id: '0xb1',
				reportPeriod: 7
			},
			loginAccount: {
				address: '0x0000000000000000000000000000000000000b0b'
			},
			reports: {}
		},
		assertions: (actions) => {
			assert.deepEqual(actions, [{
				type: 'UPDATE_REPORTS',
				reports: {
					'0xb1': {
						'0xe1': {
							eventID: '0xe1',
							period: 7,
							marketID: '0xa1',
							reportHash: '0xdeadbeef',
							reportedOutcomeID: '2',
							salt: '0x1337',
							isIndeterminate: false,
							isUnethical: false,
							isCommitted: false,
							isRevealed: false,
							isCategorical: false,
							isScalar: false
						}
					}
				}
			}, {
				type: 'ADD_COMMIT_REPORT_TRANSACTION',
				market: {
					id: '0xa1',
					eventID: '0xe1',
					type: 'binary',
					description: 'Market 1'
				},
				reportedOutcomeID: '2',
				isUnethical: false,
				isIndeterminate: false
			}, {
				type: 'NEXT_REPORT_PAGE'
			}]);
		}
	});
	test({
		description: 'commit to report outcome 5 for categorical event',
		params: {
			market: {
				id: '0xa1',
				eventID: '0xe1',
				type: 'categorical',
				description: 'Market 1'
			},
			reportedOutcomeID: '5',
			isUnethical: false,
			isIndeterminate: false
		},
		state: {
			branch: {
				id: '0xb1',
				reportPeriod: 7
			},
			loginAccount: {
				address: '0x0000000000000000000000000000000000000b0b'
			},
			reports: {}
		},
		assertions: (actions) => {
			assert.deepEqual(actions, [{
				type: 'UPDATE_REPORTS',
				reports: {
					'0xb1': {
						'0xe1': {
							eventID: '0xe1',
							period: 7,
							marketID: '0xa1',
							reportHash: '0xdeadbeef',
							reportedOutcomeID: '5',
							salt: '0x1337',
							isIndeterminate: false,
							isUnethical: false,
							isCommitted: false,
							isRevealed: false,
							isCategorical: true,
							isScalar: false
						}
					}
				}
			}, {
				type: 'ADD_COMMIT_REPORT_TRANSACTION',
				market: {
					id: '0xa1',
					eventID: '0xe1',
					type: 'categorical',
					description: 'Market 1'
				},
				reportedOutcomeID: '5',
				isUnethical: false,
				isIndeterminate: false
			}, {
				type: 'NEXT_REPORT_PAGE'
			}]);
		}
	});
	test({
		description: 'commit to report outcome 1.2345 for scalar event',
		params: {
			market: {
				id: '0xa1',
				eventID: '0xe1',
				type: 'scalar',
				description: 'Market 1'
			},
			reportedOutcomeID: '1.2345',
			isUnethical: false,
			isIndeterminate: false
		},
		state: {
			branch: {
				id: '0xb1',
				reportPeriod: 7
			},
			loginAccount: {
				address: '0x0000000000000000000000000000000000000b0b'
			},
			reports: {}
		},
		assertions: (actions) => {
			assert.deepEqual(actions, [{
				type: 'UPDATE_REPORTS',
				reports: {
					'0xb1': {
						'0xe1': {
							eventID: '0xe1',
							period: 7,
							marketID: '0xa1',
							reportHash: '0xdeadbeef',
							reportedOutcomeID: '1.2345',
							salt: '0x1337',
							isIndeterminate: false,
							isUnethical: false,
							isCommitted: false,
							isRevealed: false,
							isCategorical: false,
							isScalar: true
						}
					}
				}
			}, {
				type: 'ADD_COMMIT_REPORT_TRANSACTION',
				market: {
					id: '0xa1',
					eventID: '0xe1',
					type: 'scalar',
					description: 'Market 1'
				},
				reportedOutcomeID: '1.2345',
				isUnethical: false,
				isIndeterminate: false
			}, {
				type: 'NEXT_REPORT_PAGE'
			}]);
		}
	});
	test({
		description: 'commit to report unethical outcome 1.2345 for scalar event',
		params: {
			market: {
				id: '0xa1',
				eventID: '0xe1',
				type: 'scalar',
				description: 'Market 1'
			},
			reportedOutcomeID: '1.2345',
			isUnethical: true,
			isIndeterminate: false
		},
		state: {
			branch: {
				id: '0xb1',
				reportPeriod: 7
			},
			loginAccount: {
				address: '0x0000000000000000000000000000000000000b0b'
			},
			reports: {}
		},
		assertions: (actions) => {
			assert.deepEqual(actions, [{
				type: 'UPDATE_REPORTS',
				reports: {
					'0xb1': {
						'0xe1': {
							eventID: '0xe1',
							period: 7,
							marketID: '0xa1',
							reportHash: '0xdeadbeef',
							reportedOutcomeID: '1.2345',
							salt: '0x1337',
							isIndeterminate: false,
							isUnethical: true,
							isCommitted: false,
							isRevealed: false,
							isCategorical: false,
							isScalar: true
						}
					}
				}
			}, {
				type: 'ADD_COMMIT_REPORT_TRANSACTION',
				market: {
					id: '0xa1',
					eventID: '0xe1',
					type: 'scalar',
					description: 'Market 1'
				},
				reportedOutcomeID: '1.2345',
				isUnethical: true,
				isIndeterminate: false
			}, {
				type: 'NEXT_REPORT_PAGE'
			}]);
		}
	});
	test({
		description: 'commit to report indeterminate for binary event',
		params: {
			market: {
				id: '0xa1',
				eventID: '0xe1',
				type: 'binary',
				description: 'Market 1'
			},
			reportedOutcomeID: '1.5',
			isUnethical: false,
			isIndeterminate: true
		},
		state: {
			branch: {
				id: '0xb1',
				reportPeriod: 7
			},
			loginAccount: {
				address: '0x0000000000000000000000000000000000000b0b'
			},
			reports: {}
		},
		assertions: (actions) => {
			assert.deepEqual(actions, [{
				type: 'UPDATE_REPORTS',
				reports: {
					'0xb1': {
						'0xe1': {
							eventID: '0xe1',
							period: 7,
							marketID: '0xa1',
							reportHash: '0xdeadbeef',
							reportedOutcomeID: '1.5',
							salt: '0x1337',
							isIndeterminate: true,
							isUnethical: false,
							isCommitted: false,
							isRevealed: false,
							isCategorical: false,
							isScalar: false
						}
					}
				}
			}, {
				type: 'ADD_COMMIT_REPORT_TRANSACTION',
				market: {
					id: '0xa1',
					eventID: '0xe1',
					type: 'binary',
					description: 'Market 1'
				},
				reportedOutcomeID: '1.5',
				isUnethical: false,
				isIndeterminate: true
			}, {
				type: 'NEXT_REPORT_PAGE'
			}]);
		}
	});
	test({
		description: 'commit to report indeterminate for categorical event',
		params: {
			market: {
				id: '0xa1',
				eventID: '0xe1',
				type: 'categorical',
				description: 'Market 1'
			},
			reportedOutcomeID: '1.5',
			isUnethical: false,
			isIndeterminate: true
		},
		state: {
			branch: {
				id: '0xb1',
				reportPeriod: 7
			},
			loginAccount: {
				address: '0x0000000000000000000000000000000000000b0b'
			},
			reports: {}
		},
		assertions: (actions) => {
			assert.deepEqual(actions, [{
				type: 'UPDATE_REPORTS',
				reports: {
					'0xb1': {
						'0xe1': {
							eventID: '0xe1',
							period: 7,
							marketID: '0xa1',
							reportHash: '0xdeadbeef',
							reportedOutcomeID: '1.5',
							salt: '0x1337',
							isIndeterminate: true,
							isUnethical: false,
							isCommitted: false,
							isRevealed: false,
							isCategorical: true,
							isScalar: false
						}
					}
				}
			}, {
				type: 'ADD_COMMIT_REPORT_TRANSACTION',
				market: {
					id: '0xa1',
					eventID: '0xe1',
					type: 'categorical',
					description: 'Market 1'
				},
				reportedOutcomeID: '1.5',
				isUnethical: false,
				isIndeterminate: true
			}, {
				type: 'NEXT_REPORT_PAGE'
			}]);
		}
	});
	test({
		description: 'commit to report indeterminate for scalar event',
		params: {
			market: {
				id: '0xa1',
				eventID: '0xe1',
				type: 'scalar',
				description: 'Market 1'
			},
			reportedOutcomeID: '1.500000000000000001',
			isUnethical: false,
			isIndeterminate: true
		},
		state: {
			branch: {
				id: '0xb1',
				reportPeriod: 7
			},
			loginAccount: {
				address: '0x0000000000000000000000000000000000000b0b'
			},
			reports: {}
		},
		assertions: (actions) => {
			assert.deepEqual(actions, [{
				type: 'UPDATE_REPORTS',
				reports: {
					'0xb1': {
						'0xe1': {
							eventID: '0xe1',
							period: 7,
							marketID: '0xa1',
							reportHash: '0xdeadbeef',
							reportedOutcomeID: '1.500000000000000001',
							salt: '0x1337',
							isIndeterminate: true,
							isUnethical: false,
							isCommitted: false,
							isRevealed: false,
							isCategorical: false,
							isScalar: true
						}
					}
				}
			}, {
				type: 'ADD_COMMIT_REPORT_TRANSACTION',
				market: {
					id: '0xa1',
					eventID: '0xe1',
					type: 'scalar',
					description: 'Market 1'
				},
				reportedOutcomeID: '1.500000000000000001',
				isUnethical: false,
				isIndeterminate: true
			}, {
				type: 'NEXT_REPORT_PAGE'
			}]);
		}
	});
	test({
		description: 'commit to report unethical and indeterminate for binary event',
		params: {
			market: {
				id: '0xa1',
				eventID: '0xe1',
				type: 'binary',
				description: 'Market 1'
			},
			reportedOutcomeID: '1.5',
			isUnethical: true,
			isIndeterminate: true
		},
		state: {
			branch: {
				id: '0xb1',
				reportPeriod: 7
			},
			loginAccount: {
				address: '0x0000000000000000000000000000000000000b0b'
			},
			reports: {}
		},
		assertions: (actions) => {
			assert.deepEqual(actions, [{
				type: 'UPDATE_REPORTS',
				reports: {
					'0xb1': {
						'0xe1': {
							eventID: '0xe1',
							period: 7,
							marketID: '0xa1',
							reportHash: '0xdeadbeef',
							reportedOutcomeID: '1.5',
							salt: '0x1337',
							isIndeterminate: true,
							isUnethical: true,
							isCommitted: false,
							isRevealed: false,
							isCategorical: false,
							isScalar: false
						}
					}
				}
			}, {
				type: 'ADD_COMMIT_REPORT_TRANSACTION',
				market: {
					id: '0xa1',
					eventID: '0xe1',
					type: 'binary',
					description: 'Market 1'
				},
				reportedOutcomeID: '1.5',
				isUnethical: true,
				isIndeterminate: true
			}, {
				type: 'NEXT_REPORT_PAGE'
			}]);
		}
	});
	test({
		description: 'commit to report unethical and indeterminate for categorical event',
		params: {
			market: {
				id: '0xa1',
				eventID: '0xe1',
				type: 'categorical',
				description: 'Market 1'
			},
			reportedOutcomeID: '1.5',
			isUnethical: true,
			isIndeterminate: true
		},
		state: {
			branch: {
				id: '0xb1',
				reportPeriod: 7
			},
			loginAccount: {
				address: '0x0000000000000000000000000000000000000b0b'
			},
			reports: {}
		},
		assertions: (actions) => {
			assert.deepEqual(actions, [{
				type: 'UPDATE_REPORTS',
				reports: {
					'0xb1': {
						'0xe1': {
							eventID: '0xe1',
							period: 7,
							marketID: '0xa1',
							reportHash: '0xdeadbeef',
							reportedOutcomeID: '1.5',
							salt: '0x1337',
							isIndeterminate: true,
							isUnethical: true,
							isCommitted: false,
							isRevealed: false,
							isCategorical: true,
							isScalar: false
						}
					}
				}
			}, {
				type: 'ADD_COMMIT_REPORT_TRANSACTION',
				market: {
					id: '0xa1',
					eventID: '0xe1',
					type: 'categorical',
					description: 'Market 1'
				},
				reportedOutcomeID: '1.5',
				isUnethical: true,
				isIndeterminate: true
			}, {
				type: 'NEXT_REPORT_PAGE'
			}]);
		}
	});
	test({
		description: 'commit to report unethical and indeterminate for scalar event',
		params: {
			market: {
				id: '0xa1',
				eventID: '0xe1',
				type: 'scalar',
				description: 'Market 1'
			},
			reportedOutcomeID: '1.500000000000000001',
			isUnethical: true,
			isIndeterminate: true
		},
		state: {
			branch: {
				id: '0xb1',
				reportPeriod: 7
			},
			loginAccount: {
				address: '0x0000000000000000000000000000000000000b0b'
			},
			reports: {}
		},
		assertions: (actions) => {
			assert.deepEqual(actions, [{
				type: 'UPDATE_REPORTS',
				reports: {
					'0xb1': {
						'0xe1': {
							eventID: '0xe1',
							period: 7,
							marketID: '0xa1',
							reportHash: '0xdeadbeef',
							reportedOutcomeID: '1.500000000000000001',
							salt: '0x1337',
							isIndeterminate: true,
							isUnethical: true,
							isCommitted: false,
							isRevealed: false,
							isCategorical: false,
							isScalar: true
						}
					}
				}
			}, {
				type: 'ADD_COMMIT_REPORT_TRANSACTION',
				market: {
					id: '0xa1',
					eventID: '0xe1',
					type: 'scalar',
					description: 'Market 1'
				},
				reportedOutcomeID: '1.500000000000000001',
				isUnethical: true,
				isIndeterminate: true
			}, {
				type: 'NEXT_REPORT_PAGE'
			}]);
		}
	});
});
