import {
	assert
} from 'chai';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import testState from '../../testState';
import * as action from '../../../src/modules/link/actions/show-link';

describe(`modules/link/actions/show-link.js`, () => {
	const middlewares = [thunk];
	const mockStore = configureMockStore(middlewares);
	let thisTestState = Object.assign({}, testState);
	let store = mockStore(thisTestState);
	let out;
	const URL = '/test?search=example';

	beforeEach(() => {
		store.clearActions();
		// Mock the window object
		global.window = {};
		global.window.location = {
			pathname: '/test',
			search: 'example'
		};
		global.window.history = {
			state: [],
			pushState: (a, b, c) => window.history.state.push(c)
		};
		global.window.scrollTo = (x, y) => true;
	});

	afterEach(() => {
		global.window = {};
	});

	it(`should dispatch a SHOW_LINK action type with a parsed URL`, () => {
		assert.deepEqual(window.history.state, [], `window.history.state didn't start empty`);
		store.dispatch(action.showLink(URL));
		out = [{
			type: 'SHOW_LINK',
			parsedURL: {
				pathArray: ['/test'],
				searchParams: {
					search: 'example'
				},
				url: '/test?search=example'
			}
		}];

		assert.deepEqual(store.getActions(), out, `Didn't parse the url correctly`);
		assert.deepEqual(window.history.state, [URL], `Didn't add the new link to the history`);
	});

	it(`should be able to dispatch the previous link`, () => {
		store.dispatch(action.showPreviousLink(URL));

		assert.deepEqual(store.getActions(), out, `Didn't dispatch the previous link`);
		assert.deepEqual(window.history.state, [], `window.history.state has a history of links instead of being empty as expected`);
	});

});
