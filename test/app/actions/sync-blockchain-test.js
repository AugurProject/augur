import { describe, it, afterEach } from 'mocha';
import { assert } from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import testState from 'test/testState';

describe(`modules/app/actions/sync-blockchain.js`, () => {
  proxyquire.noPreserveCache().noCallThru();
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  const state = Object.assign({}, testState, {
    blockchain: {
      currentBlockMillisSinceEpoch: 12344,
      currentBlockTimestamp: 4886718335,
      currentBlockNumber: 9999
    }
  });
  const store = mockStore(state);
  const AugurJS = {
    rpc: {
      block: { number: 10000 },
      blockNumber: () => {},
      getBlock: () => {}
    }
  };
  const UpdateBlockchain = { updateBlockchain: () => {} };
  sinon.stub(AugurJS.rpc, 'blockNumber', (cb) => {
    cb('0x2710');
  });
  sinon.stub(AugurJS.rpc, 'getBlock', (blockNumber, full, cb) => {
    cb({ timestamp: '0x123456789' });
  });
  sinon.stub(UpdateBlockchain, 'updateBlockchain', data => ({ type: 'UPDATE_BLOCKCHAIN', data }));
  const action = proxyquire('../../../src/modules/app/actions/sync-blockchain.js', {
    '../../../services/augurjs': AugurJS,
    '../../app/actions/update-blockchain': UpdateBlockchain
  });
  global.Date.now = sinon.stub().returns(12345);
  afterEach(() => {
    store.clearActions();
    AugurJS.rpc.blockNumber.reset();
  });
  it('rpc.block not set: should sync with blockchain using rpc.blockNumber', () => {
    AugurJS.rpc.block = null;
    const out = [{
      type: 'UPDATE_BLOCKCHAIN',
      data: {
        currentBlockNumber: 10000
      }
    }, {
      type: 'UPDATE_BLOCKCHAIN',
      data: {
        currentBlockTimestamp: 4886718345,
        currentBlockMillisSinceEpoch: 12345
      }
    }];
    store.dispatch(action.syncBlockchain());
    assert(AugurJS.rpc.blockNumber.calledOnce, `blockNumber wasn't called once as expected`);
    assert.deepEqual(store.getActions(), out, `Didn't dispatch the expected actions`);
  });
  it('rpc.block set: should sync with blockchain using rpc.block.number', () => {
    AugurJS.rpc.block = { number: 10000, timestamp: '0x123456789' };
    const out = [{
      type: 'UPDATE_BLOCKCHAIN',
      data: {
        currentBlockNumber: 10000,
        currentBlockTimestamp: 4886718345,
        currentBlockMillisSinceEpoch: 12345
      }
    }];
    store.dispatch(action.syncBlockchain());
    assert.strictEqual(AugurJS.rpc.blockNumber.callCount, 0, `blockNumber wasn't called zero times as expected`);
    assert.deepEqual(store.getActions(), out, `Didn't dispatch the expected actions`);
  });
});
