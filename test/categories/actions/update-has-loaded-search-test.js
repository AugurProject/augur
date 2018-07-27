

import { updateHasLoadedCategory, UPDATE_HAS_LOADED_SEARCH } from 'modules/categories/actions/update-has-loaded-search'

describe('modules/categories/actions/update-has-loaded-search.js', () => {
  const test = (t) => {
    it(t.description, () => {
      t.assertions(updateHasLoadedCategory({ name: 'dummy', state: t.hasLoadedSearch }))
    })
  }

  test({
    description: 'should return the expected object',
    hasLoadedSearch: true,
    assertions: (action) => {
      const expected = {
        type: UPDATE_HAS_LOADED_SEARCH,
        hasLoadedSearch: { name: 'dummy', state: true },
      }

      assert.deepEqual(action, expected, `Didn't return the expected object`)
    },
  })
})
