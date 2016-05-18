import {
	assert
} from 'chai';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import testState from '../../testState';
import * as action from '../../../src/modules/markets/actions/update-selected-page-num';

describe(`modules/markets/actions/update-selected-page-num.js`, () => {
	const middlewares = [thunk];
	const mockStore = configureMockStore(middlewares);
	let state = Object.assign({}, testState);
	let store = mockStore(state);
	let out;

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
		global.window = {};
	});

	it(`should return a func. which dispatches UPDATE_SELECTED_PAGE_NUM and SHOW_LINK actions`, () => {
		out = [{
			type: 'UPDATE_SELECTED_PAGE_NUM',
			selectedPageNum: 2
		}, {
			type: 'SHOW_LINK',
			parsedURL: {
				pathArray: ['/'],
				searchParams: {
					isOpen: 'true'
				},
				url: '/?isOpen=true'
			}
		}, {
			type: 'UPDATE_SELECTED_PAGE_NUM',
			selectedPageNum: 5
		}, {
			type: 'SHOW_LINK',
			parsedURL: {
				pathArray: ['/'],
				searchParams: {
					isOpen: 'true'
				},
				url: '/?isOpen=true'
			}
		}];
		store.dispatch(action.updateSelectedPageNum(2));
		store.dispatch(action.updateSelectedPageNum(5));

		assert.deepEqual(store.getActions(), out, `Didn't dispatch an update selected page number action or a show link action as expected`);
	});
});
