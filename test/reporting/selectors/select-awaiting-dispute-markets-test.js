import sinon from 'sinon'
import marketsAwaitingDispute, { selectMarketsAwaitingDispute, __RewireAPI__ } from 'modules/reporting/selectors/select-awaiting-dispute-markets'

describe(`modules/reports/selectors/select-awaiting-dispute-markets.js`, () => {
  const test = t => it(t.description, done => t.assertions(done))

  describe('default method', () => {
    test({
      description: 'should call `selectMarketsAwaitingDispute` from the default function',
      assertions: (done) => {
        const stubbedSelectMarketsAwaitingDispute = sinon.stub()
        __RewireAPI__.__Rewire__('selectMarketsAwaitingDispute', stubbedSelectMarketsAwaitingDispute)

        marketsAwaitingDispute()

        assert.isTrue(stubbedSelectMarketsAwaitingDispute.calledOnce, `didn't call 'selectMarketsAwaitingDispute' once as expected`)

        __RewireAPI__.__ResetDependency__('selectMarketsAwaitingDispute')

        done()
      },
    })
  })

  describe('selectMarketsAwaitingDispute', () => {
    test({
      description: `should return an empty array`,
      assertions: (done) => {
        const actual = selectMarketsAwaitingDispute.resultFunc([])

        const expected = []

        assert.deepEqual(actual, expected, `didn't return the expected result`)

        done()
      },
    })

    test({
      description: `should return an array populated with matching market objects`,
      assertions: (done) => {
        __RewireAPI__.__Rewire__('constants', {
          REPORTING_STATE: {
            AWAITING_NEXT_WINDOW: 'test',
          },
        })

        const actual = selectMarketsAwaitingDispute.resultFunc(
          [
            {
              id: '0xshouldpass',
              reportingState: 'test',
            },
            {
              id: '0xshouldnt',
              reportingState: 'fail',
            },
          ],
          {},
          {
            forkingMarket: '',
          },
        )

        const expected = [{
          id: '0xshouldpass',
          reportingState: 'test',
        }]

        assert.deepEqual(actual, expected, `didn't return the expected result`)

        __RewireAPI__.__ResetDependency__('constants')

        done()
      },
    })
  })
})
