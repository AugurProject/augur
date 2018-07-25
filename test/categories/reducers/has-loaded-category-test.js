

import hasLoadedSearch from 'modules/categories/reducers/has-loaded-category'

import { UPDATE_HAS_LOADED_SEARCH } from 'modules/categories/actions/update-has-loaded-category'

describe('modules/categories/reducers/has-loaded-category.js', () => {
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
      const actual = hasLoadedSearch({ category: true }, { type: null })

      const expected = { category: true }

      assert.deepEqual(actual, expected, `Didn't return the expected existing value`)
    },
  })

  test({
    describe: 'should return the updated value',
    assertions: () => {
      const actual = hasLoadedSearch({ category: true }, {
        type: UPDATE_HAS_LOADED_SEARCH,
        hasLoadedSearch: {
          category: false,
          category2: true,
        },
      })

      const expected = {
        category: false,
        category2: true,
      }

      assert.deepEqual(actual, expected, `Didn't return the expected updated value`)
    },
  })
})
