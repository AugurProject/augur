import {
	assert
} from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import * as mockStore from '../../mockStore';
import assertions from 'augur-ui-react-components/lib/assertions';

describe(`modules/markets/selectors/filter-sort.js`, () => {
	proxyquire.noPreserveCache().noCallThru();
	let selector, expected, actual;
	let { state, store } = mockStore.default;
	let mockSort = {
		updateSelectedFilterSort: () => {}
	};

	sinon.stub(mockSort, 'updateSelectedFilterSort', (o) => {
		return {
			type: 'UPDATE_SELECTED_FILTER_SORT',
			value: o
		}
	});

	selector = proxyquire('../../../src/modules/markets/selectors/filter-sort.js', {
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
		assertions.filterSort(actual);
	});
});
