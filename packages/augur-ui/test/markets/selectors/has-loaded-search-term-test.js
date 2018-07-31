

import { hasLoadedSearchTerm } from '../../../src/modules/markets/selectors/has-loaded-search-term'

describe('modules/markets/selectors/has-loaded-search-term.js', () => {

  it('should return nothing', () => {
    const actual = hasLoadedSearchTerm({}, undefined, undefined, [])
    const expected = {}
    assert.deepEqual(actual, expected, `Didn't return the expected default value`)
  })

  it('should return the existing value', () => {
    const actual = hasLoadedSearchTerm({ category: { name: 'category', state: true } }, undefined, undefined, ['tag1', 'tag2'])
    const expected = {
      category: true,
      tag1: undefined,
      tag2: undefined,
    }
    assert.deepEqual(actual, expected, `Didn't return the expected existing value`)
  })

  it('should return the existing value', () => {
    const actual = hasLoadedSearchTerm({ category: { name: 'category', state: true } }, undefined, undefined, ['tag1'])
    const expected = {
      category: true,
      tag1: undefined,
    }
    assert.deepEqual(actual, expected, `Didn't return the expected existing value`)
  })

  it('should return the updated value', () => {
    const actual = hasLoadedSearchTerm({ keywords: { name: 'keywords', state: false, term: 'bob' } }, 'category', 'sue', [])
    const expected = {
      category: false,
      keywords: false,
    }
    assert.deepEqual(actual, expected, `Didn't return the expected updated value`)
  })

  it('should return the updated value', () => {
    const actual = hasLoadedSearchTerm({ keywords: { name: 'keywords', state: false, term: 'bob' } }, 'category', 'bob', [])
    const expected = {
      category: false,
      keywords: true,
    }
    assert.deepEqual(actual, expected, `Didn't return the expected updated value`)
  })
})
