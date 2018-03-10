import { describe, it } from 'mocha'
import { assert } from 'chai'
import sinon from 'sinon'
import marketDisputeOutcomes, { selectMarketDisputeOutcomes, __RewireAPI__ } from 'modules/reporting/selectors/select-market-dispute-outcomes'
import { BINARY, SCALAR, CATEGORICAL } from 'modules/markets/constants/market-types'

describe(`modules/reports/selectors/select-market-dispute-outcomes.js`, () => {
  const test = t => it(t.description, done => t.assertions(done))

  describe('default method', () => {
    test({
      description: 'should call `selectMarketDisputeOutcomes` from the default function',
      assertions: (done) => {
        const stubbedSelectmarketDisputeOutcomes = sinon.stub()
        __RewireAPI__.__Rewire__('selectMarketDisputeOutcomes', stubbedSelectmarketDisputeOutcomes)

        marketDisputeOutcomes()

        assert.isTrue(stubbedSelectmarketDisputeOutcomes.calledOnce, `didn't call 'selectMarketDisputeOutcomes' once as expected`)

        __RewireAPI__.__ResetDependency__('selectMarketDisputeOutcomes')

        done()
      },
    })
  })

  describe('selectMarketDisputeOutcomes', () => {
    test({
      description: `should return an empty object`,
      assertions: (done) => {
        const actual = selectMarketDisputeOutcomes.resultFunc([])

        const expected = {}

        assert.deepEqual(actual, expected, `didn't return the expected result`)

        done()
      },
    })

    test({
      description: `When no outcomes, should return a mapping of market id to a list of outcomes dependent on market type`,
      assertions: (done) => {

        const actual = selectMarketDisputeOutcomes.resultFunc([
          {
            id: 'binary_market',
            marketType: BINARY,
            numTicks: 10000,
            numOutcomes: 2,
            stakes: [],
          },
          {
            id: 'categorical_market',
            marketType: CATEGORICAL,
            numTicks: 10002,
            numOutcomes: 3,
            outcomes: [
              { description: 'Outcome 1' },
              { description: 'Outcome 2' },
              { description: 'Outcome 3' },
            ],
            stakes: [],
          },
          {
            id: 'scalar_market',
            marketType: SCALAR,
            numTicks: 1300,
            stakes: [],
          },
        ])

        const expected = {
          binary_market: [
            {
              goal: 0,
              id: 11,
              name: 'No',
              totalRep: 0,
              userRep: 0,
            },
            {
              goal: 0,
              id: 12,
              name: 'Yes',
              totalRep: 0,
              userRep: 0,
            },
            {
              goal: 0,
              id: 100,
              name: 'Invalid',
              totalRep: 0,
              userRep: 0,
            },
          ],
          categorical_market: [
            {
              goal: 0,
              id: 11,
              name: 'Outcome 1',
              totalRep: 0,
              userRep: 0,
            },
            {
              goal: 0,
              id: 12,
              name: 'Outcome 2',
              totalRep: 0,
              userRep: 0,
            },
            {
              goal: 0,
              id: 13,
              name: 'Outcome 3',
              totalRep: 0,
              userRep: 0,
            },
            {
              goal: 0,
              id: 100,
              name: 'Invalid',
              totalRep: 0,
              userRep: 0,
            },
          ],
          scalar_market: [
            {
              goal: 0,
              id: 100,
              name: 'Invalid',
              totalRep: 0,
              userRep: 0,
            },
          ],
        }

        assert.deepEqual(actual, expected, `didn't return the expected result`)

        done()
      },
    })
  })
})
