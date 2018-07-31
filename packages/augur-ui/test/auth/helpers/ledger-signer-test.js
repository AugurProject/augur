

import sinon from 'sinon'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import ledgerSigner, { __RewireAPI__ } from 'modules/auth/helpers/ledger-signer'

describe('modules/auth/helpers/ledger-signer', () => {
  const middlewares = [thunk]
  const mockStore = configureMockStore(middlewares)
  const store = mockStore({})

  const stubbedUpdateModal = () => ({ type: 'stubbedUpdateModal' })
  const stubbedCloseModal = () => ({ type: 'stubbedCloseModal' })

  let ledgerLib

  __RewireAPI__.__Rewire__('updateModal', stubbedUpdateModal)
  __RewireAPI__.__Rewire__('closeModal', stubbedCloseModal)

  const test = t => it(t.description, () => t.assertions())

  beforeEach(() => {
    ledgerLib = {
      signTransactionByBip44Index: sinon.stub(),
    }

    store.clearActions()
  })

  test({
    description: 'should dispatch the expected actions when signing succeeds',
    assertions: async () => {
      let actual
      const expected = [
        {
          type: 'stubbedUpdateModal',
        },
        {
          type: 'stubbedCloseModal',
        },
      ]

      ledgerLib.signTransactionByBip44Index.resolves({ r: 'blah', s: 'test', v: 'bob' })

      await ledgerSigner([{}, () => {}], ledgerLib, store.dispatch)
        .then((res) => {
          actual = store.getActions()
        })
        .catch((err) => {
          assert(false, `didn't resolve as expected`)
        })

      assert.deepEqual(actual, expected, `didn't dispatch the expected actions`)

    },
  })

  test({
    description: 'should dispatch the expected actions when signing fails',
    assertions: async () => {
      let actual
      const expected = [
        {
          type: 'stubbedUpdateModal',
        },
        {
          type: 'stubbedUpdateModal',
        },
      ]

      ledgerLib.signTransactionByBip44Index.rejects()

      await ledgerSigner([{}, () => {}], ledgerLib, store.dispatch)
        .then(() => {
          assert(false, `didn't reject as expected`)
        })
        .catch((err) => {
          actual = store.getActions()
        })

      assert.deepEqual(actual, expected, `didn't dispatch the expected actions`)
    },
  })
})
