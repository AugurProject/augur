import proxyquire from 'proxyquire';
import * as mockStore from '../../mockStore';
import { assertions } from 'augur-ui-react-components';

describe(`modules/link/selectors/links.js`, () => {
	proxyquire.noPreserveCache().noCallThru();
	let selector, actual;
	let { state, store } = mockStore.default;

	selector = proxyquire('../../../src/modules/link/selectors/links', {
		'../../../store': store
	});

	beforeEach(() => {
		store.clearActions();
		// Mock the window object
		// global.window = {};
		// global.window.location = {
		// 	pathname: '/test',
		// 	search: 'example'
		// };
		// global.window.history = {
		// 	state: [],
		// 	pushState: (a, b, c) => window.history.state.push(c)
		// };
		// global.window.scrollTo = (x, y) => true;
	});

	afterEach(() => {
		// global.window = {};
		store.clearActions();
	});

	it(`should have the expected shape`, () => {
		actual = selector.default();
		// console.log(actual);
		assertions.links(actual);
	});
});
