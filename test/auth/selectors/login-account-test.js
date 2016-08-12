import proxyquire from 'proxyquire';
import * as mockStore from '../../mockStore';
import assertions from 'augur-ui-react-components/lib/assertions';

describe(`modules/auth/selectors/login-account.js`, () => {
	proxyquire.noPreserveCache().noCallThru();
	let actual, selector;
	let { state, store } = mockStore.default;

	selector = proxyquire('../../../src/modules/auth/selectors/login-account', {
		'../../../store': store
	});

	beforeEach(() => {
		store.clearActions();
	});

	afterEach(() => {
		store.clearActions();
	});

	it(`should login an account`, () => {
		actual = selector.default();
		assertions.loginAccount(actual);
	});
});
