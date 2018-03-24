import { describe, it, afterEach } from 'mocha'

import mockStore from 'test/mockStore'
import speedomatic from 'speedomatic'
import { formatGasCostToEther } from 'utils/format-number'

import { purchaseParticipationTokens, __RewireAPI__ as ReWireModule } from 'modules/reporting/actions/purchase-participation-tokens'

describe('purchase participation tokens tests', () => {
  const test = t => it(t.description, done => t.assertions(done))
  const { store } = mockStore

  const ACTIONS = {
    CLOSE_MODAL: { type: 'CLOSE_MODAL' },
  }
  const mockRPC = { getGasPrice: () => '0x2fdaf' }

  afterEach(() => {
    store.clearActions()
  })

  test({
    description: 'It should handle buying 10.25 participation tokens',
    assertions: (done) => {
      ReWireModule.__Rewire__('augur', {
        api: {
          FeeWindow: {
            buy: (p) => {
              const {
                tx, _attotokens, onSent, onSuccess, onFailed,
              } = p
              assert.deepEqual(tx, { meta: store.getState().loginAccount.meta, to: '0xfeeWindow01', estimateGas: false })
              assert.deepEqual(_attotokens, speedomatic.fix('10.25', 'hex'))
              assert.isFunction(onSent)
              assert.isFunction(onSuccess)
              assert.isFunction(onFailed)
              onSent()
              onSuccess({})
            },
          },
        },
        reporting: {
          getFeeWindowCurrent: (p, cb) => {
            assert.deepEqual(p, { universe: store.getState().universe.id })
            assert.isFunction(cb)
            cb(null, { feeWindow: '0xfeeWindow01' })
          },
        },
        rpc: mockRPC,
      })

      store.dispatch(purchaseParticipationTokens('10.25', false, (err, res) => {
        assert.isNull(err)
        assert.isObject(res)
        const expectedActions = [ACTIONS.CLOSE_MODAL]
        assert.deepEqual(store.getActions(), expectedActions)
        done()
      }))
    },
  })

  test({
    description: 'It should handle estimating gas for buying participation tokens',
    assertions: (done) => {
      ReWireModule.__Rewire__('augur', {
        api: {
          FeeWindow: {
            buy: (p) => {
              const {
                tx, _attotokens, onSent, onSuccess, onFailed,
              } = p
              assert.deepEqual(tx, { meta: store.getState().loginAccount.meta, to: '0xfeeWindow01', estimateGas: true })
              assert.deepEqual(_attotokens, speedomatic.fix('10.25', 'hex'))
              assert.isFunction(onSent)
              assert.isFunction(onSuccess)
              assert.isFunction(onFailed)
              onSent()
              onSuccess('0xdeadbeef')
            },
          },
        },
        reporting: {
          getFeeWindowCurrent: (p, cb) => {
            assert.deepEqual(p, { universe: store.getState().universe.id })
            assert.isFunction(cb)
            cb(null, { feeWindow: '0xfeeWindow01' })
          },
        },
        rpc: mockRPC,
      })

      store.dispatch(purchaseParticipationTokens('10.25', true, (err, res) => {
        assert.isNull(err)
        const expectedResponse = formatGasCostToEther('0xdeadbeef', { decimalsRounded: 4 }, '0x2fdaf')
        assert.deepEqual(res, expectedResponse)
        const expectedActions = []
        assert.deepEqual(store.getActions(), expectedActions)
        done()
      }))
    },
  })

  test({
    description: 'It should handle an error from estimating gas for buying participation tokens',
    assertions: (done) => {
      ReWireModule.__Rewire__('augur', {
        api: {
          FeeWindow: {
            buy: (p) => {
              const {
                tx, _attotokens, onSent, onSuccess, onFailed,
              } = p
              assert.deepEqual(tx, { meta: store.getState().loginAccount.meta, to: '0xfeeWindow01', estimateGas: true })
              assert.deepEqual(_attotokens, speedomatic.fix('10.25', 'hex'))
              assert.isFunction(onSent)
              assert.isFunction(onSuccess)
              assert.isFunction(onFailed)
              onSent()
              onFailed({ error: 1000, message: 'Uh-Oh!' })
            },
          },
        },
        reporting: {
          getFeeWindowCurrent: (p, cb) => {
            assert.deepEqual(p, { universe: store.getState().universe.id })
            assert.isFunction(cb)
            cb(null, { feeWindow: '0xfeeWindow01' })
          },
        },
        rpc: mockRPC,
      })

      store.dispatch(purchaseParticipationTokens('10.25', true, (err, res) => {
        assert.isUndefined(res)
        assert.deepEqual(err, { error: 1000, message: 'Uh-Oh!' })
        const expectedActions = []
        assert.deepEqual(store.getActions(), expectedActions)
        done()
      }))
    },
  })

  test({
    description: 'It should handle an error from getting the Fee Window',
    assertions: (done) => {
      ReWireModule.__Rewire__('augur', {
        api: {
          FeeWindow: {
            buy: (p) => {
              assert.isNull('we should never hit this.')
            },
          },
        },
        reporting: {
          getFeeWindowCurrent: (p, cb) => {
            assert.deepEqual(p, { universe: store.getState().universe.id })
            assert.isFunction(cb)
            cb({ error: 1000, message: 'Uh-Oh!' })
          },
        },
        rpc: mockRPC,
      })

      store.dispatch(purchaseParticipationTokens('10.25', true, (err, res) => {
        assert.isUndefined(res)
        assert.deepEqual(err, { error: 1000, message: 'Uh-Oh!' })
        const expectedActions = []
        assert.deepEqual(store.getActions(), expectedActions)
        done()
      }))
    },
  })
})
