import { assert } from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import * as mockStore from '../../mockStore';

describe(`modules/link/actions/update-url.js`, () => {
	let { state, store } = mockStore.default;
	let out, action;
	const URL = '/test?search=example';

	let mockFullMarket = {};
	mockFullMarket.loadFullMarket = sinon.stub().returns({
		type: 'UPDATE_URL',
		value: 'loadFullMarket has been called, this is a stub.'
	});

	action = proxyquire('../../../src/modules/link/actions/update-url', {
		'../../market/actions/load-full-market': mockFullMarket
	});

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

	it(`should dispatch a UPDATE_URL action type with a parsed URL`, () => {
		store.dispatch(action.updateURL(URL));
		out = [{
			type: 'UPDATE_URL',
			parsedURL: {
				pathArray: ['/test'],
				searchParams: {
					search: 'example'
				},
				url: '/test?search=example'
			}
		}, {
			type: 'UPDATE_URL',
			value: 'loadFullMarket has been called, this is a stub.'
		}];

		assert.deepEqual(store.getActions(), out, `Didn't parse the url correctly`);
	});
});
