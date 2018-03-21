import { describe, it } from 'mocha'
import { assert } from 'chai'
import sinon from 'sinon'
import sinonStubPromise from 'sinon-stub-promise'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import uPortSigner, { __RewireAPI__ } from 'modules/auth/helpers/uport-signer'
import { Connect } from 'uport-connect'

import { MODAL_UPORT } from 'modules/modal/constants/modal-types'

sinonStubPromise(sinon)

describe('modules/auth/helpers/uport-signer.js', () => {
  const middlewares = [thunk]
  const mockStore = configureMockStore(middlewares)
  const store = mockStore({})

  let stubbedSendTransaction

  const stubbedUpdateModal = sinon.stub().returnsArg(0)
  __RewireAPI__.__Rewire__('updateModal', stubbedUpdateModal)

  const stubbedCloseModal = sinon.stub().returns({
    type: 'close-stub',
  })
  __RewireAPI__.__Rewire__('closeModal', stubbedCloseModal)

  const test = t => it(t.description, () => t.assertions(store))

  beforeEach(() => {
    stubbedSendTransaction = sinon.stub(Connect.prototype, 'sendTransaction').returnsPromise()
  })

  after(() => {
    __RewireAPI__.__ResetDependency__('updateModal')
    __RewireAPI__.__ResetDependency__('closeModal')
  })

  afterEach(() => {
    sinon.restore(Connect.prototype.sendTransaction)
    store.clearActions()
  })

  test({
    description: 'should call the expected actions from the `sendTransaction` callback',
    assertions: (store) => {
      stubbedSendTransaction.yields('test-uri')

      uPortSigner({}, store.dispatch)

      const expected = [
        {
          type: MODAL_UPORT,
          uri: 'test-uri',
        },
      ]

      const actual = store.getActions()

      assert.deepEqual(actual, expected, `didn't dispatch the expected actions`)
    },
  })

  test({
    description: `should dispatch the expected actions on 'resolve'`,
    assertions: (store) => {
      stubbedSendTransaction.resolves()

      uPortSigner({}, store.dispatch)

      const expected = [
        {
          type: 'close-stub',
        },
      ]

      const actual = store.getActions()

      assert.deepEqual(actual, expected, `didn't dispatch the expected actions`)
    },
  })

  test({
    description: `should dispatch the expected actions on 'resolve'`,
    assertions: (store) => {
      stubbedSendTransaction.rejects('test-err')

      uPortSigner({}, store.dispatch)

      const expected = [
        {
          type: MODAL_UPORT,
          error: `Failed to Sign with "test-err"`,
          canClose: true,
        },
      ]

      const actual = store.getActions()

      assert.deepEqual(actual, expected, `didn't dispatch the expected actions`)
    },
  })
})
