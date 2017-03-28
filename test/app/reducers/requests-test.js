import { describe, it } from 'mocha';
import { assert } from 'chai';
import requestsReducer from 'modules/app/reducers/requests';
import { MARKET_DATA_LOADING } from 'modules/app/actions/update-market-data-loading';

describe('modules/app/reducers/requests.js', () => {
  it('should react to default action', () => {
    const newState = requestsReducer(undefined, {
      type: '@@INIT'
    });

    assert.deepEqual(newState, {});
  });

  it('should react to MARKET_DATA_LOADING action', () => {
    const currentState = {};

    const newState = requestsReducer(currentState, {
      type: MARKET_DATA_LOADING,
      marketID: 'marketID',
      status: true
    });

    assert.deepEqual(newState, {
      MARKET_DATA_LOADING: {
        marketID: true
      }
    });
    assert.notStrictEqual(currentState, newState);
  });

});
