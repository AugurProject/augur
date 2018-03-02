import { describe, it } from 'mocha'
import * as ActionTypes from 'redux'
import { assert } from 'chai'

import { RESET_STATE } from 'modules/app/actions/reset-state'
import { UPDATE_UPCOMING_DESIGNATED_REPORTING_MARKETS } from 'modules/reporting/actions/update-upcoming-designated-reporting'
import { UPDATE_DESIGNATED_REPORTING_MARKETS } from 'modules/reporting/actions/update-designated-reporting'
import { UPDATE_OPEN_REPORTING_MARKETS } from 'modules/reporting/actions/update-open-reporting'
import { UPDATE_RESOLVED_REPORTING_MARKETS } from 'modules/reporting/actions/update-resolved-reporting'

import reducer from './market-report-state'


describe('market report state', () => {
  const defaultState = {
    designated: [],
    open: [],
    upcoming: [],
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
          resolved: [],
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
