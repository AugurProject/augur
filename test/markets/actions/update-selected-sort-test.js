import { assert } from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import * as mockStore from '../../mockStore';
// import configureMockStore from 'redux-mock-store';
// import thunk from 'redux-thunk';
// import testState from '../../testState';
// import * as action from '../../../src/modules/markets/actions/update-selected-sort';

describe('modules/markets/actions/update-selected-sort', () => {
	let { state, store } = mockStore.default;
	let out, action;
	let mockUpdateURL = { updateURL: () => {} };

	sinon.stub(mockUpdateURL, 'updateURL', (href) => {
		return { type: 'UPDATE_URL', href };
	});

	action = proxyquire('../../../src/modules/markets/actions/update-selected-sort', {
		'../../link/actions/update-url': mockUpdateURL
	});

	beforeEach(() => {
		store.clearActions();
		// Mock the Window object
		global.window = {};
		global.window.location = {
			pathname: '/',
			search: '?isOpen=true'
		};
		global.window.history = {
			pushState: (a, b, c) => true
		};
		global.window.scrollTo = (x, y) => true;
	});

	afterEach(() => {
		store.clearActions();
		global.window = {};
	});

	it(`should return an UPDATE_SELECTED_SORT action object`, () => {
		const selectedSort = 'puppies';
		store.dispatch(action.updateSelectedSort(selectedSort));
		out = [{
			type: 'UPDATE_SELECTED_SORT',
			selectedSort: 'puppies'
		}, {
			type: 'UPDATE_URL',
			href: '/?filters=isOpen'
		}];

		assert.deepEqual(store.getActions(), out, `Didn't return the correct action object`);
	});
});
