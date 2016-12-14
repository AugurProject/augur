import { describe, it, before, after } from 'mocha';
import proxyquire from 'proxyquire';
import * as mockStore from 'test/mockStore';
import loginAccountAssertions from 'assertions/login-account';

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

		loginAccountAssertions(actual);
	});
});
