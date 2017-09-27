import { describe, it, beforeEach } from 'mocha';
import { assert } from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import testState from 'test/testState';

describe(`modules/app/actions/listen-to-updates.js`, () => {
  proxyquire.noPreserveCache();

  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  const state = testState;
  const store = mockStore(state);
  const AugurJS = {
    augur: {
      filters: {
        startListeners: () => {}
      }
    }
  };

  const SyncBlockchain = {
    syncBlockchain: sinon.stub().returns({ type: 'SYNC_BLOCKCHAIN' })
  };

  const SyncBranch = {
    default: sinon.stub().returns({ type: 'SYNC_BRANCH' })
  };

  const UpdateBranch = {
    updateBranch: sinon.stub().returns({ type: 'UPDATE_BRANCH' })
  };

  const UpdateAssets = {
    updateAssets: sinon.stub().returns({ type: 'UPDATE_ASSETS' })
  };

  const OutcomePrice = {
    updateOutcomePrice: sinon.stub().returns({ type: 'UPDATE_OUTCOME_PRICE' })
  };

  const LoadMarketsInfo = {
    loadMarketsInfo: sinon.stub().returns({ type: 'LOAD_MARKETS_INFO' })
  };

  const UpdateOrderBook = {
    addOrder: sinon.stub().returns({ type: 'ADD_ORDER' }),
    fillOrder: sinon.stub().returns({ type: 'FILL_ORDER' }),
    removeOrder: sinon.stub().returns({ type: 'REMOVE_ORDER' })
  };

  const UpdateTopics = {
    updateMarketTopicPopularity: sinon.stub().returns({ type: 'UPDATE_MARKET_TOPIC_POPULARITY' })
  };

  const ConvertLogsToTransactions = {
    convertLogsToTransactions: sinon.stub().returns({ type: 'CONVERT_LOGS_TO_TRANSACTIONS' })
  };

  const UpdateAccountTradesData = {
    updateAccountBidsAsksData: sinon.stub().returns({ type: 'UPDATE_ACCOUNT_BIDS_ASKS_DATA' }),
    updateAccountCancelsData: sinon.stub().returns({ type: 'UPDATE_ACCOUNT_CANCELS_DATA' }),
    updateAccountTradesData: sinon.stub().returns({ type: 'UPDATE_ACCOUNT_TRADES_DATA' })
  };

  const action = proxyquire('../../../src/modules/app/actions/listen-to-updates.js', {
    '../../../services/augurjs': AugurJS,
    '../../branch/actions/sync-branch': SyncBranch,
    '../../branch/actions/update-branch': UpdateBranch,
    './sync-blockchain': SyncBlockchain,
    '../../auth/actions/update-assets': UpdateAssets,
    '../../markets/actions/update-outcome-price': OutcomePrice,
    '../../markets/actions/load-markets-info': LoadMarketsInfo,
    '../../bids-asks/actions/update-order-book': UpdateOrderBook,
    '../../topics/actions/update-topics': UpdateTopics,
    '../../transactions/actions/convert-logs-to-transactions': ConvertLogsToTransactions,
    '../../my-positions/actions/update-account-trades-data': UpdateAccountTradesData
  });

  beforeEach(() => {
    store.clearActions();
  });

  afterEach(() => {
    AugurJS.augur.filters.startListeners.restore();
  });

  const test = (t) => {
    it(t.description, () => {
      t.assertions(store);
    });
  };

  test({
    description: 'should dispatch expected actions from block callback',
    assertions: (store) => {
      sinon.stub(AugurJS.augur.filters, 'startListeners', (subscriptionCallbacks) => {
        subscriptionCallbacks.block('blockhash');
      });

      store.dispatch(action.listenToUpdates());

      const expected = [
        {
          type: 'SYNC_BLOCKCHAIN'
        },
        {
          type: 'UPDATE_ASSETS'
        },
        {
          type: 'SYNC_BRANCH'
        }
      ];

      assert.deepEqual(store.getActions(), expected, `Didn't return the expected actions`);
    }
  });

  test({
    description: `should NOT dispatch actions from Payout callback if sender IS NOT logged user`,
    assertions: (store) => {
      sinon.stub(AugurJS.augur.filters, 'startListeners', (subscriptionCallbacks) => {
        subscriptionCallbacks.ClaimProceeds.Payout({
          sender: '0xNOTUSER'
        });
      });

      store.dispatch(action.listenToUpdates());

      const expected = [];

      assert.deepEqual(store.getActions(), expected, `Didn't return the expected actions`);
    }
  });

  test({
    description: `should dispatch actions from Payout callback if sender IS logged user`,
    assertions: (store) => {
      sinon.stub(AugurJS.augur.filters, 'startListeners', (subscriptionCallbacks) => {
        subscriptionCallbacks.ClaimProceeds.Payout({
          sender: '0x0000000000000000000000000000000000000001'
        });
      });

      store.dispatch(action.listenToUpdates());

      const expected = [
        {
          type: 'UPDATE_ASSETS'
        },
        {
          type: 'CONVERT_LOGS_TO_TRANSACTIONS'
        }
      ];

      assert.deepEqual(store.getActions(), expected, `Didn't return the expected actions`);
    }
  });

  test({
    description: `should NOT dispatch actions from Registration callback if sender IS NOT logged user`,
    assertions: (store) => {
      sinon.stub(AugurJS.augur.filters, 'startListeners', (subscriptionCallbacks) => {
        subscriptionCallbacks.Registration.Registration({
          sender: '0xNOTUSER'
        });
      });

      store.dispatch(action.listenToUpdates());

      const expected = [];

      assert.deepEqual(store.getActions(), expected, `Didn't return the expected actions`);
    }
  });

  test({
    description: `should dispatch actions from Registration callback if sender IS logged user`,
    assertions: (store) => {
      sinon.stub(AugurJS.augur.filters, 'startListeners', (subscriptionCallbacks) => {
        subscriptionCallbacks.Registration.Registration({
          sender: '0x0000000000000000000000000000000000000001'
        });
      });

      store.dispatch(action.listenToUpdates());

      const expected = [
        {
          type: 'CONVERT_LOGS_TO_TRANSACTIONS'
        }
      ];

      assert.deepEqual(store.getActions(), expected, `Didn't return the expected actions`);
    }
  });

  test({
    description: `should NOT dispatch actions from SubmitReport callback if sender IS NOT logged user`,
    assertions: (store) => {
      sinon.stub(AugurJS.augur.filters, 'startListeners', (subscriptionCallbacks) => {
        subscriptionCallbacks.ReportingToken.SubmitReport({
          sender: '0xNOTUSER'
        });
      });

      store.dispatch(action.listenToUpdates());

      const expected = [];

      assert.deepEqual(store.getActions(), expected, `Didn't return the expected actions`);
    }
  });

  test({
    description: `should dispatch actions from SubmitReport callback if sender IS logged user`,
    assertions: (store) => {
      sinon.stub(AugurJS.augur.filters, 'startListeners', (subscriptionCallbacks) => {
        subscriptionCallbacks.ReportingToken.SubmitReport({
          sender: '0x0000000000000000000000000000000000000001'
        });
      });

      store.dispatch(action.listenToUpdates());

      const expected = [
        {
          type: 'UPDATE_ASSETS'
        },
        {
          type: 'CONVERT_LOGS_TO_TRANSACTIONS'
        }
      ];

      assert.deepEqual(store.getActions(), expected, `Didn't return the expected actions`);
    }
  });

  test({
    description: `should NOT dispatch actions from TakeOrder callback WITHOUT correct argument properties`,
    assertions: (store) => {
      sinon.stub(AugurJS.augur.filters, 'startListeners', (subscriptionCallbacks) => {
        subscriptionCallbacks.Orders.TakeOrder({});
      });

      store.dispatch(action.listenToUpdates());

      const expected = [];

      assert.deepEqual(store.getActions(), expected, `Didn't return the expected actions`);
    }
  });

  test({
    description: `should dispatch actions from TakeOrder callback WITH correct argument properties AND sender AND owner ARE NOT logged user`,
    assertions: (store) => {
      sinon.stub(AugurJS.augur.filters, 'startListeners', (subscriptionCallbacks) => {
        subscriptionCallbacks.Orders.TakeOrder({
          market: '0xMARKET',
          price: '0.2',
          outcome: '1',
          sender: '0xNOTUSER',
          owner: '0xNOTUSER'
        });
      });

      store.dispatch(action.listenToUpdates());

      const expected = [
        {
          type: 'UPDATE_OUTCOME_PRICE'
        },
        {
          type: 'UPDATE_MARKET_TOPIC_POPULARITY'
        },
        {
          type: 'FILL_ORDER'
        }
      ];

      assert.deepEqual(store.getActions(), expected, `Didn't return the expected actions`);
    }
  });

  test({
    description: `should dispatch actions from TakeOrder callback WITH correct argument properties AND sender IS logged user`,
    assertions: (store) => {
      sinon.stub(AugurJS.augur.filters, 'startListeners', (subscriptionCallbacks) => {
        subscriptionCallbacks.Orders.TakeOrder({
          market: '0xMARKET',
          price: '0.2',
          outcome: '1',
          sender: '0x0000000000000000000000000000000000000001',
          owner: '0xNOTUSER'
        });
      });

      store.dispatch(action.listenToUpdates());

      const expected = [
        {
          type: 'UPDATE_OUTCOME_PRICE'
        },
        {
          type: 'UPDATE_MARKET_TOPIC_POPULARITY'
        },
        {
          type: 'UPDATE_ACCOUNT_TRADES_DATA'
        },
        {
          type: 'UPDATE_ASSETS'
        },
        {
          type: 'LOAD_MARKETS_INFO'
        }
      ];

      assert.deepEqual(store.getActions(), expected, `Didn't return the expected actions`);
    }
  });

  test({
    description: `should dispatch actions from TakeOrder callback WITH correct argument properties AND owner IS logged user`,
    assertions: (store) => {
      sinon.stub(AugurJS.augur.filters, 'startListeners', (subscriptionCallbacks) => {
        subscriptionCallbacks.Orders.TakeOrder({
          market: '0xMARKET',
          price: '0.2',
          outcome: '1',
          sender: '0xNOTUSER',
          owner: '0x0000000000000000000000000000000000000001'
        });
      });

      store.dispatch(action.listenToUpdates());

      const expected = [
        {
          type: 'UPDATE_OUTCOME_PRICE'
        },
        {
          type: 'UPDATE_MARKET_TOPIC_POPULARITY'
        },
        {
          type: 'FILL_ORDER'
        },
        {
          type: 'UPDATE_ACCOUNT_TRADES_DATA'
        },
        {
          type: 'UPDATE_ASSETS'
        },
        {
          type: 'LOAD_MARKETS_INFO'
        }
      ];

      assert.deepEqual(store.getActions(), expected, `Didn't return the expected actions`);
    }
  });

  test({
    description: `should NOT dispatch actions from MakeOrder callback WITHOUT correct argument properties`,
    assertions: (store) => {
      sinon.stub(AugurJS.augur.filters, 'startListeners', (subscriptionCallbacks) => {
        subscriptionCallbacks.Orders.MakeOrder({});
      });

      store.dispatch(action.listenToUpdates());

      const expected = [];

      assert.deepEqual(store.getActions(), expected, `Didn't return the expected actions`);
    }
  });

  test({
    description: `should dispatch actions from MakeOrder callback WITH correct argument properties AND sender IS NOT logged user`,
    assertions: (store) => {
      sinon.stub(AugurJS.augur.filters, 'startListeners', (subscriptionCallbacks) => {
        subscriptionCallbacks.Orders.MakeOrder({
          market: '0xMARKET',
          outcome: '1',
          sender: '0xNOTUSER'
        });
      });

      store.dispatch(action.listenToUpdates());

      const expected = [];

      assert.deepEqual(store.getActions(), expected, `Didn't return the expected actions`);
    }
  });

  test({
    description: `should dispatch actions from MakeOrder callback WITH correct argument properties AND sender IS logged user`,
    assertions: (store) => {
      sinon.stub(AugurJS.augur.filters, 'startListeners', (subscriptionCallbacks) => {
        subscriptionCallbacks.Orders.MakeOrder({
          market: 'testMarketID3',
          outcome: '1',
          amount: '0.2',
          sender: '0x0000000000000000000000000000000000000001'
        });
      });

      store.dispatch(action.listenToUpdates());

      const expected = [
        {
          type: 'UPDATE_ACCOUNT_BIDS_ASKS_DATA'
        },
        {
          type: 'UPDATE_ASSETS'
        }
      ];

      assert.deepEqual(store.getActions(), expected, `Didn't return the expected actions`);
    }
  });

  test({
    description: `should NOT dispatch actions from CancelOrder callback WITHOUT correct argument properties`,
    assertions: (store) => {
      sinon.stub(AugurJS.augur.filters, 'startListeners', (subscriptionCallbacks) => {
        subscriptionCallbacks.Orders.CancelOrder({});
      });

      store.dispatch(action.listenToUpdates());

      const expected = [];

      assert.deepEqual(store.getActions(), expected, `Didn't return the expected actions`);
    }
  });

  test({
    description: `should dispatch actions from CancelOrder callback WITH correct argument properties AND sender IS NOT logged user`,
    assertions: (store) => {
      sinon.stub(AugurJS.augur.filters, 'startListeners', (subscriptionCallbacks) => {
        subscriptionCallbacks.Orders.CancelOrder({
          market: '0xMARKET',
          outcome: '1',
          sender: '0xNOTUSER'
        });
      });

      store.dispatch(action.listenToUpdates());

      const expected = [];

      assert.deepEqual(store.getActions(), expected, `Didn't return the expected actions`);
    }
  });

  test({
    description: `should dispatch actions from CancelOrder callback WITH correct argument properties AND sender IS logged user`,
    assertions: (store) => {
      sinon.stub(AugurJS.augur.filters, 'startListeners', (subscriptionCallbacks) => {
        subscriptionCallbacks.Orders.CancelOrder({
          market: '0xMARKET',
          outcome: '1',
          sender: '0x0000000000000000000000000000000000000001'
        });
      });

      store.dispatch(action.listenToUpdates());

      const expected = [
        {
          type: 'UPDATE_ACCOUNT_CANCELS_DATA'
        },
        {
          type: 'UPDATE_ASSETS'
        }
      ];

      assert.deepEqual(store.getActions(), expected, `Didn't return the expected actions`);
    }
  });

  test({
    description: `should NOT dispatch actions from CreateMarket callback WITHOUT correct argument properties`,
    assertions: (store) => {
      sinon.stub(AugurJS.augur.filters, 'startListeners', (subscriptionCallbacks) => {
        subscriptionCallbacks.Branch.CreateMarket();
      });

      store.dispatch(action.listenToUpdates());

      const expected = [];

      assert.deepEqual(store.getActions(), expected, `Didn't return the expected actions`);
    }
  });

  test({
    description: `should dispatch actions from CreateMarket callback WITH correct argument properties AND sender IS NOT logged user`,
    assertions: (store) => {
      sinon.stub(AugurJS.augur.filters, 'startListeners', (subscriptionCallbacks) => {
        subscriptionCallbacks.Branch.CreateMarket({
          marketID: '0xMARKET',
          sender: '0xNOTUSER'
        });
      });

      store.dispatch(action.listenToUpdates());

      const expected = [
        {
          type: 'LOAD_MARKETS_INFO'
        }
      ];

      assert.deepEqual(store.getActions(), expected, `Didn't return the expected actions`);
    }
  });

  test({
    description: `should dispatch actions from CreateMarket callback WITH correct argument properties AND sender IS logged user`,
    assertions: (store) => {
      sinon.stub(AugurJS.augur.filters, 'startListeners', (subscriptionCallbacks) => {
        subscriptionCallbacks.Branch.CreateMarket({
          marketID: '0xMARKET',
          sender: '0x0000000000000000000000000000000000000001'
        });
      });

      store.dispatch(action.listenToUpdates());

      const expected = [
        {
          type: 'LOAD_MARKETS_INFO'
        },
        {
          type: 'UPDATE_ASSETS'
        },
        {
          type: 'CONVERT_LOGS_TO_TRANSACTIONS'
        }
      ];

      assert.deepEqual(store.getActions(), expected, `Didn't return the expected actions`);
    }
  });

  test({
    description: `should NOT dispatch actions from DepositEther callback WITHOUT sender as logged user`,
    assertions: (store) => {
      sinon.stub(AugurJS.augur.filters, 'startListeners', (subscriptionCallbacks) => {
        subscriptionCallbacks.Cash.DepositEther({
          sender: '0xNOTUSER'
        });
      });

      store.dispatch(action.listenToUpdates());

      const expected = [];

      assert.deepEqual(store.getActions(), expected, `Didn't return the expected actions`);
    }
  });

  test({
    description: `should dispatch actions from DepositEther callback WITH sender as logged user`,
    assertions: (store) => {
      sinon.stub(AugurJS.augur.filters, 'startListeners', (subscriptionCallbacks) => {
        subscriptionCallbacks.Cash.DepositEther({
          sender: '0x0000000000000000000000000000000000000001'
        });
      });

      store.dispatch(action.listenToUpdates());

      const expected = [
        {
          type: 'UPDATE_ASSETS'
        },
        {
          type: 'CONVERT_LOGS_TO_TRANSACTIONS'
        }
      ];

      assert.deepEqual(store.getActions(), expected, `Didn't return the expected actions`);
    }
  });

  test({
    description: `should NOT dispatch actions from WithdrawEther callback WITHOUT sender as logged user`,
    assertions: (store) => {
      sinon.stub(AugurJS.augur.filters, 'startListeners', (subscriptionCallbacks) => {
        subscriptionCallbacks.Cash.WithdrawEther({
          sender: '0xNOTUSER'
        });
      });

      store.dispatch(action.listenToUpdates());

      const expected = [];

      assert.deepEqual(store.getActions(), expected, `Didn't return the expected actions`);
    }
  });

  test({
    description: `should dispatch actions from WithdrawEther callback WITH sender as logged user`,
    assertions: (store) => {
      sinon.stub(AugurJS.augur.filters, 'startListeners', (subscriptionCallbacks) => {
        subscriptionCallbacks.Cash.WithdrawEther({
          sender: '0x0000000000000000000000000000000000000001'
        });
      });

      store.dispatch(action.listenToUpdates());

      const expected = [
        {
          type: 'UPDATE_ASSETS'
        },
        {
          type: 'CONVERT_LOGS_TO_TRANSACTIONS'
        }
      ];

      assert.deepEqual(store.getActions(), expected, `Didn't return the expected actions`);
    }
  });

  test({
    description: `should NOT dispatch actions from Transfer callback WITHOUT correct argument properties`,
    assertions: (store) => {
      sinon.stub(AugurJS.augur.filters, 'startListeners', (subscriptionCallbacks) => {
        subscriptionCallbacks.ReputationToken.Transfer();
      });

      store.dispatch(action.listenToUpdates());

      const expected = [];

      assert.deepEqual(store.getActions(), expected, `Didn't return the expected actions`);
    }
  });

  test({
    description: `should dispatch actions from Transfer callback WITH correct argument properties AND _from IS logged user`,
    assertions: (store) => {
      sinon.stub(AugurJS.augur.filters, 'startListeners', (subscriptionCallbacks) => {
        subscriptionCallbacks.ReputationToken.Transfer({
          _from: '0x0000000000000000000000000000000000000001',
          _to: '0xNOTUSER'
        });
      });

      store.dispatch(action.listenToUpdates());

      const expected = [
        {
          type: 'UPDATE_ASSETS'
        },
        {
          type: 'CONVERT_LOGS_TO_TRANSACTIONS'
        }
      ];

      assert.deepEqual(store.getActions(), expected, `Didn't return the expected actions`);
    }
  });

  test({
    description: `should dispatch actions from Transfer callback WITH correct argument properties AND _to IS logged user`,
    assertions: (store) => {
      sinon.stub(AugurJS.augur.filters, 'startListeners', (subscriptionCallbacks) => {
        subscriptionCallbacks.ReputationToken.Transfer({
          _from: '0xNOTUSER',
          _to: '0x0000000000000000000000000000000000000001'
        });
      });

      store.dispatch(action.listenToUpdates());

      const expected = [
        {
          type: 'UPDATE_ASSETS'
        },
        {
          type: 'CONVERT_LOGS_TO_TRANSACTIONS'
        }
      ];

      assert.deepEqual(store.getActions(), expected, `Didn't return the expected actions`);
    }
  });

  test({
    description: `should NOT dispatch actions from Approval callback WITHOUT correct argument properties`,
    assertions: (store) => {
      sinon.stub(AugurJS.augur.filters, 'startListeners', (subscriptionCallbacks) => {
        subscriptionCallbacks.ReputationToken.Approval();
      });

      store.dispatch(action.listenToUpdates());

      const expected = [];

      assert.deepEqual(store.getActions(), expected, `Didn't return the expected actions`);
    }
  });

  test({
    description: `should dispatch actions from Approval callback WITH correct argument properties AND _owner IS logged user`,
    assertions: (store) => {
      sinon.stub(AugurJS.augur.filters, 'startListeners', (subscriptionCallbacks) => {
        subscriptionCallbacks.ReputationToken.Approval({
          _owner: '0x0000000000000000000000000000000000000001',
          _spender: '0xNOTUSER'
        });
      });

      store.dispatch(action.listenToUpdates());

      const expected = [
        {
          type: 'UPDATE_ASSETS'
        },
        {
          type: 'CONVERT_LOGS_TO_TRANSACTIONS'
        }
      ];

      assert.deepEqual(store.getActions(), expected, `Didn't return the expected actions`);
    }
  });

  test({
    description: `should dispatch actions from Approval callback WITH correct argument properties AND _spender IS logged user`,
    assertions: (store) => {
      sinon.stub(AugurJS.augur.filters, 'startListeners', (subscriptionCallbacks) => {
        subscriptionCallbacks.ReputationToken.Approval({
          _owner: '0xNOTUSER',
          _spender: '0x0000000000000000000000000000000000000001'
        });
      });

      store.dispatch(action.listenToUpdates());

      const expected = [
        {
          type: 'UPDATE_ASSETS'
        },
        {
          type: 'CONVERT_LOGS_TO_TRANSACTIONS'
        }
      ];

      assert.deepEqual(store.getActions(), expected, `Didn't return the expected actions`);
    }
  });

  test({
    description: `should NOT dispatch actions from Finalize callback WITHOUT correct argument properties`,
    assertions: (store) => {
      sinon.stub(AugurJS.augur.filters, 'startListeners', (subscriptionCallbacks) => {
        subscriptionCallbacks.Market.Finalize();
      });

      store.dispatch(action.listenToUpdates());

      const expected = [];

      assert.deepEqual(store.getActions(), expected, `Didn't return the expected actions`);
    }
  });

  test({
    description: `should NOT dispatch actions from Finalize callback WITHOUT matched branch`,
    assertions: (store) => {
      sinon.stub(AugurJS.augur.filters, 'startListeners', (subscriptionCallbacks) => {
        subscriptionCallbacks.Market.Finalize({
          market: '0xMARKET',
          branch: '0xNOTMATCH'
        });
      });

      store.dispatch(action.listenToUpdates());

      const expected = [];

      assert.deepEqual(store.getActions(), expected, `Didn't return the expected actions`);
    }
  });

  test({
    description: `should dispatch actions from Finalize callback WITH matched branch`,
    assertions: (store) => {
      sinon.stub(AugurJS.augur.filters, 'startListeners', (subscriptionCallbacks) => {
        subscriptionCallbacks.Market.Finalize({
          market: '0xMARKET',
          branch: '0xf69b5'
        });
      });

      store.dispatch(action.listenToUpdates());

      const expected = [
        {
          type: 'LOAD_MARKETS_INFO'
        }
      ];

      assert.deepEqual(store.getActions(), expected, `Didn't return the expected actions`);
    }
  });
});
