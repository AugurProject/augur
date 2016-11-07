import { assert } from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import testState from '../../testState';

describe('modules/reports/actions/load-report.js', () => {
	proxyquire.noPreserveCache().noCallThru();
	const middlewares = [thunk];
	const mockStore = configureMockStore(middlewares);

	const test = (t) => {
		it(t.description, (done) => {
			const store = mockStore(t.state);
			const AugurJS = {
				augur: {
					getReport: () => {},
					getReportHash: () => {}
				}
			};
			const DecryptReport = {
				decryptReport: () => {}
			};
			const action = proxyquire('../../../src/modules/reports/actions/load-report', {
				'../../../services/augurjs': AugurJS,
				'../../reports/actions/decrypt-report': DecryptReport
			});
			sinon.stub(AugurJS.augur, 'getReport', (branchID, period, eventID, address, cb) => {
				cb(t.blockchain.reports[branchID][eventID]);
			});
			sinon.stub(AugurJS.augur, 'getReportHash', (branchID, period, account, eventID, cb) => {
				cb(t.blockchain.reportHashes[branchID][eventID]);
			});
			sinon.stub(DecryptReport, 'decryptReport', (loginAccount, branchID, period, eventID, cb) => {
				console.log('decryptReport:', loginAccount, branchID, period, eventID);
				cb(null, {
					reportedOutcomeID: t.blockchain.encryptedReports[branchID][eventID].reportedOutcomeID,
					salt: t.blockchain.encryptedReports[branchID][eventID].salt,
					isUnethical: t.blockchain.encryptedReports[branchID][eventID].isUnethical
				});
			});
			store.dispatch(action.loadReport(t.state.branch.id, t.state.branch.reportPeriod, t.eventID, t.marketID, (err) => {
				assert.isNull(err);
				t.assertions(store.getActions());
				store.clearActions();
				done();
			}));
		});
	};
	test({
		description: 'report hash: no, encrypted reports: no, revealed reports: no',
		eventID: '0xe1',
		marketID: '0xa1',
		blockchain: {
			encryptedReports: {
				'0xb1': {
					'0xe1': {
						reportedOutcomeID: null,
						salt: null,
						isUnethical: false
					}
				}
			},
			reportHashes: {
				'0xb1': {
					'0xe1': '0x0'
				}
			},
			reports: {
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
				keystore: {
					crypto: {
						kdfparams: {
							salt: '0x1337'
						}
					}
				},
				ether: '10000',
				realEther: '2.5',
				rep: '47'
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
							reportHash: null,
							reportedOutcomeID: null,
							salt: null,
							isUnethical: false,
							isRevealed: false,
							isCommitted: false
						}
					}
				}
			}]);
		}
	});
	test({
		description: 'report hash: no, encrypted reports: no, revealed reports: no, non-empty reports state',
		eventID: '0xe1',
		marketID: '0xa1',
		blockchain: {
			encryptedReports: {
				'0xb1': {
					'0xe1': {
						reportedOutcomeID: null,
						salt: null,
						isUnethical: false
					}
				}
			},
			reportHashes: {
				'0xb1': {
					'0xe1': '0x0'
				}
			},
			reports: {
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
				keystore: {
					crypto: {
						kdfparams: {
							salt: '0x1337'
						}
					}
				},
				ether: '10000',
				realEther: '2.5',
				rep: '47'
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
							reportedOutcomeID: null,
							salt: null,
							isUnethical: false,
							isRevealed: false,
							isCommitted: false
						}
					}
				}
			}]);
		}
	});
	test({
		description: 'report hash: yes, encrypted reports: no, revealed reports: no',
		eventID: '0xe1',
		marketID: '0xa1',
		blockchain: {
			encryptedReports: {
				'0xb1': {
					'0xe1': {
						reportedOutcomeID: null,
						salt: null,
						isUnethical: false
					}
				}
			},
			reportHashes: {
				'0xb1': {
					'0xe1': '0x1e'
				}
			},
			reports: {
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
				keystore: {
					crypto: {
						kdfparams: {
							salt: '0x1337'
						}
					}
				},
				ether: '10000',
				realEther: '2.5',
				rep: '47'
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
							reportHash: '0x1e',
							isUnethical: false,
							reportedOutcomeID: null,
							salt: null,
							isUnethical: false,
							isRevealed: false,
							isCommitted: true
						}
					}
				}
			}]);
		}
	});
	test({
		description: 'report hash: yes, encrypted reports: no, revealed reports: no, non-empty reports state',
		eventID: '0xe1',
		marketID: '0xa1',
		blockchain: {
			encryptedReports: {
				'0xb1': {
					'0xe1': {
						reportedOutcomeID: null,
						salt: null,
						isUnethical: false
					}
				}
			},
			reportHashes: {
				'0xb1': {
					'0xe1': '0x1e'
				}
			},
			reports: {
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
				keystore: {
					crypto: {
						kdfparams: {
							salt: '0x1337'
						}
					}
				},
				ether: '10000',
				realEther: '2.5',
				rep: '47'
			},
			reports: {
				'0xb1': {
					'0xe2': {
						eventID: '0xe1',
						period: 7,
						marketID: '0xa1',
						reportHash: null,
						reportedOutcomeID: null,
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
							reportHash: '0x1e',
							isUnethical: false,
							reportedOutcomeID: null,
							salt: null,
							isUnethical: false,
							isRevealed: false,
							isCommitted: true
						}
					}
				}
			}]);
		}
	});
	test({
		description: 'report hash: yes, encrypted reports: yes, revealed reports: no',
		eventID: '0xe1',
		marketID: '0xa1',
		blockchain: {
			encryptedReports: {
				'0xb1': {
					'0xe1': {
						reportedOutcomeID: '1',
						salt: '0x7331',
						isUnethical: false
					}
				}
			},
			reportHashes: {
				'0xb1': {
					'0xe1': '0x1e'
				}
			},
			reports: {
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
				keystore: {
					crypto: {
						kdfparams: {
							salt: '0x1337'
						}
					}
				},
				ether: '10000',
				realEther: '2.5',
				rep: '47'
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
							reportHash: '0x1e',
							isUnethical: false,
							reportedOutcomeID: '1',
							salt: '0x7331',
							isUnethical: false,
							isRevealed: false,
							isCommitted: true
						}
					}
				}
			}]);
		}
	});
	test({
		description: 'report hash: yes, encrypted reports: yes, revealed reports: yes',
		eventID: '0xe1',
		marketID: '0xa1',
		blockchain: {
			encryptedReports: {
				'0xb1': {
					'0xe1': {
						reportedOutcomeID: '1',
						salt: '0x7331',
						isUnethical: false
					}
				}
			},
			reportHashes: {
				'0xb1': {
					'0xe1': '0x1e'
				}
			},
			reports: {
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
				keystore: {
					crypto: {
						kdfparams: {
							salt: '0x1337'
						}
					}
				},
				ether: '10000',
				realEther: '2.5',
				rep: '47'
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
							isUnethical: false,
							reportedOutcomeID: '1',
							reportHash: null,
							salt: null,
							isRevealed: true,
							isCommitted: true
						}
					}
				}
			}]);
		}
	});
	test({
		description: 'report hash: yes, encrypted reports: no, revealed reports: yes',
		eventID: '0xe1',
		marketID: '0xa1',
		blockchain: {
			encryptedReports: {
				'0xb1': {
					'0xe1': {
						reportedOutcomeID: null,
						salt: null,
						isUnethical: false
					}
				}
			},
			reportHashes: {
				'0xb1': {
					'0xe1': '0x1e'
				}
			},
			reports: {
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
				keystore: {
					crypto: {
						kdfparams: {
							salt: '0x1337'
						}
					}
				},
				ether: '10000',
				realEther: '2.5',
				rep: '47'
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
							isUnethical: false,
							reportedOutcomeID: '1',
							reportHash: null,
							salt: null,
							isRevealed: true,
							isCommitted: true
						}
					}
				}
			}]);
		}
	});
	test({
		description: 'report hash: no, encrypted reports: no, revealed reports: yes',
		eventID: '0xe1',
		marketID: '0xa1',
		blockchain: {
			encryptedReports: {
				'0xb1': {
					'0xe1': {
						reportedOutcomeID: null,
						salt: null,
						isUnethical: false
					}
				}
			},
			reportHashes: {
				'0xb1': {
					'0xe1': '0x0'
				}
			},
			reports: {
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
				keystore: {
					crypto: {
						kdfparams: {
							salt: '0x1337'
						}
					}
				},
				ether: '10000',
				realEther: '2.5',
				rep: '47'
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
							isUnethical: false,
							reportedOutcomeID: '1',
							reportHash: null,
							salt: null,
							isRevealed: true,
							isCommitted: true
						}
					}
				}
			}]);
		}
	});
});
