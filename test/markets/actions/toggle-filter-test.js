import {
	assert
} from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import * as mockStore from '../../mockStore';
// import * as action from '../../../src/modules/markets/actions/toggle-filter.js';

describe(`modules/markets/actions/toggle-filter.js`, () => {
	let { state, store } = mockStore.default;
	let out, action
	let mockShowLink = { showLink: () => {} };

	sinon.stub(mockShowLink, 'showLink', (href, options) => {
		return { type: 'SHOW_LINK', href, options };
	});

	action = proxyquire('../../../src/modules/markets/actions/toggle-filter', {
		'../../link/actions/show-link': mockShowLink
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
		global.window = {};
	});

	it(`should dispatch a toggle filter action`, () => {
		const filterID = '123test456';
		store.dispatch(action.toggleFilter(filterID));
		out = [{
			type: 'TOGGLE_FILTER',
			filterID: '123test456'
		}, {
			type: 'SHOW_LINK',
			href: '/?filters=isOpen',
			options: {preventScrollTop: true}
		}];

		assert.deepEqual(store.getActions(), out, `Didn't dispatch the correct actions for toggle-filter`);
	});
});
