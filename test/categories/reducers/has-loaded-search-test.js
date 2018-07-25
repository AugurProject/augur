

import hasLoadedSearch from 'modules/categories/reducers/has-loaded-search'

import { UPDATE_HAS_LOADED_SEARCH } from 'modules/categories/actions/update-has-loaded-search'

describe('modules/categories/reducers/has-loaded-search.js', () => {
  const test = (t) => {
    it(t.describe, () => {
      t.assertions()
    })
  }

  test({
    describe: 'should return the default value',
    assertions: () => {
      const actual = hasLoadedSearch(undefined, { type: null })

      const expected = {}

      assert.deepEqual(actual, expected, `Didn't return the expected default value`)
    },
  })

  test({
    describe: 'should return the existing value',
    assertions: () => {
      const actual = hasLoadedSearch({ category: { name: 'category', state: true } }, { name: 'type', state: null })

      const expected = { category: { name: 'category', state: true } }

      assert.deepEqual(actual, expected, `Didn't return the expected existing value`)
    },
  })

  test({
    describe: 'should return the updated value',
    assertions: () => {
      const actual = hasLoadedSearch({ bob: { name: 'bob', state: true } }, {
        type: UPDATE_HAS_LOADED_SEARCH,
        hasLoadedSearch: { name: 'category', state: false },
      })

      const expected = {
        category: { name: 'category', state: false },
        bob: { name: 'bob', state: true },
      }

      assert.deepEqual(actual, expected, `Didn't return the expected updated value`)
    },
  })
})
