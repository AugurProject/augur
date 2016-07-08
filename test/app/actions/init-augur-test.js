import {
	assert
} from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import testState from '../../testState';

describe(`modules/app/actions/init-augur.js`, () => {
	proxyquire.noPreserveCache().noCallThru();
	const middlewares = [thunk];
	const mockStore = configureMockStore(middlewares);
	let store, action, out;
	let state = Object.assign({}, testState);
	store = mockStore(state);

	let mockAugurJS = {};
	let mockUpBlockchain = {};
	let mockListenUp = {};
	let mockLoginAcc = {};
	let mockLoadMarkets = {};
	let mockLoadFullMarket = {};

	mockAugurJS.connect = sinon.stub().yields(null, {
		connect: 'test'
	});
	mockAugurJS.loadBranch = sinon.stub().yields(null, {
		id: 'testBranch'
	});
	mockUpBlockchain.updateBlockchain = sinon.stub().yields().returns({
		type: 'UPDATE_BLOCKCHAIN'
	});
	mockListenUp.listenToUpdates = sinon.stub().returns({
		type: 'LISTEN_TO_UPDATES'
	});
	mockLoginAcc.loadLoginAccount = sinon.stub().returns({
		type: 'LOAD_LOGIN_ACCOUNT'
	});
	mockLoadMarkets.loadMarkets = sinon.stub().returns({
		type: 'LOAD_MARKETS'
	});
	mockLoadFullMarket.loadFullMarket = sinon.stub().returns({
		type: 'LOAD_FULL_MARKET'
	});

	action = proxyquire('../../../src/modules/app/actions/init-augur.js', {
		'../../../services/augurjs': mockAugurJS,
		'../../app/actions/update-blockchain': mockUpBlockchain,
		'../../app/actions/listen-to-updates': mockListenUp,
		'../../auth/actions/load-login-account': mockLoginAcc,
		'../../markets/actions/load-markets': mockLoadMarkets,
		'../../market/actions/load-full-market': mockLoadFullMarket
	});

	beforeEach(() => {
		store.clearActions();
		global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
		const requests = global.requests = [];
		global.XMLHttpRequest.onCreate = function (xhr) {
            requests.push(xhr);
        };
	});

	afterEach(() => {
		global.XMLHttpRequest.restore();
		store.clearActions();
	});

	it(`should initiate the augur app`, () => {
		out = [{ type: 'UPDATE_ENV', env: { test: 'hello world' } }, {
			isConnected: {
				connect: 'test'
			},
			type: 'UPDATE_CONNECTION_STATUS'
		}, {
			type: 'LOAD_LOGIN_ACCOUNT'
		}, {
			type: 'UPDATE_BRANCH',
			branch: {
				id: 'testBranch'
			}
		}, {
			type: 'LOAD_MARKETS'
		}, {
			type: 'LOAD_FULL_MARKET'
		}, {
			type: 'LISTEN_TO_UPDATES'
		}, {
			type: 'UPDATE_BLOCKCHAIN'
		}];

		store.dispatch(action.initAugur());

		global.requests[0].respond(200, { contentType: 'text/json' }, `{ "test": "hello world" }`);

		assert(mockAugurJS.connect.calledOnce, `Didn't call AugurJS.connect() exactly once`);
		assert(mockAugurJS.loadBranch.calledOnce, `Didn't call AugurJS.loadBranch()  exactly once`);
		assert(mockUpBlockchain.updateBlockchain.calledOnce, `Didn't call updateBlockchain() exactly once as expected`);
		assert(mockListenUp.listenToUpdates.calledOnce, `Didn't call listenToUpdates() exactly once as expected`);
		assert(mockLoginAcc.loadLoginAccount.calledOnce, `Didn't call loadLoginAccount() exactly once as expected`);
		assert(mockLoadMarkets.loadMarkets.calledOnce, `Didn't call loadMarkets() exactly once as expected`);
		assert.deepEqual(store.getActions(), out, `Didn't dispatch the correct action objects`);
	});
});
