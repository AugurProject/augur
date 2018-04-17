

import formatTimePassed from 'utils/format-time-passed'

describe('utils/format-time-passed.js', () => {
  it('should format time passed', () => {
    assert.equal(formatTimePassed(999), 'less than a second ago')
    assert.equal(formatTimePassed(1000), '00:01 ago')
    assert.equal(formatTimePassed(1001), '00:01 ago')
    assert.equal(formatTimePassed(1999), '00:01 ago')
    assert.equal(formatTimePassed(2000), '00:02 ago')
    assert.equal(formatTimePassed(59999), '00:59 ago')
    assert.equal(formatTimePassed(60000), '01:00 ago')
    assert.equal(formatTimePassed(60001), '01:00 ago')
    assert.equal(formatTimePassed(60002), '01:00 ago')
    assert.equal(formatTimePassed(70000), '01:10 ago')
    assert.equal(formatTimePassed(3599000), '59:59 ago')
    assert.equal(formatTimePassed(3600000), 'hour ago')
    assert.equal(formatTimePassed(3600001), 'more than hour ago')
    assert.equal(formatTimePassed(24 * 60 * 60 * 1001), 'more than hour ago')
  })
})
