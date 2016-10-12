import {
	assert
} from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import * as mockStore from '../../mockStore';
import assertions from 'augur-ui-react-components/lib/assertions';

describe(`modules/markets/selectors/pagination.js`, () => {
	proxyquire.noPreserveCache().noCallThru();
	let selector, expected, actual;
	let { state, store } = mockStore.default;

	let mockPage = {
		updateSelectedPageNum: () => {}
	};
	let mockSelectors = {
		marketsTotals: {
			numUnpaginated: 100
		}
	};

	sinon.stub(mockPage, 'updateSelectedPageNum', (pageNum) => {
		return {
			type: 'UPDATE_SELECTED_PAGE_NUM',
			pageNum
		}
	});

	selector = proxyquire('../../../src/modules/markets/selectors/pagination.js', {
		'../../../store': store,
		'../../markets/actions/update-selected-page-num': mockPage,
		'../../../selectors': mockSelectors
	});

	before(() => {
		store.clearActions();
	});

	after(() => {
		store.clearActions();
	});

	it(`should change the selected page number`, () => {
		actual = selector.default();

		expected = [{
			type: 'UPDATE_SELECTED_PAGE_NUM',
			pageNum: 4
		}];

		actual.onUpdateSelectedPageNum(4);

		assert.deepEqual(store.getActions(), expected, `Didn't dispatch the expected action objects when onUpdateSelectedPageNum was called.`);
	});

	it('should deliver the correct shape to AURC', () => {
		state.pagination.selectedPageNum = 2;
		
		actual = selector.default();

		assertions.pagination(actual);
	});
});
