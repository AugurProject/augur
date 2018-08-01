

import { buildSearchString } from '../../../src/modules/markets/selectors/build-search-string'

describe('modules/markets/selectors/build-search-string.js', () => {

  it('should return nothing', () => {
    const actual = buildSearchString(undefined, [])
    const expected = undefined
    assert.deepEqual(actual, expected, `Didn't return the expected default value`)
  })

  it('should return the existing value', () => {
    const actual = buildSearchString(undefined, ['tag1', 'tag2'])
    const expected = 'tag1 OR tag2'
    assert.deepEqual(actual, expected, `Didn't return the expected existing value`)
  })

  it('should return the existing value', () => {
    const actual = buildSearchString(undefined, ['tag1'])
    const expected = 'tag1'
    assert.deepEqual(actual, expected, `Didn't return the expected existing value`)
  })

  it('keyword is too short to search on', () => {
    const actual = buildSearchString('sue', [])
    const expected = undefined
    assert.deepEqual(actual, expected, `Didn't return the expected updated value`)
  })

  it('add keyword in search', () => {
    const actual = buildSearchString('suez', [])
    const expected = 'suez'
    assert.deepEqual(actual, expected, `Didn't return the expected updated value`)
  })

  it('add keyword and tag', () => {
    const actual = buildSearchString('bobo', ['tag1'])
    const expected = 'tag1 OR bobo'
    assert.deepEqual(actual, expected, `Didn't return the expected updated value`)
  })
})
