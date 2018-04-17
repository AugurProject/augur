
import * as ActionTypes from 'redux'


import { RESET_STATE } from 'modules/app/actions/reset-state'
import { UPDATE_UPCOMING_DESIGNATED_REPORTING_MARKETS } from 'src/modules/reporting/actions/update-upcoming-designated-reporting'
import { UPDATE_DESIGNATED_REPORTING_MARKETS } from 'src/modules/reporting/actions/update-designated-reporting'
import { UPDATE_OPEN_REPORTING_MARKETS } from 'src/modules/reporting/actions/update-open-reporting'
import { UPDATE_AWAITING_DISPUTE_MARKETS } from 'modules/reporting/actions/update-awaiting-dispute'
import { UPDATE_CROWD_DISPUTE_MARKETS } from 'modules/reporting/actions/update-crowd-dispute'
import { UPDATE_RESOLVED_REPORTING_MARKETS } from 'modules/reporting/actions/update-resolved-reporting'

import reducer from 'modules/reporting/reducers/market-report-state'


describe('market report state', () => {
  const defaultState = {
    designated: [],
    open: [],
    upcoming: [],
    awaiting: [],
    dispute: [],
    resolved: [],
  }

  describe('default state', () => {
    it('should return an object with empty arrays', () => {
      const result = reducer(undefined, { type: ActionTypes.INIT })
      assert.deepEqual(defaultState, result)
    })
  })

  describe('actions', () => {
    const payload = [
      '1',
      '2',
      '3',
    ]

    describe('UPDATE_UPCOMING_DESIGNATED_REPORTING_MARKETS action', () => {
      it('should replace upcoming attribute with data payload', () => {
        const result = reducer(defaultState, { type: UPDATE_UPCOMING_DESIGNATED_REPORTING_MARKETS, data: payload })
        assert.deepEqual({
          designated: [],
          open: [],
          upcoming: payload,
          awaiting: [],
          dispute: [],
          resolved: [],
        }, result)
      })
    })

    describe('UPDATE_DESIGNATED_REPORTING_MARKETS', () => {
      it('should replace designated attribute with data payload', () => {
        const result = reducer(defaultState, { type: UPDATE_DESIGNATED_REPORTING_MARKETS, data: payload })
        assert.deepEqual({
          designated: payload,
          open: [],
          upcoming: [],
          awaiting: [],
          dispute: [],
          resolved: [],
        }, result)
      })
    })

    describe('UPDATE_OPEN_REPORTING_MARKETS', () => {
      it('should replace open attribute with data payload', () => {
        const result = reducer(defaultState, { type: UPDATE_OPEN_REPORTING_MARKETS, data: payload })
        assert.deepEqual({
          designated: [],
          open: payload,
          upcoming: [],
          awaiting: [],
          dispute: [],
          resolved: [],
        }, result)
      })
    })

    describe('UPDATE_AWAITING_DISPUTE_MARKETS', () => {
      it('should replace open attribute with data payload', () => {
        const result = reducer(defaultState, { type: UPDATE_AWAITING_DISPUTE_MARKETS, data: payload })
        assert.deepEqual({
          designated: [],
          open: [],
          upcoming: [],
          resolved: [],
          awaiting: payload,
          dispute: [],
        }, result)
      })
    })

    describe('UPDATE_CROWD_DISPUTE_MARKETS', () => {
      it('should replace open attribute with data payload', () => {
        const result = reducer(defaultState, { type: UPDATE_CROWD_DISPUTE_MARKETS, data: payload })
        assert.deepEqual({
          designated: [],
          open: [],
          upcoming: [],
          resolved: [],
          awaiting: [],
          dispute: payload,
        }, result)
      })
    })

    describe('UPDATE_RESOLVED_REPORTING_MARKETS', () => {
      it('should replace resolved attribute with data payload', () => {
        const result = reducer(defaultState, { type: UPDATE_RESOLVED_REPORTING_MARKETS, data: payload })
        assert.deepEqual({
          designated: [],
          open: [],
          upcoming: [],
          resolved: payload,
          awaiting: [],
          dispute: [],
        }, result)
      })
    })

    describe('RESET_STATE', () => {
      it('should return default state', () => {
        const result = reducer({ randomattr: [] }, { type: RESET_STATE, data: payload })
        assert.deepEqual(defaultState, result)
      })
    })
  })
})
