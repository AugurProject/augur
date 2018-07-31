import { BigNumber, createBigNumber, __RewireAPI__ as ReWireModule } from 'src/utils/create-big-number'
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
    const result = createBigNumber(undefined)
    assert.isUndefined(result)
    assert.isOk(spy.called)
  })

  it('should console an error when a null value is passed', () => {
    const result = createBigNumber(null)
    assert.isUndefined(result)
    assert.isOk(spy.called)
  })

  it('should return a bignumber', () => {
    const result = createBigNumber('2500')
    assert.instanceOf(result, BigNumber)
    assert.isNotOk(spy.called)
  })

  it('should act like a big number', () => {
    assert.equal(createBigNumber(2).plus(createBigNumber(4)).toString(), '6')
  })

  it('should sort like a big number', () => {
    const expected = [
      { value: '77' },
      { value: '12' },
      { value: '4' },
    ]
    const myObjectArray = [
      { value: '12' },
      { value: '4' },
      { value: '77' },
    ]
    const result = myObjectArray.sort((a, b) => createBigNumber(a.value).isLessThan(createBigNumber(b.value)))
    assert.deepEqual(result, expected, 'was not sorted correctly')
  })
})
