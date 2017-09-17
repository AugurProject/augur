import { describe, it } from 'mocha';
import chai, { assert } from 'chai';
import chaiSubset from 'chai-subset';
import sinon from 'sinon';
import proxyquire from 'proxyquire';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';

import BigNumber from 'bignumber.js';
import { strip0xPrefix } from 'speedomatic';

import { formatEther, formatEtherTokens, formatRep, formatShares } from 'utils/format-number';
import { formatDate } from 'utils/format-date';

import {
  constructBasicTransaction,
  constructDefaultTransaction,
  constructApprovalTransaction,
  constructRegistrationTransaction,
  constructTransferTransaction
} from 'modules/transactions/actions/construct-transaction';

import { CREATE_MARKET, SUBMIT_REPORT, SELL, CANCEL_ORDER } from 'modules/transactions/constants/types';
import { BINARY } from 'modules/markets/constants/market-types';

chai.use(chaiSubset);

describe('modules/transactions/actions/contruct-transaction.js', () => {
  proxyquire.noPreserveCache().noCallThru();

  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);

  const MOCK_ACTION_TYPES = {
    LOAD_MARKET_THEN_RETRY_CONVERSION: 'LOAD_MARKET_THEN_RETRY_CONVERSION',
    LOOKUP_EVENT_MARKETS_THEN_RETRY_CONVERSION: 'LOOKUP_EVENT_MARKETS_THEN_RETRY_CONVERSION',
    UPDATE_MARKETS_WITH_ACCOUNT_REPORT_DATA: 'UPDATE_MARKETS_WITH_ACCOUNT_REPORT_DATA',
    CONSTRUCT_TAKE_ORDER_TRANSACTION: 'CONSTRUCT_TAKE_ORDER_TRANSACTION',
    CONSTRUCT_MAKE_ORDER_TRANSACTION: 'CONSTRUCT_MAKE_ORDER_TRANSACTION',
    CONSTRUCT_CANCEL_ORDER_TRANSACTION: 'CONSTRUCT_CANCEL_ORDER_TRANSACTION',
    CONSTRUCT_PAYOUT_TRANSACTION: 'CONSTRUCT_PAYOUT_TRANSACTION',
    CONSTRUCT_MARKET_TRANSACTION: 'CONSTRUCT_MARKET_TRANSACTION',
    CONSTRUCT_REPORTING_TRANSACTION: 'CONSTRUCT_REPORTING_TRANSACTION'
  };

  const mockRetryConversion = {
    loadMarketThenRetryConversion: sinon.stub().returns({
      type: MOCK_ACTION_TYPES.LOAD_MARKET_THEN_RETRY_CONVERSION
    })
  };

  describe('loadDataForMarketTransaction', () => {
    const action = proxyquire('../../../src/modules/transactions/actions/construct-transaction', {
      './retry-conversion': mockRetryConversion
    });

    const test = (t) => {
      it(t.description, () => {
        const store = mockStore(t.state || {});

        t.assertions(store);
      });
    };

    test({
      description: `should return expected actions with no loaded markets`,
      state: {
        marketsData: {}
      },
      assertions: (store) => {
        const label = 'label';
        const log = {
          market: '0xMARKETID'
        };
        const isRetry = false;
        const callback = () => {};

        store.dispatch(action.loadDataForMarketTransaction(label, log, isRetry, callback));

        const actual = store.getActions();

        const expected = [
          {
            type: MOCK_ACTION_TYPES.LOAD_MARKET_THEN_RETRY_CONVERSION
          }
        ];

        assert.deepEqual(actual, expected, `Didn't return the expected actions`);
      }
    });

    test({
      description: `should return expected actions with no loaded markets AND isRetry`,
      state: {
        marketsData: {}
      },
      assertions: (store) => {
        const label = 'label';
        const log = {
          market: '0xMARKETID'
        };
        const isRetry = true;
        const callback = sinon.spy();

        store.dispatch(action.loadDataForMarketTransaction(label, log, isRetry, callback));

        assert.isTrue(callback.calledOnce, `Didn't call callback once as expected`);
      }
    });

    test({
      description: `should return expected actions with loaded markets`,
      state: {
        marketsData: {
          '0xMARKETID': {
            description: 'market is loaded'
          }
        }
      },
      assertions: (store) => {
        const label = 'label';
        const log = {
          market: '0xMARKETID'
        };
        const isRetry = false;
        const callback = () => ({
          type: MOCK_ACTION_TYPES.CALLBACK
        });

        const actual = store.dispatch(action.loadDataForMarketTransaction(label, log, isRetry, callback));

        const expected = {
          description: 'market is loaded'
        };

        assert.deepEqual(actual, expected, `Didn't return the expected object`);
      }
    });
  });

  describe('loadDataForReportingTransaction', () => {
    const action = proxyquire('../../../src/modules/transactions/actions/construct-transaction', {
      './retry-conversion': mockRetryConversion
    });

    const test = (t) => {
      it(t.description, () => {
        const store = mockStore(t.state || {});

        t.assertions(store);
      });
    };

    test({
      description: `should dispatch the expected actions with no markets loaded and no eventMarketMap`,
      state: {
        marketsData: {},
        outcomesData: {}
      },
      assertions: (store) => {
        const label = 'label';
        const log = {
          market: '0xMARKETID'
          // Lack of event market map is mocked by excluding the event
        };
        const isRetry = false;
        const callback = () => {};

        store.dispatch(action.loadDataForReportingTransaction(label, log, isRetry, callback));

        const actual = store.getActions();

        const expected = [
          {
            type: MOCK_ACTION_TYPES.LOAD_MARKET_THEN_RETRY_CONVERSION
          }
        ];

        assert.deepEqual(actual, expected, `Didn't return the expected actions`);
      }
    });

    test({
      description: `should dispatch the expected actions with no markets loaded and no eventMarketMap and isRetry`,
      state: {
        marketsData: {},
        outcomesData: {}
      },
      assertions: (store) => {
        const label = 'label';
        const log = {
          market: '0xMARKETID'
          // Lack of event market map is mocked by excluding the event
        };
        const isRetry = true;
        const callback = sinon.stub();

        store.dispatch(action.loadDataForReportingTransaction(label, log, isRetry, callback));

        assert.isTrue(callback.calledOnce, `Didn't call callback once as expected`);
      }
    });

    test({
      description: `should dispatch the expected actions with no markets loaded and with an eventMarketMap`,
      state: {
        marketsData: {},
        outcomesData: {}
      },
      assertions: (store) => {
        const label = 'label';
        const log = {
          market: '0xMARKETID',
          event: '0xEVENTID'
        };
        const isRetry = false;
        const callback = () => {};

        store.dispatch(action.loadDataForReportingTransaction(label, log, isRetry, callback));

        const actual = store.getActions();

        const expected = [
          {
            type: MOCK_ACTION_TYPES.LOAD_MARKET_THEN_RETRY_CONVERSION
          }
        ];

        assert.deepEqual(actual, expected, `Didn't return the expected actions`);
      }
    });

    test({
      description: `should dispatch the expected actions with no markets loaded and with an eventMarketMap and isRetry`,
      state: {
        marketsData: {},
        outcomesData: {}
      },
      assertions: (store) => {
        const label = 'label';
        const log = {
          market: '0xMARKETID',
          event: '0xEVENTID'
        };
        const isRetry = true;
        const callback = sinon.stub();

        store.dispatch(action.loadDataForReportingTransaction(label, log, isRetry, callback));

        assert.isTrue(callback.calledOnce, `Didn't call callback once as expected`);
      }
    });

    test({
      description: `should return the expected object with markets loaded and with an eventMarketMap`,
      state: {
        marketsData: {
          '0xMARKETID': {
            description: 'testing'
          }
        },
        outcomesData: {
          '0xMARKETID': {}
        }
      },
      assertions: (store) => {
        const label = 'label';
        const log = {
          market: '0xMARKETID',
          event: '0xEVENTID'
        };
        const isRetry = false;
        const callback = sinon.stub();

        const result = store.dispatch(action.loadDataForReportingTransaction(label, log, isRetry, callback));

        const expected = {
          marketID: '0xMARKETID',
          market: {
            description: 'testing'
          },
          outcomes: {}
        };

        assert.deepEqual(result, expected, `Didn't return the expected actions`);
      }
    });
  });

  describe('constructBasicTransaction', () => {
    const test = t => it(t.description, () => {
      const store = mockStore();
      t.assertions(store);
    });

    test({
      description: 'should return the expected object with no arguments passed',
      assertions: (store) => {
        const actual = store.dispatch(constructBasicTransaction());

        const expected = {
          hash: undefined,
          status: undefined
        };

        assert.deepEqual(actual, expected, `Didn't return the expected object`);
      }
    });

    test({
      description: 'should return the expected object with just hash and status passed',
      assertions: (store) => {
        const hash = '0xHASH';
        const status = 'status';

        const actual = store.dispatch(constructBasicTransaction(hash, status));

        const expected = {
          hash,
          status
        };

        assert.deepEqual(actual, expected, `Didn't return the expected object`);
      }
    });

    test({
      description: 'should return the expected object with all arguments passed',
      assertions: (store) => {
        const hash = '0xHASH';
        const status = 'status';
        const blockNumber = 123456;
        const timestamp = 1491843278;
        const gasFees = 0.001;


        const actual = store.dispatch(constructBasicTransaction(hash, status, blockNumber, timestamp, gasFees));

        const expected = {
          hash,
          status,
          blockNumber,
          timestamp: formatDate(new Date(timestamp * 1000)),
          gasFees: formatEther(gasFees)
        };

        assert.deepEqual(actual, expected, `Didn't return the expected object`);
      }
    });
  });

  describe('constructDefaultTransaction', () => {
    const test = t => it(t.description, () => t.assertions());

    test({
      description: 'should return the expected object',
      assertions: () => {
        const label = 'transaction';
        const log = {
          message: 'log message',
          description: 'log description'
        };

        const actual = constructDefaultTransaction(label, log);

        const expected = {
          data: {},
          type: label,
          message: 'log message',
          description: 'log description'
        };

        assert.deepEqual(actual, expected, `Didn't return the expected object`);
      }
    });
  });

  describe('constructApprovalTransaction', () => {
    const test = t => it(t.description, () => t.assertions());

    test({
      description: 'should return the expected object with inProgress false',
      assertions: () => {
        const log = {
          _sender: '0xSENDER',
          inProgress: false
        };

        const actual = constructApprovalTransaction(log);

        const expected = {
          data: {},
          type: 'Approved to Send Reputation',
          description: `Approve ${log._spender} to send Reputation`,
          message: 'approved'
        };

        assert.deepEqual(actual, expected, `Didn't return the expected object`);
      }
    });

    test({
      description: 'should return the expected object with inProgress true',
      assertions: () => {
        const log = {
          _sender: '0xSENDER',
          inProgress: true
        };

        const actual = constructApprovalTransaction(log);

        const expected = {
          data: {},
          type: 'Approved to Send Reputation',
          description: `Approve ${log._spender} to send Reputation`,
          message: 'approving'
        };

        assert.deepEqual(actual, expected, `Didn't return the expected object`);
      }
    });
  });

  describe('constructRegistrationTransaction', () => {
    const test = t => it(t.description, () => t.assertions());

    test({
      description: `should return the expected object with inProgress false`,
      assertions: () => {
        const log = {
          inProgress: false,
          sender: '0xSENDER'
        };

        const actual = constructRegistrationTransaction(log);

        const expected = {
          data: {},
          type: 'Register New Account',
          description: `Register account ${log.sender.replace('0x', '')}`,
          message: `saved registration timestamp`
        };

        assert.deepEqual(actual, expected, `Didn't return the expected object`);
      }
    });

    test({
      description: `should return the expected object with inProgress`,
      assertions: () => {
        const log = {
          inProgress: true,
          sender: '0xSENDER'
        };

        const actual = constructRegistrationTransaction(log);

        const expected = {
          data: {},
          type: 'Register New Account',
          description: `Register account ${log.sender.replace('0x', '')}`,
          message: `saving registration timestamp`
        };

        assert.deepEqual(actual, expected, `Didn't return the expected object`);
      }
    });
  });

  describe('constructTransferTransaction', () => {
    const test = t => it(t.description, () => t.assertions());

    test({
      description: `should return the expected object with _from equal to address and _to not equal to address and inProgress false`,
      assertions: () => {
        const address = '0xUSERADDRESS';
        const log = {
          _from: '0xUSERADDRESS',
          _to: '0xNOTUSERADDRESS',
          inProgress: false,
          _value: '10'
        };

        const actual = constructTransferTransaction(log, address);

        const expected = {
          data: {
            balances: [
              {
                change: formatRep(new BigNumber(log._value, 10).neg(), { positiveSign: true })
              }
            ]
          },
          type: 'Send Reputation',
          description: `Send Reputation to ${strip0xPrefix(log._to)}`,
          message: 'sent REP'
        };

        assert.deepEqual(actual, expected, `Didn't return the expected object`);
      }
    });

    test({
      description: `should return the expected object with _from equal to address and _to not equal to address and inProgress`,
      assertions: () => {
        const address = '0xUSERADDRESS';
        const log = {
          _from: '0xUSERADDRESS',
          _to: '0xNOTUSERADDRESS',
          inProgress: true,
          _value: '10'
        };

        const actual = constructTransferTransaction(log, address);

        const expected = {
          data: {
            balances: [
              {
                change: formatRep(new BigNumber(log._value, 10).neg(), { positiveSign: true })
              }
            ]
          },
          type: 'Send Reputation',
          description: `Send Reputation to ${strip0xPrefix(log._to)}`,
          message: 'sending REP'
        };

        assert.deepEqual(actual, expected, `Didn't return the expected object`);
      }
    });

    test({
      description: `should return the expected object with _from equal to address and _to not equal to address and inProgress false`,
      assertions: () => {
        const address = '0xUSERADDRESS';
        const log = {
          _from: '0xNOTUSERADDRESS',
          _to: '0xUSERADDRESS',
          inProgress: false,
          _value: '10'
        };

        const actual = constructTransferTransaction(log, address);

        const expected = {
          data: {
            balances: [
              {
                change: formatRep(new BigNumber(log._value, 10), { positiveSign: true })
              }
            ]
          },
          type: 'Receive Reputation',
          description: `Receive Reputation from ${strip0xPrefix(log._from)}`,
          message: 'received REP'
        };

        assert.deepEqual(actual, expected, `Didn't return the expected object`);
      }
    });

    test({
      description: `should return the expected object with _from equal to address and _to not equal to address and inProgress`,
      assertions: () => {
        const address = '0xUSERADDRESS';
        const log = {
          _from: '0xNOTUSERADDRESS',
          _to: '0xUSERADDRESS',
          inProgress: true,
          _value: '10'
        };

        const actual = constructTransferTransaction(log, address);

        const expected = {
          data: {
            balances: [
              {
                change: formatRep(new BigNumber(log._value, 10), { positiveSign: true })
              }
            ]
          },
          type: 'Receive Reputation',
          description: `Receive Reputation from ${strip0xPrefix(log._from)}`,
          message: 'receiving REP'
        };

        assert.deepEqual(actual, expected, `Didn't return the expected object`);
      }
    });
  });

  describe('constructCreateMarketTransaction', () => {
    const action = require('../../../src/modules/transactions/actions/construct-transaction');

    const test = t => it(t.description, () => t.assertions());

    test({
      description: `should return the expected object with inProgress false`,
      assertions: () => {
        const log = {
          inProgress: false,
          marketCreationFee: '10',
          marketID: '0xMARKETID',
          validityBond: '10',
          topic: 'Testing'
        };
        const description = 'test description~|>one|two|three';

        const actual = action.constructCreateMarketTransaction(log, description);

        const expected = {
          data: {
            marketID: log.marketID
          },
          type: CREATE_MARKET,
          description: 'test description',
          topic: 'Testing',
          marketCreationFee: formatEtherTokens(log.marketCreationFee),
          bond: {
            label: 'event validity',
            value: formatEtherTokens(log.validityBond)
          },
          message: 'created market'
        };

        assert.deepEqual(actual, expected, `Didn't return the expected object`);
      }
    });

    test({
      description: `should return the expected object with inProgress true`,
      assertions: () => {
        const log = {
          inProgress: true,
          marketCreationFee: '10',
          marketID: '0xMARKETID',
          validityBond: '10',
          topic: 'Testing'
        };
        const description = 'test description~|>one|two|three';

        const actual = action.constructCreateMarketTransaction(log, description);

        const expected = {
          data: {
            marketID: log.marketID
          },
          type: CREATE_MARKET,
          description: 'test description',
          topic: 'Testing',
          marketCreationFee: formatEtherTokens(log.marketCreationFee),
          bond: {
            label: 'event validity',
            value: formatEtherTokens(log.validityBond)
          },
          message: 'creating market'
        };

        assert.deepEqual(actual, expected, `Didn't return the expected object`);
      }
    });
  });

  describe('constructPayoutTransaction', () => {
    const action = require('../../../src/modules/transactions/actions/construct-transaction');

    const test = t => it(t.description, () => t.assertions());

    test({
      description: `should return the expected object with no cashPayout and no log.market and inProgress false`,
      assertions: () => {
        const log = {
          shares: '10',
          inProgress: false
        };
        const market = {
          description: 'test description'
        };

        const actual = action.constructPayoutTransaction(log, market);

        const expected = {
          data: {
            shares: '10',
            marketID: null
          },
          type: 'Claim Trading Payout',
          description: 'test description',
          message: `closed out ${formatShares(log.shares).full}`
        };

        assert.deepEqual(actual, expected, `Didn't return the expected object`);
      }
    });

    test({
      description: `should return the expected object with no cashPayout and log.market and inProgress false`,
      assertions: () => {
        const log = {
          shares: '10',
          inProgress: false,
          market: '0xMARKETID'
        };
        const market = {
          description: 'test description'
        };

        const actual = action.constructPayoutTransaction(log, market);

        const expected = {
          data: {
            shares: '10',
            marketID: '0xMARKETID'
          },
          type: 'Claim Trading Payout',
          description: 'test description',
          message: `closed out ${formatShares(log.shares).full}`
        };

        assert.deepEqual(actual, expected, `Didn't return the expected object`);
      }
    });

    test({
      description: `should return the expected object with cashPayout and log.market and inProgress false`,
      assertions: () => {
        const log = {
          shares: '10',
          inProgress: false,
          market: '0xMARKETID',
          cashPayout: '10',
          cashBalance: '10'
        };
        const market = {
          description: 'test description'
        };

        const actual = action.constructPayoutTransaction(log, market);

        const expected = {
          data: {
            shares: '10',
            marketID: '0xMARKETID',
            balances: [
              {
                change: formatEtherTokens(log.cashPayout, { positiveSign: true }),
                balance: formatEtherTokens(log.cashBalance)
              }
            ]
          },
          type: 'Claim Trading Payout',
          description: 'test description',
          message: `closed out ${formatShares(log.shares).full}`
        };

        assert.deepEqual(actual, expected, `Didn't return the expected object`);
      }
    });
  });

  describe('constructSubmitReportTransaction', () => {
    const mockReportableOutcomes = {
      formatReportedOutcome: sinon.stub().returns('formatted reported outcome')
    };

    const mockUpdateEventsWithAccountReportData = {
      updateMarketsWithAccountReportData: sinon.stub().returns({
        type: MOCK_ACTION_TYPES.UPDATE_MARKETS_WITH_ACCOUNT_REPORT_DATA
      })
    };

    const action = proxyquire('../../../src/modules/transactions/actions/construct-transaction', {
      '../../reports/selectors/reportable-outcomes': mockReportableOutcomes,
      '../../my-reports/actions/update-markets-with-account-report-data': mockUpdateEventsWithAccountReportData
    });

    const test = t => it(t.description, () => {
      const store = mockStore();
      t.assertions(store);
    });

    test({
      description: `should return the expected object with inProgress`,
      assertions: () => {
        const log = {
          inProgress: true
        };
        const marketID = '0xMARKETID';
        const market = {
          description: 'test description'
        };

        const result = action.constructSubmitReportTransaction(log, marketID, market);

        const expectedResult = {
          data: {
            marketID,
            market,
            reportedOutcomeID: 'formatted reported outcome',
            outcome: {
              name: 'formatted reported outcome'
            }
          },
          type: SUBMIT_REPORT,
          description: market.description,
          message: 'revealing report: formatted reported outcome'
        };

        assert.deepEqual(result, expectedResult, `Didn't return the expected object`);
      }
    });
  });

  describe('constructCancelOrderTransaction', () => {
    const action = require('../../../src/modules/transactions/actions/construct-transaction');

    let trade = {
      transactionHash: '0xHASH',
      orderId: '0xORDERID',
      tradeGroupID: '0xTRADEGROUPID',
      price: '0.1',
      amount: '2',
      maker: false,
      settlementFee: '0.01',
      type: SELL,
      timestamp: 1491843278,
      blockNumber: 123456,
      gasFees: 0.001,
      inProgress: false,
      cashRefund: '10'
    };
    const marketID = '0xMARKETID';
    const marketType = BINARY;
    const description = 'test description';
    const outcomeID = '1';
    const status = 'testing';

    const test = t => it(t.description, () => {
      const store = mockStore();
      t.assertions(store);
    });

    test({
      description: `should return the expected object with inProgress false`,
      assertions: (store) => {
        const actual = store.dispatch(action.constructCancelOrderTransaction(trade, marketID, marketType, description, outcomeID, null, status));

        const price = formatEtherTokens(trade.price);
        const shares = formatShares(trade.amount);

        const expected = {
          '0xHASH': {
            type: CANCEL_ORDER,
            status,
            description,
            data: {
              order: {
                type: trade.type,
                shares
              },
              marketType,
              outcome: {
                name: outcomeID
              },
              outcomeID,
              marketID
            },
            message: `canceled order to ${trade.type} ${shares.full} for ${price.full} each`,
            numShares: shares,
            noFeePrice: price,
            avgPrice: price,
            timestamp: formatDate(new Date(trade.timestamp * 1000)),
            hash: trade.transactionHash,
            totalReturn: formatEtherTokens(trade.cashRefund),
            gasFees: formatEther(trade.gasFees),
            blockNumber: trade.blockNumber,
            orderId: trade.orderId
          }
        };

        assert.deepEqual(actual, expected, `Didn't return the expected object`);
      }
    });

    test({
      description: `should return the expected object with inProgress false`,
      assertions: (store) => {
        trade = {
          ...trade,
          inProgress: true
        };

        const actual = store.dispatch(action.constructCancelOrderTransaction(trade, marketID, marketType, description, outcomeID, null, status));

        const price = formatEtherTokens(trade.price);
        const shares = formatShares(trade.amount);

        const expected = {
          '0xHASH': {
            type: CANCEL_ORDER,
            status,
            description,
            data: {
              order: {
                type: trade.type,
                shares
              },
              marketType,
              outcome: {
                name: outcomeID
              },
              outcomeID,
              marketID
            },
            message: `canceling order to ${trade.type} ${shares.full} for ${price.full} each`,
            numShares: shares,
            noFeePrice: price,
            avgPrice: price,
            timestamp: formatDate(new Date(trade.timestamp * 1000)),
            hash: trade.transactionHash,
            totalReturn: null,
            gasFees: formatEther(trade.gasFees),
            blockNumber: trade.blockNumber,
            orderId: trade.orderId
          }
        };

        assert.deepEqual(actual, expected, `Didn't return the expected object`);
      }
    });
  });

  describe('constructTradingTransaction', () => {
    const constructTransaction = require('../../../src/modules/transactions/actions/construct-transaction');

    constructTransaction.__set__('constructTakeOrderTransaction', sinon.stub().returns({
      type: MOCK_ACTION_TYPES.CONSTRUCT_TAKE_ORDER_TRANSACTION
    }));
    constructTransaction.__set__('constructMakeOrderTransaction', sinon.stub().returns({
      type: MOCK_ACTION_TYPES.CONSTRUCT_MAKE_ORDER_TRANSACTION
    }));
    constructTransaction.__set__('constructCancelOrderTransaction', sinon.stub().returns({
      type: MOCK_ACTION_TYPES.CONSTRUCT_CANCEL_ORDER_TRANSACTION
    }));

    const test = t => it(t.description, () => {
      const store = mockStore(t.state);
      t.assertions(store);
    });

    test({
      description: `should dispatch the expected actions for label 'TakeOrder'`,
      state: {
        marketsData: {
          '0xMARKETID': {}
        },
        outcomesData: {}
      },
      assertions: (store) => {
        store.dispatch(constructTransaction.constructTradingTransaction('TakeOrder', {}, '0xMARKETID'));

        const actual = store.getActions();

        const expected = [
          {
            type: MOCK_ACTION_TYPES.CONSTRUCT_TAKE_ORDER_TRANSACTION
          }
        ];

        assert.deepEqual(actual, expected, `Didn't dispatch the expected actions`);
      }
    });

    test({
      description: `should dispatch the expected actions for label 'MakeOrder'`,
      state: {
        marketsData: {
          '0xMARKETID': {}
        },
        outcomesData: {}
      },
      assertions: (store) => {
        store.dispatch(constructTransaction.constructTradingTransaction('MakeOrder', {}, '0xMARKETID'));

        const actual = store.getActions();

        const expected = [
          {
            type: MOCK_ACTION_TYPES.CONSTRUCT_MAKE_ORDER_TRANSACTION
          }
        ];

        assert.deepEqual(actual, expected, `Didn't dispatch the expected actions`);
      }
    });

    test({
      description: `should dispatch the expected actions for label 'CancelOrder'`,
      state: {
        marketsData: {
          '0xMARKETID': {}
        },
        outcomesData: {}
      },
      assertions: (store) => {
        store.dispatch(constructTransaction.constructTradingTransaction('CancelOrder', {}, '0xMARKETID'));

        const actual = store.getActions();

        const expected = [
          {
            type: MOCK_ACTION_TYPES.CONSTRUCT_CANCEL_ORDER_TRANSACTION
          }
        ];

        assert.deepEqual(actual, expected, `Didn't dispatch the expected actions`);
      }
    });
  });

  describe('constructMarketTransaction', () => {
    const { __RewireAPI__, constructMarketTransaction } = require('../../../src/modules/transactions/actions/construct-transaction');

    const test = t => it(t.description, () => {
      const store = mockStore();
      t.assertions(store);
    });

    test({
      description: `should call the expected method for label 'Payout'`,
      assertions: (store) => {
        __RewireAPI__.__set__('constructPayoutTransaction', () => 'constructPayoutTransaction');

        const actual = store.dispatch(constructMarketTransaction('Payout'));

        const expected = 'constructPayoutTransaction';

        assert.strictEqual(actual, expected, `Didn't call the expected method`);
      }
    });

    test({
      description: `should dispatch the expected method for default label`,
      assertions: (store) => {
        const actual = store.dispatch(constructMarketTransaction(undefined));

        const expected = null;

        assert.strictEqual(actual, expected, `Didn't return the expected value`);
      }
    });
  });
});
