import { describe, it } from 'mocha';
import { assert } from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import testState from '../../testState';

describe(`modules/auth/actions/logout.js`, () => {
	proxyquire.noPreserveCache().noCallThru();
	const middlewares = [thunk];
	const mockStore = configureMockStore(middlewares);
	const fakeAugurJS = {
		augur: {
			web: {},
			Sessions: { logout: () => {} }
		}
	};
	const store = mockStore(testState);
	fakeAugurJS.augur.web.logout = () => {};
	sinon.stub(fakeAugurJS.augur.Sessions, 'logout', (o) => {
		o.onSent({ callReturn: 1 });
		o.onSuccess({ callReturn: 1 });
	});
	const action = proxyquire('../../../src/modules/auth/actions/logout', {
		'../../../services/augurjs': fakeAugurJS
	});

	it(`should logout of the logged in account`, () => {
		const expectedOutput = [{
			type: 'CLEAR_LOGIN_ACCOUNT'
		}];

		store.dispatch(action.logout());
		assert.deepEqual(store.getActions(), expectedOutput, `It didn't logout as expected`);
	});
});
