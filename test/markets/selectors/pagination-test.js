import { describe, it, before, after } from 'mocha';
import { assert } from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import * as mockStore from 'test/mockStore';
import paginationAssertions from 'assertions/pagination';

describe(`modules/markets/selectors/pagination.js`, () => {
	proxyquire.noPreserveCache().noCallThru();
	let actual;
	const { state, store } = mockStore.default;

	const mockPage = {
		updateSelectedPageNum: () => {}
	};
	const mockSelectors = {
		marketsTotals: {
			numUnpaginated: 100
		}
	};

	sinon.stub(mockPage, 'updateSelectedPageNum', pageNum => ({
		type: 'UPDATE_SELECTED_PAGE_NUM',
		pageNum
	}));

	const selector = proxyquire('../../../src/modules/markets/selectors/pagination.js', {
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

		const expected = [{
			type: 'UPDATE_SELECTED_PAGE_NUM',
			pageNum: 4
		}];

		actual.onUpdateSelectedPageNum(4);

		assert.deepEqual(store.getActions(), expected, `Didn't dispatch the expected action objects when onUpdateSelectedPageNum was called.`);
	});

	it('should deliver the correct shape to AURC', () => {
		state.pagination.selectedPageNum = 2;

		actual = selector.default();

		paginationAssertions(actual);
	});
});
