import { BigNumber, WrappedBigNumber, __RewireAPI__ as ReWireModule } from 'src/utils/wrapped-big-number'
import * as sinon from 'sinon'

describe('src/utils/wrapped-big-number.js', () => {
  let spy
  beforeEach(() => {
    spy = sinon.spy()
    ReWireModule.__Rewire__('logError', spy)
  })

  after(() => {
    ReWireModule.__ResetDependency__('logError')
  })

  it('should console an error when a undefined is passed', () => {
    const result = WrappedBigNumber(undefined)
    assert.isUndefined(result)
    assert.isOk(spy.called)
  })

  it('should console an error when a null value is passed', () => {
    const result = WrappedBigNumber(null)
    assert.isUndefined(result)
    assert.isOk(spy.called)
  })

  it('should return a bignumber', () => {
    const result = WrappedBigNumber('2500')
    assert.instanceOf(result, BigNumber)
    assert.isNotOk(spy.called)
  })

  it('should act like a big number', () => {
    assert.equal(WrappedBigNumber(2).plus(WrappedBigNumber(4)).toString(), '6')
  })
})
