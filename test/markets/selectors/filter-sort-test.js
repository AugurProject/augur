import { describe, it, before, beforeEach, after } from 'mocha';
import { assert } from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import * as mockStore from '../../mockStore';
import filterSortAssertions from 'assertions/filter-sort';

describe(`modules/markets/selectors/filter-sort.js`, () => {
	proxyquire.noPreserveCache().noCallThru();
	let actual;
	let expected;
	const { store } = mockStore.default;
	const mockSort = {
		updateSelectedFilterSort: () => {}
	};

	sinon.stub(mockSort, 'updateSelectedFilterSort', o => ({
		type: 'UPDATE_SELECTED_FILTER_SORT',
		value: o
	}));

	const selector = proxyquire('../../../src/modules/markets/selectors/filter-sort.js', {
		'../../../store': store,
		'../../markets/actions/update-selected-filter-sort': mockSort
	});

	before(() => {
		actual = selector.default();
	});

	beforeEach(() => {
		store.clearActions();
		mockSort.updateSelectedFilterSort.reset();
	});

	after(() => {
		store.clearActions();
	});

	it('should pass the correct object to the action', () => {
		actual.onChange('closed', null, false);
		expected = { type: 'closed', isDesc: false };
		assert.deepEqual(store.getActions()[0].value, expected, `Didn't pass expected object to action`);

		store.clearActions();

		actual.onChange(null, 'expiry', null);
		expected = { sort: 'expiry' };
		assert.deepEqual(store.getActions()[0].value, expected, `Didn't pass expected object to action`);
	});

	it(`should call 'updateSelectedFilterSort' once`, () => {
		actual.onChange('closed', null, null);

		assert(mockSort.updateSelectedFilterSort.calledOnce, `'updateSelectedFilterSort' was not called once`);
	});

	it('should deliver the correct shape to augur-ui-react-components', () => {
		filterSortAssertions(actual);
	});
});
