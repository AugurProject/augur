import sinon from 'sinon'
import sinonStubPromise from 'sinon-stub-promise'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { uPortSigner, __RewireAPI__ } from 'modules/auth/helpers/uport-signer'
import { Connect } from 'uport-connect'
import { MODAL_UPORT } from 'modules/modal/constants/modal-types'

sinonStubPromise(sinon)

describe('modules/auth/helpers/uport-signer.js', () => {
  const store = configureMockStore([thunk])({})
  let stubbedSendTransaction
  let stubbedUport
  __RewireAPI__.__Rewire__('updateModal', sinon.stub().returnsArg(0))
  __RewireAPI__.__Rewire__('closeModal', sinon.stub().returns({ type: 'close-stub' }))
  beforeEach(() => {
    stubbedSendTransaction = sinon.stub(Connect.prototype, 'sendTransaction').returnsPromise()
    stubbedUport = { sendTransaction: stubbedSendTransaction }
  })
  after(() => {
    __RewireAPI__.__ResetDependency__('updateModal')
    __RewireAPI__.__ResetDependency__('closeModal')
  })
  afterEach(() => {
    Connect.prototype.sendTransaction.restore()
    store.clearActions()
  })
  it('should call the expected actions from the `sendTransaction` callback', () => {
    stubbedSendTransaction.yields('test-uri')
    store.dispatch(uPortSigner(stubbedUport, {}))
    assert.deepEqual(store.getActions(), [{ type: MODAL_UPORT, uri: 'test-uri' }])
  })
  it(`should dispatch the expected actions on 'resolve'`, () => {
    stubbedSendTransaction.resolves()
    store.dispatch(uPortSigner(stubbedUport, {}))
    assert.deepEqual(store.getActions(), [{ type: 'close-stub' }])
  })
  it(`should dispatch the expected actions on 'resolve'`, () => {
    stubbedSendTransaction.rejects('test-err')
    store.dispatch(uPortSigner(stubbedUport, {}))
    assert.deepEqual(store.getActions(), [{ type: MODAL_UPORT, error: `Failed to Sign with "test-err"`, canClose: true }])
  })
})
