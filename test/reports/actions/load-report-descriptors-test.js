import { assert } from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

describe('modules/reports/actions/load-report-descriptors.js', () => {
	proxyquire.noPreserveCache().noCallThru();
	const middlewares = [thunk];
	const mockStore = configureMockStore(middlewares);

	const test = (t) => {
		it(t.description, (done) => {
			const store = mockStore(t.state);
			const AugurJS = {
				augur: {
					getEthicReport: () => {}
				}
			};
			const DecryptReport = {
				decryptReport: () => {}
			};
			const action = proxyquire('../../../src/modules/reports/actions/load-report-descriptors', {
				'../../../services/augurjs': AugurJS
			});
			sinon.stub(AugurJS.augur, 'getEthicReport', (branchID, period, eventID, address, cb) => {
				cb(t.blockchain.ethicReports[branchID][eventID]);
			});
			store.dispatch(action.loadReportDescriptors((err) => {
				assert.isNull(err);
				t.assertions(store.getActions());
				store.clearActions();
				done();
			}));
		});
	};
	test({
		description: 'binary market, not indeterminate, not unethical',
		eventID: '0xe1',
		marketID: '0xa1',
		blockchain: {
			ethicReports: {
				'0xb1': {
					'0xe1': '1'
				}
			}
		},
		state: {
			branch: {
				id: '0xb1',
				description: 'Branch 1',
				periodLength: 200,
				currentPeriod: 8,
				reportPeriod: 7,
				currentPeriodProgress: 10,
				isReportRevealPhase: false
			},
			loginAccount: {
				address: '0x0000000000000000000000000000000000000b0b',
				derivedKey: new Buffer('42', 'hex'),
				ether: '10000',
				realEther: '2.5',
				rep: '47'
			},
			marketsData: {
				'0xa1': {
					type: 'binary',
					minValue: '1',
					maxValue: '2'
				}
			},
			reports: {
				'0xb1': {
					'0xe1': {
						eventID: '0xe1',
						period: 7,
						marketID: '0xa1',
						reportHash: null,
						reportedOutcomeID: '1',
						salt: null,
						isIndeterminate: false,
						isUnethical: false,
						isRevealed: false,
						isCommitted: false
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
							reportHash: null,
							reportedOutcomeID: '1',
							salt: null,
							minValue: '1',
							maxValue: '2',
							isCategorical: false,
							isScalar: false,
							isUnethical: false,
							isIndeterminate: false,
							isRevealed: false,
							isCommitted: false
						}
					}
				}
			}]);
		}
	});
	test({
		description: 'categorical market, not indeterminate, not unethical',
		eventID: '0xe1',
		marketID: '0xa1',
		blockchain: {
			ethicReports: {
				'0xb1': {
					'0xe1': '1'
				}
			}
		},
		state: {
			branch: {
				id: '0xb1',
				description: 'Branch 1',
				periodLength: 200,
				currentPeriod: 8,
				reportPeriod: 7,
				currentPeriodProgress: 10,
				isReportRevealPhase: false
			},
			loginAccount: {
				address: '0x0000000000000000000000000000000000000b0b',
				derivedKey: new Buffer('42', 'hex'),
				ether: '10000',
				realEther: '2.5',
				rep: '47'
			},
			marketsData: {
				'0xa1': {
					type: 'categorical',
					minValue: '1',
					maxValue: '2'
				}
			},
			reports: {
				'0xb1': {
					'0xe1': {
						eventID: '0xe1',
						period: 7,
						marketID: '0xa1',
						reportHash: null,
						reportedOutcomeID: '1',
						salt: null,
						isIndeterminate: false,
						isUnethical: false,
						isRevealed: false,
						isCommitted: false
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
							reportHash: null,
							reportedOutcomeID: '1',
							salt: null,
							minValue: '1',
							maxValue: '2',
							isCategorical: true,
							isScalar: false,
							isUnethical: false,
							isIndeterminate: false,
							isRevealed: false,
							isCommitted: false
						}
					}
				}
			}]);
		}
	});
	test({
		description: 'scalar market, not indeterminate, unethical',
		eventID: '0xe1',
		marketID: '0xa1',
		blockchain: {
			ethicReports: {
				'0xb1': {
					'0xe1': '0'
				}
			}
		},
		state: {
			branch: {
				id: '0xb1',
				description: 'Branch 1',
				periodLength: 200,
				currentPeriod: 8,
				reportPeriod: 7,
				currentPeriodProgress: 10,
				isReportRevealPhase: false
			},
			loginAccount: {
				address: '0x0000000000000000000000000000000000000b0b',
				derivedKey: new Buffer('42', 'hex'),
				ether: '10000',
				realEther: '2.5',
				rep: '47'
			},
			marketsData: {
				'0xa1': {
					type: 'scalar',
					minValue: '5',
					maxValue: '20'
				}
			},
			reports: {
				'0xb1': {
					'0xe1': {
						eventID: '0xe1',
						period: 7,
						marketID: '0xa1',
						reportHash: null,
						reportedOutcomeID: '1.2345',
						salt: null,
						isUnethical: false,
						isRevealed: false,
						isCommitted: false
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
							reportHash: null,
							reportedOutcomeID: '1.2345',
							salt: null,
							minValue: '5',
							maxValue: '20',
							isCategorical: false,
							isScalar: true,
							isUnethical: true,
							isIndeterminate: false,
							isRevealed: false,
							isCommitted: false
						}
					}
				}
			}]);
		}
	});
	test({
		description: 'categorical market, indeterminate, not unethical',
		eventID: '0xe1',
		marketID: '0xa1',
		blockchain: {
			ethicReports: {
				'0xb1': {
					'0xe1': '1'
				}
			}
		},
		state: {
			branch: {
				id: '0xb1',
				description: 'Branch 1',
				periodLength: 200,
				currentPeriod: 8,
				reportPeriod: 7,
				currentPeriodProgress: 10,
				isReportRevealPhase: false
			},
			loginAccount: {
				address: '0x0000000000000000000000000000000000000b0b',
				derivedKey: new Buffer('42', 'hex'),
				ether: '10000',
				realEther: '2.5',
				rep: '47'
			},
			marketsData: {
				'0xa1': {
					type: 'categorical',
					minValue: '1',
					maxValue: '2'
				}
			},
			reports: {
				'0xb1': {
					'0xe1': {
						eventID: '0xe1',
						period: 7,
						marketID: '0xa1',
						reportHash: null,
						reportedOutcomeID: '1.5',
						salt: null,
						isUnethical: false,
						isRevealed: false,
						isCommitted: false
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
							reportHash: null,
							reportedOutcomeID: '1.5',
							salt: null,
							minValue: '1',
							maxValue: '2',
							isCategorical: true,
							isScalar: false,
							isUnethical: false,
							isIndeterminate: true,
							isRevealed: false,
							isCommitted: false
						}
					}
				}
			}]);
		}
	});	
	test({
		description: 'scalar market, indeterminate, not unethical',
		eventID: '0xe1',
		marketID: '0xa1',
		blockchain: {
			ethicReports: {
				'0xb1': {
					'0xe1': '1'
				}
			}
		},
		state: {
			branch: {
				id: '0xb1',
				description: 'Branch 1',
				periodLength: 200,
				currentPeriod: 8,
				reportPeriod: 7,
				currentPeriodProgress: 10,
				isReportRevealPhase: false
			},
			loginAccount: {
				address: '0x0000000000000000000000000000000000000b0b',
				derivedKey: new Buffer('42', 'hex'),
				ether: '10000',
				realEther: '2.5',
				rep: '47'
			},
			marketsData: {
				'0xa1': {
					type: 'scalar',
					minValue: '5',
					maxValue: '20'
				}
			},
			reports: {
				'0xb1': {
					'0xe1': {
						eventID: '0xe1',
						period: 7,
						marketID: '0xa1',
						reportHash: null,
						reportedOutcomeID: '1.500000000000000001',
						salt: null,
						isUnethical: false,
						isRevealed: false,
						isCommitted: false,
						isSubmitted: false
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
							reportHash: null,
							reportedOutcomeID: '1.500000000000000001',
							salt: null,
							minValue: '5',
							maxValue: '20',
							isCategorical: false,
							isScalar: true,
							isUnethical: false,
							isIndeterminate: false,
							isRevealed: false,
							isCommitted: false,
							isSubmitted: false
						}
					}
				}
			}]);
		}
	});
	test({
		description: 'categorical market, not indeterminate, unethical',
		eventID: '0xe1',
		marketID: '0xa1',
		blockchain: {
			ethicReports: {
				'0xb1': {
					'0xe1': '0'
				}
			}
		},
		state: {
			branch: {
				id: '0xb1',
				description: 'Branch 1',
				periodLength: 200,
				currentPeriod: 8,
				reportPeriod: 7,
				currentPeriodProgress: 10,
				isReportRevealPhase: false
			},
			loginAccount: {
				address: '0x0000000000000000000000000000000000000b0b',
				derivedKey: new Buffer('42', 'hex'),
				ether: '10000',
				realEther: '2.5',
				rep: '47'
			},
			marketsData: {
				'0xa1': {
					type: 'categorical',
					minValue: '1',
					maxValue: '2'
				}
			},
			reports: {
				'0xb1': {
					'0xe1': {
						eventID: '0xe1',
						period: 7,
						marketID: '0xa1',
						reportHash: null,
						reportedOutcomeID: '3',
						salt: null,
						isUnethical: false,
						isRevealed: false,
						isCommitted: false,
						isSubmitted: false
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
							reportHash: null,
							reportedOutcomeID: '3',
							salt: null,
							minValue: '1',
							maxValue: '2',
							isCategorical: true,
							isScalar: false,
							isUnethical: true,
							isIndeterminate: false,
							isRevealed: false,
							isCommitted: false,
							isSubmitted: false
						}
					}
				}
			}]);
		}
	});
	test({
		description: 'scalar market, not indeterminate, unethical',
		eventID: '0xe1',
		marketID: '0xa1',
		blockchain: {
			ethicReports: {
				'0xb1': {
					'0xe1': '0'
				}
			}
		},
		state: {
			branch: {
				id: '0xb1',
				description: 'Branch 1',
				periodLength: 200,
				currentPeriod: 8,
				reportPeriod: 7,
				currentPeriodProgress: 10,
				isReportRevealPhase: false
			},
			loginAccount: {
				address: '0x0000000000000000000000000000000000000b0b',
				derivedKey: new Buffer('42', 'hex'),
				ether: '10000',
				realEther: '2.5',
				rep: '47'
			},
			marketsData: {
				'0xa1': {
					type: 'scalar',
					minValue: '5',
					maxValue: '20'
				}
			},
			reports: {
				'0xb1': {
					'0xe1': {
						eventID: '0xe1',
						period: 7,
						marketID: '0xa1',
						reportHash: null,
						reportedOutcomeID: '1.2345',
						salt: null,
						isUnethical: false,
						isRevealed: false,
						isCommitted: false,
						isSubmitted: false
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
							reportHash: null,
							reportedOutcomeID: '1.2345',
							salt: null,
							minValue: '5',
							maxValue: '20',
							isCategorical: false,
							isScalar: true,
							isUnethical: true,
							isIndeterminate: false,
							isRevealed: false,
							isCommitted: false,
							isSubmitted: false
						}
					}
				}
			}]);
		}
	});
});
