import { assert } from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

describe(`modules/reports/actions/clear-old-reports.js`, () => {
	proxyquire.noPreserveCache().noCallThru();
	const middlewares = [thunk];
	const mockStore = configureMockStore(middlewares);

	const test = (t) => {
		it(t.description, () => {
			const store = mockStore(t.state);
			const action = proxyquire('../../../src/modules/reports/actions/clear-old-reports.js', {
			});
			store.dispatch(action.clearOldReports());
			t.assertions(store.getActions());
			store.clearActions();
		});
	};
	test({
		description: 'one old and one current report',
		state: {
			branch: {
				id: '0xb1',
				reportPeriod: 7
			},
			reports: {
				'0xb1': {
					'0xe1': {
						eventID: '0xe1',
						period: 6,
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
				type: 'UPDATE_REPORTS',
				reports: {
					'0xb1': {
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
			}]);
		}
	});
	test({
		description: 'one old and one current report, both uncommitted',
		state: {
			branch: {
				id: '0xb1',
				reportPeriod: 7
			},
			reports: {
				'0xb1': {
					'0xe1': {
						eventID: '0xe1',
						period: 6,
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
				type: 'UPDATE_REPORTS',
				reports: {
					'0xb1': {
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
			}]);
		}
	});
	test({
		description: 'one old and one current report, old report committed',
		state: {
			branch: {
				id: '0xb1',
				reportPeriod: 7
			},
			reports: {
				'0xb1': {
					'0xe1': {
						eventID: '0xe1',
						period: 6,
						marketID: '0xa1',
						reportHash: '0xdeadbeef',
						reportedOutcomeID: '2',
						salt: '0x1337',
						isScalar: false,
						isCategorical: false,
						isIndeterminate: false,
						isUnethical: false,
						isCommitted: true,
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
				type: 'UPDATE_REPORTS',
				reports: {
					'0xb1': {
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
			}]);
		}
	});
	test({
		description: 'one old and one current report, old report committed and revealed',
		state: {
			branch: {
				id: '0xb1',
				reportPeriod: 7
			},
			reports: {
				'0xb1': {
					'0xe1': {
						eventID: '0xe1',
						period: 6,
						marketID: '0xa1',
						reportHash: '0xdeadbeef',
						reportedOutcomeID: '2',
						salt: '0x1337',
						isScalar: false,
						isCategorical: false,
						isIndeterminate: false,
						isUnethical: false,
						isCommitted: true,
						isRevealed: true
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
				type: 'UPDATE_REPORTS',
				reports: {
					'0xb1': {
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
			}]);
		}
	});
	test({
		description: 'two old reports',
		state: {
			branch: {
				id: '0xb1',
				reportPeriod: 7
			},
			reports: {
				'0xb1': {
					'0xe1': {
						eventID: '0xe1',
						period: 6,
						marketID: '0xa1',
						reportHash: '0xdeadbeef',
						reportedOutcomeID: '2',
						salt: '0x1337',
						isScalar: false,
						isCategorical: false,
						isIndeterminate: false,
						isUnethical: false,
						isCommitted: true,
						isRevealed: true
					},
					'0xe2': {
						eventID: '0xe2',
						period: 6,
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
				type: 'UPDATE_REPORTS',
				reports: {
					'0xb1': {}
				}
			}]);
		}
	});
	test({
		description: 'two current reports',
		state: {
			branch: {
				id: '0xb1',
				reportPeriod: 7
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
						isCommitted: true,
						isRevealed: true
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
							isScalar: false,
							isCategorical: false,
							isIndeterminate: false,
							isUnethical: false,
							isCommitted: true,
							isRevealed: true
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
			}]);
		}
	});
	test({
		description: 'two current reports and two old reports',
		state: {
			branch: {
				id: '0xb1',
				reportPeriod: 7
			},
			reports: {
				'0xb1': {
					'0xe1': {
						eventID: '0xe1',
						period: 6,
						marketID: '0xa1',
						reportHash: '0xdeadbeef',
						reportedOutcomeID: '2',
						salt: '0x1337',
						isScalar: false,
						isCategorical: false,
						isIndeterminate: false,
						isUnethical: false,
						isCommitted: true,
						isRevealed: true
					},
					'0xe2': {
						eventID: '0xe2',
						period: 6,
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
						isScalar: false,
						isCategorical: false,
						isIndeterminate: false,
						isUnethical: false,
						isCommitted: true,
						isRevealed: true
					},
					'0xe4': {
						eventID: '0xe4',
						period: 7,
						marketID: '0xa4',
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
				type: 'UPDATE_REPORTS',
				reports: {
					'0xb1': {
						'0xe3': {
							eventID: '0xe3',
							period: 7,
							marketID: '0xa3',
							reportHash: '0xdeadbeef',
							reportedOutcomeID: '2',
							salt: '0x1337',
							isScalar: false,
							isCategorical: false,
							isIndeterminate: false,
							isUnethical: false,
							isCommitted: true,
							isRevealed: true
						},
						'0xe4': {
							eventID: '0xe4',
							period: 7,
							marketID: '0xa4',
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
			}]);
		}
	});
	test({
		description: 'two current reports and two old reports on branch 1, one current report and three old reports on branch 2',
		state: {
			branch: {
				id: '0xb1',
				reportPeriod: 7
			},
			reports: {
				'0xb1': {
					'0xe1': {
						eventID: '0xe1',
						period: 6,
						marketID: '0xa1',
						reportHash: '0xdeadbeef',
						reportedOutcomeID: '2',
						salt: '0x1337',
						isScalar: false,
						isCategorical: false,
						isIndeterminate: false,
						isUnethical: false,
						isCommitted: true,
						isRevealed: true
					},
					'0xe2': {
						eventID: '0xe2',
						period: 6,
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
						isScalar: false,
						isCategorical: false,
						isIndeterminate: false,
						isUnethical: false,
						isCommitted: true,
						isRevealed: true
					},
					'0xe4': {
						eventID: '0xe4',
						period: 7,
						marketID: '0xa4',
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
				},
				'0xb2': {
					'0xe5': {
						eventID: '0xe5',
						period: 6,
						marketID: '0xa5',
						reportHash: '0xdeadbeef',
						reportedOutcomeID: '2',
						salt: '0x1337',
						isScalar: false,
						isCategorical: false,
						isIndeterminate: false,
						isUnethical: false,
						isCommitted: true,
						isRevealed: true
					},
					'0xe6': {
						eventID: '0xe6',
						period: 6,
						marketID: '0xa6',
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
					'0xe7': {
						eventID: '0xe7',
						period: 6,
						marketID: '0xa7',
						reportHash: '0xdeadbeef',
						reportedOutcomeID: '2',
						salt: '0x1337',
						isScalar: false,
						isCategorical: false,
						isIndeterminate: false,
						isUnethical: false,
						isCommitted: true,
						isRevealed: true
					},
					'0xe8': {
						eventID: '0xe8',
						period: 7,
						marketID: '0xa8',
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
				type: 'UPDATE_REPORTS',
				reports: {
					'0xb1': {
						'0xe3': {
							eventID: '0xe3',
							period: 7,
							marketID: '0xa3',
							reportHash: '0xdeadbeef',
							reportedOutcomeID: '2',
							salt: '0x1337',
							isScalar: false,
							isCategorical: false,
							isIndeterminate: false,
							isUnethical: false,
							isCommitted: true,
							isRevealed: true
						},
						'0xe4': {
							eventID: '0xe4',
							period: 7,
							marketID: '0xa4',
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
					},
					'0xb2': {
						'0xe8': {
							eventID: '0xe8',
							period: 7,
							marketID: '0xa8',
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
			}]);
		}
	});
});
