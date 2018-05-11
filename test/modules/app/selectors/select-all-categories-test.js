import { selectAllCategories } from 'src/modules/app/selectors/select-all-categories'

describe('src/modules/app/selectors/select-all-categories.js', () => {
  let result
  const state = {
    marketsData: {
      '0xeac40138d3dcfba355e3e309f08e6c86ee51077a': {
        category: 'category-with-tags',
        tags: ['unique-tag', 'duplicate-tag'],
      },
      '0x0ff6ee01f88145298761a29a0372ed24e16e73b1': {
        category: 'category-with-tags',
        tags: ['unique-tag-1', 'duplicate-tag'],
      },
      '0xbcde24abef27b2e537b8ded8139c7991de308607': {
        category: 'category-with-tags-2',
        tags: ['unique-tag-1', 'duplicate-tag'],
      },
      '0xad462350da60993e6ee0be1cdff608892d2864ab': {
        category: 'category-without-tags',
        tags: [],
      },
      '0x4d89f393ec02bf26827ad1bfa03613030fe1028d': {},
    },
  }

  beforeEach(() => {
    result = selectAllCategories(state)
  })

  it('should group tags by category', () => {
    const expected = {
      'category-with-tags': ['unique-tag', 'duplicate-tag', 'unique-tag-1'],
      'category-with-tags-2': ['unique-tag-1', 'duplicate-tag'],
      'category-without-tags': [],
    }

    assert.deepEqual(result, expected)
  })
})

