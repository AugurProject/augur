import { describe, it, before, after } from 'mocha';
import { assert } from 'chai';
import proxyquire from 'proxyquire';
import * as mockStore from '../../mockStore';
// import assertions from 'augur-ui-react-components/lib/assertions';

describe(`modules/auth/selectors/login-account.js`, () => {
	proxyquire.noPreserveCache().noCallThru();
	const { store } = mockStore.default;

	const selector = proxyquire('../../../src/modules/auth/selectors/login-account', {
		'../../../store': store
	});

	before(() => {
		store.clearActions();
	});

	after(() => {
		store.clearActions();
	});

	it(`should login an account`, () => {
		const actual = selector.default();

		assert.exists(actual); // TODO --remove
		// assertions.loginAccount(actual);
	});
});
