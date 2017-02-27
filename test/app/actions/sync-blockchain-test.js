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
      block: { number: 10000, timestamp: 4886718345 }
    }
  };
  const UpdateBlockchain = { updateBlockchain: () => {} };
  sinon.stub(UpdateBlockchain, 'updateBlockchain', data => ({ type: 'UPDATE_BLOCKCHAIN', data }));
  const action = proxyquire('../../../src/modules/app/actions/sync-blockchain.js', {
    '../../../services/augurjs': AugurJS,
    '../../app/actions/update-blockchain': UpdateBlockchain
  });
  global.Date.now = sinon.stub().returns(12345);
  afterEach(() => {
    store.clearActions();
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
    assert.deepEqual(store.getActions(), out, `Didn't dispatch the expected actions`);
  });
});
