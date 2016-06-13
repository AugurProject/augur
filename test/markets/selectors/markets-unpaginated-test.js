import {
	assert
} from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import * as mockStore from '../../mockStore';
import allMarkets from './markets-all-test';
import filteredMarkets from './markets-filtered-test';
import favoriteMarkets from './markets-favorite-test';

let unpaginatedMarkets;
describe('modules/markets/selectors/markets-unpaginated', () => {
	proxyquire.noPreserveCache().noCallThru();
	let selector, actual, expected;
	let { state, store } = mockStore.default;

	const mockSelectors = {
		filteredMarkets: filteredMarkets(),
		allMarkets: allMarkets(),
		favoriteMarkets: favoriteMarkets()
	};

	selector = proxyquire('../../../src/modules/markets/selectors/markets-unpaginated', {
		'../../../store': store,
		'../../../selectors': mockSelectors
	});
	unpaginatedMarkets = selector.default;

	beforeEach(() => {
		store.clearActions();
	});

	afterEach(() => {
		store.clearActions();
	});

	it(`should return unpaginated markets`, () => {
		actual = selector.default();

		expected = [{
			isOpen: true,
			description: 'test 1',
			outcomes: [
				{ name: 'outcome1' },
				{ name: 'outcome2' }
			],
			tags: [
				{ name: 'testtag' },
				{ name: 'tag' }
			]
		}, {
			isOpen: true,
			description: 'test 2',
			outcomes: [
				{ name: 'outcome3' },
				{ name: 'outcome4' }
			],
			tags: [
				{ name: 'testtag' },
				{ name: 'tag' }
			]
		}];

		assert.deepEqual(actual, expected, `didn't produce the expected output`);
	});
});

export default unpaginatedMarkets;
