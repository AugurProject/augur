import { getDefaultRangePeriodDuration } from 'src/modules/market/helpers/get-default-range-period-durations'

describe('src/modules/market/helpers/get-default-range-period-durations.js', () => {
  describe('when pass valid period/range arrays', () => {
    let periodList
    let rangeList
    let result

    beforeEach(() => {
      periodList = [
        {
          duration: 60,
          label: 'Every minute',
        },
        {
          duration: 3600,
          label: 'Hourly',
          isDefault: true,
        }, {
          duration: 86400,
          label: 'Daily',
        },
        {
          duration: 604800,
          label: 'Weekly',
        },
        {
          duration: 2629800,
          label: 'Monthly',
        },
      ]

      rangeList = [
        {
          duration: 60,
          label: 'Every minute',
        },
        {
          duration: 3600,
          label: 'Hourly',
        }, {
          duration: 86400,
          label: 'Daily',
          isDefault: true,
        },
        {
          duration: 604800,
          label: 'Weekly',
        },
        {
          duration: 2629800,
          label: 'Monthly',
        },
      ]

      result = getDefaultRangePeriodDuration(rangeList, periodList)
    })

    it('should return first period with a true isDefault attribute', () => {
      assert.equal(result.period, 3600)
    })

    it('should return first range with a true isDefault attribute', () => {
      assert.equal(result.range, 86400)

    })
  })
})
