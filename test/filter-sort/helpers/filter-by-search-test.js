import { describe, it } from 'mocha'
import { assert } from 'chai'
import mocks from 'test/mockStore'
import filterBySearch from 'modules/filter-sort/helpers/filter-by-search'

describe('modules/filter-sort/helpers/filter-by-search.js', () => {
  const test = t => it(t.description, () => t.assertions())
  const { state, store } = mocks
  test({
    description: 'should handle a null search',
    assertions: () => {
      assert.isNull(filterBySearch(null, [], []))
    }
  })
  test({
    description: 'should handle a empty string search',
    assertions: () => {
      assert.isNull(filterBySearch('', [], []))
    }
  })
})
