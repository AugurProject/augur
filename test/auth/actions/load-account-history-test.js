import { describe, it } from 'mocha';
import { assert } from 'chai';
import configureMockStore from 'redux-mock-store';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import thunk from 'redux-thunk';

describe(`modules/auth/actions/load-account-history.js`, () => {
  proxyquire.noPreserveCache();
  const mockStore = configureMockStore([thunk]);

  const MOCK_ACTION_TYPES = {
    LOAD_ACCOUNT_TRADES: 'LOAD_ACCOUNT_TRADES',
    LOAD_BIDS_ASKS_HISTORY: 'LOAD_BIDS_ASKS_HISTORY',
    LOAD_CREATE_MARKET_HISTORY: 'LOAD_CREATE_MARKET_HISTORY',
    LOAD_FUNDING_HISTORY: 'LOAD_FUNDING_HISTORY',
    LOAD_TRANSFER_HISTORY: 'LOAD_TRANSFER_HISTORY',
    LOAD_REPORTING_HISTORY: 'LOAD_REPORTING_HISTORY',
    SYNC_BRANCH: 'SYNC_BRANCH',
    CLEAR_REPORTS: 'CLEAR_REPORTS',
    UPDATE_TRANSACTIONS_OLDEST_LOADED_BLOCK: 'UPDATE_TRANSACTIONS_OLDEST_LOADED_BLOCK',
    UPDATE_TRANSACTIONS_LOADING: 'UPDATE_TRANSACTIONS_LOADING',
    TRIGGER_TRANSACTIONS_EXPORT: 'TRIGGER_TRANSACTIONS_EXPORT'
  };

  let transactionCount = 1;

  const generateSoftLimitTransactionsData = () => {
    const limit = transactionCount + 40;
    let transactionsData = {};
    for (let i = transactionCount; i < limit; i++) {
      transactionsData = {
        ...transactionsData,
        [i]: {}
      };
      transactionCount = i;
    }

    transactionCount += 1;

    return transactionsData;
  };

  const LoadAccountTrades = {
    loadAccountTrades: () => {}
  };
  sinon.stub(LoadAccountTrades, 'loadAccountTrades', (options, cb) => {
    cb();
    return {
      type: MOCK_ACTION_TYPES.LOAD_ACCOUNT_TRADES,
      options
    };
  });

  const LoadBidsAsksHistory = {
    loadBidsAsksHistory: () => {}
  };
  sinon.stub(LoadBidsAsksHistory, 'loadBidsAsksHistory', (options, cb) => {
    cb();
    return {
      type: MOCK_ACTION_TYPES.LOAD_BIDS_ASKS_HISTORY,
      options
    };
  });

  const LoadCreateMarketHistory = {
    loadCreateMarketHistory: () => {}
  };
  sinon.stub(LoadCreateMarketHistory, 'loadCreateMarketHistory', (options, cb) => {
    cb();
    return {
      type: MOCK_ACTION_TYPES.LOAD_CREATE_MARKET_HISTORY,
      options
    };
  });

  const LoadFundingHistory = {
    loadFundingHistory: () => {},
    loadTransferHistory: () => {}
  };
  sinon.stub(LoadFundingHistory, 'loadFundingHistory', (options, cb) => {
    cb();
    return {
      type: MOCK_ACTION_TYPES.LOAD_FUNDING_HISTORY,
      options
    };
  });
  sinon.stub(LoadFundingHistory, 'loadTransferHistory', (options, cb) => {
    cb();
    return {
      type: MOCK_ACTION_TYPES.LOAD_TRANSFER_HISTORY,
      options
    };
  });

  const LoadReportingHistory = {
    loadReportingHistory: () => {}
  };
  sinon.stub(LoadReportingHistory, 'loadReportingHistory', (options, cb) => {
    cb();
    return {
      type: MOCK_ACTION_TYPES.LOAD_REPORTING_HISTORY,
      options
    };
  });

  const UpdateTransactionsOldestLoadedBlock = {
    updateTransactionsOldestLoadedBlock: () => {}
  };
  sinon.stub(UpdateTransactionsOldestLoadedBlock, 'updateTransactionsOldestLoadedBlock', block => ({
    type: MOCK_ACTION_TYPES.UPDATE_TRANSACTIONS_OLDEST_LOADED_BLOCK,
    block
  }));

  const UpdateTransactionsLoading = {
    updateTransactionsLoading: () => {}
  };
  sinon.stub(UpdateTransactionsLoading, 'updateTransactionsLoading', isLoading => ({
    type: MOCK_ACTION_TYPES.UPDATE_TRANSACTIONS_LOADING,
    isLoading
  }));

  const SyncBranch = {};
  SyncBranch.default = sinon.stub().returns({ type: MOCK_ACTION_TYPES.SYNC_BRANCH });

  const UpdateReports = {};
  UpdateReports.clearReports = sinon.stub().returns({ type: MOCK_ACTION_TYPES.CLEAR_REPORTS });

  const triggerTransactionsExport = sinon.stub().returns({ type: MOCK_ACTION_TYPES.TRIGGER_TRANSACTIONS_EXPORT });

  const action = proxyquire('../../../src/modules/auth/actions/load-account-history.js', {
    '../../my-positions/actions/load-account-trades': LoadAccountTrades,
    '../../bids-asks/actions/load-bids-asks-history': LoadBidsAsksHistory,
    '../../create-market/actions/load-create-market-history': LoadCreateMarketHistory,
    '../../account/actions/load-funding-history': LoadFundingHistory,
    '../../my-reports/actions/load-reporting-history': LoadReportingHistory,
    '../../branch/actions/sync-branch': SyncBranch,
    '../../reports/actions/update-reports': UpdateReports,
    '../../transactions/actions/update-transactions-oldest-loaded-block': UpdateTransactionsOldestLoadedBlock,
    '../../transactions/actions/update-transactions-loading': UpdateTransactionsLoading
  });

  const test = (t) => {
    it(t.description, () => {
      const store = mockStore(t.state);

      store.dispatch(action.loadAccountHistory(t.loadAllHistory));
      t.assertions(store.getActions());
    });
  };

  test({
    description: `should do nothing if registerBlock is null`,
    state: {
      transactionsOldestLoadedBlock: 10,
      loginAccount: {}
    },
    assertions: (actions) => {
      const expected = [];
      assert.deepEqual(actions, expected, `Didn't dispatch the expected actions`);
    }
  });

  test({
    description: `shouldn't load transactions if oldestLoadedBlock is null`,
    state: {
      transactionsOldestLoadedBlock: null,
      loginAccount: {},
      blockchain: {}
    },
    assertions: (actions) => {
      const expected = [
        {
          type: MOCK_ACTION_TYPES.CLEAR_REPORTS
        },
        {
          type: MOCK_ACTION_TYPES.SYNC_BRANCH
        }
      ];
      assert.deepEqual(actions, expected, `Didn't dispatch the expected actions`);
    }
  });

  test({
    description: `shouldn't load transactions if oldestLoadedBlock === registerBlock`,
    state: {
      transactionsOldestLoadedBlock: 10,
      loginAccount: {
        registerBlockNumber: 10
      }
    },
    assertions: (actions) => {
      const expected = [];
      assert.deepEqual(actions, expected, `Didn't dispatch the expected actions`);
    }
  });

  test({
    description: `should load all transactions back to registerBlock if 'loadAllHistory' is passed in as true`,
    state: {
      blockchain: {
        currentBlockNumber: 10
      },
      loginAccount: {
        registerBlockNumber: 1
      }
    },
    loadAllHistory: true,
    assertions: (actions) => {
      const expected = [
        {
          type: MOCK_ACTION_TYPES.CLEAR_REPORTS
        },
        {
          type: MOCK_ACTION_TYPES.SYNC_BRANCH
        },
        {
          type: MOCK_ACTION_TYPES.UPDATE_TRANSACTIONS_LOADING,
          isLoading: true
        },
        {
          type: MOCK_ACTION_TYPES.LOAD_ACCOUNT_TRADES,
          options: {}
        },
        {
          type: MOCK_ACTION_TYPES.LOAD_BIDS_ASKS_HISTORY,
          options: {}
        },
        {
          type: MOCK_ACTION_TYPES.LOAD_FUNDING_HISTORY,
          options: {}
        },
        {
          type: MOCK_ACTION_TYPES.LOAD_TRANSFER_HISTORY,
          options: {}
        },
        {
          type: MOCK_ACTION_TYPES.LOAD_CREATE_MARKET_HISTORY,
          options: {}
        },
        {
          type: MOCK_ACTION_TYPES.UPDATE_TRANSACTIONS_OLDEST_LOADED_BLOCK,
          block: 1
        },
        {
          type: MOCK_ACTION_TYPES.UPDATE_TRANSACTIONS_LOADING,
          isLoading: false
        },
        {
          type: MOCK_ACTION_TYPES.LOAD_REPORTING_HISTORY,
          options: {}
        }
      ];
      assert.deepEqual(actions, expected, `Didn't dispatch the expected actions`);
    }
  });

  test({
    description: `should load more transactions until register block`,
    state: {
      blockchain: {
        currentBlockNumber: 10000
      },
      loginAccount: {
        registerBlockNumber: 1
      },
      transactionsData: {}
    },
    loadTransactions: true,
    assertions: (actions) => {
      const expected = [
        {
          type: 'CLEAR_REPORTS'
        },
        {
          type: 'SYNC_BRANCH'
        },
        {
          type: 'UPDATE_TRANSACTIONS_LOADING',
          isLoading: true
        },
        {
          type: 'LOAD_ACCOUNT_TRADES',
          options: {
            toBlock: 10000,
            fromBlock: 4240
          }
        },
        {
          type: 'LOAD_BIDS_ASKS_HISTORY',
          options: {
            toBlock: 10000,
            fromBlock: 4240
          }
        },
        {
          type: 'LOAD_FUNDING_HISTORY',
          options: {
            toBlock: 10000,
            fromBlock: 4240
          }
        },
        {
          type: 'LOAD_TRANSFER_HISTORY',
          options: {
            toBlock: 10000,
            fromBlock: 4240
          }
        },
        {
          type: 'LOAD_CREATE_MARKET_HISTORY',
          options: {
            toBlock: 10000,
            fromBlock: 4240
          }
        },
        {
          type: 'UPDATE_TRANSACTIONS_OLDEST_LOADED_BLOCK',
          block: 4240
        },
        {
          type: 'UPDATE_TRANSACTIONS_LOADING',
          isLoading: true
        },
        {
          type: 'LOAD_ACCOUNT_TRADES',
          options: {
            toBlock: 4239,
            fromBlock: 1
          }
        },
        {
          type: 'LOAD_BIDS_ASKS_HISTORY',
          options: {
            toBlock: 4239,
            fromBlock: 1
          }
        },
        {
          type: 'LOAD_FUNDING_HISTORY',
          options: {
            toBlock: 4239,
            fromBlock: 1
          }
        },
        {
          type: 'LOAD_TRANSFER_HISTORY',
          options: {
            toBlock: 4239,
            fromBlock: 1
          }
        },
        {
          type: 'LOAD_CREATE_MARKET_HISTORY',
          options: {
            toBlock: 4239,
            fromBlock: 1
          }
        },
        {
          type: 'UPDATE_TRANSACTIONS_OLDEST_LOADED_BLOCK',
          block: 1
        },
        {
          type: 'UPDATE_TRANSACTIONS_LOADING',
          isLoading: false
        },
        {
          type: 'LOAD_REPORTING_HISTORY',
          options: {
            toBlock: 4239,
            fromBlock: 1
          }
        },
        {
          type: 'LOAD_REPORTING_HISTORY',
          options: {
            toBlock: 10000,
            fromBlock: 4240
          }
        }
      ];

      assert.deepEqual(actions, expected, `Didn't dispatch the expected actions`);
    }
  });

  describe('loadMoreTransactions', () => {
    const test = (t) => {
      it(t.description, () => {
        const store = mockStore(t.state);

        action.loadMoreTransactions(store.dispatch, store.getState, t.options, t.constraints);
        t.assertions(store.getActions());
      });
    };

    test({
      description: `should dispatch the expected actions when loadAllHistory is true`,
      constraints: {
        loadAllHistory: true,
        registerBlock: 1
      },
      assertions: (actions) => {
        const expected = [
          {
            type: MOCK_ACTION_TYPES.UPDATE_TRANSACTIONS_OLDEST_LOADED_BLOCK,
            block: 1
          },
          {
            type: MOCK_ACTION_TYPES.UPDATE_TRANSACTIONS_LOADING,
            isLoading: false
          }
        ];

        assert.deepEqual(actions, expected, `Didn't dispatch the expected actions`);
      }
    });

    test({
      description: `should dispatch the expected actions when loadAllHistory is true and 'triggerTransactionsExport' was passed`,
      constraints: {
        loadAllHistory: true,
        registerBlock: 1,
        triggerTransactionsExport
      },
      assertions: (actions) => {
        const expected = [
          {
            type: MOCK_ACTION_TYPES.UPDATE_TRANSACTIONS_OLDEST_LOADED_BLOCK,
            block: 1
          },
          {
            type: MOCK_ACTION_TYPES.UPDATE_TRANSACTIONS_LOADING,
            isLoading: false
          },
          {
            type: MOCK_ACTION_TYPES.TRIGGER_TRANSACTIONS_EXPORT
          }
        ];

        assert.deepEqual(actions, expected, `Didn't dispatch the expected actions`);
      }
    });

    test({
      description: `should dispatch the expected actions when the soft limit of transactions was loaded AND fromBlock === registerBlock`,
      options: {
        fromBlock: 1000,
        toBlock: 6760
      },
      constraints: {
        loadAllHistory: false,
        initialTransactionCount: 0,
        transactionSoftLimit: 40,
        registerBlock: 1,
        blockChunkSize: 100
      },
      state: {
        transactionsData: {
          ...generateSoftLimitTransactionsData()
        }
      },
      assertions: (actions) => {
        const expected = [
          {
            type: MOCK_ACTION_TYPES.UPDATE_TRANSACTIONS_OLDEST_LOADED_BLOCK,
            block: 1000
          },
          {
            type: MOCK_ACTION_TYPES.UPDATE_TRANSACTIONS_LOADING,
            isLoading: false
          }
        ];

        assert.deepEqual(actions, expected, `Didn't dispatch the expected actions`);
      }
    });

    test({
      description: `should dispatch the expected actions when soft limit not reached AND initial fromBlock !== registerBlock`,
      options: {
        fromBlock: 1000,
        toBlock: 2000
      },
      constraints: {
        loadAllHistory: false,
        initialTransactionCount: 0,
        transactionSoftLimit: 40,
        registerBlock: 1,
        blockChunkSize: 1000
      },
      state: {
        transactionsData: {}
      },
      assertions: (actions) => {
        const expected = [
          {
            type: MOCK_ACTION_TYPES.UPDATE_TRANSACTIONS_OLDEST_LOADED_BLOCK,
            block: 1000
          },
          {
            type: MOCK_ACTION_TYPES.UPDATE_TRANSACTIONS_LOADING,
            isLoading: true
          },
          {
            type: MOCK_ACTION_TYPES.LOAD_ACCOUNT_TRADES,
            options: {
              fromBlock: 1,
              toBlock: 999
            }
          },
          {
            type: MOCK_ACTION_TYPES.LOAD_BIDS_ASKS_HISTORY,
            options: {
              fromBlock: 1,
              toBlock: 999
            }
          },
          {
            type: MOCK_ACTION_TYPES.LOAD_FUNDING_HISTORY,
            options: {
              fromBlock: 1,
              toBlock: 999
            }
          },
          {
            type: MOCK_ACTION_TYPES.LOAD_TRANSFER_HISTORY,
            options: {
              fromBlock: 1,
              toBlock: 999
            }
          },
          {
            type: MOCK_ACTION_TYPES.LOAD_CREATE_MARKET_HISTORY,
            options: {
              fromBlock: 1,
              toBlock: 999
            }
          },
          {
            type: MOCK_ACTION_TYPES.UPDATE_TRANSACTIONS_OLDEST_LOADED_BLOCK,
            block: 1
          },
          {
            type: MOCK_ACTION_TYPES.UPDATE_TRANSACTIONS_LOADING,
            isLoading: false
          },
          {
            type: MOCK_ACTION_TYPES.LOAD_REPORTING_HISTORY,
            options: {
              fromBlock: 1,
              toBlock: 999
            }
          }
        ];

        assert.deepEqual(actions, expected, `Didn't dispatch the expected actions`);
      }
    });
  });
});
