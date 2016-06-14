import {
	assert
} from 'chai';
import proxyquire from 'proxyquire';
import * as mockStore from '../../mockStore';

let filteredMarkets;
describe(`modules/markets/selectors/markets-filtered.js`, () => {
	proxyquire.noPreserveCache().noCallThru();
	let selector, out, test;
	let { state, store } = mockStore.default;

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

	filteredMarkets = selector.default;

	beforeEach(() => {
		store.clearActions();
	});

	afterEach(() => {
		store.clearActions();
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

export default filteredMarkets;
