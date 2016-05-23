import {
	assert
} from 'chai';
import proxyquire from 'proxyquire';
// import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import testState from '../../testState';
// import * as selector from '../../../src/modules/markets/selectors/markets-filtered';

describe(`modules/markets/selectors/markets-filtered.js`, () => {
	proxyquire.noPreserveCache().noCallThru();
	const middlewares = [thunk];
	const mockStore = configureMockStore(middlewares);
	let store, selector, out, test;
	let state = Object.assign({}, testState);
	store = mockStore(state);
	let mockSelectors = { allMarkets: [{
		isOpen: true,
		description: 'test 1',
		outcomes: [{
			name: 'outcome1'
		}, {
			name: 'outcome2'
		}],
		tags: [{name: 'testtag'}, {name: 'tag'}]
	}, {
		isOpen: true,
		description: 'test 2',
		outcomes: [{
			name: 'outcome3'
		}, {
			name: 'outcome4'
		}],
		tags: [{name: 'testtag'}, {name: 'tag'}]
	}]};

	selector = proxyquire('../../../src/modules/markets/selectors/markets-filtered.js', {
		'../../../store': store,
		'../../../selectors': mockSelectors
	});

	it(`should be able to select the correct filtered markets`, () => {
		test = selector.default();

		out = [{
			isOpen: true,
			description: 'test 1',
			outcomes: [{
				name: 'outcome1'
			}, {
				name: 'outcome2'
			}],
			tags: [{name: 'testtag'}, {name: 'tag'}]
		}, {
			isOpen: true,
			description: 'test 2',
			outcomes: [{
				name: 'outcome3'
			}, {
				name: 'outcome4'
			}],
			tags: [{name: 'testtag'}, {name: 'tag'}]
		}];

		assert.deepEqual(test, out, `Didn't produce the expected output object`);
	});

});
