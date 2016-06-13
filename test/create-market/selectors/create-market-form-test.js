import proxyquire from 'proxyquire';
import * as mockStore from '../../mockStore';
import { assertions } from 'augur-ui-react-components';

describe(`modules/create-market/selectors/create-market-form.js`, () => {
	proxyquire.noPreserveCache().noCallThru();
	let selector, actual;
	let { state, store } = mockStore.default;

	selector = proxyquire('../../../src/modules/create-market/selectors/create-market-form', {
		'../../../store': store
	});

	beforeEach(() => {
		store.clearActions();
	});

	afterEach(() => {
		store.clearActions();
	});

// Create Market Form is under construction will finish these when it completes.
	it(`should handle form initialization`, () => {
		actual = selector.default();
		// console.log(actual);
		state.createMarketInProgress = actual;
		assertions.createMarketForm(actual);
	});

	it(`should handle a binary market step 2`, () => {
		// console.log(state.createMarketInProgress);
		state.createMarketInProgress.step = 2;
		state.createMarketInProgress.type = 'binary';
		actual = selector.default();
		// console.log(actual);
		assertions.createMarketForm(actual);
		state.createMarketInProgress = actual;
	});

	it(`should handle a binary market step 3`, () => {
		state.createMarketInProgress.step = 3;
		actual = selector.default();
		// console.log(actual);
		assertions.createMarketForm(actual);
		state.createMarketInProgress = actual;
	});

	it(`should handle a binary market step 4`, () => {
		state.createMarketInProgress.step = 4;
		actual = selector.default();
		// console.log(actual);
		assertions.createMarketForm(actual);
		state.createMarketInProgress = actual;
	});
});
