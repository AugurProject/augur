

import sinon from 'sinon'
import thunk from 'redux-thunk'
import configureMockStore from 'redux-mock-store'

import { transferFunds, __RewireAPI__ as transferFundsReqireAPI } from 'modules/auth/actions/transfer-funds'

import { ETH, REP } from 'modules/account/constants/asset-types'

describe('modules/auth/actions/transfer-funds.js', () => {
  const mockStore = configureMockStore([thunk])
  const test = t => it(t.description, (done) => {
    const store = mockStore(t.state || {})
    t.assertions(done, store)
  })

  afterEach(() => {
    transferFundsReqireAPI.__ResetDependency__('augur')
    transferFundsReqireAPI.__ResetDependency__('updateAssets')
    transferFundsReqireAPI.__ResetDependency__('addNotification')
    transferFundsReqireAPI.__ResetDependency__('updateNotifications')
    transferFundsReqireAPI.__ResetDependency__('selectCurrentTimestampInSeconds')
  })

  test({
    description: `should return the expected console error from the default switch`,
    state: {
      loginAccount: {
        address: '0xtest',
      },
    },
    assertions: (done, store) => {
      const origConErr = console.error

      console.error = sinon.stub()

      store.dispatch(transferFunds(10, 'to-default', '0xtest2'))

      assert(console.error.calledOnce, `didn't call 'console.error' once as expected`)

      console.error = origConErr
      done()
    },
  })

  test({
    description: `should call the 'sendEther' method of augur when currency is ETH`,
    state: {
      loginAccount: {
        address: '0xtest',
      },
    },
    assertions: (done, store) => {
      const sendEther = sinon.stub()

      transferFundsReqireAPI.__Rewire__('augur', {
        assets: {
          sendEther,
        },
      })

      store.dispatch(transferFunds(10, ETH, '0xtest2'))

      assert(sendEther.calledOnce, `didn't call 'Cash.send' once as expected`)

      done()
    },
  })

  test({
    description: `should call the 'REP' method of augur when currency is REP`,
    state: {
      loginAccount: {
        address: '0xtest',
      },
      universe: {
        id: '0xuniverse',
      },
    },
    assertions: (done, store) => {
      const sendReputation = sinon.stub()

      transferFundsReqireAPI.__Rewire__('augur', {
        assets: {
          sendReputation,
        },
      })

      store.dispatch(transferFunds(10, REP, '0xtest2'))

      assert(sendReputation.calledOnce, `didn't call 'Cash.send' once as expected`)

      done()
    },
  })

  test({
    description: `should dispatch the 'updateAssets' and 'addNotification' method from the 'onSuccess' callback of 'sendEther`,
    state: {
      loginAccount: {
        address: '0xtest',
      },
      blockchain: {
        currentAugurTimestamp: 1521665,
      },
    },
    assertions: (done, store) => {
      const assets = {
        sendEther: (options) => {
          options.onSuccess({ hash: '0xtest' })
        },
      }

      const updateAssets = sinon.stub().returns({
        type: 'updateAssets',
      })

      const addNotification = sinon.stub().returns({
        type: 'addNotification',
      })

      const updateNotification = sinon.stub().returns({
        type: 'updateNotification',
      })

      transferFundsReqireAPI.__Rewire__('augur', {
        assets,
      })
      transferFundsReqireAPI.__Rewire__('updateAssets', updateAssets)
      transferFundsReqireAPI.__Rewire__('addNotification', addNotification)
      transferFundsReqireAPI.__Rewire__('updateNotification', updateNotification)

      store.dispatch(transferFunds(10, ETH, '0xtest2'))

      assert(updateNotification.calledOnce, `didn't call 'updateNotifications' once as expected`)

      done()
    },
  })

  test({
    description: `should dispatch the 'updateAssets' method from the 'onSuccess' callback of 'sendReputation`,
    state: {
      loginAccount: {
        address: '0xtest',
      },
      universe: {
        id: '0xuniverse',
      },
    },
    assertions: (done, store) => {
      const assets = {
        sendReputation: (options) => {
          options.onSuccess({ hash: 'hashValue' })
        },
      }

      const updateAssets = sinon.stub().returns({
        type: 'updateAssets',
      })
      transferFundsReqireAPI.__Rewire__('selectCurrentTimestampInSeconds', () => {})
      transferFundsReqireAPI.__Rewire__('augur', {
        assets,
      })
      transferFundsReqireAPI.__Rewire__('updateAssets', updateAssets)

      store.dispatch(transferFunds(10, REP, '0xtest2'))

      done()
    },
  })
})
