import {
  filterArrayByArrayPredicate,
} from 'src/modules/filter-sort/helpers/filter-array-of-objects-by-array'

import { identity } from 'lodash/fp'

describe('src/modules/filter-sort/helpers/filter-array-of-objects-by-array.js', () => {
  const examplePropertyToFilterOn = 'some-prop'
  let result

  describe('when propertyToFilterOn is null', () => {
    beforeEach(() => {
      result = filterArrayByArrayPredicate(null, [])
    })

    it('should return identity function', () => {
      assert.equal(result, identity)
    })
  })

  describe('when arrayToFilterBy is null', () => {
    beforeEach(() => {
      result = filterArrayByArrayPredicate(examplePropertyToFilterOn, null)
    })

    it('should return identity function', () => {
      assert.equal(result, identity)
    })
  })

  describe('when arrayToFilterBy is an empty array', () => {
    beforeEach(() => {
      result = filterArrayByArrayPredicate('some-prop', [])
    })

    it('should return identity function', () => {
      assert.equal(result, identity)
    })
  })

  describe('when arrayToFilterBy is non-empty', () => {
    let exampleArrayToFilterBy
    let filterPredicateFn

    beforeEach(() => {
      exampleArrayToFilterBy = ['prop1', 'prop2']
      filterPredicateFn = filterArrayByArrayPredicate(examplePropertyToFilterOn, exampleArrayToFilterBy)
    })

    it('should return a filter function', () => {
      assert.isFunction(filterPredicateFn)
    })

    describe('when passed an object that has one matching members', () => {
      beforeEach(() => {
        result = filterPredicateFn({
          [examplePropertyToFilterOn]: ['prop1'],
        })
      })

      it('should be true', () => {
        assert.isOk(result)
      })
    })

    describe('when passed an object with two matching members', () => {
      beforeEach(() => {
        result = filterPredicateFn({
          [examplePropertyToFilterOn]: ['prop1', 'prop2'],
        })
      })

      it('should be true', () => {
        assert.isOk(result)
      })
    })

    describe('when passed an object without matching member', () => {
      beforeEach(() => {
        result = filterPredicateFn({
          [examplePropertyToFilterOn]: ['prop3'],
        })
      })

      it('should be true', () => {
        assert.isNotOk(result)
      })
    })

    describe('when passed an object without property to filter on', () => {
      beforeEach(() => {
        result = filterPredicateFn({
        })
      })

      it('should be false', () => {
        assert.isNotOk(result)
      })
    })
  })
})
