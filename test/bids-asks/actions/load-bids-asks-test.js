import { assert } from 'chai';
// import proxyquire from 'proxyquire';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import testState from '../../testState';
import * as action from '../../../src/modules/bids-asks/actions/load-bids-asks';

describe(`modules/bids-asks/actions/load-bids-asks.js`, () => {
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  // let action, store;
  let thisTestState = Object.assign({}, testState);
  let store = mockStore(thisTestState);

  // action = proxyquire('../../../src/modules/bids-asks/actions/load-bids-asks', {});

  beforeEach(() => {
    store.clearActions();
  });

  it(`should load bids-asks for a market`);
});
