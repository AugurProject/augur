

import proxyquire from 'proxyquire'

describe(`modules/universe/selectors/reporting-cycle.js`, () => {
  proxyquire.noPreserveCache()
  const test = t => it(t.description, () => {
    const AugurJS = {
      augur: t.stub.augur,
    }
    const selector = proxyquire('../../../src/modules/universe/selectors/reporting-cycle.js', {
      '../../../services/augurjs': AugurJS,
    })
    t.assertions(selector.selectReportingCycle(t.state))
  })

  test({
    description: 'Reporting cycle is 51% complete',
    state: {
      blockchain: {
        currentBlockTimestamp: 123456789,
      },
      universe: {
        reportingPeriodDurationInSeconds: 100,
      },
    },
    stub: {
      augur: {
        reporting: {
          getCurrentPeriodProgress: (reportingPeriodDurationInSeconds, timestamp) => 51,
        },
      },
    },
    assertions: (reportingCycle) => {
      assert.deepEqual(reportingCycle, {
        currentReportingPeriodPercentComplete: 51,
        reportingCycleTimeRemaining: 'in a minute',
      })
    },
  })

  test({
    description: 'Reporting cycle is 0% complete',
    state: {
      blockchain: {
        currentBlockTimestamp: 123456789,
      },
      universe: {
        reportingPeriodDurationInSeconds: 2678400,
      },
    },
    stub: {
      augur: {
        reporting: {
          getCurrentPeriodProgress: (reportingPeriodDurationInSeconds, timestamp) => 0,
        },
      },
    },
    assertions: (reportingCycle) => {
      assert.deepEqual(reportingCycle, {
        currentReportingPeriodPercentComplete: 0,
        reportingCycleTimeRemaining: 'in a month',
      })
    },
  })

  test({
    description: 'Reporting cycle is 100% complete',
    state: {
      blockchain: {
        currentBlockTimestamp: 123456789,
      },
      universe: {
        reportingPeriodDurationInSeconds: 2678400,
      },
    },
    stub: {
      augur: {
        reporting: {
          getCurrentPeriodProgress: (reportingPeriodDurationInSeconds, timestamp) => 100,
        },
      },
    },
    assertions: (reportingCycle) => {
      assert.deepEqual(reportingCycle, {
        currentReportingPeriodPercentComplete: 100,
        reportingCycleTimeRemaining: 'a few seconds ago',
      })
    },
  })

})
