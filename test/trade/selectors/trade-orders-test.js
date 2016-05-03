import {
  assert
} from 'chai';
import proxyquire from 'proxyquire';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import testState from '../../testState';
import * as selector from '../../../src/modules/trade/selectors/trade-orders';

describe(`modules/trade/selectors/trade-orders.js`, () => {
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  let state = Object.assign({}, testState);
  let store = mockStore(state);
  let out;
  // This area looks like it's still Under Contruction, will revisit tests
  it(`should select trade orders correctly`);

  it(`should select outcome trade orders correctly`);

  it(`should select outcome transactions correctly`);

});
