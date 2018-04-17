

import mocks from 'test/mockStore'
import filterByTags from 'modules/filter-sort/helpers/filter-by-tags'

describe('modules/filter-sort/helpers/filter-by-tags.js', () => {
  const test = t => it(t.description, () => t.assertions())
  const { state } = mocks
  const defaultItems = [
    {
      ...state.marketsData.testMarketId,
      tags: ['test', 'two words'],
    }, {
      ...state.marketsData.testMarketId2,
    },
  ]
  test({
    description: 'should handle a empty tag array and items array',
    assertions: () => {
      assert.isNull(filterByTags([], []))
    },
  })
  test({
    description: 'should handle a null tag array',
    assertions: () => {
      assert.isNull(filterByTags(null, defaultItems))
    },
  })
  test({
    description: 'should handle a single tag',
    assertions: () => {
      const expected = ['testMarketId']
      assert.deepEqual(filterByTags(['test'], defaultItems), expected)
    },
  })
  test({
    description: 'should handle two tags',
    assertions: () => {
      const expected = ['testMarketId2']
      assert.deepEqual(filterByTags(['tag1', 'tag2'], defaultItems), expected)
    },
  })
  test({
    description: 'should handle a two word tag',
    assertions: () => {
      const expected = ['testMarketId']
      assert.deepEqual(filterByTags(['two words'], defaultItems), expected)
    },
  })
  test({
    description: 'should handle finding no market ideas (no match)',
    assertions: () => {
      const expected = []
      assert.deepEqual(filterByTags(['hippopotamus'], defaultItems), expected)
    },
  })
})
