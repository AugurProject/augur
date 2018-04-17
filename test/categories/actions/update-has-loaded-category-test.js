

import { updateHasLoadedCategory, UPDATE_HAS_LOADED_CATEGORY } from 'modules/categories/actions/update-has-loaded-category'

describe('modules/categories/actions/update-has-loaded-category.js', () => {
  const test = (t) => {
    it(t.description, () => {
      t.assertions(updateHasLoadedCategory(t.hasLoadedCategory))
    })
  }

  test({
    description: 'should return the expected object',
    hasLoadedCategory: true,
    assertions: (action) => {
      const expected = {
        type: UPDATE_HAS_LOADED_CATEGORY,
        hasLoadedCategory: true,
      }

      assert.deepEqual(action, expected, `Didn't return the expected object`)
    },
  })
})
