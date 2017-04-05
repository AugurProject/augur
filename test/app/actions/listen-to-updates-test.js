import { describe, it, beforeEach } from 'mocha';
import { assert } from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import testState from 'test/testState';

describe(`modules/app/actions/listen-to-updates.js`, () => {
  proxyquire.noPreserveCache().noCallThru();

  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  const state = Object.assign({}, testState);
  const store = mockStore(state);
  const AugurJS = {
    augur: {
      filters: {
        listen: () => {}
      },
      CompositeGetters: {
        getPositionInMarket: sinon.stub.yields(['0x0', '0x1'])
      }
    },
    abi: {
      number: sinon.stub().returns([0, 1]),
      bignum: () => {}
    }
  };
  // sinon.stub(AugurJS.augur.CompositeGetters, 'getPositionInMarket', (market, trader, cb) => {
  //   cb(['0x0', '0x1']);
  // });

  const SyncBlockchain = {
    syncBlockchain: sinon.stub().returns({ type: 'SYNC_BLOCKCHAIN' })
  };

  const SyncBranch = {
    syncBranch: sinon.stub().returns({ type: 'SYNC_BRANCH' })
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

  const UpdateMarketOrderBook = {
    addOrder: sinon.stub().returns({ type: 'ADD_ORDER' }),
    fillOrder: sinon.stub().returns({ type: 'FILL_ORDER' }),
    removeOrder: sinon.stub().returns({ type: 'REMOVE_ORDER' })
  };

  const UpdateTopics = {
    updateMarketTopicPopularity: sinon.stub().returns({ type: 'UPDATE_MARKET_TOPIC_POPULARITY' })
  };

  const ConverLogsToTransactions = {
    convertLogsToTransactions: sinon.stub().returns({ type: 'CONVERT_LOGS_TO_TRANSACTIONS' })
  };

  const UpdateAccountTradesData = {
    updateAccountBidsAsksData: sinon.stub().returns({ type: 'UPDATE_ACCOUNT_BIDS_ASKS_DATA' }),
    updateAccountCancelsData: sinon.stub().returns({ type: 'UPDATE_ACCOUNT_CANCELS_DATA' }),
    updateAccountTradesData: sinon.stub().returns({ type: 'UPDATE_ACCOUNT_TRADES_DATA' })
  };

  // sinon.stub(AugurJS.augur.filters, 'listen', (cb) => {
  //   cb.block('blockhash');
  //   cb.log_fill_tx({
  //     market: 'testMarketID',
  //     outcome: 'testOutcome',
  //     price: 123.44250502560001,
  //     amount: '2'
  //   });
  //   cb.log_add_tx({ market: 'testMarketID' });
  //   cb.log_cancel({ market: 'testMarketID' });
  //   cb.marketCreated({ marketID: 'testID1', topic: 'topical' });
  //   cb.tradingFeeUpdated({ marketID: 'testID1' });
  // });


  const action = proxyquire('../../../src/modules/app/actions/listen-to-updates.js', {
    '../../../services/augurjs': AugurJS,
    '../../branch/actions/sync-branch': SyncBranch,
    '../../branch/actions/update-branch': UpdateBranch,
    './sync-blockchain': SyncBlockchain,
    '../../auth/actions/update-assets': UpdateAssets,
    '../../markets/actions/update-outcome-price': OutcomePrice,
    '../../markets/actions/load-markets-info': LoadMarketsInfo,
    '../../bids-asks/actions/update-market-order-book': UpdateMarketOrderBook,
    '../../topics/actions/update-topics': UpdateTopics,
    '../../transactions/actions/convert-logs-to-transactions': ConverLogsToTransactions,
    '../../my-positions/actions/update-account-trades-data': UpdateAccountTradesData
  });

  beforeEach(() => {
    store.clearActions();
  });

  afterEach(() => {
    AugurJS.augur.filters.listen.restore();
  });

  const test = (t) => {
    it(t.description, () => {
      t.assertions(store);
    });
  };

  test({
    description: 'should dispatch expected actions from block callback',
    assertions: (store) => {
      sinon.stub(AugurJS.augur.filters, 'listen', (cb) => {
        cb.block('blockhash');
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
    description: `should NOT dispatch actions from collectedFees callback if sender IS NOT logged user`,
    assertions: (store) => {
      sinon.stub(AugurJS.augur.filters, 'listen', (cb) => {
        cb.collectedFees({
          sender: '0xNOTUSER'
        });
      });

      store.dispatch(action.listenToUpdates());

      const expected = [];

      assert.deepEqual(store.getActions(), expected, `Didn't return the expected actions`);
    }
  });

  test({
    description: `should dispatch actions from collectedFees callback if sender IS logged user`,
    assertions: (store) => {
      sinon.stub(AugurJS.augur.filters, 'listen', (cb) => {
        cb.collectedFees({
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
    description: `should NOT dispatch actions from payout callback if sender IS NOT logged user`,
    assertions: () => {
      sinon.stub(AugurJS.augur.filters, 'listen', (cb) => {
        cb.payout({
          sender: '0xNOTUSER'
        });
      });

      store.dispatch(action.listenToUpdates());

      const expected = [];

      assert.deepEqual(store.getActions(), expected, `Didn't return the expected actions`);
    }
  });

  test({
    description: `should dispatch actions from payout callback if sender IS logged user`,
    assertions: (store) => {
      sinon.stub(AugurJS.augur.filters, 'listen', (cb) => {
        cb.payout({
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
    description: `should NOT dispatch actions from penalizationCatchUp callback if sender IS NOT logged user`,
    assertions: () => {
      sinon.stub(AugurJS.augur.filters, 'listen', (cb) => {
        cb.penalizationCaughtUp({
          sender: '0xNOTUSER'
        });
      });

      store.dispatch(action.listenToUpdates());

      const expected = [];

      assert.deepEqual(store.getActions(), expected, `Didn't return the expected actions`);
    }
  });

  test({
    description: `should dispatch actions from penalizationCatchUp callback if sender IS logged user`,
    assertions: (store) => {
      sinon.stub(AugurJS.augur.filters, 'listen', (cb) => {
        cb.penalizationCaughtUp({
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
    description: `should NOT dispatch actions from penalize callback if sender IS NOT logged user`,
    assertions: () => {
      sinon.stub(AugurJS.augur.filters, 'listen', (cb) => {
        cb.penalize({
          sender: '0xNOTUSER'
        });
      });

      store.dispatch(action.listenToUpdates());

      const expected = [];

      assert.deepEqual(store.getActions(), expected, `Didn't return the expected actions`);
    }
  });

  test({
    description: `should dispatch actions from penalize callback if sender IS logged user`,
    assertions: (store) => {
      sinon.stub(AugurJS.augur.filters, 'listen', (cb) => {
        cb.penalize({
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
    description: `should NOT dispatch actions from registration callback if sender IS NOT logged user`,
    assertions: () => {
      sinon.stub(AugurJS.augur.filters, 'listen', (cb) => {
        cb.registration({
          sender: '0xNOTUSER'
        });
      });

      store.dispatch(action.listenToUpdates());

      const expected = [];

      assert.deepEqual(store.getActions(), expected, `Didn't return the expected actions`);
    }
  });

  test({
    description: `should dispatch actions from registration callback if sender IS logged user`,
    assertions: (store) => {
      sinon.stub(AugurJS.augur.filters, 'listen', (cb) => {
        cb.registration({
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
    description: `should NOT dispatch actions from submittedReport callback if sender IS NOT logged user`,
    assertions: () => {
      sinon.stub(AugurJS.augur.filters, 'listen', (cb) => {
        cb.submittedReport({
          sender: '0xNOTUSER'
        });
      });

      store.dispatch(action.listenToUpdates());

      const expected = [];

      assert.deepEqual(store.getActions(), expected, `Didn't return the expected actions`);
    }
  });

  test({
    description: `should dispatch actions from submittedReport callback if sender IS logged user`,
    assertions: (store) => {
      sinon.stub(AugurJS.augur.filters, 'listen', (cb) => {
        cb.submittedReport({
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
    description: `should NOT dispatch actions from submittedReportHash callback if sender IS NOT logged user`,
    assertions: () => {
      sinon.stub(AugurJS.augur.filters, 'listen', (cb) => {
        cb.submittedReportHash({
          sender: '0xNOTUSER'
        });
      });

      store.dispatch(action.listenToUpdates());

      const expected = [];

      assert.deepEqual(store.getActions(), expected, `Didn't return the expected actions`);
    }
  });

  test({
    description: `should dispatch actions from submittedReportHash callback if sender IS logged user`,
    assertions: (store) => {
      sinon.stub(AugurJS.augur.filters, 'listen', (cb) => {
        cb.submittedReportHash({
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
    description: `should NOT dispatch actions from slashedRep callback if sender IS NOT logged user OR reporter`,
    assertions: () => {
      sinon.stub(AugurJS.augur.filters, 'listen', (cb) => {
        cb.slashedRep({
          sender: '0xNOTUSER',
          reporter: '0xNOTUSER'
        });
      });

      store.dispatch(action.listenToUpdates());

      const expected = [];

      assert.deepEqual(store.getActions(), expected, `Didn't return the expected actions`);
    }
  });

  test({
    description: `should dispatch actions from slashedRep callback if sender IS logged user`,
    assertions: (store) => {
      sinon.stub(AugurJS.augur.filters, 'listen', (cb) => {
        cb.slashedRep({
          sender: '0x0000000000000000000000000000000000000001',
          reporter: '0xNOTUSER'
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
    description: `should dispatch actions from slashedRep callback if reporter IS logged user`,
    assertions: (store) => {
      sinon.stub(AugurJS.augur.filters, 'listen', (cb) => {
        cb.slashedRep({
          sender: '0xNOTUSER',
          reporter: '0x0000000000000000000000000000000000000001'
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
    description: `should NOT dispatch actions from log_fill_tx callback WITHOUT correct argument properties`,
    assertions: () => {
      sinon.stub(AugurJS.augur.filters, 'listen', (cb) => {
        cb.log_fill_tx({});
      });

      store.dispatch(action.listenToUpdates());

      const expected = [];

      assert.deepEqual(store.getActions(), expected, `Didn't return the expected actions`);
    }
  });

  test({
    description: `should dispatch actions from log_fill_tx callback WITH correct argument properties AND sender IS NOT logged user`,
    assertions: (store) => {
      sinon.stub(AugurJS.augur.filters, 'listen', (cb) => {
        cb.log_fill_tx({
          market: '0xMARKET',
          price: '0.2',
          outcome: '1',
          sender: '0xNOTUSER'
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
    description: `should dispatch actions from log_fill_tx callback WITH correct argument properties AND sender IS logged user`,
    assertions: (store) => {
      sinon.stub(AugurJS.augur.filters, 'listen', (cb) => {
        cb.log_fill_tx({
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
    description: `should dispatch actions from log_fill_tx callback WITH correct argument properties AND owner IS logged user`,
    assertions: (store) => {
      sinon.stub(AugurJS.augur.filters, 'listen', (cb) => {
        cb.log_fill_tx({
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
});

// store.dispatch(action.listenToUpdates());
// const out = [{
//   type: 'SYNC_BLOCKCHAIN'
// }, {
//   type: 'UPDATE_ASSETS'
// }, {
//   type: 'SYNC_BRANCH'
// }, {
//   type: 'UPDATE_OUTCOME_PRICE'
// }, {
//   type: 'UPDATE_MARKET_TOPIC_POPULARITY'
// }, {
//   type: 'FILL_ORDER',
// }, {
//   type: 'LOAD_BASIC_MARKET',
//   marketID: [
//     'testID1'
//   ]
// }, {
//   type: 'LOAD_BASIC_MARKET',
//   marketID: [
//     'testID1'
//   ]
// }, {
//   type: 'UPDATE_ASSETS'
// }];
// assert.deepEqual(store.getActions(), out, `Didn't dispatch the expected action objects`);
