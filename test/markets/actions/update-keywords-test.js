import {
	assert
} from 'chai';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import testState from '../../testState';
import * as action from '../../../src/modules/markets/actions/update-keywords';

describe(`modules/markets/actions/update-keywords.js`, () => {
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

	it(`should dispatch UPDATE_KEYWORDS action correctly`, () => {
		const keywords = ['key', 'words'];
		out = [{
			type: 'UPDATE_KEYWORDS',
			keywords: ['key', 'words']
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

		store.dispatch(action.updateKeywords(keywords));

		assert.deepEqual(store.getActions(), out, `updatekeywords action didn't dispatch properly`);
	});
});
