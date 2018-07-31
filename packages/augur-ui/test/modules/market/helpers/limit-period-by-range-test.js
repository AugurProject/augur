import { limitPeriodByRange } from 'src/modules/market/helpers/limit-period-by-range'

describe('src/modules/market/helpers/limit-period-by-range.js', () => {
  let PERIODS

  beforeEach(() => {
    PERIODS = [
      {
        duration: 60,
        label: 'Every minute',
      },
      {
        duration: 3600,
        label: 'Hourly',
      },
    ]
  })

  describe('arguments are omitted', () => {
    it('should return the full  period list', () => {
      const result = limitPeriodByRange(PERIODS)
      assert.deepEqual(result, PERIODS)
    })
  })

  describe('when passed a range less than a a period\'s duration', () => {
    it('should return the subset or period with duration less than the passed value', () => {
      const result = limitPeriodByRange(PERIODS, 3000)
      assert.deepEqual(result, PERIODS.slice(0, 1))
    })
  })

  describe('when passed a range equal to a period\'s duration', () => {
    it('should not include the period in the result', () => {
      const result = limitPeriodByRange(PERIODS, 3600)
      assert.deepEqual(result, PERIODS.slice(0, 1))
    })
  })

  describe('when passed a range greater than a period\'s range', () => {
    it('should include the period on the result', () => {
      const result = limitPeriodByRange(PERIODS, 7200)
      assert.deepEqual(result, PERIODS)
    })
  })
})
