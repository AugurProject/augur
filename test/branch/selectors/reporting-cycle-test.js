import { describe, it } from 'mocha'
import { assert } from 'chai'
import proxyquire from 'proxyquire'
import BigNumber from 'bignumber.js'

describe(`modules/branch/selectors/reporting-cycle.js`, () => {
  proxyquire.noPreserveCache()
  const test = t => it(t.description, () => {
    const AugurJS = {
      augur: t.stub.augur,
      abi: { bignum: n => new BigNumber(n, 10) }
    }
    const selector = proxyquire('../../../src/modules/branch/selectors/reporting-cycle.js', {
      '../../../services/augurjs': AugurJS
    })
    t.assertions(selector.selectReportingCycle(t.state))
  })
  test({
    description: 'Reporting cycle is in commit phase (0%)',
    state: {
      blockchain: {
        currentBlockTimestamp: 123456789
      },
      branch: {
        periodLength: 100
      }
    },
    stub: {
      augur: {
        reporting: {
          getCurrentPeriod: (periodLength, timestamp) => 42,
          getCurrentPeriodProgress: (periodLength, timestamp) => 0
        }
      }
    },
    assertions: (reportingCycle) => {
      assert.deepEqual(reportingCycle, {
        currentPeriod: 42,
        currentPeriodProgress: 0,
        isReportRevealPhase: false,
        phaseLabel: 'Commit',
        phaseTimeRemaining: 'in a minute'
      })
    }
  })
  test({
    description: 'Reporting cycle is in commit phase (10%)',
    state: {
      blockchain: {
        currentBlockTimestamp: 123456789
      },
      branch: {
        periodLength: 100
      }
    },
    stub: {
      augur: {
        reporting: {
          getCurrentPeriod: (periodLength, timestamp) => 42,
          getCurrentPeriodProgress: (periodLength, timestamp) => 10
        }
      }
    },
    assertions: (reportingCycle) => {
      assert.deepEqual(reportingCycle, {
        currentPeriod: 42,
        currentPeriodProgress: 10,
        isReportRevealPhase: false,
        phaseLabel: 'Commit',
        phaseTimeRemaining: 'in a few seconds'
      })
    }
  })
  test({
    description: 'Reporting cycle is in commit phase (50%)',
    state: {
      blockchain: {
        currentBlockTimestamp: 123456789
      },
      branch: {
        periodLength: 100
      }
    },
    stub: {
      augur: {
        reporting: {
          getCurrentPeriod: (periodLength, timestamp) => 42,
          getCurrentPeriodProgress: (periodLength, timestamp) => 10
        }
      }
    },
    assertions: (reportingCycle) => {
      assert.deepEqual(reportingCycle, {
        currentPeriod: 42,
        currentPeriodProgress: 10,
        isReportRevealPhase: false,
        phaseLabel: 'Commit',
        phaseTimeRemaining: 'in a few seconds'
      })
    }
  })
  test({
    description: 'Reporting cycle is in reveal phase (51%)',
    state: {
      blockchain: {
        currentBlockTimestamp: 123456789
      },
      branch: {
        periodLength: 100
      }
    },
    stub: {
      augur: {
        reporting: {
          getCurrentPeriod: (periodLength, timestamp) => 42,
          getCurrentPeriodProgress: (periodLength, timestamp) => 51
        }
      }
    },
    assertions: (reportingCycle) => {
      assert.deepEqual(reportingCycle, {
        currentPeriod: 42,
        currentPeriodProgress: 51,
        isReportRevealPhase: true,
        phaseLabel: 'Reveal',
        phaseTimeRemaining: 'in a minute'
      })
    }
  })
  test({
    description: 'Reporting cycle is in reveal phase (99%)',
    state: {
      blockchain: {
        currentBlockTimestamp: 123456789
      },
      branch: {
        periodLength: 100
      }
    },
    stub: {
      augur: {
        reporting: {
          getCurrentPeriod: (periodLength, timestamp) => 42,
          getCurrentPeriodProgress: (periodLength, timestamp) => 99
        }
      }
    },
    assertions: (reportingCycle) => {
      assert.deepEqual(reportingCycle, {
        currentPeriod: 42,
        currentPeriodProgress: 99,
        isReportRevealPhase: true,
        phaseLabel: 'Reveal',
        phaseTimeRemaining: 'in a few seconds'
      })
    }
  })
})
