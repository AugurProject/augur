import { describe, it } from 'mocha';
// import { assert } from 'chai';
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

      LoadAccountTrades.loadAccountTrades = sinon.stub().returns({ type: 'LOAD_ACCOUNT_TRADES' });
      LoadBidsAsksHistory.loadBidsAsksHistory = sinon.stub().returns({ type: 'LOAD_BIDS_ASKS_HISTORY' });
      LoadCreateMarketHistory.loadCreateMarketHistory = sinon.stub().returns({ type: 'LOAD_CREATE_MARKET_HISTORY' });
      LoadFundingHistory.loadFundingHistory = sinon.stub().returns({ type: 'LOAD_FUNDING_HISTORY' });
      LoadFundingHistory.loadTransferHistory = sinon.stub().returns({ type: 'LOAD_TRANSFER_HISTORY' });
      LoadReportingHistory.loadReportingHistory = sinon.stub().returns({ type: 'LOAD_REPORTING_HISTORY' });
      SyncBranch.syncBranch = sinon.stub().returns({ type: 'SYNC_BRANCH' });
      UpdateReports.clearReports = sinon.stub().returns({ type: 'CLEAR_REPORTS' });

      const action = proxyquire('../../../src/modules/auth/actions/load-account-history.js', {
        '../../my-positions/actions/load-account-trades': LoadAccountTrades,
        '../../bids-asks/actions/load-bids-asks-history': LoadBidsAsksHistory,
        '../../create-market/actions/load-create-market-history': LoadCreateMarketHistory,
        '../../ccount/actions/load-funding-history': LoadFundingHistory,
        '../../my-reports/actions/load-reporting-history': LoadReportingHistory,
        '../../branch/actions/sync-branch': SyncBranch,
        '../../reports/actions/update-reports': UpdateReports
      });

      store.dispatch(action.loadAccountHistory());
      t.assertions(store.getActions());
      store.clearActions();
    });
  };
  test({
    description: 'load account history sequence',
    state: {
      loginAccount: {
        registerBlockNumber: 123456
      },
      blockchain: {
        currentBlockNumber: 123457
      },
      branch: {
        id: 1010101
      },
      transactionsOldestLoadedBlock: 123456
    },
    assertions: (actions) => {
  //     assert.deepEqual(actions, [{
  //       type: 'LOAD_ACCOUNT_TRADES'
  //     }, {
  //       type: 'LOAD_BIDS_ASKS_HISTORY'
  //     }, {
  //       type: 'LOAD_FUNDING_HISTORY'
  //     }, {
  //       type: 'LOAD_TRANSFER_HISTORY'
  //     }, {
  //       type: 'LOAD_CREATE_MARKET_HISTORY'
  //     }, {
  //       type: 'CLEAR_REPORTS'
  //     }, {
  //       type: 'LOAD_REPORTING_HISTORY'
  //     }, {
  //       type: 'SYNC_BRANCH'
  //     }]);
    }
  });
});
