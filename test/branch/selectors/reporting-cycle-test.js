import { describe, it } from 'mocha';
import { assert } from 'chai';
import proxyquire from 'proxyquire';

describe(`modules/branch/selectors/reporting-cycle.js`, () => {
  proxyquire.noPreserveCache();
  const test = t => it(t.description, () => {
    const AugurJS = {
      augur: t.stub.augur
    };
    const selector = proxyquire('../../../src/modules/branch/selectors/reporting-cycle.js', {
      '../../../services/augurjs': AugurJS
    });
    t.assertions(selector.selectReportingCycle(t.state));
  });
  test({
    description: 'Reporting cycle is 51% complete',
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
        reportingCycleTimeRemaining: 'in a minute'
      });
    }
  });
});
