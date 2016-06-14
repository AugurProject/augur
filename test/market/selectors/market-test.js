import proxyquire from 'proxyquire';
import sinon from 'sinon';
import * as mockStore from '../../mockStore';
import {assertions}from 'augur-ui-react-components';

describe(`modules/market/selectors/market.js`, () => {
	proxyquire.noPreserveCache().noCallThru();
	let selector, expected, actual;
	let { state, store } = mockStore.default;

	selector = proxyquire('../../../src/modules/market/selectors/market.js', {
		'../../../store': store,
	});

	beforeEach(() => {
		store.clearActions();
	});

	afterEach(() => {
		store.clearActions();
	});

	it(`should return an assembled market`, () => {
		actual = selector.default();
		// console.log(actual);
		assertions.market.marketAssertion(actual);
	});
});
