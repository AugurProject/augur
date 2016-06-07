// import {
// 	assert
// } from 'chai';
import proxyquire from 'proxyquire';
// import configureMockStore from 'redux-mock-store';
// import thunk from 'redux-thunk';
// import testState from '../../testState';
import * as mockStore from '../../mockStore';
import linksAssertion from '../../../node_modules/augur-ui-react-components/test/assertions/links';
// import selector from '../../../src/modules/link/selectors/links';
let links;
describe(`modules/link/selectors/links.js`, () => {
	proxyquire.noPreserveCache().noCallThru();
	// const middlewares = [thunk];
	// const mockStore = configureMockStore(middlewares);
	// let mockState = Object.assign({}, testState);
	// let store = mockStore(mockState);
	let selector, actual;
	let { state, store } = mockStore.default;

	selector = proxyquire('../../../src/modules/link/selectors/links', {
		'../../../store': store
	});

	links = selector;

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

	it(`should return an links object with expected shape`, () => {
		actual = selector.default();
		linksAssertion(actual);
		// First test that all onClicks should return functions.
		// assert.isFunction(test.authLink.onClick, `authLink.onClick didn't return a function`);
		// assert.isFunction(test.createMarketLink.onClick, `createMarketLink.onClick didn't return a function`);
		// assert.isFunction(test.marketsLink.onClick, `marketsLink.onClick didn't return a function`);
		// assert.isFunction(test.positionsLink.onClick, `positionsLink.onClick didn't return a function`);
		// assert.isFunction(test.transactionsLink.onClick, `transactionsLink.onClick didn't return a function`);
		// assert.isFunction(test.marketLink.onClick, `marketLink.onClick didn't return a function`);
		// assert.isFunction(test.previousLink.onClick, `previousLink.onClick didn't return a function`);
	});

	// it(`should select links properily`, () => {
	// 	actual = selector.default();
	// 	linksAssertion(actual)
	// 	// going to copy the functions directly from the test, we are testing that
	// 	// the shape of the data is correct and the hrefs are the correct hrefs.
	// 	// out = {
	// 	// 	authLink: {
	// 	// 		href: '/login',
	// 	// 		onClick: test.authLink.onClick
	// 	// 	},
	// 	// 	createMarketLink: {
	// 	// 		href: '/make',
	// 	// 		onClick: test.createMarketLink.onClick
	// 	// 	},
	// 	// 	marketsLink: {
	// 	// 		href: '/?search=test%20testtag&filters=isOpen&tags=testtag%2Ctag',
	// 	// 		onClick: test.marketsLink.onClick
	// 	// 	},
	// 	// 	positionsLink: {
	// 	// 		href: '/positions',
	// 	// 		onClick: test.positionsLink.onClick
	// 	// 	},
	// 	// 	transactionsLink: {
	// 	// 		href: '/transactions',
	// 	// 		onClick: test.transactionsLink.onClick
	// 	// 	},
	// 	// 	marketLink: {
	// 	// 		href: '/m/_undefined',
	// 	// 		onClick: test.marketLink.onClick,
	// 	// 		text: 'View',
	// 	// 		className: 'view'
	// 	// 	},
	// 	// 	previousLink: {
	// 	// 		href: '/',
	// 	// 		onClick: test.previousLink.onClick
	// 	// 	}
	// 	// };
	// 	//
	// 	// assert.deepEqual(test, out, `Didn't produce the correct shape of data.`);
	// });

});

export default links;
