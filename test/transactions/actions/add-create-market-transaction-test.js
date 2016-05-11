import {
  assert
} from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import testState from '../../testState';

describe(`modules/transactions/actions/add-create-market-transaction.js`, () => {
  proxyquire.noPreserveCache().noCallThru();
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  let store, action, out;
  let state = Object.assign({}, testState);
  store = mockStore(state);
  let mockSubmit = {
    createMarket: () => {}
  };
  let mockAdd = {
    addTransaction: () => {}
  };

  sinon.stub(mockSubmit, 'createMarket', (id, data) => {
    return {
      type: 'CREATE_MARKET',
      id,
      data
    };
  });

  sinon.stub(mockAdd, `addTransaction`, (arg) => {
    return {
      type: 'ADD_TRANSACTION',
      data: arg
    }
  });


  action = proxyquire('../../../src/modules/transactions/actions/add-create-market-transaction.js', {
    '../../create-market/actions/submit-new-market': mockSubmit,
    '../../transactions/actions/add-transactions': mockAdd
  });

  beforeEach(() => {
    store.clearActions();
  });

  afterEach(() => {
    store.clearActions();
  });

  it(`should add and create a new create market transaction`, () => {
    let marketData = {
      id: 'testMarket1'
    };
    store.dispatch(action.addCreateMarketTransaction(marketData, 1, 5));
    out = [{
      type: 'ADD_TRANSACTION',
      data: {
        type: 'create_market',
        gas: 1,
        ether: 5,
        data: {
          id: 'testMarket1'
        },
        action: store.getActions()[0].data.action
      }
    }, {
      type: 'CREATE_MARKET',
      id: undefined,
      data: {
        id: 'testMarket1'
      }
    }];

    store.getActions()[0].data.action();

    assert(mockSubmit.createMarket.calledOnce, `createMarket wasn't called exactly once as expected`);
    assert(mockAdd.addTransaction.calledOnce, `addTransaction wasn't called once as expected`);
    assert.deepEqual(store.getActions(), out, `Didn't dispatch the expected action objects`);
  });
});
