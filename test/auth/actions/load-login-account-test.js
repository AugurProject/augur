import {
	assert
} from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import testState from '../../testState';
import {
	updateLoginAccount
} from '../../../src/modules/auth/actions/update-login-account';

describe(`modules/auth/actions/load-login-account.js`, () => {
	proxyquire.noPreserveCache().noCallThru();
	const middlewares = [thunk];
	const mockStore = configureMockStore(middlewares);
	const fakeAugurJS = {};
	const fakeUpdateAssets = {};
	const fakeLoadAcctTrades = {};
	const fakeLoadReports = {};
	const fakeCheckPeriod = {};
	const fakeCollectFees = {};
	const fakeClearReports = {};
	let action, store;
	let thisTestState = Object.assign({}, testState, {
		loginAccount: {}
	});
	store = mockStore(thisTestState);
	fakeAugurJS.loadLoginAccount = (env, cb) => {
		cb(null, {
			id: 123456789
		});
	};
	fakeUpdateAssets.updateAssets = () => {
		return (dispatch, getState) => {
			let ether = 500,
				rep = 25,
				realEther = 100;
			dispatch(updateLoginAccount({
				ether
			}));
			dispatch(updateLoginAccount({
				rep
			}));
			dispatch(updateLoginAccount({
				realEther
			}));
		};
	};

	fakeLoadAcctTrades.loadAccountTrades = sinon.stub().returns({
		type: 'LOAD_ACCOUNT_TRADES'
	});
	fakeClearReports.clearReports = sinon.stub().returns({
		type: 'CLEAR_REPORTS'
	});

	action = proxyquire('../../../src/modules/auth/actions/load-login-account', {
		'../../../services/augurjs': fakeAugurJS,
		'../../auth/actions/update-assets': fakeUpdateAssets,
		'../../my-positions/actions/load-account-trades': fakeLoadAcctTrades,
		'../../reports/actions/load-reports': fakeLoadReports,
		'../../reports/actions/update-reports': fakeClearReports,
		'../../reports/actions/check-period': fakeCheckPeriod,
		'../../reports/actions/collect-fees': fakeCollectFees
	});

	beforeEach(() => {
		store.clearActions();
	});

	it(`should update the login account`, () => {
		store.dispatch(action.loadLoginAccount());

		const expectedOutput = [{
			type: 'UPDATE_LOGIN_ACCOUNT',
			data: {
				id: 123456789
			}
		}, {
			type: 'UPDATE_LOGIN_ACCOUNT',
			data: {
				ether: 500
			}
		}, {
			type: 'UPDATE_LOGIN_ACCOUNT',
			data: {
				rep: 25
			}
		}, {
			type: 'UPDATE_LOGIN_ACCOUNT',
			data: {
				realEther: 100
			}
		}, {
			type: 'LOAD_ACCOUNT_TRADES'
		}, {
			type: 'CLEAR_REPORTS'
		}];
		assert(fakeLoadAcctTrades.loadAccountTrades.calledOnce, `loadAccountTrades wasn't called once as expected.`);
		assert(fakeClearReports.clearReports.calledOnce, `clearReports wasn't called once as expected.`);
		assert.deepEqual(store.getActions(), expectedOutput, `didn't properly update the logged in account`);
	});
});
