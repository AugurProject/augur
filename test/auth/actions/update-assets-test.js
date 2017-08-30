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
      loginAccount: {}
    },
    assertions: (store, done) => {
      store.dispatch(updateAssets())

      assert(updateLoginAccount, `didn't call 'updateLoginAccount' once as expected`)

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
            }
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
              }
            })

            const callbackStub = {
              callback: () => {}
            }
            sinon.stub(callbackStub, 'callback', err => assert(err, ERR, `didn't call the callback with the expected error`))

            store.dispatch(updateAssets(callbackStub.callback))

            done()
          }
        })

        test({
          description: `should dispatch 'updateLoginAccount' if value is not present`,
          state: {
            loginAccount: {}
          },
          assertions: (store, done) => {
            const loadAssets = (options, ethTokensCB, repCB, ethCB) => {
              switch (asset) {
                case ETH_TOKENS:
                  return ethTokensCB(null, '10')
                case ETH:
                  return ethCB(null, '10')
                case REP:
                  return repCB(null, '10')
                default:
                  return assert(false, `malformed callback test`)
              }
            }
            updateAssetsRewireAPI.__Rewire__('augur', {
              assets: {
                loadAssets
              }
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
            }
          },
          assertions: (store, done) => {
            const loadAssets = (options, ethTokensCB, repCB, ethCB) => {
              switch (asset) {
                case ETH_TOKENS:
                  return ethTokensCB(null, '10')
                case ETH:
                  return ethCB(null, '10')
                case REP:
                  return repCB(null, '10')
                default:
                  return assert(false, `malformed callback test`)
              }
            }
            updateAssetsRewireAPI.__Rewire__('augur', {
              assets: {
                loadAssets
              }
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
              [ETH_TOKENS]: '10',
              [ETH]: '10',
              [REP]: '10'
            },
            branch: {
              id: '0xbranch'
            }
          },
          assertions: (store, done) => {
            const loadAssets = (options, ethTokensCB, repCB, ethCB) => {
              switch (asset) {
                case ETH_TOKENS:
                  ethCB(null, '10')
                  repCB(null, '10')
                  ethTokensCB(null, '11')
                  break
                case ETH:
                  ethTokensCB(null, '10')
                  repCB(null, '10')
                  ethCB(null, '11')
                  break
                case REP:
                  ethTokensCB(null, '10')
                  ethCB(null, '10')
                  repCB(null, '11')
                  break
                default:
                  return assert(false, `malformed callback test`)
              }
            }
            updateAssetsRewireAPI.__Rewire__('augur', {
              assets: {
                loadAssets
              }
            })

            const callbackStub = {
              callback: () => {}
            }
            sinon.stub(callbackStub, 'callback', (err, balances) => {
              assert.isNull(err, `didn't call the callback with the expected error`)
              assert(balances, {
                [ETH_TOKENS]: asset === ETH_TOKENS ? '11' : '10',
                [ETH]: asset === ETH ? '11' : '10',
                [REP]: asset === REP ? '11' : '10',
              }, `didn't call the callback with the expected balances`)
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
