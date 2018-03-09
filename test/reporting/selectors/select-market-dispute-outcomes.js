import { describe, it } from 'mocha'
import { assert } from 'chai'
import sinon from 'sinon'
import marketDisputeOutcomes, { selectmarketDisputeOutcomes, __RewireAPI__ } from 'modules/reporting/selectors/select-market-dispute-outcomes'

describe(`modules/reports/selectors/select-market-dispute-outcomes.js`, () => {
  const test = t => it(t.description, done => t.assertions(done))

  describe('default method', () => {
    test({
      description: 'should call `selectMarketDisputeOutcomes` from the default function',
      assertions: (done) => {
        const stubbedSelectmarketDisputeOutcomes = sinon.stub()
        __RewireAPI__.__Rewire__('selectmarketDisputeOutcomes', stubbedSelectmarketDisputeOutcomes)

        marketDisputeOutcomes()

        assert.isTrue(stubbedSelectmarketDisputeOutcomes.calledOnce, `didn't call 'selectmarketDisputeOutcomes' once as expected`)

        __RewireAPI__.__ResetDependency__('selectmarketDisputeOutcomes')

        done()
      },
    })
  })

  describe('selectmarketDisputeOutcomes', () => {
    test({
      description: `should return an empty object`,
      assertions: (done) => {
        const actual = selectmarketDisputeOutcomes.resultFunc([])

        const expected = {}

        assert.deepEqual(actual, expected, `didn't return the expected result`)

        done()
      },
    })

    test({
      description: `should return a mapping of market id to a list of outcomes`,
      assertions: (done) => {

        const actual = selectmarketDisputeOutcomes.resultFunc([
          {
            id: 'market1',
            stakes: [],
          },
          {
            id: 'market2',
            stakes: [],
          },
        ])

        const expected = {
          market1: [],
          market2: [],
        }

        assert.deepEqual(actual, expected, `didn't return the expected result`)

        done()
      },
    })
  })
})
