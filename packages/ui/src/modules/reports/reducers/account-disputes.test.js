import * as ActionTypes from "redux";

import { RESET_STATE } from "modules/app/actions/reset-state";
import {
  CLEAR_ACCOUNT_DISPUTES,
  REMOVE_ACCOUNT_DISPUTE,
  UPDATE_ACCOUNT_DISPUTE
} from "modules/reports/actions/update-account-disputes";
import reducer from "modules/reports/reducers/account-disputes-state";

describe(`modules/reports/reducers/account-disputes-state.js`, () => {
  const DEFAULT_STATE = {};
  const marketId1Data = {
    marketId: "marketId1",
    outcome: "0"
  };
  const marketId2Data = {
    marketId: "marketId2",
    outcome: "0"
  };

  test(`default state`, () => {
    expect(reducer(undefined, { type: ActionTypes.INIT })).toEqual({});
  });

  test(`add one dispute`, () => {
    const expected = {
      marketId1: marketId1Data
    };
    expect(
      reducer(undefined, {
        type: UPDATE_ACCOUNT_DISPUTE,
        data: { accountDisputesData: marketId1Data }
      })
    ).toEqual(expected);
  });

  test(`add multiple dispute`, () => {
    const state = reducer(
      {},
      {
        type: UPDATE_ACCOUNT_DISPUTE,
        data: { accountDisputesData: marketId1Data }
      }
    );
    const actual = reducer(state, {
      type: UPDATE_ACCOUNT_DISPUTE,
      data: { accountDisputesData: marketId2Data }
    });
    const expected = {
      marketId1: marketId1Data,
      marketId2: marketId2Data
    };
    expect(actual).toEqual(expected);
  });

  test(`remove one dispute`, () => {
    const data = {
      marketId1: marketId1Data,
      marketId2: marketId2Data
    };
    const actual = reducer(data, {
      type: REMOVE_ACCOUNT_DISPUTE,
      data: { accountDisputesData: marketId1Data }
    });
    const expected = {
      marketId2: marketId2Data
    };
    expect(actual).toEqual(expected);
  });

  test(`clear all account disputes`, () => {
    const data = {
      marketId1: marketId1Data,
      marketId2: marketId2Data
    };
    const actual = reducer(data, { type: CLEAR_ACCOUNT_DISPUTES });
    expect(actual).toEqual(DEFAULT_STATE);
  });

  test(`reset state account disputes`, () => {
    const data = {
      marketId1: marketId1Data,
      marketId2: marketId2Data
    };
    const actual = reducer(data, { type: RESET_STATE });
    expect(actual).toEqual(DEFAULT_STATE);
  });
});
