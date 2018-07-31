import sinon from 'sinon'
import thunk from 'redux-thunk'
import configureMockStore from 'redux-mock-store'
import { updateAssets, __RewireAPI__ as updateAssetsRewireAPI } from 'modules/auth/actions/update-assets'
import { __RewireAPI__ as updateEtherBalanceRewireAPI } from 'modules/auth/actions/update-ether-balance'

const ETH = 'eth'
const REP = 'rep'

describe('modules/auth/actions/update-assets.js', () => {
  const mockStore = configureMockStore([thunk])
  const stubbedUpdateLoginAccount = sinon.stub().returns({ type: 'updateLoginAccount' })
  updateAssetsRewireAPI.__Rewire__('updateLoginAccount', stubbedUpdateLoginAccount)
  const test = t => it(t.description, (done) => {
    const store = mockStore(t.state || {})
    t.assertions(store, done)
  })
  afterEach(() => {
    stubbedUpdateLoginAccount.resetHistory()
  })
  test({
    description: `should dispatch 'updateLoginAccount' if a user is unlogged`,
    state: {
      loginAccount: {},
      universe: { id: 'blah' },
    },
    assertions: (store, done) => {
      store.dispatch(updateAssets())
      assert(stubbedUpdateLoginAccount.calledOnce, `didn't call 'updateLoginAccount' once as expected`)
      done()
    },
  })
  describe('loadAssets callbacks', () => {
    const callbackTests = (asset) => {
      describe(`${asset}`, () => {
        afterEach(() => {
          updateAssetsRewireAPI.__ResetDependency__('augur')
        })
        test({
          description: `should call the callback with the expected error`,
          state: {
            loginAccount: {
              address: '0xtest',
            },
            universe: {
              id: '0xuniverse',
            },
            address: '0xtest',
          },
          assertions: (store, done) => {
            const ERR = { error: `${asset}-failure` }
            updateEtherBalanceRewireAPI.__Rewire__('augur', {
              rpc: {
                eth: {
                  getBalance: (value, callback) => {
                    callback(ERR, '1000')
                  },
                },
              },
            })
            updateAssetsRewireAPI.__Rewire__('augur', {
              api: {
                Universe: {
                  getReputationToken: (value, callback) => {
                    callback(ERR, '10000')
                  },
                },
                ReputationToken: {
                  balanceOf: (value, callback) => {
                    callback(ERR, '10000')
                  },
                },
                LegacyReputationToken: {
                  balanceOf: (value, callback) => {
                    callback(ERR, '2000')
                  },
                  allowance: (value, callback) => {
                    callback(ERR, '0')
                  },
                },
              },
            })
            const callbackStub = { callback: () => {} }
            sinon.stub(callbackStub, 'callback').callsFake(err => assert.deepEqual(err, ERR, `didn't call the callback with the expected error`))
            store.dispatch(updateAssets(callbackStub.callback))
            done()
          },
        })
        test({
          description: `should dispatch 'updateLoginAccount' if value is not present`,
          state: {
            loginAccount: {},
            universe: {
              id: 'myId',
            },
          },
          assertions: (store, done) => {
            updateAssetsRewireAPI.__Rewire__('augur', {})
            updateEtherBalanceRewireAPI.__Rewire__('augur', {})
            store.dispatch(updateAssets())
            assert(stubbedUpdateLoginAccount.calledOnce, `didn't call 'updateLoginAccount' once as expected`)
            done()
          },
        })
        test({
          description: `should dispatch 'updateLoginAccount' if value is present but doesn't equal updated value`,
          state: {
            loginAccount: {
              [`${asset}`]: '11',
            },
            universe: {
              id: 'myId',
            },
          },
          assertions: (store, done) => {
            updateAssetsRewireAPI.__Rewire__('augur', {})
            updateEtherBalanceRewireAPI.__Rewire__('augur', {})
            store.dispatch(updateAssets())
            assert(stubbedUpdateLoginAccount.calledOnce, `didn't call 'updateLoginAccount' once as expected`)
            done()
          },
        })
        test({
          description: `should call the callback with the balances once all have loaded`,
          state: {
            loginAccount: {
              address: '0xtest',
              ethTokens: '10',
              eth: '10',
              rep: '10',
              legacyRep: '10',
              legacyRepAllowance: '0',
            },
            universe: {
              id: '0xuniverse',
            },
          },
          assertions: (store, done) => {
            const speedomatic = { unfix: (value, str) => {} }
            sinon.stub(speedomatic, 'unfix').returnsArg(0)
            updateAssetsRewireAPI.__Rewire__('speedomatic', speedomatic)
            const testValue = {
              eth: 10,
              legacyRep: 2000,
              rep: 20,
            }
            updateEtherBalanceRewireAPI.__Rewire__('augur', {
              rpc: {
                eth: {
                  getBalance: (value, callback) => {
                    callback(null, testValue.eth)
                  },
                },
              },
            })
            updateAssetsRewireAPI.__Rewire__('augur', {
              api: {
                Universe: {
                  getReputationToken: (value, callback) => {
                    callback(null, '0xtestx0')
                  },
                },
                ReputationToken: {
                  balanceOf: (value, callback) => {
                    callback(null, testValue.rep)
                  },
                },
                LegacyReputationToken: {
                  balanceOf: (value, callback) => {
                    callback(null, testValue.legacyRep)
                  },
                  allowance: (value, callback) => {
                    callback(null, testValue.legacyRepAllowance)
                  },
                },
              },
            })
            const callbackStub = { callback: () => {} }
            sinon.stub(callbackStub, 'callback').callsFake((err, balances) => {
              assert.isNull(err, `didn't call the callback with the expected error`)
              assert.deepEqual(balances, testValue, `didn't call the callback with the expected balances`)
            })
            store.dispatch(updateAssets(callbackStub.callback))
            done()
          },
        })
      })
    }
    callbackTests(ETH)
    callbackTests(REP)
  })
})
