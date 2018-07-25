

import { updateHasLoadedCategory, UPDATE_HAS_LOADED_SEARCH } from 'modules/categories/actions/update-has-loaded-category'

describe('modules/categories/actions/update-has-loaded-category.js', () => {
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
        hasLoadedSearch: true,
      }

      assert.deepEqual(action, expected, `Didn't return the expected object`)
    },
  })
})
