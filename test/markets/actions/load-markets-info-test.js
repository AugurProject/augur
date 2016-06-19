import {
	assert
} from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import testState from '../../testState';

describe(`modules/markets/actions/load-markets-info.js`, () => {
	proxyquire.noPreserveCache().noCallThru();
	const middlewares = [thunk];
	const mockStore = configureMockStore(middlewares);
	let store, action, out;
	let state = Object.assign({}, testState);
	store = mockStore(state);
	let mockAugurJS = {
		batchGetMarketInfo: () => {}
	};

	beforeEach(() => {
		store.clearActions();
	});

	afterEach(() => {
		store.clearActions();
	});

	sinon.stub(mockAugurJS, `batchGetMarketInfo`, (marketIDs, cb) => {
		cb(null, {
			test123: {
				events: [{
					id: 'event1',
					minValue: 1,
					maxValue: 3,
					numOutcomes: 3,
					outcome: 2
				}],
				tags: ['test', 'testtag'],
				outcomes: [{
					id: 1
				}, {
					id: 2
				}],
				type: 'binary'
			}
		});
	});

	action = proxyquire('../../../src/modules/markets/actions/load-markets-info', {
		'../../../services/augurjs': mockAugurJS
	});

	it(`should load markets info`, () => {
		out = [{
			type: 'UPDATE_MARKETS_DATA',
			marketsData: {
				test123: {
					tags: [ 'test', 'testtag' ],
					type: 'binary',
					eventID: 'event1',
					isLoadedMarketInfo: true,
					minValue: 1,
					maxValue: 3,
					numOutcomes: 3,
					reportedOutcome: 2
				}
			}
		}, {
			type: 'UPDATE_OUTCOMES_DATA',
			outcomesData: {
				test123: {
					'1': {
						name: 'No'
					},
					'2': {
						name: 'Yes'
					}
				}
			}
		}];
		let actual = store.dispatch(action.loadMarketsInfo(['test123']));

		assert.deepEqual(store.getActions(), out, `Didn't dispatch the expected action objects`);
	});
});
