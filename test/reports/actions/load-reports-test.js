import { describe, it } from 'mocha';
import { assert } from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

describe('modules/reports/actions/load-reports.js', () => {
	proxyquire.noPreserveCache().noCallThru();
	const middlewares = [thunk];
	const mockStore = configureMockStore(middlewares);

	const test = (t) => {
		it(t.description, (done) => {
			const store = mockStore(t.state);
			const AugurJS = {
				augur: {
					getEventsToReportOn: () => {},
					getMarket: () => {}
				}
			};
			const LoadMarketsInfo = {
				loadMarketsInfo: () => {}
			};
			const LoadReport = {
				loadReport: () => {}
			};
			const LoadReportDescriptors = {
				loadReportDescriptors: () => {}
			};
			const action = proxyquire('../../../src/modules/reports/actions/load-reports', {
				'../../../services/augurjs': AugurJS,
				'../../markets/actions/load-markets-info': LoadMarketsInfo,
				'../../reports/actions/load-report': LoadReport,
				'../../reports/actions/load-report-descriptors': LoadReportDescriptors
			});
			sinon.stub(AugurJS.augur, 'getEventsToReportOn', (branchID, period, account, index, cb) => {
				cb(t.blockchain.eventsToReportOn[branchID]);
			});
			sinon.stub(AugurJS.augur, 'getMarket', (eventID, index, cb) => {
				cb(t.blockchain.eventToMarket[eventID]);
			});
			sinon.stub(LoadMarketsInfo, 'loadMarketsInfo', (marketIDs, cb) => (dispatch, getState) => {
				dispatch({ type: 'LOAD_MARKETS_INFO', marketIDs });
				if (cb) cb();
			});
			sinon.stub(LoadReport, 'loadReport', (branchID, period, eventID, marketID, cb) => (dispatch, getState) => {
				dispatch({ type: 'LOAD_REPORT' });
				cb(null);
			});
			sinon.stub(LoadReportDescriptors, 'loadReportDescriptors', (cb) => (dispatch, getState) => {
				dispatch({ type: 'LOAD_REPORT_DESCRIPTORS' });
				cb(null);
			});
			store.dispatch(action.loadReports((e, marketIDs) => {
				assert.isNull(e);
				t.assertions(store.getActions(), marketIDs);
				store.clearActions();
				done();
			}));
		});
	};
	test({
		description: 'no events to report on',
		blockchain: {
			eventToMarket: {},
			eventsToReportOn: {
				'0xb1': []
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
			reports: {}
		},
		assertions: (actions, marketIDs) => {
			assert.isArray(actions);
			assert.isArray(marketIDs);
			assert.lengthOf(actions, 0);
			assert.lengthOf(marketIDs, 0);
		}
	});
	test({
		description: 'one event to report on',
		blockchain: {
			eventToMarket: {
				'0xe1': '0xf1'
			},
			eventsToReportOn: {
				'0xb1': [
					'0xe1'
				]
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
			reports: {}
		},
		assertions: (actions, marketIDs) => {
			assert.deepEqual(actions, [{
				type: 'LOAD_MARKETS_INFO',
				marketIDs: ['0xf1']
			}, {
				type: 'LOAD_REPORT'
			}, {
				type: 'LOAD_REPORT_DESCRIPTORS'
			}]);
			assert.deepEqual(marketIDs, ['0xf1']);
		}
	});
	test({
		description: 'two events to report on',
		blockchain: {
			eventToMarket: {
				'0xe1': '0xf1',
				'0xe2': '0xf2'
			},
			eventsToReportOn: {
				'0xb1': [
					'0xe1',
					'0xe2'
				]
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
			reports: {}
		},
		assertions: (actions, marketIDs) => {
			assert.deepEqual(actions, [{
				type: 'LOAD_MARKETS_INFO',
				marketIDs: ['0xf1']
			}, {
				type: 'LOAD_REPORT'
			}, {
				type: 'LOAD_MARKETS_INFO',
				marketIDs: ['0xf2']
			}, {
				type: 'LOAD_REPORT'
			}, {
				type: 'LOAD_REPORT_DESCRIPTORS'
			}]);
			assert.deepEqual(marketIDs, ['0xf1', '0xf2']);
		}
	});
	test({
		description: 'two events to report on, one already revealed',
		blockchain: {
			eventToMarket: {
				'0xe1': '0xf1',
				'0xe2': '0xf2'
			},
			eventsToReportOn: {
				'0xb1': [
					'0xe1',
					'0xe2'
				]
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
			reports: {
				'0xb1': {
					'0xe1': {
						isRevealed: true
					}
				}
			}
		},
		assertions: (actions, marketIDs) => {
			assert.deepEqual(actions, [{
				type: 'LOAD_MARKETS_INFO',
				marketIDs: ['0xf1']
			}, {
				type: 'LOAD_MARKETS_INFO',
				marketIDs: ['0xf2']
			}, {
				type: 'LOAD_REPORT'
			}, {
				type: 'LOAD_REPORT_DESCRIPTORS'
			}]);
			assert.deepEqual(marketIDs, ['0xf1', '0xf2']);
		}
	});
	test({
		description: 'two events to report on current branch, one event elsewhere',
		blockchain: {
			eventToMarket: {
				'0xe1': '0xf1',
				'0xe2': '0xf2',
				'0xe3': '0xf3'
			},
			eventsToReportOn: {
				'0xb1': [
					'0xe1',
					'0xe2'
				],
				'0xb2': [
					'0xe3'
				]
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
			reports: {}
		},
		assertions: (actions, marketIDs) => {
			assert.deepEqual(actions, [{
				type: 'LOAD_MARKETS_INFO',
				marketIDs: ['0xf1']
			}, {
				type: 'LOAD_REPORT'
			}, {
				type: 'LOAD_MARKETS_INFO',
				marketIDs: ['0xf2']
			}, {
				type: 'LOAD_REPORT'
			}, {
				type: 'LOAD_REPORT_DESCRIPTORS'
			}]);
			assert.deepEqual(marketIDs, ['0xf1', '0xf2']);
		}
	});
});
