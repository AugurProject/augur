import { describe, it } from 'mocha';
import { assert } from 'chai';
import configureMockStore from 'redux-mock-store';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import thunk from 'redux-thunk';

describe(`modules/auth/actions/load-account-data.js`, () => {
  proxyquire.noPreserveCache();
  const mockStore = configureMockStore([thunk]);
  const test = (t) => {
    it(t.description, () => {
      const store = mockStore(t.state);
      const AugurJS = {
        augur: {
          getRegisterBlockNumber: () => {}
        }
      };
      const LoadAccountTrades = {};
      const LoadBidsAsksHistory = {};
      const LoadCreateMarketHistory = {};
      const LoadEventsWithSubmittedReport = {};
      const LoadFundingHistory = {};
      const LoadReportingHistory = {};
      const SyncBranch = {};
      const UpdateAssets = { updateAssets: () => {} };
      const UpdateLoginAccount = { updateLoginAccount: () => {} };
      const UpdateReports = {};
      const action = proxyquire('../../../src/modules/auth/actions/load-account-data.js', {
        '../../../services/augurjs': AugurJS,
        '../../../modules/my-positions/actions/load-account-trades': LoadAccountTrades,
        '../../../modules/bids-asks/actions/load-bids-asks-history': LoadBidsAsksHistory,
        '../../../modules/create-market/actions/load-create-market-history': LoadCreateMarketHistory,
        '../../../modules/my-reports/actions/load-events-with-submitted-report': LoadEventsWithSubmittedReport,
        '../../../modules/account/actions/load-funding-history': LoadFundingHistory,
        '../../../modules/my-reports/actions/load-reporting-history': LoadReportingHistory,
        '../../../modules/branch/actions/sync-branch': SyncBranch,
        '../../../modules/auth/actions/update-assets': UpdateAssets,
        '../../../modules/auth/actions/update-login-account': UpdateLoginAccount,
        '../../../modules/reports/actions/update-reports': UpdateReports,
      });
      sinon.stub(AugurJS.augur, 'getRegisterBlockNumber', (address, callback) => {
        if (!callback) return t.blockchain.registerBlockNumber;
        callback(null, t.blockchain.registerBlockNumber);
      });
      LoadAccountTrades.loadAccountTrades = sinon.stub().returns({ type: 'LOAD_ACCOUNT_TRADES' });
      LoadBidsAsksHistory.loadBidsAsksHistory = sinon.stub().returns({ type: 'LOAD_BIDS_ASKS_HISTORY' });
      LoadCreateMarketHistory.loadCreateMarketHistory = sinon.stub().returns({ type: 'LOAD_CREATE_MARKET_HISTORY' });
      LoadEventsWithSubmittedReport.loadEventsWithSubmittedReport = sinon.stub().returns({ type: 'LOAD_EVENTS_WITH_SUBMITTED_REPORT' });
      LoadFundingHistory.loadFundingHistory = sinon.stub().returns({ type: 'LOAD_FUNDING_HISTORY' });
      LoadFundingHistory.loadTransferHistory = sinon.stub().returns({ type: 'LOAD_TRANSFER_HISTORY' });
      LoadReportingHistory.loadReportingHistory = sinon.stub().returns({ type: 'LOAD_REPORTING_HISTORY' });
      SyncBranch.syncBranch = sinon.stub().returns({ type: 'SYNC_BRANCH' });
      sinon.stub(UpdateAssets, 'updateAssets', callback => (dispatch) => {
        dispatch({ type: 'UPDATE_ASSETS' });
        if (callback) callback(null, t.blockchain.balances);
      });
      sinon.stub(UpdateLoginAccount, 'updateLoginAccount', data => (dispatch) => {
        dispatch({ type: 'UPDATE_LOGIN_ACCOUNT', data });
      });
      UpdateReports.clearReports = sinon.stub().returns({ type: 'CLEAR_REPORTS' });
      UpdateReports.updateReports = sinon.stub().returns({ type: 'UPDATE_REPORTS' });
      store.dispatch(action.loadFullAccountData(t.params.account, t.params.callback));
      t.assertions(store.getActions());
      store.clearActions();
    });
  };
  test({
    description: 'no account; no callback',
    params: {
      account: null,
      callback: undefined
    },
    blockchain: {
      registerBlockNumber: null
    },
    assertions: (actions) => {
      assert.deepEqual(actions, []);
    }
  });
  test({
    description: 'no account; with callback',
    params: {
      account: null,
      callback: (err, balances) => {
        assert.deepEqual(err, { message: 'account required' });
        assert.isUndefined(balances);
      }
    },
    blockchain: {
      registerBlockNumber: null
    },
    assertions: (actions) => {
      assert.deepEqual(actions, []);
    }
  });
  test({
    description: 'account without address; no callback',
    params: {
      account: { name: 'jack' },
      callback: undefined
    },
    blockchain: {
      registerBlockNumber: null
    },
    assertions: (actions) => {
      assert.deepEqual(actions, [{
        type: 'UPDATE_LOGIN_ACCOUNT',
        data: { name: 'jack' }
      }]);
    }
  });
  test({
    description: 'account without address; with callback',
    params: {
      account: { name: 'jack' },
      callback: (err, balances) => {
        assert.isNull(err);
        assert.isUndefined(balances);
      }
    },
    blockchain: {
      registerBlockNumber: null
    },
    assertions: (actions) => {
      assert.deepEqual(actions, [{
        type: 'UPDATE_LOGIN_ACCOUNT',
        data: { name: 'jack' }
      }]);
    }
  });
  test({
    description: 'account address; no callback; no register block number',
    params: {
      account: {
        address: '0xb0b'
      },
      callback: undefined
    },
    blockchain: {
      registerBlockNumber: null
    },
    assertions: (actions) => {
      assert.deepEqual(actions, [{
        type: 'UPDATE_LOGIN_ACCOUNT',
        data: { address: '0xb0b' }
      }, {
        type: 'UPDATE_ASSETS'
      }, {
        type: 'LOAD_ACCOUNT_TRADES'
      }, {
        type: 'LOAD_BIDS_ASKS_HISTORY'
      }, {
        type: 'LOAD_FUNDING_HISTORY'
      }, {
        type: 'LOAD_TRANSFER_HISTORY'
      }, {
        type: 'LOAD_CREATE_MARKET_HISTORY'
      }, {
        type: 'CLEAR_REPORTS'
      }, {
        type: 'LOAD_REPORTING_HISTORY'
      }, {
        type: 'LOAD_EVENTS_WITH_SUBMITTED_REPORT'
      }, {
        type: 'SYNC_BRANCH'
      }]);
    }
  });
  test({
    description: 'account with address, loginID, name, isUnlocked, airbitzAccount; no callback; no register block number',
    params: {
      account: {
        address: '0xb0b',
        loginID: 'loginID',
        name: 'jack',
        isUnlocked: true,
        airbitzAccount: { username: 'jack' }
      },
      callback: undefined
    },
    blockchain: {
      registerBlockNumber: null
    },
    assertions: (actions) => {
      assert.deepEqual(actions, [{
        type: 'UPDATE_LOGIN_ACCOUNT',
        data: { isUnlocked: true }
      }, {
        type: 'UPDATE_LOGIN_ACCOUNT',
        data: { loginID: 'loginID' }
      }, {
        type: 'UPDATE_LOGIN_ACCOUNT',
        data: { name: 'jack' }
      }, {
        type: 'UPDATE_LOGIN_ACCOUNT',
        data: { airbitzAccount: { username: 'jack' } }
      }, {
        type: 'UPDATE_LOGIN_ACCOUNT',
        data: { address: '0xb0b' }
      }, {
        type: 'UPDATE_ASSETS'
      }, {
        type: 'LOAD_ACCOUNT_TRADES'
      }, {
        type: 'LOAD_BIDS_ASKS_HISTORY'
      }, {
        type: 'LOAD_FUNDING_HISTORY'
      }, {
        type: 'LOAD_TRANSFER_HISTORY'
      }, {
        type: 'LOAD_CREATE_MARKET_HISTORY'
      }, {
        type: 'CLEAR_REPORTS'
      }, {
        type: 'LOAD_REPORTING_HISTORY'
      }, {
        type: 'LOAD_EVENTS_WITH_SUBMITTED_REPORT'
      }, {
        type: 'SYNC_BRANCH'
      }]);
    }
  });
  test({
    description: 'account with address and loginID; no callback; no register block number',
    params: {
      account: {
        address: '0xb0b',
        loginID: 'loginID'
      },
      callback: undefined
    },
    blockchain: {
      registerBlockNumber: null
    },
    assertions: (actions) => {
      assert.deepEqual(actions, [{
        type: 'UPDATE_LOGIN_ACCOUNT',
        data: { loginID: 'loginID' }
      }, {
        type: 'UPDATE_LOGIN_ACCOUNT',
        data: { address: '0xb0b' }
      }, {
        type: 'UPDATE_ASSETS'
      }, {
        type: 'LOAD_ACCOUNT_TRADES'
      }, {
        type: 'LOAD_BIDS_ASKS_HISTORY'
      }, {
        type: 'LOAD_FUNDING_HISTORY'
      }, {
        type: 'LOAD_TRANSFER_HISTORY'
      }, {
        type: 'LOAD_CREATE_MARKET_HISTORY'
      }, {
        type: 'CLEAR_REPORTS'
      }, {
        type: 'LOAD_REPORTING_HISTORY'
      }, {
        type: 'LOAD_EVENTS_WITH_SUBMITTED_REPORT'
      }, {
        type: 'SYNC_BRANCH'
      }]);
    }
  });
  test({
    description: 'account with address; no callback; register block number 123',
    params: {
      account: {
        address: '0xb0b'
      },
      callback: undefined
    },
    blockchain: {
      registerBlockNumber: 123
    },
    assertions: (actions) => {
      assert.deepEqual(actions, [{
        type: 'UPDATE_LOGIN_ACCOUNT',
        data: { address: '0xb0b' }
      }, {
        type: 'UPDATE_LOGIN_ACCOUNT',
        data: { registerBlockNumber: 123 }
      }, {
        type: 'UPDATE_ASSETS'
      }, {
        type: 'LOAD_ACCOUNT_TRADES'
      }, {
        type: 'LOAD_BIDS_ASKS_HISTORY'
      }, {
        type: 'LOAD_FUNDING_HISTORY'
      }, {
        type: 'LOAD_TRANSFER_HISTORY'
      }, {
        type: 'LOAD_CREATE_MARKET_HISTORY'
      }, {
        type: 'CLEAR_REPORTS'
      }, {
        type: 'LOAD_REPORTING_HISTORY'
      }, {
        type: 'LOAD_EVENTS_WITH_SUBMITTED_REPORT'
      }, {
        type: 'SYNC_BRANCH'
      }]);
    }
  });
  test({
    description: 'account with address; with callback; register block number 123',
    params: {
      account: {
        address: '0xb0b'
      },
      callback: (err, balances) => {
        assert.isNull(err);
        assert.deepEqual(balances, { rep: '1', ether: '2', realEther: '3' });
      }
    },
    blockchain: {
      registerBlockNumber: 123,
      balances: { rep: '1', ether: '2', realEther: '3' }
    },
    assertions: (actions) => {
      assert.deepEqual(actions, [{
        type: 'UPDATE_LOGIN_ACCOUNT',
        data: { address: '0xb0b' }
      }, {
        type: 'UPDATE_LOGIN_ACCOUNT',
        data: { registerBlockNumber: 123 }
      }, {
        type: 'UPDATE_ASSETS'
      }, {
        type: 'LOAD_ACCOUNT_TRADES'
      }, {
        type: 'LOAD_BIDS_ASKS_HISTORY'
      }, {
        type: 'LOAD_FUNDING_HISTORY'
      }, {
        type: 'LOAD_TRANSFER_HISTORY'
      }, {
        type: 'LOAD_CREATE_MARKET_HISTORY'
      }, {
        type: 'CLEAR_REPORTS'
      }, {
        type: 'LOAD_REPORTING_HISTORY'
      }, {
        type: 'LOAD_EVENTS_WITH_SUBMITTED_REPORT'
      }, {
        type: 'SYNC_BRANCH'
      }]);
    }
  });
});
