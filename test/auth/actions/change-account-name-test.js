import {
	assert
} from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import testState from '../../testState';

describe(`modules/auth/actions/change-account-name.js`, () => {
	proxyquire.noPreserveCache();
	const middlewares = [thunk];
	const mockStore = configureMockStore(middlewares);
	const store = mockStore(testState);
	const fakeAugurJS = { changeAccountName: () => {} };

	sinon.stub(fakeAugurJS, 'changeAccountName', (name) => {
		return { type: 'FAKE TYPE NAME CHANGE', name };
	});

	beforeEach(() => {
		store.clearActions();
	});

	afterEach(() => {
		store.clearActions();
	});

	const action = proxyquire('../../../src/modules/auth/actions/change-account-name', {
		'../../../services/augurjs': fakeAugurJS
	});

	it('should change an account name', () => {
		store.dispatch(action.changeAccountName('myNameChange'));

		assert(fakeAugurJS.changeAccountName.calledOnce, `augurJS.changeAccountName wasn't called once as expected.`);
	});
});
