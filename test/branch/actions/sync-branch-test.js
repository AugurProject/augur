import { describe, it } from 'mocha'
import { assert } from 'chai'
import proxyquire from 'proxyquire'
import sinon from 'sinon'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import testState from 'test/testState'

describe(`modules/branch/actions/sync-branch.js`, () => {
  proxyquire.noPreserveCache()
  const middlewares = [thunk]
  const mockStore = configureMockStore(middlewares)
  const test = (t) => {
    it(t.description, () => {
      const state = Object.assign({}, testState, t.state)
      const store = mockStore(state)
      const AugurJS = {
        augur: {
          api: {
            ConsensusData: {},
            Branches: {},
            Events: {},
            ExpiringEvents: {}
          }
        }
      }
      const CheckPeriod = { checkPeriod: () => {} }
      const ClaimProceeds = {}
      const ReportingCycle = {}
      const UpdateAssets = { updateAssets: () => {} }
      const UpdateBranch = { updateBranch: () => {} }
      const action = proxyquire('../../../src/modules/branch/actions/sync-branch.js', {
        '../../../services/augurjs': AugurJS,
        '../../reports/actions/check-period': CheckPeriod,
        '../../my-positions/actions/claim-proceeds': ClaimProceeds,
        '../selectors/reporting-cycle': ReportingCycle,
        '../../auth/actions/update-assets': UpdateAssets,
        './update-branch': UpdateBranch
      })
      AugurJS.augur.api.Branches.getVotePeriod = sinon.stub().yields(19)
      AugurJS.augur.api.Branches.getVotePeriod.onCall(1).yields(15)
      AugurJS.augur.api.Branches.getVotePeriod.onCall(2).yields(18)
      AugurJS.augur.api.ConsensusData.getPenalizedUpTo = sinon.stub().yields('10')
      AugurJS.augur.api.ConsensusData.getFeesCollected = sinon.stub().yields('1')
      AugurJS.augur.api.Events.getPast24 = sinon.stub().yields('2')
      AugurJS.augur.api.ExpiringEvents.getNumberEvents = sinon.stub().yields('6')
      ClaimProceeds.claimProceeds = sinon.stub().returns({ type: 'CLAIM_PROCEEDS' })
      sinon.stub(CheckPeriod, 'checkPeriod', (unlock, cb) => (dispatch, getState) => {
        const reportPeriod = 19
        dispatch({ type: 'UPDATE_BRANCH', branch: { reportPeriod } })
        cb(null, reportPeriod)
      })
      ReportingCycle.default = sinon.stub().returns(t.selectors.reportingCycle)
      sinon.stub(UpdateAssets, 'updateAssets', cb => (dispatch) => {
        dispatch({ type: 'UPDATE_ASSETS' })
        cb(null, { ether: null, realEther: null, rep: null })
      })
      sinon.stub(UpdateBranch, 'updateBranch', branch => ({ type: 'UPDATE_BRANCH', branch }))
      global.Date.now = sinon.stub().returns(12345)
      store.dispatch(action.syncBranch(() => store.dispatch({ type: 'MOCK_CB_CALLED' })))
      t.assertions(store.getActions())
    })
  }
  test({
    description: 'should update our local state to match blockchain if chain is up-to-date',
    state: {
      branch: {
        currentPeriod: 20,
        currentPeriodProgress: 52,
        isReportRevealPhase: true,
        reportPeriod: 18,
        periodLength: 900
      }
    },
    selectors: {
      reportingCycle: {
        currentPeriod: 20,
        currentPeriodProgress: 52,
        isReportRevealPhase: true,
        phaseLabel: 'Reveal',
        phaseTimeRemaining: 'in 7 minutes'
      }
    },
    assertions: (actions) => {
      assert.deepEqual(actions, [{
        type: 'UPDATE_BRANCH',
        branch: {
          currentPeriod: 20,
          currentPeriodProgress: 52,
          isReportRevealPhase: true,
          phaseLabel: 'Reveal',
          phaseTimeRemaining: 'in 7 minutes'
        }
      }, {
        type: 'MOCK_CB_CALLED'
      }])
    }
  })
  test({
    description: `should increment branch if the branch is behind`,
    state: {
      branch: {
        currentPeriod: 20,
        currentPeriodProgress: 52,
        isReportRevealPhase: true,
        reportPeriod: 18,
        periodLength: 900
      }
    },
    selectors: {
      reportingCycle: {
        currentPeriod: 20,
        currentPeriodProgress: 42,
        isReportRevealPhase: false,
        phaseLabel: 'Commit',
        phaseTimeRemaining: 'in a minute'
      }
    },
    assertions: (actions) => {
      assert.deepEqual(actions, [{
        type: 'UPDATE_BRANCH',
        branch: {
          currentPeriod: 20,
          currentPeriodProgress: 42,
          isReportRevealPhase: false,
          phaseLabel: 'Commit',
          phaseTimeRemaining: 'in a minute'
        }
      }, {
        type: 'UPDATE_BRANCH',
        branch: {
          reportPeriod: 19
        }
      }, {
        type: 'UPDATE_BRANCH',
        branch: {
          numEventsCreatedInPast24Hours: 2
        }
      }, {
        type: 'UPDATE_BRANCH',
        branch: {
          numEventsInReportPeriod: 6
        }
      }, {
        type: 'UPDATE_ASSETS'
      }, {
        type: 'CLAIM_PROCEEDS'
      }, {
        type: 'MOCK_CB_CALLED'
      }])
    }
  })
  test({
    description: `should collect fees and reveal reports if we're in the second half of the reporting period`,
    state: {
      branch: {
        currentPeriod: 20,
        currentPeriodProgress: 49,
        isReportRevealPhase: false,
        reportPeriod: 18,
        periodLength: 900
      }
    },
    selectors: {
      reportingCycle: {
        currentPeriod: 20,
        currentPeriodProgress: 52,
        isReportRevealPhase: true,
        phaseLabel: 'Reveal',
        phaseTimeRemaining: 'in 7 minutes'
      }
    },
    assertions: (actions) => {
      assert.deepEqual(actions, [{
        type: 'UPDATE_BRANCH',
        branch: {
          currentPeriod: 20,
          currentPeriodProgress: 52,
          isReportRevealPhase: true,
          phaseLabel: 'Reveal',
          phaseTimeRemaining: 'in 7 minutes'
        }
      }, {
        type: 'UPDATE_BRANCH',
        branch: {
          reportPeriod: 19
        }
      }, {
        type: 'UPDATE_BRANCH',
        branch: {
          numEventsCreatedInPast24Hours: 2
        }
      }, {
        type: 'UPDATE_BRANCH',
        branch: {
          numEventsInReportPeriod: 6
        }
      }, {
        type: 'UPDATE_ASSETS'
      }, {
        type: 'CLAIM_PROCEEDS'
      }, {
        type: 'MOCK_CB_CALLED'
      }])
    }
  })
})
