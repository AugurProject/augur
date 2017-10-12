import { describe, it } from 'mocha'
import { assert } from 'chai'
import sinon from 'sinon'
import thunk from 'redux-thunk'
import configureMockStore from 'redux-mock-store'

import { updateAssets, __RewireAPI__ as updateAssetsRewireAPI } from 'modules/auth/actions/update-assets'

const ETH_TOKENS = 'ethTokens'
const ETH = 'eth'
const REP = 'rep'

describe('modules/auth/actions/update-assets.js', () => {
  const mockStore = configureMockStore([thunk])

  const updateLoginAccount = sinon.stub().returns({
    type: 'updateLoginAccount'
  })
  updateAssetsRewireAPI.__Rewire__('updateLoginAccount', updateLoginAccount)

  const test = t => it(t.description, (done) => {
    const store = mockStore(t.state || {})

    t.assertions(store, done)
  })

  afterEach(() => {
    updateLoginAccount.reset()
  })

  test({
    description: `should dispatch 'updateLoginAccount' if a user is unlogged`,
    state: {
      loginAccount: {},
      branch: { id: 'blah' }
    },
    assertions: (store, done) => {
      store.dispatch(updateAssets())

      assert(updateLoginAccount.calledOnce, `didn't call 'updateLoginAccount' once as expected`)

      done()
    }
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
              address: '0xtest'
            },
            branch: {
              id: '0xbranch'
            },
            address: '0xtest'
          },
          assertions: (store, done) => {
            const ERR = `${asset}-failure`

            const loadAssets = (options, ethTokensCB, repCB, ethCB) => {
              switch (asset) {
                case ETH_TOKENS:
                  return ethTokensCB(ERR)
                case ETH:
                  return ethCB(ERR)
                case REP:
                  return repCB(ERR)
                default:
                  return assert(false, `malformed callback test`)
              }
            }
            updateAssetsRewireAPI.__Rewire__('augur', {
              assets: {
                loadAssets
              },
              rpc: {
                getBalance: (value, callback) => {
                  callback('1000')
                }
              },
              api: {
                Cash: {
                  balanceOf: (value, callback) => {
                    callback(ERR, '10000')
                  }
                },
                Branch: {
                  getReputationToken: (value, callback) => {
                    callback(ERR, '10000')
                  }
                },
                ReputationToken: {
                  balanceOf: (value, callback) => {
                    callback(ERR, '10000')
                  }
                }
              }
            })

            const callbackStub = {
              callback: () => { }
            }
            sinon.stub(callbackStub, 'callback', err => assert(err, ERR, `didn't call the callback with the expected error`))

            store.dispatch(updateAssets(callbackStub.callback))

            done()
          }
        })

        test({
          description: `should dispatch 'updateLoginAccount' if value is not present`,
          state: {
            loginAccount: {},
            branch: {
              id: 'myId'
            }
          },
          assertions: (store, done) => {
            updateAssetsRewireAPI.__Rewire__('augur', {

            })

            store.dispatch(updateAssets())

            assert(updateLoginAccount.calledOnce, `didn't call 'updateLoginAccount' once as expected`)

            done()
          }
        })

        test({
          description: `should dispatch 'updateLoginAccount' if value is present but doesn't equal updated value`,
          state: {
            loginAccount: {
              [`${asset}`]: '11'
            },
            branch: {
              id: 'myId'
            }
          },
          assertions: (store, done) => {
            updateAssetsRewireAPI.__Rewire__('augur', {

            })

            store.dispatch(updateAssets())

            assert(updateLoginAccount.calledOnce, `didn't call 'updateLoginAccount' once as expected`)

            done()
          }
        })

        test({
          description: `should call the callback with the balances once all have loaded`,
          state: {
            loginAccount: {
              address: '0xtest',
              ethTokens: '10',
              eth: '10',
              rep: '10'
            },
            branch: {
              id: '0xbranch'
            }
          },
          assertions: (store, done) => {
            const allAssetsLoaded = sinon.stub()
            allAssetsLoaded.onFirstCall().returns(false)
              .onSecondCall().returns(false)
              .onThirdCall().returns(true)
            const speedomatic =
              {
                unfix: (value, str) => { }
              }
            sinon.stub(speedomatic, 'unfix').returnsArg(0)
            updateAssetsRewireAPI.__Rewire__('allAssetsLoaded', allAssetsLoaded)
            updateAssetsRewireAPI.__Rewire__('speedomatic', speedomatic)
            const testValue = {
              eth: 10,
              rep: 20,
              ethTokens: 30
            }
            updateAssetsRewireAPI.__Rewire__('augur', {
              api: {
                Cash: {
                  balanceOf: (value, callback) => {
                    callback(null, testValue.ethTokens)
                  }
                },
                Branch: {
                  getReputationToken: (value, callback) => {
                    callback(null, '0xtestx0')
                  }
                },
                ReputationToken: {
                  balanceOf: (value, callback) => {
                    callback(testValue.rep)
                  }
                }
              },
              rpc: {
                getBalance: (value, callback) => {
                  callback(testValue.eth)
                }
              }
            })

            const callbackStub = {
              callback: () => { }
            }
            sinon.stub(callbackStub, 'callback', (err, balances) => {
              assert.isNull(err, `didn't call the callback with the expected error`)
              assert.deepEqual(balances, testValue, `didn't call the callback with the expected balances`)
            })

            store.dispatch(updateAssets(callbackStub.callback))

            done()
          }
        })
      })
    }

    callbackTests(ETH_TOKENS)
    callbackTests(ETH)
    callbackTests(REP)
  })
})
