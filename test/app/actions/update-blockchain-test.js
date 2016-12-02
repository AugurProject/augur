import { describe, it, beforeEach, afterEach } from 'mocha';
import { assert } from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import testState from '../../testState';

describe(`modules/app/actions/update-blockchain.js`, () => {
	proxyquire.noPreserveCache().noCallThru();
	const middlewares = [thunk];
	const mockStore = configureMockStore(middlewares);
	const state = Object.assign({}, testState, {
		blockchain: {
			currentBlockMillisSinceEpoch: 12344,
			currentBlockNumber: 9999
		}
	});
	const store = mockStore(state);
	const mockAugurJS = {
		rpc: {
			block: { number: 10000 },
			blockNumber: () => {}
		}
	};
	sinon.stub(mockAugurJS.rpc, 'blockNumber', (cb) => {
		cb('0x2710');
	});
	const action = proxyquire('../../../src/modules/app/actions/update-blockchain.js', {
		'../../../services/augurjs': mockAugurJS
	});
	beforeEach(() => {
		store.clearActions();
		global.Date.now = sinon.stub().returns(12345);
	});
	afterEach(() => {
		store.clearActions();
		mockAugurJS.rpc.blockNumber.reset();
	});
	it('rpc.block not set: should sync with blockchain using rpc.blockNumber', () => {
		mockAugurJS.rpc.block = null;
		const out = [{
			type: 'UPDATE_BLOCKCHAIN',
			data: {
				currentBlockNumber: 10000,
				currentBlockMillisSinceEpoch: 12345
			}
		}];
		store.dispatch(action.syncBlockchain());
		assert(mockAugurJS.rpc.blockNumber.calledOnce, `blockNumber wasn't called once as expected`);
		assert.deepEqual(store.getActions(), out, `Didn't dispatch the expected actions`);
	});
	it('rpc.block set: should sync with blockchain using rpc.block.number', () => {
		mockAugurJS.rpc.block = { number: 10000 };
		const out = [{
			type: 'UPDATE_BLOCKCHAIN',
			data: {
				currentBlockNumber: 10000,
				currentBlockMillisSinceEpoch: 12345
			}
		}];
		store.dispatch(action.syncBlockchain());
		assert.strictEqual(mockAugurJS.rpc.blockNumber.callCount, 0, `blockNumber wasn't called zero times as expected`);
		assert.deepEqual(store.getActions(), out, `Didn't dispatch the expected actions`);
	});
});
