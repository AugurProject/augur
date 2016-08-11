import {
	assert
} from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import * as mockStore from '../../mockStore';
import assertions from 'augur-ui-react-components/lib/assertions';

let searchSort;
describe(`modules/markets/selectors/search-sort.js`, () => {
	proxyquire.noPreserveCache().noCallThru();
	let selector, expected, actual;
	let { state, store } = mockStore.default;
	let mockSort = {
		updateSelectedSort: () => {}
	};

	sinon.stub(mockSort, 'updateSelectedSort', (o) => {
		return {
			type: 'UPDATE_SELECTED_SORT',
			value: o
		}
	});

	selector = proxyquire('../../../src/modules/markets/selectors/search-sort.js', {
		'../../../store': store,
		'../../markets/actions/update-selected-sort': mockSort
	});

	searchSort = selector.default;

	beforeEach(() => {
		store.clearActions();
	});

	afterEach(() => {
		store.clearActions();
	});

	it(`should return information about the sorting filters in search`, () => {
		actual = selector.default();
		expected = [{
			type: 'UPDATE_SELECTED_SORT',
			value: {
				prop: 'endDate',
				isDesc: false
			}
		}];

		assertions.searchSort(actual);
		actual.onChangeSort('endDate', false);

		assert(mockSort.updateSelectedSort.calledOnce, `updateSelectedSort wasn't called once as expected`);
		assert.deepEqual(store.getActions(), expected, `Didn't dispatch the expected action object when onChangeSort was called from output selector object`);
	});
});

export default searchSort;
