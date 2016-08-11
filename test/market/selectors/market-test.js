import proxyquire from 'proxyquire';
import * as mockStore from '../../mockStore';
import { assertions } from 'augur-ui-react-components';

import sinon from 'sinon';

describe(`modules/market/selectors/market.js`, () => {
	proxyquire.noPreserveCache().noCallThru();
	let selector,
		actual;
	let { store } = mockStore.default;

	const { loginAccount } = store.getState();
	const stubbedSelectors = { loginAccount };

	let stubbedAugurJS = {
		getFees: () => {}
	};
	sinon.stub(stubbedAugurJS, 'getFees', () => 10);

	selector = proxyquire('../../../src/modules/market/selectors/market.js', {
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
		actual = selector.default();
		assertions.market(actual);
	});
});
