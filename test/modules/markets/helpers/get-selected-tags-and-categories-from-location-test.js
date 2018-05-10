import { getSelectedTagsAndCategoriesFromLocation } from 'src/modules/markets/helpers/get-selected-tags-and-categories-from-location'

import { compose } from 'lodash/fp'

describe('src/modules/markets/helpers/get-tags-and-categories-from-location.js', () => {
  // Works from bottom to top.
  const composedGetTagsAndCategoriesFromLocation = compose(
    getSelectedTagsAndCategoriesFromLocation,
    searchStr => ({
      search: searchStr,
    }),
  )

  let result

  describe('category, keywords and tags', () => {
    beforeEach(() => {
      result = composedGetTagsAndCategoriesFromLocation('category=Augur&tags=Ethereum.~_trading&keywords=test%20keywords')
    })

    it('should return an object with the relevant parsed data in an object', () => {
      assert.deepEqual(result, {
        category: 'Augur',
        keywords: 'test keywords',
        tags: [
          'Ethereum',
          'trading',
        ],
        balanceOfSearchParams: {},
      })
    })
  })

  describe('no tags', () => {
    beforeEach(() => {
      result = composedGetTagsAndCategoriesFromLocation('category=Augur')
    })

    it('should return an object with the relevant parsed data', () => {
      assert.deepEqual(result, {
        category: 'Augur',
        keywords: '',
        tags: [],
        balanceOfSearchParams: {},
      })
    })
  })

  describe('no category', () => {
    beforeEach(() => {
      result = composedGetTagsAndCategoriesFromLocation('')
    })

    it('should return an object with a null category and empty tags array', () => {
      assert.deepEqual(result, {
        category: undefined,
        keywords: '',
        tags: [],
        balanceOfSearchParams: {},
      })
    })
  })

  describe('no keywords', () => {
    beforeEach(() => {

    })
  })

  describe('no search string', () => {
    beforeEach(() => {
      result = getSelectedTagsAndCategoriesFromLocation({})
    })

    it('should do something', () => {
      assert.deepEqual(result, {
        category: undefined,
        keywords: '',
        tags: [],
        balanceOfSearchParams: {},
      })
    })
  })

  describe('other stuff on search string', () => {
    beforeEach(() => {
      result = composedGetTagsAndCategoriesFromLocation('category=Augur&page=1&cats=what')
    })

    it('should be returned as part of the "balanceOfSearchParams"', () => {
      assert.deepEqual(result, {
        category: 'Augur',
        keywords: '',
        tags: [],
        balanceOfSearchParams: {
          page: '1',
          cats: 'what',
        },
      })
    })
  })
})
