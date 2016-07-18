import {
	assert
} from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import testState from '../../testState';

describe(`modules/auth/actions/register.js`, () => {
	proxyquire.noPreserveCache();
	const middlewares = [thunk];
	const mockStore = configureMockStore(middlewares);
	const fakeAugurJS = {};
	const fakeAuthLink = {};
	const fakeSelectors = {};

	let action, store;
	let thisTestState = Object.assign({}, testState, {
		loginAccount: {}
	});
	store = mockStore(thisTestState);
	fakeAugurJS.register = (env, branchID, name, psswrd, cb, onFundSent, onFundSuccess, onFundFailed) => {
		cb(null, {
			address: 'test',
			id: 'test',
			secureLoginID: 'testid',
			name: name,
			ether: 0,
			realEther: 0,
			rep: 0
		});
	};
	fakeSelectors.links = {
		marketsLink: {
			onClick: () => {}
		}
	};
	fakeAuthLink.selectAuthLink = (page, bool, dispatch) => {
		return { onClick: () => {} };
	};


	action = proxyquire('../../../src/modules/auth/actions/register', {
		'../../../services/augurjs': fakeAugurJS,
		'../../../selectors': fakeSelectors,
		'../../link/selectors/links': fakeAuthLink
	});

	beforeEach(() => {
		store.clearActions();
	});

	it(`should register a new account`, () => {
		// this should be faster, currently taking to long
		const expectedOutput = [{
			type: 'UPDATE_LOGIN_ACCOUNT',
			data: {
				secureLoginID: 'testid',
			}
		}];

		store.dispatch(action.register('newUser', 'testing', 'testing'));

		assert.deepEqual(store.getActions(), expectedOutput, `Didn't create a new account as expected`);
	});

	it(`should fail with no username entered`, () => {
		const expectedOutput = [{
			type: 'AUTH_ERROR',
			err: {
				code: 'USERNAME_REQUIRED'
			}
		}];

		store.dispatch(action.register('', 'testing', 'testing'));

		assert.deepEqual(store.getActions(), expectedOutput, `didn't fail when user doesn't pass a username`);
	});

	it(`should fail with mismatched passwords`, () => {
		const expectedOutput = [{
			type: 'AUTH_ERROR',
			err: {
				code: 'PASSWORDS_DO_NOT_MATCH'
			}
		}, {
			type: 'AUTH_ERROR',
			err: {
				code: 'PASSWORDS_DO_NOT_MATCH'
			}
		}, {
			type: 'AUTH_ERROR',
			err: {
				code: 'PASSWORDS_DO_NOT_MATCH'
			}
		}, {
			type: 'AUTH_ERROR',
			err: {
				code: 'PASSWORDS_DO_NOT_MATCH'
			}
		}];

		store.dispatch(action.register('test', 'test', 'test1'));
		store.dispatch(action.register('test', '', 'test'));
		store.dispatch(action.register('test', 'test2', 'test'));
		store.dispatch(action.register('test', 'test1', 'test2'));

		assert.deepEqual(store.getActions(), expectedOutput, `didn't fail when user doesn't pass a username`);
	});
});
