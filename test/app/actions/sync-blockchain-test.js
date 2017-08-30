import { describe, it, after } from 'mocha'
import { assert } from 'chai'
import proxyquire from 'proxyquire'
import sinon from 'sinon'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import testState from 'test/testState'

describe(`modules/app/actions/sync-blockchain.js`, function () { // eslint-disable-line func-names, prefer-arrow-callback
  proxyquire.noPreserveCache().noCallThru()
  const middlewares = [thunk]
  const mockStore = configureMockStore(middlewares)
  const state = Object.assign({}, testState, {
    blockchain: {
      currentBlockMillisSinceEpoch: 12344,
      currentBlockTimestamp: 4886718335,
      currentBlockNumber: 9999
    }
  })
  const store = mockStore(state)
  const AugurJS = {
    rpc: {
      getCurrentBlock: () => ({ number: 10000, timestamp: 4886718345 }),
      block: { number: 10000, timestamp: 4886718345 }
    }
  }
  const UpdateBlockchain = { updateBlockchain: () => {} }

  sinon.stub(UpdateBlockchain, 'updateBlockchain', data => ({ type: 'UPDATE_BLOCKCHAIN', data }))

  const action = proxyquire('../../../src/modules/app/actions/sync-blockchain.js', {
    '../../../services/augurjs': AugurJS,
    '../../app/actions/update-blockchain': UpdateBlockchain
  })

  after(() => {
    store.clearActions()
    this.clock.restore()
  })

  it('rpc.block set: should sync with blockchain using rpc.block.number', (done) => {
    this.clock = sinon.useFakeTimers(12345)
    AugurJS.rpc.block = { number: 10000, timestamp: '0x123456789' }
    const out = [{
      type: 'UPDATE_BLOCKCHAIN',
      data: {
        currentBlockNumber: 0x10000,
        currentBlockTimestamp: 0x4886718345,
        currentBlockMillisSinceEpoch: 12345
      }
    }]
    store.dispatch(action.syncBlockchain())
    assert.deepEqual(store.getActions(), out, `Didn't dispatch the expected actions`)

    done()
  })
})
