import proxyquire from 'proxyquire'

describe(`modules/reports/selectors/select-dispute-markets.js`, () => {
  proxyquire.noPreserveCache().noCallThru()

  const test = (t) => {
    it(t.description, () => {
      t.assertions()
    })
  }

  describe('default', () => {
    test({
      description: `should not get any markets`,
      assertions: () => {
        const mockMarketsAll = {
          selectMarkets: () => ([]),
        }
        const mockSelectUniverseState = {
          selectUniverseState: () => ({
            forkingMarket: '',
            isForking: false,
          }),
        }
        const selector = proxyquire('../../../src/modules/reporting/selectors/select-dispute-markets.js', {
          '../../markets/selectors/markets-all': mockMarketsAll,
          '../../../select-state': mockSelectUniverseState,
        })

        const actual = selector.selectMarketsInDispute()
        assert.deepEqual(actual, [], `Didn't call the expected method`)
      },
    })
  })

  describe('selectMarketsInDispute', () => {
    test({
      description: `should return zero elements array`,
      assertions: () => {
        const mockMarketsAll = {
          selectMarkets: () => (
            [
              {
                id: '0xMARKETID1',
                reportingState: 'PRE_REPORTING',
              },
              {
                id: '0xMARKETID2',
                reportingState: 'FINALIZED',
              },
              {
                id: '0xMARKETID3',
                reportingState: 'PRE_REPORTING',
              },
            ]
          ),
        }
        const mockSelectUniverseState = {
          selectUniverseState: () => ({
            forkingMarket: '',
            isForking: false,
          }),
        }
        const selector = proxyquire('../../../src/modules/reporting/selectors/select-dispute-markets.js', {
          '../../markets/selectors/markets-all': mockMarketsAll,
          '../../../select-state': mockSelectUniverseState,
        })

        const actual = selector.selectMarketsInDispute()
        assert.deepEqual(actual, [], `Didn't return the expected array`)
      },
    })
  })

  describe('selectMarketsInDispute', () => {
    test({
      description: `should return one element expected array`,
      assertions: () => {
        const mockMarketsAll = {
          selectMarkets: () => (
            [
              {
                id: '0xMARKETID1',
                reportingState: 'PRE_REPORTING',
              },
              {
                id: '0xMARKETID2',
                reportingState: 'FINALIZED',
              },
              {
                id: '0xMARKETID3',
                reportingState: 'CROWDSOURCING_DISPUTE',
              },
            ]
          ),
        }
        const mockSelectUniverseState = {
          selectUniverseState: () => ({
            forkingMarket: '',
            isForking: false,
          }),
        }
        const selector = proxyquire('../../../src/modules/reporting/selectors/select-dispute-markets.js', {
          '../../markets/selectors/markets-all': mockMarketsAll,
          '../../../select-state': mockSelectUniverseState,
        })

        const actual = selector.selectMarketsInDispute()

        const expected = [
          {
            id: '0xMARKETID3',
            reportingState: 'CROWDSOURCING_DISPUTE',
          },
        ]

        assert.deepEqual(actual, expected, `Didn't return the expected array`)
      },
    })
  })
})
