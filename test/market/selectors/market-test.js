import { describe, it, beforeEach, afterEach } from 'mocha';
import { assert } from 'chai';
import proxyquire from 'proxyquire';
import * as mockStore from '../../mockStore';
// import assertions from 'augur-ui-react-components/lib/assertions';

import sinon from 'sinon';

describe(`modules/market/selectors/market.js`, () => {
	proxyquire.noPreserveCache().noCallThru();
	const { store } = mockStore.default;

	const { loginAccount } = store.getState();
	const stubbedSelectors = { loginAccount };

	const stubbedAugurJS = {
		getMarketCreatorFeesCollected: () => {},
		abi: { bignum: (n) => n }
	};
	sinon.stub(stubbedAugurJS, 'getMarketCreatorFeesCollected', () => 10);

	const selector = proxyquire('../../../src/modules/market/selectors/market.js', {
		'../../../store': store,
		// make selectors/user-open-orders-summary use the same store as selectors/market.js
		'../../user-open-orders/selectors/user-open-orders-summary': proxyquire('../../../src/modules/user-open-orders/selectors/user-open-orders-summary', {
			'../../../store': store
		}),
		'../../../modules/my-markets/selectors/my-markets': proxyquire('../../../src/modules/my-markets/selectors/my-markets', {
			'../../../services/augurjs': stubbedAugurJS,
			'../../../selectors': stubbedSelectors
		})
	});

	beforeEach(() => {
		store.clearActions();
	});

	afterEach(() => {
		store.clearActions();
	});

	it(`should return the expected values to components`, () => {
		const actual = selector.default();
		assert.isDefined(actual); // TOOD -- remove
		// assertions.market(actual);
	});
});
