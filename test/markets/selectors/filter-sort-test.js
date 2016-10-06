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
		store.clearActions();
	});

	after(() => {
		store.clearActions();
	});

	it(`should return the expected object`, () => {
		actual = selector.default();

		console.log('actual -- ', actual);

		expected = {
			types: [
				{
					label: 'Open',
					value: 'open'
				},
				{
					label: 'Closed',
					value: 'closed'
				},
				{
					label: 'Reporting',
					value: 'reporting'
				}
			],
			sort: [
				{
					label: 'Volume',
					value: 'volume'
				},
				{
					label: 'Newest',
					value: 'newest'
				},
				{
					label: 'Expiry',
					value: 'expiry'
				},
				{
					label: 'Taker Fee',
					value: 'takerFee'
				},
				{
					label: 'Maker Fee',
					value: 'makerFee'
				}
			],
			order: {
				isDesc: true
			},
			selectedFilterSort: {
				type: 'open',
				sort: 'volume',
				isDesc: true
			}
		}

		// assertions.searchSort(actual);
		// actual.onChangeSort('endDate', false);

		// assert.deepEqual(store.getActions(), expected, `Didn't dispatch the expected action object when onChangeSort was called from output selector object`);
	});

	it('should call the correct action', () => {
		actual.onChange('closed', false);

		assert(mockSort.updateSelectedFilterSort.calledOnce, `updateSelectedFilterSort wasn't called once as expected`);
	});
});
