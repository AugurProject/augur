import * as ActionTypes from "redux";

import { RESET_STATE } from "modules/app/actions/reset-state";
import {
  UPDATE_AWAITING_DISPUTE_MARKETS,
  UPDATE_CROWD_DISPUTE_MARKETS,
  UPDATE_DESIGNATED_REPORTING_MARKETS,
  UPDATE_OPEN_REPORTING_MARKETS,
  UPDATE_RESOLVED_REPORTING_MARKETS,
  UPDATE_UPCOMING_DESIGNATED_REPORTING_MARKETS
} from "modules/reports/actions/update-markets-in-reporting-state";

import reducer from "modules/reports/reducers/market-report-state";

describe("market report state", () => {
  const defaultState = {
    designated: [],
    open: [],
    upcoming: [],
    awaiting: [],
    dispute: [],
    resolved: []
  };

  describe("default state", () => {
    test("should return an object with empty arrays", () => {
      const result = reducer(undefined, { type: ActionTypes.INIT });
      expect(defaultState).toEqual(result);
    });
  });

  describe("actions", () => {
    const marketIds = ["1", "2", "3"];

    describe("UPDATE_UPCOMING_DESIGNATED_REPORTING_MARKETS action", () => {
      test("should replace upcoming attribute with data payload", () => {
        const result = reducer(defaultState, {
          type: UPDATE_UPCOMING_DESIGNATED_REPORTING_MARKETS,
          data: { marketIds }
        });
        expect({
          designated: [],
          open: [],
          upcoming: marketIds,
          awaiting: [],
          dispute: [],
          resolved: []
        }).toEqual(result);
      });
    });

    describe("UPDATE_DESIGNATED_REPORTING_MARKETS", () => {
      test("should replace designated attribute with data payload", () => {
        const result = reducer(defaultState, {
          type: UPDATE_DESIGNATED_REPORTING_MARKETS,
          data: { marketIds }
        });
        expect({
          designated: marketIds,
          open: [],
          upcoming: [],
          awaiting: [],
          dispute: [],
          resolved: []
        }).toEqual(result);
      });
    });

    describe("UPDATE_OPEN_REPORTING_MARKETS", () => {
      test("should replace open attribute with data payload", () => {
        const result = reducer(defaultState, {
          type: UPDATE_OPEN_REPORTING_MARKETS,
          data: { marketIds }
        });
        expect({
          designated: [],
          open: marketIds,
          upcoming: [],
          awaiting: [],
          dispute: [],
          resolved: []
        }).toEqual(result);
      });
    });

    describe("UPDATE_AWAITING_DISPUTE_MARKETS", () => {
      test("should replace open attribute with data payload", () => {
        const result = reducer(defaultState, {
          type: UPDATE_AWAITING_DISPUTE_MARKETS,
          data: { marketIds }
        });
        expect({
          designated: [],
          open: [],
          upcoming: [],
          resolved: [],
          awaiting: marketIds,
          dispute: []
        }).toEqual(result);
      });
    });

    describe("UPDATE_CROWD_DISPUTE_MARKETS", () => {
      test("should replace open attribute with data payload", () => {
        const result = reducer(defaultState, {
          type: UPDATE_CROWD_DISPUTE_MARKETS,
          data: { marketIds }
        });
        expect({
          designated: [],
          open: [],
          upcoming: [],
          resolved: [],
          awaiting: [],
          dispute: marketIds
        }).toEqual(result);
      });
    });

    describe("UPDATE_RESOLVED_REPORTING_MARKETS", () => {
      test("should replace resolved attribute with data payload", () => {
        const result = reducer(defaultState, {
          type: UPDATE_RESOLVED_REPORTING_MARKETS,
          data: { marketIds }
        });
        expect({
          designated: [],
          open: [],
          upcoming: [],
          resolved: marketIds,
          awaiting: [],
          dispute: []
        }).toEqual(result);
      });
    });

    describe("RESET_STATE", () => {
      test("should return default state", () => {
        const result = reducer(
          { randomattr: [] },
          { type: RESET_STATE, data: { marketIds } }
        );
        expect(defaultState).toEqual(result);
      });
    });
  });
});
