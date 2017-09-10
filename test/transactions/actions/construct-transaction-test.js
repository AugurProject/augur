import { describe, it } from 'mocha';
import chai, { assert } from 'chai';
import chaiSubset from 'chai-subset';
import sinon from 'sinon';
import proxyquire from 'proxyquire';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';

import { augur } from 'services/augurjs';
import speedomatic from 'speedomatic';

import { formatEther, formatEtherTokens, formatRep, formatPercent, formatShares } from 'utils/format-number';
import { formatDate } from 'utils/format-date';

import {
  constructBasicTransaction,
  constructDefaultTransaction,
  constructApprovalTransaction,
  // constructCollectedFeesTransaction,
  constructDepositTransaction,
  constructRegistrationTransaction,
  constructWithdrawTransaction,
  constructTransferTransaction
} from 'modules/transactions/actions/construct-transaction';

import { CREATE_MARKET, SUBMIT_REPORT, BUY, SELL, MATCH_BID, MATCH_ASK, BID, ASK, CANCEL_ORDER } from 'modules/transactions/constants/types';
import { BINARY, SCALAR } from 'modules/markets/constants/market-types';
import { ZERO } from 'modules/trade/constants/numbers';

chai.use(chaiSubset);

describe('modules/transactions/actions/contruct-transaction.js', () => {
  proxyquire.noPreserveCache().noCallThru();

  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);

  const MOCK_ACTION_TYPES = {
    LOAD_MARKET_THEN_RETRY_CONVERSION: 'LOAD_MARKET_THEN_RETRY_CONVERSION',
    LOOKUP_EVENT_MARKETS_THEN_RETRY_CONVERSION: 'LOOKUP_EVENT_MARKETS_THEN_RETRY_CONVERSION',
    UPDATE_EVENTS_WITH_ACCOUNT_REPORT_DATA: 'UPDATE_EVENTS_WITH_ACCOUNT_REPORT_DATA',
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
            type: MOCK_ACTION_TYPES.LOOKUP_EVENT_MARKETS_THEN_RETRY_CONVERSION
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

  // describe('constructCollectedFeesTransaction', () => {
  //   const test = t => it(t.description, () => t.assertions());

  //   test({
  //     description: `should return the expected object with initialRepBalance undefined and no totalReportingRep and no cashFeesCollected and inProgress false`,
  //     assertions: () => {
  //       const log = {
  //         repGain: '1',
  //         inProgress: false,
  //         newRepBalance: '1',
  //         period: 1234,
  //         notReportingBond: '1'
  //       };

  //       const actual = constructCollectedFeesTransaction(log);

  //       const repGain = speedomatic.bignum(log.repGain);
  //       const initialRepBalance = speedomatic.bignum(log.newRepBalance).minus(repGain).toFixed();

  //       const expected = {
  //         data: {},
  //         type: 'Reporting Payment',
  //         description: `Reporting cycle #${log.period}`,
  //         bond: {
  //           label: 'reporting',
  //           value: formatEther(log.notReportingBond)
  //         },
  //         message: `reported with ${formatRep(initialRepBalance).full}`
  //       };

  //       assert.deepEqual(actual, expected, `Didn't return the expected object`);
  //     }
  //   });

  //   test({
  //     description: `should return the expected object with initialRepBalance and no totalReportingRep and no cashFeesCollected and inProgress false`,
  //     assertions: () => {
  //       const log = {
  //         repGain: '1',
  //         inProgress: false,
  //         newRepBalance: '1',
  //         period: 1234,
  //         notReportingBond: '1',
  //         initialRepBalance: '1'
  //       };

  //       const actual = constructCollectedFeesTransaction(log);

  //       const expected = {
  //         data: {},
  //         type: 'Reporting Payment',
  //         description: `Reporting cycle #${log.period}`,
  //         bond: {
  //           label: 'reporting',
  //           value: formatEther(log.notReportingBond)
  //         },
  //         message: `reported with ${formatRep(log.initialRepBalance).full}`
  //       };

  //       assert.deepEqual(actual, expected, `Didn't return the expected object`);
  //     }
  //   });

  //   test({
  //     description: `should return the expected object with initialRepBalance and totalReportingRep equals zero and no cashFeesCollected and inProgress false`,
  //     assertions: () => {
  //       const log = {
  //         repGain: '1',
  //         inProgress: false,
  //         newRepBalance: '1',
  //         period: 1234,
  //         notReportingBond: '1',
  //         initialRepBalance: '1',
  //         totalReportingRep: '0'
  //       };

  //       const actual = constructCollectedFeesTransaction(log);

  //       const expected = {
  //         data: {},
  //         type: 'Reporting Payment',
  //         description: `Reporting cycle #${log.period}`,
  //         bond: {
  //           label: 'reporting',
  //           value: formatEther(log.notReportingBond)
  //         },
  //         message: `reported with ${formatRep(log.initialRepBalance).full}`
  //       };

  //       assert.deepEqual(actual, expected, `Didn't return the expected object`);
  //     }
  //   });

  //   test({
  //     description: `should return the expected object with initialRepBalance and totalReportingRep and no cashFeesCollected and inProgress false`,
  //     assertions: () => {
  //       const log = {
  //         repGain: '1',
  //         inProgress: false,
  //         newRepBalance: '1',
  //         period: 1234,
  //         notReportingBond: '1',
  //         initialRepBalance: '1',
  //         totalReportingRep: '100'
  //       };

  //       const actual = constructCollectedFeesTransaction(log);

  //       const totalReportingRep = speedomatic.bignum(log.totalReportingRep);
  //       const percentRep = formatPercent(speedomatic.bignum(log.initialRepBalance).dividedBy(totalReportingRep).times(100), { decimals: 0 });

  //       const expected = {
  //         data: {},
  //         type: 'Reporting Payment',
  //         description: `Reporting cycle #${log.period}`,
  //         bond: {
  //           label: 'reporting',
  //           value: formatEther(log.notReportingBond)
  //         },
  //         message: `reported with ${formatRep(log.initialRepBalance).full} (${percentRep.full})`
  //       };

  //       assert.deepEqual(actual, expected, `Didn't return the expected object`);
  //     }
  //   });

  //   test({
  //     description: `should return the expected object with initialRepBalance and totalReportingRep and cashFeesCollected and inProgress false`,
  //     assertions: () => {
  //       const log = {
  //         repGain: '1',
  //         inProgress: false,
  //         period: 1234,
  //         notReportingBond: '1',
  //         initialRepBalance: '1',
  //         newRepBalance: '1',
  //         totalReportingRep: '100',
  //         cashFeesCollected: '100',
  //         newCashBalance: '101'
  //       };

  //       const actual = constructCollectedFeesTransaction(log);

  //       const repGain = speedomatic.bignum(log.repGain);

  //       const totalReportingRep = speedomatic.bignum(log.totalReportingRep);
  //       const percentRep = formatPercent(speedomatic.bignum(log.initialRepBalance).dividedBy(totalReportingRep).times(100), { decimals: 0 });

  //       const expected = {
  //         data: {
  //           balances: [
  //             {
  //               change: formatEtherTokens(log.cashFeesCollected, { positiveSign: true }),
  //               balance: formatEtherTokens(log.newCashBalance)
  //             },
  //             {
  //               change: formatRep(repGain, { positiveSign: true }),
  //               balance: formatRep(log.newRepBalance)
  //             }
  //           ]
  //         },
  //         type: 'Reporting Payment',
  //         description: `Reporting cycle #${log.period}`,
  //         bond: {
  //           label: 'reporting',
  //           value: formatEther(log.notReportingBond)
  //         },
  //         message: `reported with ${formatRep(log.initialRepBalance).full} (${percentRep.full})`
  //       };

  //       assert.deepEqual(actual, expected, `Didn't return the expected object`);
  //     }
  //   });

  //   test({
  //     description: `should return the expected object with initialRepBalance and totalReportingRep and cashFeesCollected and inProgress true`,
  //     assertions: () => {
  //       const log = {
  //         repGain: '1',
  //         inProgress: true,
  //         period: 1234,
  //         notReportingBond: '1',
  //         initialRepBalance: '1',
  //         newRepBalance: '1',
  //         totalReportingRep: '100',
  //         cashFeesCollected: '100',
  //         newCashBalance: '101'
  //       };

  //       const actual = constructCollectedFeesTransaction(log);

  //       const repGain = speedomatic.bignum(log.repGain);

  //       const totalReportingRep = speedomatic.bignum(log.totalReportingRep);
  //       const percentRep = formatPercent(speedomatic.bignum(log.initialRepBalance).dividedBy(totalReportingRep).times(100), { decimals: 0 });

  //       const expected = {
  //         data: {
  //           balances: [
  //             {
  //               change: formatEtherTokens(log.cashFeesCollected, { positiveSign: true }),
  //               balance: formatEtherTokens(log.newCashBalance)
  //             },
  //             {
  //               change: formatRep(repGain, { positiveSign: true }),
  //               balance: formatRep(log.newRepBalance)
  //             }
  //           ]
  //         },
  //         type: 'Reporting Payment',
  //         description: `Reporting cycle #${log.period}`,
  //         bond: {
  //           label: 'reporting',
  //           value: formatEther(log.notReportingBond)
  //         },
  //         message: `reporting with ${formatRep(log.initialRepBalance).full} (${percentRep.full})`
  //       };

  //       assert.deepEqual(actual, expected, `Didn't return the expected object`);
  //     }
  //   });
  // });

  describe('constructDepositTransaction', () => {
    const test = t => it(t.description, () => t.assertions());

    test({
      description: `should return the expected object with inProgress false`,
      assertions: () => {
        const log = {
          inProgress: false,
          value: '10'
        };

        const actual = constructDepositTransaction(log);

        const expected = {
          data: {},
          type: 'Deposit Ether',
          description: 'Convert Ether to tradeable Ether token',
          message: `deposited ${formatEtherTokens(log.value).full}`
        };

        assert.deepEqual(actual, expected, `Didn't return the expected object`);
      }
    });

    test({
      description: `should return the expected object with inProgress`,
      assertions: () => {
        const log = {
          inProgress: true,
          value: '10'
        };

        const actual = constructDepositTransaction(log);

        const expected = {
          data: {},
          type: 'Deposit Ether',
          description: 'Convert Ether to tradeable Ether token',
          message: `depositing ${formatEtherTokens(log.value).full}`
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

  describe('constructWithdrawTransaction', () => {
    const test = t => it(t.description, () => t.assertions());

    test({
      description: `should return the expected object with inProgress false`,
      assertions: () => {
        const log = {
          inProgress: false,
          value: '10'
        };

        const actual = constructWithdrawTransaction(log);

        const expected = {
          data: {},
          type: 'Withdraw Ether',
          description: 'Convert tradeable Ether token to Ether',
          message: `withdrew ${formatEtherTokens(log.value).full}`
        };

        assert.deepEqual(actual, expected, `Didn't return the expected object`);
      }
    });

    test({
      description: `should return the expected object with inProgress`,
      assertions: () => {
        const log = {
          inProgress: true,
          value: '10'
        };

        const actual = constructWithdrawTransaction(log);

        const expected = {
          data: {},
          type: 'Withdraw Ether',
          description: 'Convert tradeable Ether token to Ether',
          message: `withdrawing ${formatEtherTokens(log.value).full}`
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
                change: formatRep(speedomatic.bignum(log._value).neg(), { positiveSign: true })
              }
            ]
          },
          type: 'Send Reputation',
          description: `Send Reputation to ${speedomatic.strip0xPrefix(log._to)}`,
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
                change: formatRep(speedomatic.bignum(log._value).neg(), { positiveSign: true })
              }
            ]
          },
          type: 'Send Reputation',
          description: `Send Reputation to ${speedomatic.strip0xPrefix(log._to)}`,
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
                change: formatRep(speedomatic.bignum(log._value), { positiveSign: true })
              }
            ]
          },
          type: 'Receive Reputation',
          description: `Receive Reputation from ${speedomatic.strip0xPrefix(log._from)}`,
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
                change: formatRep(speedomatic.bignum(log._value), { positiveSign: true })
              }
            ]
          },
          type: 'Receive Reputation',
          description: `Receive Reputation from ${speedomatic.strip0xPrefix(log._from)}`,
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
          eventBond: '10',
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
            value: formatEtherTokens(log.eventBond)
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
          eventBond: '10',
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
            value: formatEtherTokens(log.eventBond)
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

  // describe('constructPenalizeTransaction', () => {
  //   const mockReportableOutcomes = {
  //     formatReportedOutcome: sinon.stub().returns('formatted reported outcome')
  //   };

  //   const mockUpdateEventsWithAccountReportData = {
  //     updateEventsWithAccountReportData: sinon.stub().returns({
  //       type: MOCK_ACTION_TYPES.UPDATE_EVENTS_WITH_ACCOUNT_REPORT_DATA
  //     })
  //   };

  //   const action = proxyquire('../../../src/modules/transactions/actions/construct-transaction', {
  //     '../../reports/selectors/reportable-outcomes': mockReportableOutcomes,
  //     '../../my-reports/actions/update-events-with-account-report-data': mockUpdateEventsWithAccountReportData
  //   });

  //   const test = (t) => {
  //     const store = mockStore();
  //     it(t.description, () => {
  //       t.assertions(store);
  //     });
  //   };

  //   test({
  //     description: `should return the expected object and dispatch the expected actions with no repChange and inProgress false and reportValue !== log.outcome`,
  //     assertions: (store) => {
  //       const log = {
  //         reportValue: '1',
  //         outcome: '2'
  //       };
  //       const marketID = '0xMARKETID';
  //       const market = {
  //         description: 'test description'
  //       };

  //       const result = action.constructPenalizeTransaction(log, marketID, market, {}, store.dispatch);

  //       const expectedResult = {
  //         data: {
  //           marketID
  //         },
  //         type: 'Compare Report To Consensus',
  //         description: 'test description',
  //         message: `✘ report formatted reported outcome does not match consensus formatted reported outcome`
  //       };

  //       assert.deepEqual(result, expectedResult, `Didn't return the expected object`);

  //       const actions = store.getActions();

  //       const expectedActions = [
  //         {
  //           type: MOCK_ACTION_TYPES.UPDATE_EVENTS_WITH_ACCOUNT_REPORT_DATA
  //         }
  //       ];

  //       assert.deepEqual(actions, expectedActions, `Didn't dispatch the expected actions`);
  //     }
  //   });

  //   test({
  //     description: `should return the expected object and dispatch the expected actions with repChange equals 0 and inProgress false and reportValue !== log.outcome`,
  //     assertions: (store) => {
  //       const log = {
  //         reportValue: '1',
  //         outcome: '2',
  //         repchange: '0',
  //         oldrep: '2'
  //       };
  //       const marketID = '0xMARKETID';
  //       const market = {
  //         description: 'test description'
  //       };

  //       const result = action.constructPenalizeTransaction(log, marketID, market, {}, store.dispatch);

  //       const expectedResult = {
  //         data: {
  //           marketID,
  //           balances: [
  //             {
  //               change: formatRep(speedomatic.bignum(log.repchange), { positiveSign: true }),
  //               balance: formatRep(2)
  //             }
  //           ]
  //         },
  //         type: 'Compare Report To Consensus',
  //         description: 'test description',
  //         message: `✘ report formatted reported outcome does not match consensus formatted reported outcome`
  //       };

  //       assert.deepEqual(result, expectedResult, `Didn't return the expected object`);

  //       const actions = store.getActions();

  //       const expectedActions = [
  //         {
  //           type: MOCK_ACTION_TYPES.UPDATE_EVENTS_WITH_ACCOUNT_REPORT_DATA
  //         },
  //         {
  //           type: MOCK_ACTION_TYPES.UPDATE_EVENTS_WITH_ACCOUNT_REPORT_DATA
  //         }
  //       ];

  //       assert.deepEqual(actions, expectedActions, `Didn't dispatch the expected actions`);
  //     }
  //   });

  //   test({
  //     description: `should return the expected object and dispatch the expected actions with repChange not equal to 0 and inProgress false and reportValue !== log.outcome`,
  //     assertions: (store) => {
  //       const log = {
  //         reportValue: '1',
  //         outcome: '2',
  //         repchange: '0',
  //         oldrep: '2'
  //       };
  //       const marketID = '0xMARKETID';
  //       const market = {
  //         description: 'test description'
  //       };

  //       const result = action.constructPenalizeTransaction(log, marketID, market, {}, store.dispatch);

  //       const expectedResult = {
  //         data: {
  //           marketID,
  //           balances: [
  //             {
  //               change: formatRep(constants.ZERO, { positiveSign: true }),
  //               balance: formatRep('2')
  //             }
  //           ]
  //         },
  //         type: 'Compare Report To Consensus',
  //         description: 'test description',
  //         message: `✘ report formatted reported outcome does not match consensus formatted reported outcome`
  //       };

  //       assert.deepEqual(result, expectedResult, `Didn't return the expected object`);

  //       const actions = store.getActions();

  //       const expectedActions = [
  //         {
  //           type: MOCK_ACTION_TYPES.UPDATE_EVENTS_WITH_ACCOUNT_REPORT_DATA
  //         },
  //         {
  //           type: MOCK_ACTION_TYPES.UPDATE_EVENTS_WITH_ACCOUNT_REPORT_DATA
  //         }
  //       ];

  //       assert.deepEqual(actions, expectedActions, `Didn't dispatch the expected actions`);
  //     }
  //   });

  //   test({
  //     description: `should return the expected object and dispatch the expected actions with repChange not equal to 0 and inProgress false and reportValue === log.outcome`,
  //     assertions: (store) => {
  //       const log = {
  //         reportValue: '1',
  //         outcome: '1',
  //         repchange: '0',
  //         oldrep: '2'
  //       };
  //       const marketID = '0xMARKETID';
  //       const market = {
  //         description: 'test description'
  //       };

  //       const result = action.constructPenalizeTransaction(log, marketID, market, {}, store.dispatch);

  //       const expectedResult = {
  //         data: {
  //           marketID,
  //           balances: [
  //             {
  //               change: formatRep(constants.ZERO, { positiveSign: true }),
  //               balance: formatRep('2')
  //             }
  //           ]
  //         },
  //         type: 'Compare Report To Consensus',
  //         description: 'test description',
  //         message: `✔ report formatted reported outcome matches consensus`
  //       };

  //       assert.deepEqual(result, expectedResult, `Didn't return the expected object`);

  //       const actions = store.getActions();

  //       const expectedActions = [
  //         {
  //           type: MOCK_ACTION_TYPES.UPDATE_EVENTS_WITH_ACCOUNT_REPORT_DATA
  //         },
  //         {
  //           type: MOCK_ACTION_TYPES.UPDATE_EVENTS_WITH_ACCOUNT_REPORT_DATA
  //         }
  //       ];

  //       assert.deepEqual(actions, expectedActions, `Didn't dispatch the expected actions`);
  //     }
  //   });

  //   test({
  //     description: `should return the expected object and dispatch the expected actions with repChange not equal to 0 and inProgress and reportValue === log.outcome`,
  //     assertions: (store) => {
  //       const log = {
  //         reportValue: '1',
  //         outcome: '1',
  //         repchange: '0',
  //         oldrep: '2',
  //         inProgress: true
  //       };
  //       const marketID = '0xMARKETID';
  //       const market = {
  //         description: 'test description'
  //       };

  //       const result = action.constructPenalizeTransaction(log, marketID, market, {}, store.dispatch);

  //       const expectedResult = {
  //         data: {
  //           marketID,
  //           balances: [
  //             {
  //               change: formatRep(constants.ZERO, { positiveSign: true }),
  //               balance: formatRep('2')
  //             }
  //           ]
  //         },
  //         type: 'Compare Report To Consensus',
  //         description: 'test description',
  //         message: 'comparing report to consensus'
  //       };

  //       assert.deepEqual(result, expectedResult, `Didn't return the expected object`);

  //       const actions = store.getActions();

  //       const expectedActions = [];

  //       assert.deepEqual(actions, expectedActions, `Didn't dispatch the expected actions`);
  //     }
  //   });
  // });

  describe('constructSubmitReportTransaction', () => {
    const mockReportableOutcomes = {
      formatReportedOutcome: sinon.stub().returns('formatted reported outcome')
    };

    const mockUpdateEventsWithAccountReportData = {
      updateEventsWithAccountReportData: sinon.stub().returns({
        type: MOCK_ACTION_TYPES.UPDATE_EVENTS_WITH_ACCOUNT_REPORT_DATA
      })
    };

    const action = proxyquire('../../../src/modules/transactions/actions/construct-transaction', {
      '../../reports/selectors/reportable-outcomes': mockReportableOutcomes,
      '../../my-reports/actions/update-events-with-account-report-data': mockUpdateEventsWithAccountReportData
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

  describe('constructTakeOrderTransaction', () => {
    const action = require('../../../src/modules/transactions/actions/construct-transaction');

    const test = t => it(t.description, () => {
      const store = mockStore();
      t.assertions(store);
    });

    test({
      description: `should return the expected transaction object with necessary data missing`,
      assertions: (store) => {
        const trade = {};

        const actual = store.dispatch(action.constructTakeOrderTransaction(trade));

        const expected = null;

        assert.strictEqual(actual, expected, `Didn't return the expected value`);
      }
    });

    test({
      description: `should return the expected transaction object with maker and type BUY and inProgress false`,
      assertions: (store) => {
        const trade = {
          transactionHash: '0xHASH',
          orderId: '0xORDERID',
          tradeGroupID: '0xTRADEGROUPID',
          price: '0.1',
          amount: '2',
          maker: true,
          makerFee: '0.01',
          type: BUY,
          timestamp: 1491843278,
          blockNumber: 123456,
          gasFees: 0.001
        };
        const marketID = '0xMARKETID';
        const marketType = BINARY;
        const minPrice = '0';
        const description = 'test description';
        const outcomeID = '1';
        const status = 'testing';

        const price = formatEtherTokens(trade.price);
        const shares = formatShares(trade.amount);
        const tradingFees = trade.maker ? speedomatic.bignum(trade.makerFee) : speedomatic.bignum(trade.settlementFee);
        const bnShares = speedomatic.bignum(trade.amount);
        const bnPrice = marketType === SCALAR ? speedomatic.bignum(augur.trading.shrinkScalarPrice(minPrice, trade.price)) : speedomatic.bignum(trade.price);
        const totalCost = bnPrice.times(bnShares).plus(tradingFees);
        const totalReturn = bnPrice.times(bnShares).minus(tradingFees);
        const totalCostPerShare = totalCost.dividedBy(bnShares);

        const actual = store.dispatch(action.constructTakeOrderTransaction(trade, marketID, marketType, minPrice, description, outcomeID, null, status));

        const expected = {
          '0xHASH-0xORDERID': {
            type: MATCH_ASK,
            hash: trade.transactionHash,
            tradeGroupID: trade.tradeGroupID,
            status,
            description,
            data: {
              marketType,
              outcomeName: outcomeID,
              outcomeID,
              marketID
            },
            message: `sold ${shares.full} for ${formatEtherTokens(totalCostPerShare).full} / share`,
            numShares: shares,
            noFeePrice: price,
            avgPrice: price,
            timestamp: formatDate(new Date(trade.timestamp * 1000)),
            tradingFees: formatEtherTokens(tradingFees),
            feePercent: formatPercent(tradingFees.dividedBy(totalCost).times(100)),
            totalCost: undefined,
            totalReturn: formatEtherTokens(totalReturn),
            gasFees: trade.gasFees && speedomatic.bignum(trade.gasFees).gt(ZERO) ? formatEther(trade.gasFees) : null,
            blockNumber: trade.blockNumber
          }
        };

        assert.deepEqual(actual, expected, `Didn't return the expected value`);
      }
    });

    test({
      description: `should return the expected transaction object with maker and type BUY and inProgress`,
      assertions: (store) => {
        const trade = {
          transactionHash: '0xHASH',
          orderId: '0xORDERID',
          tradeGroupID: '0xTRADEGROUPID',
          price: '0.1',
          amount: '2',
          maker: true,
          makerFee: '0.01',
          type: BUY,
          timestamp: 1491843278,
          blockNumber: 123456,
          gasFees: 0.001,
          inProgress: true
        };
        const marketID = '0xMARKETID';
        const marketType = BINARY;
        const minPrice = '0';
        const description = 'test description';
        const outcomeID = '1';
        const status = 'testing';

        const price = formatEtherTokens(trade.price);
        const shares = formatShares(trade.amount);
        const tradingFees = trade.maker ? speedomatic.bignum(trade.makerFee) : speedomatic.bignum(trade.settlementFee);
        const bnShares = speedomatic.bignum(trade.amount);
        const bnPrice = marketType === SCALAR ? speedomatic.bignum(augur.trading.shrinkScalarPrice(minPrice, trade.price)) : speedomatic.bignum(trade.price);
        const totalCost = bnPrice.times(bnShares).plus(tradingFees);
        const totalReturn = bnPrice.times(bnShares).minus(tradingFees);
        const totalCostPerShare = totalCost.dividedBy(bnShares);

        const actual = store.dispatch(action.constructTakeOrderTransaction(trade, marketID, marketType, minPrice, description, outcomeID, null, status));

        const expected = {
          '0xHASH-0xORDERID': {
            type: MATCH_ASK,
            hash: trade.transactionHash,
            tradeGroupID: trade.tradeGroupID,
            status,
            description,
            data: {
              marketType,
              outcomeName: outcomeID,
              outcomeID,
              marketID
            },
            message: `${MATCH_ASK} ${shares.full} for ${formatEtherTokens(totalCostPerShare).full} / share`,
            numShares: shares,
            noFeePrice: price,
            avgPrice: price,
            timestamp: formatDate(new Date(trade.timestamp * 1000)),
            tradingFees: formatEtherTokens(tradingFees),
            feePercent: formatPercent(tradingFees.dividedBy(totalCost).times(100)),
            totalCost: undefined,
            totalReturn: formatEtherTokens(totalReturn),
            gasFees: trade.gasFees && speedomatic.bignum(trade.gasFees).gt(ZERO) ? formatEther(trade.gasFees) : null,
            blockNumber: trade.blockNumber
          }
        };

        assert.deepEqual(actual, expected, `Didn't return the expected value`);
      }
    });

    test({
      description: `should return the expected transaction object with maker and type SELL and inProgress false`,
      assertions: (store) => {
        const trade = {
          transactionHash: '0xHASH',
          orderId: '0xORDERID',
          tradeGroupID: '0xTRADEGROUPID',
          price: '0.1',
          amount: '2',
          maker: true,
          makerFee: '0.01',
          type: SELL,
          timestamp: 1491843278,
          blockNumber: 123456,
          gasFees: 0.001
        };
        const marketID = '0xMARKETID';
        const marketType = BINARY;
        const minPrice = '0';
        const description = 'test description';
        const outcomeID = '1';
        const status = 'testing';

        const price = formatEtherTokens(trade.price);
        const shares = formatShares(trade.amount);
        const tradingFees = trade.maker ? speedomatic.bignum(trade.makerFee) : speedomatic.bignum(trade.settlementFee);
        const bnShares = speedomatic.bignum(trade.amount);
        const bnPrice = marketType === SCALAR ? speedomatic.bignum(augur.trading.shrinkScalarPrice(minPrice, trade.price)) : speedomatic.bignum(trade.price);
        const totalCost = bnPrice.times(bnShares).plus(tradingFees);
        const totalReturn = bnPrice.times(bnShares).minus(tradingFees);
        const totalReturnPerShare = totalReturn.dividedBy(bnShares);

        const actual = store.dispatch(action.constructTakeOrderTransaction(trade, marketID, marketType, minPrice, description, outcomeID, null, status));

        const expected = {
          '0xHASH-0xORDERID': {
            type: MATCH_BID,
            hash: trade.transactionHash,
            tradeGroupID: trade.tradeGroupID,
            status,
            description,
            data: {
              marketType,
              outcomeName: outcomeID,
              outcomeID,
              marketID
            },
            message: `bought ${shares.full} for ${formatEtherTokens(totalReturnPerShare).full} / share`,
            numShares: shares,
            noFeePrice: price,
            avgPrice: price,
            timestamp: formatDate(new Date(trade.timestamp * 1000)),
            tradingFees: formatEtherTokens(tradingFees),
            feePercent: formatPercent(tradingFees.dividedBy(totalCost).times(100)),
            totalCost: formatEtherTokens(totalCost),
            totalReturn: undefined,
            gasFees: formatEther(trade.gasFees),
            blockNumber: trade.blockNumber
          }
        };

        assert.deepEqual(actual, expected, `Didn't return the expected value`);
      }
    });

    test({
      description: `should return the expected transaction object with maker and type SELL and inProgress`,
      assertions: (store) => {
        const trade = {
          transactionHash: '0xHASH',
          orderId: '0xORDERID',
          tradeGroupID: '0xTRADEGROUPID',
          price: '0.1',
          amount: '2',
          maker: true,
          makerFee: '0.01',
          type: SELL,
          timestamp: 1491843278,
          blockNumber: 123456,
          gasFees: 0.001,
          inProgress: true
        };
        const marketID = '0xMARKETID';
        const marketType = BINARY;
        const minPrice = '0';
        const description = 'test description';
        const outcomeID = '1';
        const status = 'testing';

        const price = formatEtherTokens(trade.price);
        const shares = formatShares(trade.amount);
        const tradingFees = trade.maker ? speedomatic.bignum(trade.makerFee) : speedomatic.bignum(trade.settlementFee);
        const bnShares = speedomatic.bignum(trade.amount);
        const bnPrice = marketType === SCALAR ? speedomatic.bignum(augur.trading.shrinkScalarPrice(minPrice, trade.price)) : speedomatic.bignum(trade.price);
        const totalCost = bnPrice.times(bnShares).plus(tradingFees);
        const totalReturn = bnPrice.times(bnShares).minus(tradingFees);
        const totalReturnPerShare = totalReturn.dividedBy(bnShares);

        const actual = store.dispatch(action.constructTakeOrderTransaction(trade, marketID, marketType, minPrice, description, outcomeID, null, status));

        const expected = {
          '0xHASH-0xORDERID': {
            type: MATCH_BID,
            hash: trade.transactionHash,
            tradeGroupID: trade.tradeGroupID,
            status,
            description,
            data: {
              marketType,
              outcomeName: outcomeID,
              outcomeID,
              marketID
            },
            message: `${MATCH_BID} ${shares.full} for ${formatEtherTokens(totalReturnPerShare).full} / share`,
            numShares: shares,
            noFeePrice: price,
            avgPrice: price,
            timestamp: formatDate(new Date(trade.timestamp * 1000)),
            tradingFees: formatEtherTokens(tradingFees),
            feePercent: formatPercent(tradingFees.dividedBy(totalCost).times(100)),
            totalCost: formatEtherTokens(totalCost),
            totalReturn: undefined,
            gasFees: trade.gasFees && speedomatic.bignum(trade.gasFees).gt(ZERO) ? formatEther(trade.gasFees) : null,
            blockNumber: trade.blockNumber
          }
        };

        assert.deepEqual(actual, expected, `Didn't return the expected value`);
      }
    });

    test({
      description: `should return the expected transaction object with taker and type BUY and inProgress false`,
      assertions: (store) => {
        const trade = {
          transactionHash: '0xHASH',
          orderId: '0xORDERID',
          tradeGroupID: '0xTRADEGROUPID',
          price: '0.1',
          amount: '2',
          maker: false,
          settlementFee: '0.01',
          type: BUY,
          timestamp: 1491843278,
          blockNumber: 123456,
          gasFees: 0.001
        };
        const marketID = '0xMARKETID';
        const marketType = BINARY;
        const minPrice = '0';
        const description = 'test description';
        const outcomeID = '1';
        const status = 'testing';

        const price = formatEtherTokens(trade.price);
        const shares = formatShares(trade.amount);
        const tradingFees = trade.maker ? speedomatic.bignum(trade.makerFee) : speedomatic.bignum(trade.settlementFee);
        const bnShares = speedomatic.bignum(trade.amount);
        const bnPrice = marketType === SCALAR ? speedomatic.bignum(augur.trading.shrinkScalarPrice(minPrice, trade.price)) : speedomatic.bignum(trade.price);
        const totalCost = bnPrice.times(bnShares).plus(tradingFees);
        const totalCostPerShare = totalCost.dividedBy(bnShares);

        const actual = store.dispatch(action.constructTakeOrderTransaction(trade, marketID, marketType, minPrice, description, outcomeID, null, status));

        const expected = {
          '0xHASH-0xORDERID': {
            type: BUY,
            hash: trade.transactionHash,
            tradeGroupID: trade.tradeGroupID,
            status,
            description,
            data: {
              marketType,
              outcomeName: outcomeID,
              outcomeID,
              marketID
            },
            message: `bought ${shares.full} for ${formatEtherTokens(totalCostPerShare).full} / share`,
            numShares: shares,
            noFeePrice: price,
            avgPrice: price,
            timestamp: formatDate(new Date(trade.timestamp * 1000)),
            tradingFees: formatEtherTokens(tradingFees),
            feePercent: formatPercent(tradingFees.dividedBy(totalCost).times(100)),
            totalCost: formatEtherTokens(totalCost),
            totalReturn: undefined,
            gasFees: trade.gasFees && speedomatic.bignum(trade.gasFees).gt(ZERO) ? formatEther(trade.gasFees) : null,
            blockNumber: trade.blockNumber
          }
        };

        assert.deepEqual(actual, expected, `Didn't return the expected value`);
      }
    });

    test({
      description: `should return the expected transaction object with taker and type BUY and inProgress`,
      assertions: (store) => {
        const trade = {
          transactionHash: '0xHASH',
          orderId: '0xORDERID',
          tradeGroupID: '0xTRADEGROUPID',
          price: '0.1',
          amount: '2',
          maker: false,
          settlementFee: '0.01',
          type: BUY,
          timestamp: 1491843278,
          blockNumber: 123456,
          gasFees: 0.001,
          inProgress: true
        };
        const marketID = '0xMARKETID';
        const marketType = BINARY;
        const minPrice = '0';
        const description = 'test description';
        const outcomeID = '1';
        const status = 'testing';

        const price = formatEtherTokens(trade.price);
        const shares = formatShares(trade.amount);
        const tradingFees = trade.maker ? speedomatic.bignum(trade.makerFee) : speedomatic.bignum(trade.settlementFee);
        const bnShares = speedomatic.bignum(trade.amount);
        const bnPrice = marketType === SCALAR ? speedomatic.bignum(augur.trading.shrinkScalarPrice(minPrice, trade.price)) : speedomatic.bignum(trade.price);
        const totalCost = bnPrice.times(bnShares).plus(tradingFees);
        const totalCostPerShare = totalCost.dividedBy(bnShares);

        const actual = store.dispatch(action.constructTakeOrderTransaction(trade, marketID, marketType, minPrice, description, outcomeID, null, status));

        const expected = {
          '0xHASH-0xORDERID': {
            type: BUY,
            hash: trade.transactionHash,
            tradeGroupID: trade.tradeGroupID,
            status,
            description,
            data: {
              marketType,
              outcomeName: outcomeID,
              outcomeID,
              marketID
            },
            message: `${BUY} ${shares.full} for ${formatEtherTokens(totalCostPerShare).full} / share`,
            numShares: shares,
            noFeePrice: price,
            avgPrice: price,
            timestamp: formatDate(new Date(trade.timestamp * 1000)),
            tradingFees: formatEtherTokens(tradingFees),
            feePercent: formatPercent(tradingFees.dividedBy(totalCost).times(100)),
            totalCost: formatEtherTokens(totalCost),
            totalReturn: undefined,
            gasFees: formatEther(trade.gasFees),
            blockNumber: trade.blockNumber
          }
        };

        assert.deepEqual(actual, expected, `Didn't return the expected value`);
      }
    });

    test({
      description: `should return the expected transaction object with taker and type SELL and inProgress false`,
      assertions: (store) => {
        const trade = {
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
          gasFees: 0.001
        };
        const marketID = '0xMARKETID';
        const marketType = BINARY;
        const minPrice = '0';
        const description = 'test description';
        const outcomeID = '1';
        const status = 'testing';

        const price = formatEtherTokens(trade.price);
        const shares = formatShares(trade.amount);
        const tradingFees = trade.maker ? speedomatic.bignum(trade.makerFee) : speedomatic.bignum(trade.settlementFee);
        const bnShares = speedomatic.bignum(trade.amount);
        const bnPrice = marketType === SCALAR ? speedomatic.bignum(augur.trading.shrinkScalarPrice(minPrice, trade.price)) : speedomatic.bignum(trade.price);
        const totalCost = bnPrice.times(bnShares).plus(tradingFees);
        const totalReturn = bnPrice.times(bnShares).minus(tradingFees);
        const totalReturnPerShare = totalReturn.dividedBy(bnShares);

        const actual = store.dispatch(action.constructTakeOrderTransaction(trade, marketID, marketType, minPrice, description, outcomeID, null, status));

        const expected = {
          '0xHASH-0xORDERID': {
            type: SELL,
            hash: trade.transactionHash,
            tradeGroupID: trade.tradeGroupID,
            status,
            description,
            data: {
              marketType,
              outcomeName: outcomeID,
              outcomeID,
              marketID
            },
            message: `sold ${shares.full} for ${formatEtherTokens(totalReturnPerShare).full} / share`,
            numShares: shares,
            noFeePrice: price,
            avgPrice: price,
            timestamp: formatDate(new Date(trade.timestamp * 1000)),
            tradingFees: formatEtherTokens(tradingFees),
            feePercent: formatPercent(tradingFees.dividedBy(totalCost).times(100)),
            totalCost: undefined,
            totalReturn: formatEtherTokens(totalReturn),
            gasFees: formatEther(trade.gasFees),
            blockNumber: trade.blockNumber
          }
        };

        assert.deepEqual(actual, expected, `Didn't return the expected value`);
      }
    });

    test({
      description: `should return the expected transaction object with taker and type SELL and inProgress`,
      assertions: (store) => {
        const trade = {
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
          inProgress: true
        };
        const marketID = '0xMARKETID';
        const marketType = BINARY;
        const minPrice = '0';
        const description = 'test description';
        const outcomeID = '1';
        const status = 'testing';

        const price = formatEtherTokens(trade.price);
        const shares = formatShares(trade.amount);
        const tradingFees = trade.maker ? speedomatic.bignum(trade.makerFee) : speedomatic.bignum(trade.settlementFee);
        const bnShares = speedomatic.bignum(trade.amount);
        const bnPrice = marketType === SCALAR ? speedomatic.bignum(augur.trading.shrinkScalarPrice(minPrice, trade.price)) : speedomatic.bignum(trade.price);
        const totalCost = bnPrice.times(bnShares).plus(tradingFees);
        const totalReturn = bnPrice.times(bnShares).minus(tradingFees);
        const totalReturnPerShare = totalReturn.dividedBy(bnShares);

        const actual = store.dispatch(action.constructTakeOrderTransaction(trade, marketID, marketType, minPrice, description, outcomeID, null, status));

        const expected = {
          '0xHASH-0xORDERID': {
            type: SELL,
            hash: trade.transactionHash,
            tradeGroupID: trade.tradeGroupID,
            status,
            description,
            data: {
              marketType,
              outcomeName: outcomeID,
              outcomeID,
              marketID
            },
            message: `${SELL} ${shares.full} for ${formatEtherTokens(totalReturnPerShare).full} / share`,
            numShares: shares,
            noFeePrice: price,
            avgPrice: price,
            timestamp: formatDate(new Date(trade.timestamp * 1000)),
            tradingFees: formatEtherTokens(tradingFees),
            feePercent: formatPercent(tradingFees.dividedBy(totalCost).times(100)),
            totalCost: undefined,
            totalReturn: formatEtherTokens(totalReturn),
            gasFees: formatEther(trade.gasFees),
            blockNumber: trade.blockNumber
          }
        };

        assert.deepEqual(actual, expected, `Didn't return the expected value`);
      }
    });

    test({
      description: `should return the expected transaction object with type scalar and taker and type SELL and inProgress`,
      assertions: (store) => {
        const trade = {
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
          inProgress: true
        };
        const marketID = '0xMARKETID';
        const marketType = SCALAR;
        const minPrice = '0';
        const description = 'test description';
        const outcomeID = '1';
        const status = 'testing';

        const price = formatEtherTokens(trade.price);
        const shares = formatShares(trade.amount);
        const tradingFees = trade.maker ? speedomatic.bignum(trade.makerFee) : speedomatic.bignum(trade.settlementFee);
        const bnShares = speedomatic.bignum(trade.amount);
        const bnPrice = speedomatic.bignum(augur.trading.shrinkScalarPrice(minPrice, trade.price));
        const totalCost = bnPrice.times(bnShares).plus(tradingFees);
        const totalReturn = bnPrice.times(bnShares).minus(tradingFees);
        const totalReturnPerShare = totalReturn.dividedBy(bnShares);

        const actual = store.dispatch(action.constructTakeOrderTransaction(trade, marketID, marketType, minPrice, description, outcomeID, null, status));

        const expected = {
          '0xHASH-0xORDERID': {
            type: SELL,
            hash: trade.transactionHash,
            tradeGroupID: trade.tradeGroupID,
            status,
            description,
            data: {
              marketType,
              outcomeName: outcomeID,
              outcomeID,
              marketID
            },
            message: `${SELL} ${shares.full} for ${formatEtherTokens(totalReturnPerShare).full} / share`,
            numShares: shares,
            noFeePrice: price,
            avgPrice: price,
            timestamp: formatDate(new Date(trade.timestamp * 1000)),
            tradingFees: formatEtherTokens(tradingFees),
            feePercent: formatPercent(tradingFees.dividedBy(totalCost).times(100)),
            totalCost: undefined,
            totalReturn: formatEtherTokens(totalReturn),
            gasFees: formatEther(trade.gasFees),
            blockNumber: trade.blockNumber
          }
        };

        assert.deepEqual(actual, expected, `Didn't return the expected value`);
      }
    });
  });

  describe('constructMakeOrderTransaction', () => {
    const action = require('../../../src/modules/transactions/actions/construct-transaction');

    const test = t => it(t.description, () => {
      const store = mockStore();
      t.assertions(store);
    });

    describe('related conditionals: trade type, isShortAsk, and inProgress', () => {
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
        gasFees: 0.001
      };
      const marketID = '0xMARKETID';
      const marketType = BINARY;
      const description = 'test description';
      const outcomeID = '1';
      const market = {
        makerFee: '0.025',
        settlementFee: '0.05',
        minPrice: '0',
        maxPrice: '1'
      };
      const status = 'testing';

      test({
        description: `BUY, false, false`,
        assertions: (store) => {
          trade = {
            ...trade,
            type: BUY,
            isShortAsk: false,
            inProgress: false
          };

          const actual = store.dispatch(action.constructMakeOrderTransaction(trade, marketID, marketType, description, outcomeID, null, market, status));

          const expected = {
            '0xHASH': {
              type: BID,
              message: 'bid 2 shares for 0.1009 ETH Tokens / share',
              freeze: {
                verb: 'froze',
                noFeeCost: formatEtherTokens(0.2)
              },
              totalCost: formatEtherTokens(0.2018),
              totalReturn: undefined
            }
          };

          assert.containSubset(actual, expected, `Didn't contain the expected subset`);
        }
      });

      test({
        description: `BUY, false, true`,
        assertions: (store) => {
          trade = {
            ...trade,
            type: BUY,
            isShortAsk: false,
            inProgress: true
          };

          const actual = store.dispatch(action.constructMakeOrderTransaction(trade, marketID, marketType, description, outcomeID, null, market, status));

          const expected = {
            '0xHASH': {
              type: BID,
              message: 'bidding 2 shares for 0.1009 ETH Tokens / share',
              freeze: {
                verb: 'freezing',
                noFeeCost: formatEtherTokens(0.2)
              },
              totalCost: formatEtherTokens(0.2018),
              totalReturn: undefined
            }
          };

          assert.containSubset(actual, expected, `Didn't contain the expected subset`);
        }
      });

      test({
        description: `SELL, false, false`,
        assertions: (store) => {
          trade = {
            ...trade,
            type: SELL,
            isShortAsk: false,
            inProgress: false
          };

          const actual = store.dispatch(action.constructMakeOrderTransaction(trade, marketID, marketType, description, outcomeID, null, market, status));

          const expected = {
            '0xHASH': {
              type: ASK,
              message: 'ask 2 shares for 0.0991 ETH Tokens / share',
              freeze: {
                verb: 'froze',
                noFeeCost: undefined
              },
              totalCost: undefined,
              totalReturn: formatEtherTokens(0.1982)
            }
          };

          assert.containSubset(actual, expected, `Didn't contain the expected subset`);
        }
      });

      test({
        description: `SELL, false, true`,
        assertions: (store) => {
          trade = {
            ...trade,
            type: SELL,
            isShortAsk: false,
            inProgress: true
          };

          const actual = store.dispatch(action.constructMakeOrderTransaction(trade, marketID, marketType, description, outcomeID, null, market, status));

          const expected = {
            '0xHASH': {
              type: ASK,
              message: 'asking 2 shares for 0.0991 ETH Tokens / share',
              freeze: {
                verb: 'freezing',
                noFeeCost: undefined
              },
              totalCost: undefined,
              totalReturn: formatEtherTokens(0.1982)
            }
          };

          assert.containSubset(actual, expected, `Didn't contain the expected subset`);
        }
      });
    });

    describe('conditionals: market type', () => {
      const trade = {
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
        gasFees: 0.001
      };
      const marketID = '0xMARKETID';
      let marketType = BINARY;
      const description = 'test description';
      const outcomeID = '1';
      let market = {
        makerFee: '0.025',
        settlementFee: '0.05',
        minPrice: '0',
        maxPrice: '1'
      };
      const status = 'testing';

      test({
        description: 'BINARY',
        assertions: (store) => {
          const actual = store.dispatch(action.constructMakeOrderTransaction(trade, marketID, marketType, description, outcomeID, null, market, status));

          const expected = {
            '0xHASH': {
              noFeePrice: formatEtherTokens(0.1),
              freeze: {
                tradingFees: formatEtherTokens(0.0018)
              },
              feePercent: formatPercent(0.8919722497522299),
              message: 'ask 2 shares for 0.0991 ETH Tokens / share'
            }
          };

          assert.containSubset(actual, expected, `Didn't contain the expected subset`);
        }
      });

      test({
        description: 'SCALAR',
        assertions: (store) => {
          marketType = SCALAR;
          market = {
            ...market,
            minPrice: -1,
            maxPrice: 1
          };

          const actual = store.dispatch(action.constructMakeOrderTransaction(trade, marketID, marketType, description, outcomeID, null, market, status));

          const expected = {
            '0xHASH': {
              noFeePrice: formatEtherTokens(-0.9),
              freeze: {
                tradingFees: formatEtherTokens(0.00095)
              },
              feePercent: formatPercent(0.4727544165215227),
              message: 'ask 2 shares for 0.0995 ETH Tokens / share'
            }
          };

          assert.containSubset(actual, expected, `Didn't contain the expected subset`);
        }
      });
    });

    describe('general calculations', () => {
      const trade = {
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
        inProgress: false
      };
      const marketID = '0xMARKETID';
      const marketType = BINARY;
      const description = 'test description';
      const outcomeID = '1';
      const market = {
        makerFee: '0.025',
        settlementFee: '0.05',
        minPrice: '0',
        maxPrice: '1'
      };
      const status = 'testing';

      test({
        description: `should return the expected object`,
        assertions: (store) => {
          const actual = store.dispatch(action.constructMakeOrderTransaction(trade, marketID, marketType, description, outcomeID, null, market, status));

          const expected = {
            '0xHASH': {
              type: ASK,
              status,
              description,
              data: {
                marketType,
                outcomeName: outcomeID,
                outcomeID,
                marketID
              },
              message: 'ask 2 shares for 0.0991 ETH Tokens / share',
              numShares: formatShares(trade.amount),
              noFeePrice: formatEtherTokens(trade.price),
              freeze: {
                verb: 'froze',
                noFeeCost: undefined,
                tradingFees: formatEtherTokens(0.0018)
              },
              avgPrice: formatEtherTokens(trade.price),
              timestamp: formatDate(new Date(trade.timestamp * 1000)),
              hash: trade.transactionHash,
              feePercent: formatPercent(0.8919722497522299),
              totalCost: undefined,
              totalReturn: formatEtherTokens(0.1982),
              gasFees: formatEther(trade.gasFees),
              blockNumber: trade.blockNumber,
              tradeID: trade.orderId
            }
          };

          assert.deepEqual(actual, expected, `Didn't return the expected object`);
        }
      });
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
            tradeID: trade.orderId
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
            tradeID: trade.orderId
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

  describe('constructReportingTransaction', () => {
    const { __RewireAPI__, constructReportingTransaction } = require('../../../src/modules/transactions/actions/construct-transaction');

    const test = t => it(t.description, () => {
      const store = mockStore({
        loginAccount: {
          address: '',
          derivedKey: ''
        }
      });
      t.assertions(store);
    });

    test({
      description: `should dispatch the expected actions for label 'SubmitReport'`,
      assertions: (store) => {
        __RewireAPI__.__set__('constructSubmitReportTransaction', () => 'constructSubmitReportTransaction');

        const actual = store.dispatch(constructReportingTransaction('SubmitReport'));

        const expected = 'constructSubmitReportTransaction';

        assert.strictEqual(actual, expected, `Didn't call the expected method`);
      }
    });

    test({
      description: `should dispatch the expected method for default label`,
      assertions: (store) => {
        const actual = store.dispatch(constructReportingTransaction(undefined));

        const expected = null;

        assert.strictEqual(actual, expected, `Didn't return the expected value`);
      }
    });
  });

  describe('constructTransaction', () => {
    const { __RewireAPI__, constructTransaction } = require('../../../src/modules/transactions/actions/construct-transaction');

    const test = t => it(t.description, () => {
      const store = mockStore(t.state || {});
      t.assertions(store);
    });

    test({
      description: `should dispatch the expected actions for label 'Approval'`,
      assertions: (store) => {
        __RewireAPI__.__set__('constructApprovalTransaction', () => 'constructApprovalTransaction');

        const actual = store.dispatch(constructTransaction('Approval'));

        const expected = 'constructApprovalTransaction';

        assert.strictEqual(actual, expected, `Didn't call the expected method`);
      }
    });

    // test({
    //   description: `should dispatch the expected actions for label 'collectedFees'`,
    //   assertions: (store) => {
    //     __RewireAPI__.__set__('constructCollectedFeesTransaction', () => 'constructCollectedFeesTransaction');

    //     const actual = store.dispatch(constructTransaction('collectedFees'));

    //     const expected = 'constructCollectedFeesTransaction';

    //     assert.strictEqual(actual, expected, `Didn't call the expected method`);
    //   }
    // });

    test({
      description: `should dispatch the expected actions for label 'Deposit'`,
      assertions: (store) => {
        __RewireAPI__.__set__('constructConvertEthToEthTokenTransaction', () => 'constructConvertEthToEthTokenTransaction');

        const actual = store.dispatch(constructTransaction('Deposit'));

        const expected = 'constructConvertEthToEthTokenTransaction';

        assert.strictEqual(actual, expected, `Didn't call the expected method`);
      }
    });

    test({
      description: `should dispatch the expected actions for label 'registration'`,
      assertions: (store) => {
        __RewireAPI__.__set__('constructRegistrationTransaction', () => 'constructRegistrationTransaction');

        const actual = store.dispatch(constructTransaction('registration'));

        const expected = 'constructRegistrationTransaction';

        assert.strictEqual(actual, expected, `Didn't call the expected method`);
      }
    });

    test({
      description: `should dispatch the expected actions for label 'withdraw'`,
      assertions: (store) => {
        __RewireAPI__.__set__('constructWithdrawTransaction', () => 'constructWithdrawTransaction');

        const actual = store.dispatch(constructTransaction('withdraw'));

        const expected = 'constructWithdrawTransaction';

        assert.strictEqual(actual, expected, `Didn't call the expected method`);
      }
    });

    test({
      description: `should dispatch the expected actions for label 'Transfer' with trasnactionHash in state`,
      state: {
        transactionsData: {
          '0xHASH': {}
        }
      },
      assertions: (store) => {
        const actual = store.dispatch(constructTransaction('Transfer', {
          transactionHash: '0xHASH'
        }));

        const expected = null;

        assert.strictEqual(actual, expected, `Didn't return the expected value`);
      }
    });

    test({
      description: `should dispatch the expected actions for label 'Transfer' without trasnactionHash in state`,
      state: {
        transactionsData: {},
        loginAccount: {}
      },
      assertions: (store) => {
        __RewireAPI__.__set__('constructTransferTransaction', () => 'constructTransferTransaction');

        const actual = store.dispatch(constructTransaction('Transfer', {
          transactionHash: '0xHASH'
        }));

        const expected = 'constructTransferTransaction';

        assert.strictEqual(actual, expected, `Didn't call the expected method`);
      }
    });

    test({
      description: `should dispatch the expected actions for label 'CreateMarket' without description in log`,
      assertions: (store) => {
        __RewireAPI__.__set__('constructCreateMarketTransaction', () => 'constructCreateMarketTransaction');

        const actual = store.dispatch(constructTransaction('CreateMarket', {
          description: 'testing'
        }));

        const expected = 'constructCreateMarketTransaction';

        assert.strictEqual(actual, expected, `Didn't call the expected method`);
      }
    });

    test({
      description: `should dispatch the expected actions for label 'CreateMarket' without description in returned market`,
      assertions: (store) => {
        __RewireAPI__.__set__('loadDataForMarketTransaction', () => dispatch => ({}));

        const actual = store.dispatch(constructTransaction('CreateMarket', {}));

        const expected = undefined;

        assert.strictEqual(actual, expected, `Didn't return the expected value`);
      }
    });

    test({
      description: `should dispatch the expected actions for label 'CreateMarket' with description in returned market`,
      assertions: (store) => {
        __RewireAPI__.__set__('loadDataForMarketTransaction', () => dispatch => ({
          description: 'testing'
        }));
        __RewireAPI__.__set__('constructCreateMarketTransaction', () => 'constructCreateMarketTransaction');

        const actual = store.dispatch(constructTransaction('CreateMarket', {}));

        const expected = 'constructCreateMarketTransaction';

        assert.strictEqual(actual, expected, `Didn't call the expected method`);
      }
    });

    test({
      description: `should dispatch the expected actions for label 'Payout' without description in returned market`,
      assertions: (store) => {
        __RewireAPI__.__set__('loadDataForMarketTransaction', () => dispatch => ({}));

        const actual = store.dispatch(constructTransaction('Payout', {}));

        const expected = undefined;

        assert.strictEqual(actual, expected, `Didn't return the expected value`);
      }
    });

    test({
      description: `should dispatch the expected actions for label 'Payout' with description in returned market`,
      assertions: (store) => {
        __RewireAPI__.__set__('loadDataForMarketTransaction', () => dispatch => ({
          description: 'testing'
        }));
        __RewireAPI__.__set__('constructMarketTransaction', sinon.stub().returns({
          type: MOCK_ACTION_TYPES.CONSTRUCT_MARKET_TRANSACTION
        }));

        store.dispatch(constructTransaction('Payout', {}));

        const actual = store.getActions();

        const expected = [
          {
            type: MOCK_ACTION_TYPES.CONSTRUCT_MARKET_TRANSACTION
          }
        ];

        assert.deepEqual(actual, expected, `Didn't dispatch the expected actions`);
      }
    });

    test({
      description: `should dispatch the expected actions for label 'SubmitReport' without aux`,
      assertions: (store) => {
        __RewireAPI__.__set__('loadDataForReportingTransaction', () => dispatch => undefined);

        const actual = store.dispatch(constructTransaction('SubmitReport', {}));

        const expected = undefined;

        assert.strictEqual(actual, expected, `Didn't return the expected value`);
      }
    });

    test({
      description: `should dispatch the expected actions for label 'SubmitReport' with description in returned market`,
      assertions: (store) => {
        __RewireAPI__.__set__('loadDataForReportingTransaction', () => dispatch => ({}));
        __RewireAPI__.__set__('constructReportingTransaction', sinon.stub().returns({
          type: MOCK_ACTION_TYPES.CONSTRUCT_REPORTING_TRANSACTION
        }));

        store.dispatch(constructTransaction('SubmitReport', {}));

        const actual = store.getActions();

        const expected = [
          {
            type: MOCK_ACTION_TYPES.CONSTRUCT_REPORTING_TRANSACTION
          }
        ];

        assert.deepEqual(actual, expected, `Didn't dispatch the expected actions`);
      }
    });

    test({
      description: `should dispatch the expected actions for default label`,
      assertions: (store) => {
        __RewireAPI__.__set__('constructDefaultTransaction', () => 'constructDefaultTransaction');

        const actual = store.dispatch(constructTransaction(undefined));

        const expected = 'constructDefaultTransaction';

        assert.strictEqual(actual, expected, `Didn't call the expected method`);
      }
    });
  });
});
