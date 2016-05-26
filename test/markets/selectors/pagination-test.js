import {
	assert
} from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import testState from '../../testState';

let pagination;
describe(`modules/markets/selectors/pagination.js`, () => {
	proxyquire.noPreserveCache().noCallThru();
	const middlewares = [thunk];
	const mockStore = configureMockStore(middlewares);
	let store, selector, out, test;
	let state = Object.assign({}, testState, {
		pagination: {
			numPerPage: 10,
			selectedPageNum: 5
		}
	});
	store = mockStore(state);
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

	pagination = selector.default;

	it(`should change the selected page number`, () => {
		test = selector.default();
		let actions = [{
			type: 'UPDATE_SELECTED_PAGE_NUM',
			pageNum: 4
		}];
		out = {
			numUnpaginated: 100,
			selectedPageNum: 5,
			numPerPage: 10,
			numPages: 10,
			startItemNum: 41,
			endItemNum: 50,
			onUpdateSelectedPageNum: test.onUpdateSelectedPageNum,
			nextPageNum: 6,
			previousPageNum: 4,
			nextItemNum: 51,
			previousItemNum: 31
		};

		test.onUpdateSelectedPageNum(4);

		assert.deepEqual(test, out, `Didn't return the expected object`);
		assert(mockPage.updateSelectedPageNum.calledOnce, `updateSelectedPageNum didn't get called once as expected`);
		assert.deepEqual(store.getActions(), actions, `Didn't dispatch the expected action objects when onUpdateSelectedPageNum was called.`);
	});
});

export default pagination;
