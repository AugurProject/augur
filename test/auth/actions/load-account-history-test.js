import { describe, it } from 'mocha';
import { assert } from 'chai';
import configureMockStore from 'redux-mock-store';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import thunk from 'redux-thunk';

describe(`modules/auth/actions/load-account-history.js`, () => {
  proxyquire.noPreserveCache();
  const mockStore = configureMockStore([thunk]);
  const test = (t) => {
    it(t.description, () => {
      const store = mockStore(t.state);
      const LoadAccountTrades = {};
      const LoadBidsAsksHistory = {};
      const LoadCreateMarketHistory = {};
      const LoadFundingHistory = {};
      const LoadReportingHistory = {};
      const SyncBranch = {};
      const UpdateReports = {};
      const action = proxyquire('../../../src/modules/auth/actions/load-account-history.js', {
        '../../../modules/my-positions/actions/load-account-trades': LoadAccountTrades,
        '../../../modules/bids-asks/actions/load-bids-asks-history': LoadBidsAsksHistory,
        '../../../modules/create-market/actions/load-create-market-history': LoadCreateMarketHistory,
        '../../../modules/account/actions/load-funding-history': LoadFundingHistory,
        '../../../modules/my-reports/actions/load-reporting-history': LoadReportingHistory,
        '../../../modules/branch/actions/sync-branch': SyncBranch,
        '../../../modules/reports/actions/update-reports': UpdateReports
      });
      LoadAccountTrades.loadAccountTrades = sinon.stub().returns({ type: 'LOAD_ACCOUNT_TRADES' });
      LoadBidsAsksHistory.loadBidsAsksHistory = sinon.stub().returns({ type: 'LOAD_BIDS_ASKS_HISTORY' });
      LoadCreateMarketHistory.loadCreateMarketHistory = sinon.stub().returns({ type: 'LOAD_CREATE_MARKET_HISTORY' });
      LoadFundingHistory.loadFundingHistory = sinon.stub().returns({ type: 'LOAD_FUNDING_HISTORY' });
      LoadFundingHistory.loadTransferHistory = sinon.stub().returns({ type: 'LOAD_TRANSFER_HISTORY' });
      LoadReportingHistory.loadReportingHistory = sinon.stub().returns({ type: 'LOAD_REPORTING_HISTORY' });
      SyncBranch.syncBranch = sinon.stub().returns({ type: 'SYNC_BRANCH' });
      UpdateReports.clearReports = sinon.stub().returns({ type: 'CLEAR_REPORTS' });
      store.dispatch(action.loadAccountHistory());
      t.assertions(store.getActions());
      store.clearActions();
    });
  };
  test({
    description: 'load account history sequence',
    assertions: (actions) => {
      assert.deepEqual(actions, [{
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
        type: 'SYNC_BRANCH'
      }]);
    }
  });
});
