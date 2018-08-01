

import { buildSearchString } from '../../../src/modules/markets/selectors/build-search-string'

describe('modules/markets/selectors/build-search-string.js', () => {

  it('should return nothing', () => {
    const actual = buildSearchString(undefined, undefined, [])
    const expected = undefined
    assert.deepEqual(actual, expected, `Didn't return the expected default value`)
  })

  it('should return the existing value', () => {
    const actual = buildSearchString(undefined, undefined, ['tag1', 'tag2'])
    const expected = 'tag1 AND tag2'
    assert.deepEqual(actual, expected, `Didn't return the expected existing value`)
  })

  it('should return the existing value', () => {
    const actual = buildSearchString(undefined, undefined, ['tag1'])
    const expected = 'tag1'
    assert.deepEqual(actual, expected, `Didn't return the expected existing value`)
  })

  it('keyword is too short to search on', () => {
    const actual = buildSearchString('category', 'sue', [])
    const expected = 'category'
    assert.deepEqual(actual, expected, `Didn't return the expected updated value`)
  })

  it('add keyword in search', () => {
    const actual = buildSearchString('category', 'suez', [])
    const expected = 'category AND suez'
    assert.deepEqual(actual, expected, `Didn't return the expected updated value`)
  })

  it('add keyword and tag', () => {
    const actual = buildSearchString('category', 'bobo', ['tag1'])
    const expected = 'category AND tag1 AND bobo'
    assert.deepEqual(actual, expected, `Didn't return the expected updated value`)
  })
})
