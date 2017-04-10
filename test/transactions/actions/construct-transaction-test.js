import { describe, it } from 'mocha';
import { assert } from 'chai';
import sinon from 'sinon';
import proxyquire from 'proxyquire';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';

import { abi, augur, constants } from 'services/augurjs';

import { formatRealEther, formatEther, formatRep, formatPercent, formatShares } from 'utils/format-number';
import { formatDate } from 'utils/format-date';

import {
  constructBasicTransaction,
  constructDefaultTransaction,
  constructApprovalTransaction,
  constructCollectedFeesTransaction,
  constructDepositTransaction,
  constructRegistrationTransaction,
  constructPenalizationCaughtUpTransaction,
  constructWithdrawTransaction,
  constructSentEtherTransaction,
  constructSentCashTransaction,
  constructTransferTransaction,
  constructFundedAccountTransaction
} from 'modules/transactions/actions/construct-transaction';

import { CREATE_MARKET, COMMIT_REPORT, REVEAL_REPORT, BUY, SELL, MATCH_BID, MATCH_ASK, SHORT_SELL } from 'modules/transactions/constants/types';
import { BINARY, SCALAR } from 'modules/markets/constants/market-types';
import { ZERO } from 'modules/trade/constants/numbers';

describe('modules/transactions/actions/contruct-transaction.js', () => {
  proxyquire.noPreserveCache().noCallThru();

  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);

  const MOCK_ACTION_TYPES = {
    LOAD_MARKET_THEN_RETRY_CONVERSION: 'LOAD_MARKET_THEN_RETRY_CONVERSION',
    LOOKUP_EVENT_MARKETS_THEN_RETRY_CONVERSION: 'LOOKUP_EVENT_MARKETS_THEN_RETRY_CONVERSION',
    UPDATE_EVENTS_WITH_ACCOUNT_REPORT_DATA: 'UPDATE_EVENTS_WITH_ACCOUNT_REPORT_DATA'
  };

  const mockRetryConversion = {
    loadMarketThenRetryConversion: sinon.stub().returns({
      type: MOCK_ACTION_TYPES.LOAD_MARKET_THEN_RETRY_CONVERSION
    }),
    lookupEventMarketsThenRetryConversion: sinon.stub().returns({
      type: MOCK_ACTION_TYPES.LOOKUP_EVENT_MARKETS_THEN_RETRY_CONVERSION
    })
  };

  const mockMarket = {
    selectMarketIDFromEventID: sinon.stub()
  };
  mockMarket.selectMarketIDFromEventID.withArgs(undefined).returns(null);
  mockMarket.selectMarketIDFromEventID.withArgs('0xEVENTID').returns('0xMARKETID');

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
      './retry-conversion': mockRetryConversion,
      '../../market/selectors/market': mockMarket
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
          gasFees: formatRealEther(gasFees)
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

  describe('constructCollectedFeesTransaction', () => {
    const test = t => it(t.description, () => t.assertions());

    test({
      description: `should return the expected object with initialRepBalance undefined and no totalReportingRep and no cashFeesCollected and inProgress false`,
      assertions: () => {
        const log = {
          repGain: '1',
          inProgress: false,
          newRepBalance: '1',
          period: 1234,
          notReportingBond: '1'
        };

        const actual = constructCollectedFeesTransaction(log);

        const repGain = abi.bignum(log.repGain);
        const initialRepBalance = abi.bignum(log.newRepBalance).minus(repGain).toFixed();

        const expected = {
          data: {},
          type: 'Reporting Payment',
          description: `Reporting cycle #${log.period}`,
          bond: {
            label: 'reporting',
            value: formatRealEther(log.notReportingBond)
          },
          message: `reported with ${formatRep(initialRepBalance).full}`
        };

        assert.deepEqual(actual, expected, `Didn't return the expected object`);
      }
    });

    test({
      description: `should return the expected object with initialRepBalance and no totalReportingRep and no cashFeesCollected and inProgress false`,
      assertions: () => {
        const log = {
          repGain: '1',
          inProgress: false,
          newRepBalance: '1',
          period: 1234,
          notReportingBond: '1',
          initialRepBalance: '1'
        };

        const actual = constructCollectedFeesTransaction(log);

        const expected = {
          data: {},
          type: 'Reporting Payment',
          description: `Reporting cycle #${log.period}`,
          bond: {
            label: 'reporting',
            value: formatRealEther(log.notReportingBond)
          },
          message: `reported with ${formatRep(log.initialRepBalance).full}`
        };

        assert.deepEqual(actual, expected, `Didn't return the expected object`);
      }
    });

    test({
      description: `should return the expected object with initialRepBalance and totalReportingRep equals zero and no cashFeesCollected and inProgress false`,
      assertions: () => {
        const log = {
          repGain: '1',
          inProgress: false,
          newRepBalance: '1',
          period: 1234,
          notReportingBond: '1',
          initialRepBalance: '1',
          totalReportingRep: '0'
        };

        const actual = constructCollectedFeesTransaction(log);

        const expected = {
          data: {},
          type: 'Reporting Payment',
          description: `Reporting cycle #${log.period}`,
          bond: {
            label: 'reporting',
            value: formatRealEther(log.notReportingBond)
          },
          message: `reported with ${formatRep(log.initialRepBalance).full}`
        };

        assert.deepEqual(actual, expected, `Didn't return the expected object`);
      }
    });

    test({
      description: `should return the expected object with initialRepBalance and totalReportingRep and no cashFeesCollected and inProgress false`,
      assertions: () => {
        const log = {
          repGain: '1',
          inProgress: false,
          newRepBalance: '1',
          period: 1234,
          notReportingBond: '1',
          initialRepBalance: '1',
          totalReportingRep: '100'
        };

        const actual = constructCollectedFeesTransaction(log);

        const totalReportingRep = abi.bignum(log.totalReportingRep);
        const percentRep = formatPercent(abi.bignum(log.initialRepBalance).dividedBy(totalReportingRep).times(100), { decimals: 0 });

        const expected = {
          data: {},
          type: 'Reporting Payment',
          description: `Reporting cycle #${log.period}`,
          bond: {
            label: 'reporting',
            value: formatRealEther(log.notReportingBond)
          },
          message: `reported with ${formatRep(log.initialRepBalance).full} (${percentRep.full})`
        };

        assert.deepEqual(actual, expected, `Didn't return the expected object`);
      }
    });

    test({
      description: `should return the expected object with initialRepBalance and totalReportingRep and cashFeesCollected and inProgress false`,
      assertions: () => {
        const log = {
          repGain: '1',
          inProgress: false,
          period: 1234,
          notReportingBond: '1',
          initialRepBalance: '1',
          newRepBalance: '1',
          totalReportingRep: '100',
          cashFeesCollected: '100',
          newCashBalance: '101'
        };

        const actual = constructCollectedFeesTransaction(log);

        const repGain = abi.bignum(log.repGain);

        const totalReportingRep = abi.bignum(log.totalReportingRep);
        const percentRep = formatPercent(abi.bignum(log.initialRepBalance).dividedBy(totalReportingRep).times(100), { decimals: 0 });

        const expected = {
          data: {
            balances: [
              {
                change: formatEther(log.cashFeesCollected, { positiveSign: true }),
                balance: formatEther(log.newCashBalance)
              },
              {
                change: formatRep(repGain, { positiveSign: true }),
                balance: formatRep(log.newRepBalance)
              }
            ]
          },
          type: 'Reporting Payment',
          description: `Reporting cycle #${log.period}`,
          bond: {
            label: 'reporting',
            value: formatRealEther(log.notReportingBond)
          },
          message: `reported with ${formatRep(log.initialRepBalance).full} (${percentRep.full})`
        };

        assert.deepEqual(actual, expected, `Didn't return the expected object`);
      }
    });

    test({
      description: `should return the expected object with initialRepBalance and totalReportingRep and cashFeesCollected and inProgress true`,
      assertions: () => {
        const log = {
          repGain: '1',
          inProgress: true,
          period: 1234,
          notReportingBond: '1',
          initialRepBalance: '1',
          newRepBalance: '1',
          totalReportingRep: '100',
          cashFeesCollected: '100',
          newCashBalance: '101'
        };

        const actual = constructCollectedFeesTransaction(log);

        const repGain = abi.bignum(log.repGain);

        const totalReportingRep = abi.bignum(log.totalReportingRep);
        const percentRep = formatPercent(abi.bignum(log.initialRepBalance).dividedBy(totalReportingRep).times(100), { decimals: 0 });

        const expected = {
          data: {
            balances: [
              {
                change: formatEther(log.cashFeesCollected, { positiveSign: true }),
                balance: formatEther(log.newCashBalance)
              },
              {
                change: formatRep(repGain, { positiveSign: true }),
                balance: formatRep(log.newRepBalance)
              }
            ]
          },
          type: 'Reporting Payment',
          description: `Reporting cycle #${log.period}`,
          bond: {
            label: 'reporting',
            value: formatRealEther(log.notReportingBond)
          },
          message: `reporting with ${formatRep(log.initialRepBalance).full} (${percentRep.full})`
        };

        assert.deepEqual(actual, expected, `Didn't return the expected object`);
      }
    });
  });

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
          message: `deposited ${formatEther(log.value).full}`
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
          message: `depositing ${formatEther(log.value).full}`
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

  describe('constructPenalizationCaughtUpTransaction', () => {
    const test = t => it(t.description, () => t.assertions());

    test({
      description: `should return the expected object with no repLost and no newRepBalance and inProgress false`,
      assertions: () => {
        const log = {
          penalizedFrom: 1233,
          penalizedUpTo: 1235,
          inProgress: false
        };

        const actual = constructPenalizationCaughtUpTransaction(log);

        const expected = {
          data: {},
          type: 'Reporting Cycle Catch-Up',
          description: `Missed Reporting cycles ${log.penalizedFrom} to cycle ${log.penalizedUpTo}`,
          message: `caught up ${parseInt(log.penalizedUpTo, 10) - parseInt(log.penalizedFrom, 10)} cycles`
        };

        assert.deepEqual(actual, expected, `Didn't return the expected object`);
      }
    });

    test({
      description: `should return the expected object with repLost and newRepBalance and inProgress false`,
      assertions: () => {
        const log = {
          penalizedFrom: 1233,
          penalizedUpTo: 1235,
          inProgress: false,
          repLost: '10',
          newRepBalance: '90'
        };

        const actual = constructPenalizationCaughtUpTransaction(log);

        const expected = {
          data: {
            balances: [
              {
                change: formatRep(log.repLost, { positiveSign: true }),
                balance: formatRep(log.newRepBalance)
              }
            ]
          },
          type: 'Reporting Cycle Catch-Up',
          description: `Missed Reporting cycles ${log.penalizedFrom} to cycle ${log.penalizedUpTo}`,
          message: `caught up ${parseInt(log.penalizedUpTo, 10) - parseInt(log.penalizedFrom, 10)} cycles`
        };

        assert.deepEqual(actual, expected, `Didn't return the expected object`);
      }
    });

    test({
      description: `should return the expected object with repLost and newRepBalance and inProgress false`,
      assertions: () => {
        const log = {
          penalizedFrom: 1233,
          penalizedUpTo: 1235,
          inProgress: true,
          repLost: '10',
          newRepBalance: '90'
        };

        const actual = constructPenalizationCaughtUpTransaction(log);

        const expected = {
          data: {
            balances: [
              {
                change: formatRep(log.repLost, { positiveSign: true }),
                balance: formatRep(log.newRepBalance)
              }
            ]
          },
          type: 'Reporting Cycle Catch-Up',
          description: `Missed Reporting cycles ${log.penalizedFrom} to cycle ${log.penalizedUpTo}`,
          message: `catching up ${parseInt(log.penalizedUpTo, 10) - parseInt(log.penalizedFrom, 10)} cycles`
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
          message: `withdrew ${formatEther(log.value).full}`
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
          message: `withdrawing ${formatEther(log.value).full}`
        };

        assert.deepEqual(actual, expected, `Didn't return the expected object`);
      }
    });
  });

  describe('constructSentEtherTransaction', () => {
    const test = t => it(t.description, () => t.assertions());

    test({
      description: `should return the expected object with address not equal and inProgress false`,
      assertions: () => {
        const address = '0xUSERADDRESS';
        const log = {
          _from: '0xNOTUSERADDRESS',
          inProgress: false
        };

        const actual = constructSentEtherTransaction(log, address);

        const expected = {
          data: {},
          message: 'undefined ETH'
        };

        assert.deepEqual(actual, expected, `Didn't return the expected object`);
      }
    });

    test({
      description: `should return the expected object with address equal and inProgress false`,
      assertions: () => {
        const address = '0xUSERADDRESS';
        const log = {
          _from: '0xUSERADDRESS',
          _to: '0xOTHERUSERADDRESS',
          inProgress: false,
          _value: '10'
        };

        const actual = constructSentEtherTransaction(log, address);

        const expected = {
          data: {
            balances: [
              {
                change: formatRealEther(abi.bignum(log._value).neg(), { positiveSign: true })
              }
            ]
          },
          type: 'Send Real Ether',
          description: `Send Real Ether to ${abi.strip_0x(log._to)}`,
          message: `sent ETH`
        };

        assert.deepEqual(actual, expected, `Didn't return the expected object`);
      }
    });

    test({
      description: `should return the expected object with address equal and inProgress`,
      assertions: () => {
        const address = '0xUSERADDRESS';
        const log = {
          _from: '0xUSERADDRESS',
          _to: '0xOTHERUSERADDRESS',
          inProgress: true,
          _value: '10'
        };

        const actual = constructSentEtherTransaction(log, address);

        const expected = {
          data: {
            balances: [
              {
                change: formatRealEther(abi.bignum(log._value).neg(), { positiveSign: true })
              }
            ]
          },
          type: 'Send Real Ether',
          description: `Send Real Ether to ${abi.strip_0x(log._to)}`,
          message: `sending ETH`
        };

        assert.deepEqual(actual, expected, `Didn't return the expected object`);
      }
    });
  });

  describe('constructSentCashTransaction', () => {
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

        const actual = constructSentCashTransaction(log, address);

        const expected = {
          data: {
            balances: [
              {
                change: formatEther(abi.bignum(log._value).neg(), { positiveSign: true })
              }
            ]
          },
          type: 'Send Ether',
          description: `Send Ether to ${abi.strip_0x(log._to)}`,
          message: 'sent ETH'
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

        const actual = constructSentCashTransaction(log, address);

        const expected = {
          data: {
            balances: [
              {
                change: formatEther(abi.bignum(log._value).neg(), { positiveSign: true })
              }
            ]
          },
          type: 'Send Ether',
          description: `Send Ether to ${abi.strip_0x(log._to)}`,
          message: 'sending ETH'
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

        const actual = constructSentCashTransaction(log, address);

        const expected = {
          data: {
            balances: [
              {
                change: formatEther(abi.bignum(log._value), { positiveSign: true })
              }
            ]
          },
          type: 'Receive Ether',
          description: `Receive Ether from ${abi.strip_0x(log._from)}`,
          message: 'received ETH'
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

        const actual = constructSentCashTransaction(log, address);

        const expected = {
          data: {
            balances: [
              {
                change: formatEther(abi.bignum(log._value), { positiveSign: true })
              }
            ]
          },
          type: 'Receive Ether',
          description: `Receive Ether from ${abi.strip_0x(log._from)}`,
          message: 'receiving ETH'
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
                change: formatRep(abi.bignum(log._value).neg(), { positiveSign: true })
              }
            ]
          },
          type: 'Send Reputation',
          description: `Send Reputation to ${abi.strip_0x(log._to)}`,
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
                change: formatRep(abi.bignum(log._value).neg(), { positiveSign: true })
              }
            ]
          },
          type: 'Send Reputation',
          description: `Send Reputation to ${abi.strip_0x(log._to)}`,
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
                change: formatRep(abi.bignum(log._value), { positiveSign: true })
              }
            ]
          },
          type: 'Receive Reputation',
          description: `Receive Reputation from ${abi.strip_0x(log._from)}`,
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
                change: formatRep(abi.bignum(log._value), { positiveSign: true })
              }
            ]
          },
          type: 'Receive Reputation',
          description: `Receive Reputation from ${abi.strip_0x(log._from)}`,
          message: 'receiving REP'
        };

        assert.deepEqual(actual, expected, `Didn't return the expected object`);
      }
    });
  });

  describe('constructFundedAccountTransaction', () => {
    const test = t => it(t.description, () => t.assertions());

    test({
      description: `should return the expected object with no cashBalance and no repBalance and inProgress false`,
      assertions: () => {
        const log = {
          inProgress: false
        };

        const actual = constructFundedAccountTransaction(log);

        const expected = {
          data: {},
          type: 'fund_account',
          message: ''
        };

        assert.deepEqual(actual, expected, `Didn't return the expected object`);
      }
    });

    test({
      description: `should return the expected object with no cashBalance and no repBalance and inProgress false`,
      assertions: () => {
        const log = {
          inProgress: false,
          cashBalance: '10',
          repBalance: '100'
        };

        const actual = constructFundedAccountTransaction(log);

        const expected = {
          data: {
            balances: [
              {
                change: formatEther(log.cashBalance, { positiveSign: true }),
                balance: formatEther(log.cashBalance)
              }, {
                change: formatRep(log.repBalance, { positiveSign: true }),
                balance: formatRep(log.repBalance)
              }
            ]
          },
          type: 'fund_account',
          message: ''
        };

        assert.deepEqual(actual, expected, `Didn't return the expected object`);
      }
    });

    test({
      description: `should return the expected object with no cashBalance and no repBalance and inProgress`,
      assertions: () => {
        const log = {
          inProgress: true,
          cashBalance: '10',
          repBalance: '100'
        };

        const actual = constructFundedAccountTransaction(log);

        const expected = {
          data: {
            balances: [
              {
                change: formatEther(log.cashBalance, { positiveSign: true }),
                balance: formatEther(log.cashBalance)
              }, {
                change: formatRep(log.repBalance, { positiveSign: true }),
                balance: formatRep(log.repBalance)
              }
            ]
          },
          type: 'fund_account',
          message: 'requesting testnet funding'
        };

        assert.deepEqual(actual, expected, `Didn't return the expected object`);
      }
    });
  });

  describe('constructMarketCreatedTransaction', () => {
    const mockLinks = {
      selectMarketLink: sinon.stub().returns({})
    };
    const action = proxyquire('../../../src/modules/transactions/actions/construct-transaction', {
      '../../link/selectors/links': mockLinks
    });

    const test = t => it(t.description, () => t.assertions());

    test({
      description: `should return the expected object with inProgress false`,
      assertions: () => {
        const log = {
          inProgress: false,
          marketCreationFee: '10',
          marketID: '0xMARKETID',
          eventBond: '10'
        };
        const description = 'test description~|>one|two|three';

        const actual = action.constructMarketCreatedTransaction(log, description);

        const expected = {
          data: {
            marketID: log.marketID,
            marketLink: {},
          },
          type: CREATE_MARKET,
          description: 'test description',
          marketCreationFee: formatEther(log.marketCreationFee),
          bond: {
            label: 'event validity',
            value: formatEther(log.eventBond)
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
          eventBond: '10'
        };
        const description = 'test description~|>one|two|three';

        const actual = action.constructMarketCreatedTransaction(log, description);

        const expected = {
          data: {
            marketID: log.marketID,
            marketLink: {},
          },
          type: CREATE_MARKET,
          description: 'test description',
          marketCreationFee: formatEther(log.marketCreationFee),
          bond: {
            label: 'event validity',
            value: formatEther(log.eventBond)
          },
          message: 'creating market'
        };

        assert.deepEqual(actual, expected, `Didn't return the expected object`);
      }
    });
  });

  describe('constructPayoutTransaction', () => {
    const mockLinks = {
      selectMarketLink: sinon.stub().returns({})
    };
    const action = proxyquire('../../../src/modules/transactions/actions/construct-transaction', {
      '../../link/selectors/links': mockLinks
    });

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
            marketLink: {},
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
            marketLink: {},
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
            marketLink: {},
            marketID: '0xMARKETID',
            balances: [
              {
                change: formatEther(log.cashPayout, { positiveSign: true }),
                balance: formatEther(log.cashBalance)
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

  describe('constructTradingFeeUpdatedTransaction', () => {
    const mockLinks = {
      selectMarketLink: sinon.stub().returns({})
    };
    const action = proxyquire('../../../src/modules/transactions/actions/construct-transaction', {
      '../../link/selectors/links': mockLinks
    });

    const test = t => it(t.description, () => t.assertions());

    test({
      description: `should return the expected object with no marketID`,
      assertions: () => {
        const log = {
          tradingFee: '0.01'
        };
        const market = {
          description: 'test description'
        };

        const actual = action.constructTradingFeeUpdatedTransaction(log, market);

        const expected = {
          data: {
            marketID: null,
            marketLink: {}
          },
          description: 'test description',
          message: `updated trading fee: ${formatPercent(abi.bignum(log.tradingFee).times(100)).full}`
        };

        assert.deepEqual(actual, expected, `Didn't return the expected object`);
      }
    });

    test({
      description: `should return the expected object with marketID`,
      assertions: () => {
        const log = {
          marketID: '0xMARKETID',
          tradingFee: '0.01'
        };
        const market = {
          description: 'test description'
        };

        const actual = action.constructTradingFeeUpdatedTransaction(log, market);

        const expected = {
          data: {
            marketID: '0xMARKETID',
            marketLink: {}
          },
          description: 'test description',
          message: `updated trading fee: ${formatPercent(abi.bignum(log.tradingFee).times(100)).full}`
        };

        assert.deepEqual(actual, expected, `Didn't return the expected object`);
      }
    });
  });

  describe('constructPenalizeTransaction', () => {
    const mockLinks = {
      selectMarketLink: sinon.stub().returns({})
    };

    const mockReportableOutcomes = {
      formatReportedOutcome: sinon.stub().returns('formatted reported outcome')
    };

    const mockUpdateEventsWithAccountReportData = {
      updateEventsWithAccountReportData: sinon.stub().returns({
        type: MOCK_ACTION_TYPES.UPDATE_EVENTS_WITH_ACCOUNT_REPORT_DATA
      })
    };

    const action = proxyquire('../../../src/modules/transactions/actions/construct-transaction', {
      '../../link/selectors/links': mockLinks,
      '../../reports/selectors/reportable-outcomes': mockReportableOutcomes,
      '../../my-reports/actions/update-events-with-account-report-data': mockUpdateEventsWithAccountReportData
    });

    const test = (t) => {
      const store = mockStore();
      it(t.description, () => {
        t.assertions(store);
      });
    };

    test({
      description: `should return the expected object and dispatch the expected actions with no repChange and inProgress false and reportValue !== log.outcome`,
      assertions: (store) => {
        const log = {
          reportValue: '1',
          outcome: '2'
        };
        const marketID = '0xMARKETID';
        const market = {
          description: 'test description'
        };

        const result = action.constructPenalizeTransaction(log, marketID, market, {}, store.dispatch);

        const expectedResult = {
          data: {
            marketLink: {},
            marketID
          },
          type: 'Compare Report To Consensus',
          description: 'test description',
          message: `✘ report formatted reported outcome does not match consensus formatted reported outcome`
        };

        assert.deepEqual(result, expectedResult, `Didn't return the expected object`);

        const actions = store.getActions();

        const expectedActions = [
          {
            type: MOCK_ACTION_TYPES.UPDATE_EVENTS_WITH_ACCOUNT_REPORT_DATA
          }
        ];

        assert.deepEqual(actions, expectedActions, `Didn't dispatch the expected actions`);
      }
    });

    test({
      description: `should return the expected object and dispatch the expected actions with repChange equals 0 and inProgress false and reportValue !== log.outcome`,
      assertions: (store) => {
        const log = {
          reportValue: '1',
          outcome: '2',
          repchange: '0',
          oldrep: '2'
        };
        const marketID = '0xMARKETID';
        const market = {
          description: 'test description'
        };

        const result = action.constructPenalizeTransaction(log, marketID, market, {}, store.dispatch);

        const expectedResult = {
          data: {
            marketLink: {},
            marketID,
            balances: [
              {
                change: formatRep(abi.bignum(log.repchange), { positiveSign: true }),
                balance: formatRep(2)
              }
            ]
          },
          type: 'Compare Report To Consensus',
          description: 'test description',
          message: `✘ report formatted reported outcome does not match consensus formatted reported outcome`
        };

        assert.deepEqual(result, expectedResult, `Didn't return the expected object`);

        const actions = store.getActions();

        const expectedActions = [
          {
            type: MOCK_ACTION_TYPES.UPDATE_EVENTS_WITH_ACCOUNT_REPORT_DATA
          },
          {
            type: MOCK_ACTION_TYPES.UPDATE_EVENTS_WITH_ACCOUNT_REPORT_DATA
          }
        ];

        assert.deepEqual(actions, expectedActions, `Didn't dispatch the expected actions`);
      }
    });

    test({
      description: `should return the expected object and dispatch the expected actions with repChange not equal to 0 and inProgress false and reportValue !== log.outcome`,
      assertions: (store) => {
        const log = {
          reportValue: '1',
          outcome: '2',
          repchange: '0',
          oldrep: '2'
        };
        const marketID = '0xMARKETID';
        const market = {
          description: 'test description'
        };

        const result = action.constructPenalizeTransaction(log, marketID, market, {}, store.dispatch);

        const expectedResult = {
          data: {
            marketLink: {},
            marketID,
            balances: [
              {
                change: formatRep(constants.ZERO, { positiveSign: true }),
                balance: formatRep('2')
              }
            ]
          },
          type: 'Compare Report To Consensus',
          description: 'test description',
          message: `✘ report formatted reported outcome does not match consensus formatted reported outcome`
        };

        assert.deepEqual(result, expectedResult, `Didn't return the expected object`);

        const actions = store.getActions();

        const expectedActions = [
          {
            type: MOCK_ACTION_TYPES.UPDATE_EVENTS_WITH_ACCOUNT_REPORT_DATA
          },
          {
            type: MOCK_ACTION_TYPES.UPDATE_EVENTS_WITH_ACCOUNT_REPORT_DATA
          }
        ];

        assert.deepEqual(actions, expectedActions, `Didn't dispatch the expected actions`);
      }
    });

    test({
      description: `should return the expected object and dispatch the expected actions with repChange not equal to 0 and inProgress false and reportValue === log.outcome`,
      assertions: (store) => {
        const log = {
          reportValue: '1',
          outcome: '1',
          repchange: '0',
          oldrep: '2'
        };
        const marketID = '0xMARKETID';
        const market = {
          description: 'test description'
        };

        const result = action.constructPenalizeTransaction(log, marketID, market, {}, store.dispatch);

        const expectedResult = {
          data: {
            marketLink: {},
            marketID,
            balances: [
              {
                change: formatRep(constants.ZERO, { positiveSign: true }),
                balance: formatRep('2')
              }
            ]
          },
          type: 'Compare Report To Consensus',
          description: 'test description',
          message: `✔ report formatted reported outcome matches consensus`
        };

        assert.deepEqual(result, expectedResult, `Didn't return the expected object`);

        const actions = store.getActions();

        const expectedActions = [
          {
            type: MOCK_ACTION_TYPES.UPDATE_EVENTS_WITH_ACCOUNT_REPORT_DATA
          },
          {
            type: MOCK_ACTION_TYPES.UPDATE_EVENTS_WITH_ACCOUNT_REPORT_DATA
          }
        ];

        assert.deepEqual(actions, expectedActions, `Didn't dispatch the expected actions`);
      }
    });

    test({
      description: `should return the expected object and dispatch the expected actions with repChange not equal to 0 and inProgress and reportValue === log.outcome`,
      assertions: (store) => {
        const log = {
          reportValue: '1',
          outcome: '1',
          repchange: '0',
          oldrep: '2',
          inProgress: true
        };
        const marketID = '0xMARKETID';
        const market = {
          description: 'test description'
        };

        const result = action.constructPenalizeTransaction(log, marketID, market, {}, store.dispatch);

        const expectedResult = {
          data: {
            marketLink: {},
            marketID,
            balances: [
              {
                change: formatRep(constants.ZERO, { positiveSign: true }),
                balance: formatRep('2')
              }
            ]
          },
          type: 'Compare Report To Consensus',
          description: 'test description',
          message: 'comparing report to consensus'
        };

        assert.deepEqual(result, expectedResult, `Didn't return the expected object`);

        const actions = store.getActions();

        const expectedActions = [];

        assert.deepEqual(actions, expectedActions, `Didn't dispatch the expected actions`);
      }
    });
  });

  describe('constructSubmittedReportHashTransaction', () => {
    proxyquire.callThru();

    const mockAugur = {
      augur: {
        parseAndDecryptReport: sinon.stub().returns({
          report: 'testing'
        })
      }
    };

    const mockLinks = {
      selectMarketLink: sinon.stub().returns({})
    };

    const mockReportableOutcomes = {
      formatReportedOutcome: sinon.stub().returns('formatted reported outcome')
    };

    const mockUpdateEventsWithAccountReportData = {
      updateEventsWithAccountReportData: sinon.stub().returns({
        type: MOCK_ACTION_TYPES.UPDATE_EVENTS_WITH_ACCOUNT_REPORT_DATA
      })
    };

    const action = proxyquire('../../../src/modules/transactions/actions/construct-transaction', {
      '../../../services/augurjs': mockAugur,
      '../../link/selectors/links': mockLinks,
      '../../reports/selectors/reportable-outcomes': mockReportableOutcomes,
      '../../my-reports/actions/update-events-with-account-report-data': mockUpdateEventsWithAccountReportData
    });

    after(() => {
      proxyquire.noCallThru();
    });

    const test = (t) => {
      const store = mockStore();
      it(t.description, () => {
        t.assertions(store);
      });
    };

    test({
      description: `should return the expected object and dispatch the expected actions with no decryptionKey and no ethics and inProgress`,
      assertions: (store) => {
        const log = {
          inProgress: true
        };
        const marketID = '0xMARKETID';
        const market = {
          description: 'test description'
        };

        const result = action.constructSubmittedReportHashTransaction(log, marketID, market, null, null, store.dispatch);

        const expectedResult = {
          data: {
            marketLink: {},
            marketID,
            market,
            isUnethical: true
          },
          type: COMMIT_REPORT,
          description: market.description,
          message: 'committing to report'
        };

        assert.deepEqual(result, expectedResult, `Didn't return the expected object`);
      }
    });

    test({
      description: `should return the expected object and dispatch the expected actions with no decryptionKey and ethics and inProgress`,
      assertions: (store) => {
        const log = {
          ethics: '1',
          inProgress: true
        };
        const marketID = '0xMARKETID';
        const market = {
          description: 'test description'
        };

        const result = action.constructSubmittedReportHashTransaction(log, marketID, market, null, null, store.dispatch);

        const expectedResult = {
          data: {
            marketLink: {},
            marketID,
            market,
            isUnethical: false
          },
          type: COMMIT_REPORT,
          description: market.description,
          message: 'committing to report'
        };

        assert.deepEqual(result, expectedResult, `Didn't return the expected object`);
      }
    });

    test({
      description: `should return the expected object and dispatch the expected actions with decryptionKey and ethics and inProgress`,
      assertions: (store) => {
        const log = {
          ethics: '1',
          inProgress: true
        };
        const marketID = '0xMARKETID';
        const market = {
          description: 'test description'
        };

        const result = action.constructSubmittedReportHashTransaction(log, marketID, market, null, '123DECRYPTIONKEY', store.dispatch);

        const expectedResult = {
          data: {
            marketLink: {},
            marketID,
            market,
            isUnethical: false,
            reportedOutcomeID: 'formatted reported outcome',
            outcome: {
              name: 'formatted reported outcome'
            },
          },
          type: COMMIT_REPORT,
          description: market.description,
          message: 'committing to report: formatted reported outcome'
        };

        assert.deepEqual(result, expectedResult, `Didn't return the expected object`);
      }
    });

    test({
      description: `should return the expected object and dispatch the expected actions with decryptionKey and ethics and inProgress false`,
      assertions: (store) => {
        const log = {
          ethics: '1',
          inProgress: false
        };
        const marketID = '0xMARKETID';
        const market = {
          description: 'test description'
        };

        const result = action.constructSubmittedReportHashTransaction(log, marketID, market, null, '123DECRYPTIONKEY', store.dispatch);

        const expectedResult = {
          data: {
            marketLink: {},
            marketID,
            market,
            isUnethical: false,
            reportedOutcomeID: 'formatted reported outcome',
            outcome: {
              name: 'formatted reported outcome'
            },
          },
          type: COMMIT_REPORT,
          description: market.description,
          message: 'committed to report: formatted reported outcome'
        };

        assert.deepEqual(result, expectedResult, `Didn't return the expected object`);

        const actions = store.getActions();

        const expectedActions = [
          {
            type: MOCK_ACTION_TYPES.UPDATE_EVENTS_WITH_ACCOUNT_REPORT_DATA
          }
        ];

        assert.deepEqual(actions, expectedActions, `Didn't dispatch the expected actions`);
      }
    });
  });

  describe('constructSubmittedReportTransaction', () => {
    const mockLinks = {
      selectMarketLink: sinon.stub().returns({})
    };

    const mockReportableOutcomes = {
      formatReportedOutcome: sinon.stub().returns('formatted reported outcome')
    };

    const mockUpdateEventsWithAccountReportData = {
      updateEventsWithAccountReportData: sinon.stub().returns({
        type: MOCK_ACTION_TYPES.UPDATE_EVENTS_WITH_ACCOUNT_REPORT_DATA
      })
    };

    const action = proxyquire('../../../src/modules/transactions/actions/construct-transaction', {
      '../../link/selectors/links': mockLinks,
      '../../reports/selectors/reportable-outcomes': mockReportableOutcomes,
      '../../my-reports/actions/update-events-with-account-report-data': mockUpdateEventsWithAccountReportData
    });

    const test = t => it(t.description, () => {
      const store = mockStore();
      t.assertions(store);
    });

    test({
      description: `should return the expected object with no ethics and inProgress`,
      assertions: () => {
        const log = {
          inProgress: true
        };
        const marketID = '0xMARKETID';
        const market = {
          description: 'test description'
        };

        const result = action.constructSubmittedReportTransaction(log, marketID, market);

        const expectedResult = {
          data: {
            marketLink: {},
            marketID,
            market,
            isUnethical: true,
            reportedOutcomeID: 'formatted reported outcome',
            outcome: {
              name: 'formatted reported outcome'
            }
          },
          type: REVEAL_REPORT,
          description: market.description,
          message: 'revealing report: formatted reported outcome'
        };

        assert.deepEqual(result, expectedResult, `Didn't return the expected object`);
      }
    });

    test({
      description: `should return the expected object with ethics and inProgress`,
      assertions: () => {
        const log = {
          inProgress: true,
          ethics: '1'
        };
        const marketID = '0xMARKETID';
        const market = {
          description: 'test description'
        };

        const result = action.constructSubmittedReportTransaction(log, marketID, market);

        const expectedResult = {
          data: {
            marketLink: {},
            marketID,
            market,
            isUnethical: false,
            reportedOutcomeID: 'formatted reported outcome',
            outcome: {
              name: 'formatted reported outcome'
            }
          },
          type: REVEAL_REPORT,
          description: market.description,
          message: 'revealing report: formatted reported outcome'
        };

        assert.deepEqual(result, expectedResult, `Didn't return the expected object`);
      }
    });

    test({
      description: `should return the expected object with ethics and inProgress false`,
      assertions: (store) => {
        const log = {
          ethics: '1'
        };
        const marketID = '0xMARKETID';
        const market = {
          description: 'test description'
        };

        const result = action.constructSubmittedReportTransaction(log, marketID, market, null, store.dispatch);

        const expectedResult = {
          data: {
            marketLink: {},
            marketID,
            market,
            isUnethical: false,
            reportedOutcomeID: 'formatted reported outcome',
            outcome: {
              name: 'formatted reported outcome'
            }
          },
          type: REVEAL_REPORT,
          description: market.description,
          message: 'revealed report: formatted reported outcome'
        };

        assert.deepEqual(result, expectedResult, `Didn't return the expected object`);

        const actions = store.getActions();

        const expectedActions = [
          {
            type: MOCK_ACTION_TYPES.UPDATE_EVENTS_WITH_ACCOUNT_REPORT_DATA
          }
        ];

        assert.deepEqual(actions, expectedActions, `Didn't dispatch the expected actions`);
      }
    });
  });

  describe('constructSlashedRepTransaction', () => {
    const mockLinks = {
      selectMarketLink: sinon.stub().returns({})
    };
    const action = proxyquire('../../../src/modules/transactions/actions/construct-transaction', {
      '../../link/selectors/links': mockLinks
    });

    const test = t => it(t.description, () => t.assertions());

    test({
      description: `should return the expected object with sender not equal to user and repSlashed false and inProgress false`,
      assertions: () => {
        const log = {
          reporter: '0xREPORTER',
          sender: '0xSENDER'
        };
        const market = {
          id: '0xMARKETID',
          description: 'test description'
        };

        const actual = action.constructSlashedRepTransaction(log, market);

        const expected = {
          data: {
            marketLink: {},
            marketID: '0xMARKETID',
            market
          },
          description: market.description,
          type: 'Pay Collusion Fine',
          message: `fined by ${abi.strip_0x(log.sender)}`
        };

        assert.deepEqual(actual, expected, `Didn't return the expected object`);
      }
    });

    test({
      description: `should return the expected object with sender equal to user and repSlashed false and inProgress false`,
      assertions: () => {
        const log = {
          reporter: '0xREPORTER',
          sender: '0xSENDER'
        };
        const market = {
          id: '0xMARKETID',
          description: 'test description'
        };
        const address = '0xSENDER';

        const actual = action.constructSlashedRepTransaction(log, market, null, address);

        const expected = {
          data: {
            marketLink: {},
            marketID: '0xMARKETID',
            market
          },
          description: market.description,
          type: 'Snitch Reward',
          message: `fined ${abi.strip_0x(log.reporter)} ${formatRep(log.repSlashed).full}`
        };

        assert.deepEqual(actual, expected, `Didn't return the expected object`);
      }
    });

    test({
      description: `should return the expected object with sender equal to user and repSlashed and inProgress false`,
      assertions: () => {
        const log = {
          reporter: '0xREPORTER',
          sender: '0xSENDER',
          repSlashed: '10',
          slasherBalance: '20'
        };
        const market = {
          id: '0xMARKETID',
          description: 'test description'
        };
        const address = '0xSENDER';

        const actual = action.constructSlashedRepTransaction(log, market, null, address);

        const expected = {
          data: {
            marketLink: {},
            marketID: '0xMARKETID',
            market,
            balances: [
              {
                change: formatRep(5, { positiveSign: true }),
                balance: formatRep(log.slasherBalance)
              }
            ]
          },
          description: market.description,
          type: 'Snitch Reward',
          message: `fined ${abi.strip_0x(log.reporter)} ${formatRep(log.repSlashed).full}`
        };

        assert.deepEqual(actual, expected, `Didn't return the expected object`);
      }
    });

    test({
      description: `should return the expected object with sender equal to user and repSlashed and inProgress`,
      assertions: () => {
        const log = {
          reporter: '0xREPORTER',
          sender: '0xSENDER',
          repSlashed: '10',
          slasherBalance: '20',
          inProgress: true
        };
        const market = {
          id: '0xMARKETID',
          description: 'test description'
        };
        const address = '0xSENDER';

        const actual = action.constructSlashedRepTransaction(log, market, null, address);

        const expected = {
          data: {
            marketLink: {},
            marketID: '0xMARKETID',
            market,
            balances: [
              {
                change: formatRep(5, { positiveSign: true }),
                balance: formatRep(log.slasherBalance)
              }
            ]
          },
          description: market.description,
          type: 'Snitch Reward',
          message: `fining ${abi.strip_0x(log.reporter)}`
        };

        assert.deepEqual(actual, expected, `Didn't return the expected object`);
      }
    });
  });

  describe('constructLogFillTxTransaction', () => {
    const mockLinks = {
      selectMarketLink: sinon.stub().returns({})
    };
    const action = proxyquire('../../../src/modules/transactions/actions/construct-transaction', {
      '../../link/selectors/links': mockLinks
    });

    const test = t => it(t.description, () => {
      const store = mockStore();
      t.assertions(store);
    });

    test({
      description: `should return the expected transaction object with necessary data missing`,
      assertions: (store) => {
        const trade = {};

        const actual = store.dispatch(action.constructLogFillTxTransaction(trade));

        const expected = null;

        assert.strictEqual(actual, expected, `Didn't return the expected value`);
      }
    });

    test({
      description: `should return the expected transaction object with maker and type BUY and inProgress false`,
      assertions: (store) => {
        const trade = {
          transactionHash: '0xHASH',
          tradeid: '0xTRADEID',
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
        const minValue = '0';
        const description = 'test description';
        const outcomeID = '1';
        const status = 'testing';

        const price = formatEther(trade.price);
        const shares = formatShares(trade.amount);
        const tradingFees = trade.maker ? abi.bignum(trade.makerFee) : abi.bignum(trade.takerFee);
        const bnShares = abi.bignum(trade.amount);
        const bnPrice = marketType === SCALAR ? abi.bignum(augur.shrinkScalarPrice(minValue, trade.price)) : abi.bignum(trade.price);
        const totalCost = bnPrice.times(bnShares).plus(tradingFees);
        const totalReturn = bnPrice.times(bnShares).minus(tradingFees);
        const totalCostPerShare = totalCost.dividedBy(bnShares);

        const actual = store.dispatch(action.constructLogFillTxTransaction(trade, marketID, marketType, minValue, description, outcomeID, null, status));

        const expected = {
          '0xHASH-0xTRADEID': {
            type: MATCH_ASK,
            hash: trade.transactionHash,
            tradeGroupID: trade.tradeGroupID,
            status,
            description,
            data: {
              marketType,
              outcomeName: outcomeID,
              outcomeID,
              marketID,
              marketLink: {}
            },
            message: `sold ${shares.full} for ${formatEther(totalCostPerShare).full} / share`,
            numShares: shares,
            noFeePrice: price,
            avgPrice: price,
            timestamp: formatDate(new Date(trade.timestamp * 1000)),
            tradingFees: formatEther(tradingFees),
            feePercent: formatPercent(tradingFees.dividedBy(totalCost).times(100)),
            totalCost: undefined,
            totalReturn: formatEther(totalReturn),
            gasFees: trade.gasFees && abi.bignum(trade.gasFees).gt(ZERO) ? formatRealEther(trade.gasFees) : null,
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
          tradeid: '0xTRADEID',
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
        const minValue = '0';
        const description = 'test description';
        const outcomeID = '1';
        const status = 'testing';

        const price = formatEther(trade.price);
        const shares = formatShares(trade.amount);
        const tradingFees = trade.maker ? abi.bignum(trade.makerFee) : abi.bignum(trade.takerFee);
        const bnShares = abi.bignum(trade.amount);
        const bnPrice = marketType === SCALAR ? abi.bignum(augur.shrinkScalarPrice(minValue, trade.price)) : abi.bignum(trade.price);
        const totalCost = bnPrice.times(bnShares).plus(tradingFees);
        const totalReturn = bnPrice.times(bnShares).minus(tradingFees);
        const totalCostPerShare = totalCost.dividedBy(bnShares);

        const actual = store.dispatch(action.constructLogFillTxTransaction(trade, marketID, marketType, minValue, description, outcomeID, null, status));

        const expected = {
          '0xHASH-0xTRADEID': {
            type: MATCH_ASK,
            hash: trade.transactionHash,
            tradeGroupID: trade.tradeGroupID,
            status,
            description,
            data: {
              marketType,
              outcomeName: outcomeID,
              outcomeID,
              marketID,
              marketLink: {}
            },
            message: `${MATCH_ASK} ${shares.full} for ${formatEther(totalCostPerShare).full} / share`,
            numShares: shares,
            noFeePrice: price,
            avgPrice: price,
            timestamp: formatDate(new Date(trade.timestamp * 1000)),
            tradingFees: formatEther(tradingFees),
            feePercent: formatPercent(tradingFees.dividedBy(totalCost).times(100)),
            totalCost: undefined,
            totalReturn: formatEther(totalReturn),
            gasFees: trade.gasFees && abi.bignum(trade.gasFees).gt(ZERO) ? formatRealEther(trade.gasFees) : null,
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
          tradeid: '0xTRADEID',
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
        const minValue = '0';
        const description = 'test description';
        const outcomeID = '1';
        const status = 'testing';

        const price = formatEther(trade.price);
        const shares = formatShares(trade.amount);
        const tradingFees = trade.maker ? abi.bignum(trade.makerFee) : abi.bignum(trade.takerFee);
        const bnShares = abi.bignum(trade.amount);
        const bnPrice = marketType === SCALAR ? abi.bignum(augur.shrinkScalarPrice(minValue, trade.price)) : abi.bignum(trade.price);
        const totalCost = bnPrice.times(bnShares).plus(tradingFees);
        const totalReturn = bnPrice.times(bnShares).minus(tradingFees);
        const totalReturnPerShare = totalReturn.dividedBy(bnShares);

        const actual = store.dispatch(action.constructLogFillTxTransaction(trade, marketID, marketType, minValue, description, outcomeID, null, status));

        const expected = {
          '0xHASH-0xTRADEID': {
            type: MATCH_BID,
            hash: trade.transactionHash,
            tradeGroupID: trade.tradeGroupID,
            status,
            description,
            data: {
              marketType,
              outcomeName: outcomeID,
              outcomeID,
              marketID,
              marketLink: {}
            },
            message: `bought ${shares.full} for ${formatEther(totalReturnPerShare).full} / share`,
            numShares: shares,
            noFeePrice: price,
            avgPrice: price,
            timestamp: formatDate(new Date(trade.timestamp * 1000)),
            tradingFees: formatEther(tradingFees),
            feePercent: formatPercent(tradingFees.dividedBy(totalCost).times(100)),
            totalCost: formatEther(totalCost),
            totalReturn: undefined,
            gasFees: formatRealEther(trade.gasFees),
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
          tradeid: '0xTRADEID',
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
        const minValue = '0';
        const description = 'test description';
        const outcomeID = '1';
        const status = 'testing';

        const price = formatEther(trade.price);
        const shares = formatShares(trade.amount);
        const tradingFees = trade.maker ? abi.bignum(trade.makerFee) : abi.bignum(trade.takerFee);
        const bnShares = abi.bignum(trade.amount);
        const bnPrice = marketType === SCALAR ? abi.bignum(augur.shrinkScalarPrice(minValue, trade.price)) : abi.bignum(trade.price);
        const totalCost = bnPrice.times(bnShares).plus(tradingFees);
        const totalReturn = bnPrice.times(bnShares).minus(tradingFees);
        const totalReturnPerShare = totalReturn.dividedBy(bnShares);

        const actual = store.dispatch(action.constructLogFillTxTransaction(trade, marketID, marketType, minValue, description, outcomeID, null, status));

        const expected = {
          '0xHASH-0xTRADEID': {
            type: MATCH_BID,
            hash: trade.transactionHash,
            tradeGroupID: trade.tradeGroupID,
            status,
            description,
            data: {
              marketType,
              outcomeName: outcomeID,
              outcomeID,
              marketID,
              marketLink: {}
            },
            message: `${MATCH_BID} ${shares.full} for ${formatEther(totalReturnPerShare).full} / share`,
            numShares: shares,
            noFeePrice: price,
            avgPrice: price,
            timestamp: formatDate(new Date(trade.timestamp * 1000)),
            tradingFees: formatEther(tradingFees),
            feePercent: formatPercent(tradingFees.dividedBy(totalCost).times(100)),
            totalCost: formatEther(totalCost),
            totalReturn: undefined,
            gasFees: trade.gasFees && abi.bignum(trade.gasFees).gt(ZERO) ? formatRealEther(trade.gasFees) : null,
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
          tradeid: '0xTRADEID',
          tradeGroupID: '0xTRADEGROUPID',
          price: '0.1',
          amount: '2',
          maker: false,
          takerFee: '0.01',
          type: BUY,
          timestamp: 1491843278,
          blockNumber: 123456,
          gasFees: 0.001
        };
        const marketID = '0xMARKETID';
        const marketType = BINARY;
        const minValue = '0';
        const description = 'test description';
        const outcomeID = '1';
        const status = 'testing';

        const price = formatEther(trade.price);
        const shares = formatShares(trade.amount);
        const tradingFees = trade.maker ? abi.bignum(trade.makerFee) : abi.bignum(trade.takerFee);
        const bnShares = abi.bignum(trade.amount);
        const bnPrice = marketType === SCALAR ? abi.bignum(augur.shrinkScalarPrice(minValue, trade.price)) : abi.bignum(trade.price);
        const totalCost = bnPrice.times(bnShares).plus(tradingFees);
        const totalCostPerShare = totalCost.dividedBy(bnShares);

        const actual = store.dispatch(action.constructLogFillTxTransaction(trade, marketID, marketType, minValue, description, outcomeID, null, status));

        const expected = {
          '0xHASH-0xTRADEID': {
            type: BUY,
            hash: trade.transactionHash,
            tradeGroupID: trade.tradeGroupID,
            status,
            description,
            data: {
              marketType,
              outcomeName: outcomeID,
              outcomeID,
              marketID,
              marketLink: {}
            },
            message: `bought ${shares.full} for ${formatEther(totalCostPerShare).full} / share`,
            numShares: shares,
            noFeePrice: price,
            avgPrice: price,
            timestamp: formatDate(new Date(trade.timestamp * 1000)),
            tradingFees: formatEther(tradingFees),
            feePercent: formatPercent(tradingFees.dividedBy(totalCost).times(100)),
            totalCost: formatEther(totalCost),
            totalReturn: undefined,
            gasFees: trade.gasFees && abi.bignum(trade.gasFees).gt(ZERO) ? formatRealEther(trade.gasFees) : null,
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
          tradeid: '0xTRADEID',
          tradeGroupID: '0xTRADEGROUPID',
          price: '0.1',
          amount: '2',
          maker: false,
          takerFee: '0.01',
          type: BUY,
          timestamp: 1491843278,
          blockNumber: 123456,
          gasFees: 0.001,
          inProgress: true
        };
        const marketID = '0xMARKETID';
        const marketType = BINARY;
        const minValue = '0';
        const description = 'test description';
        const outcomeID = '1';
        const status = 'testing';

        const price = formatEther(trade.price);
        const shares = formatShares(trade.amount);
        const tradingFees = trade.maker ? abi.bignum(trade.makerFee) : abi.bignum(trade.takerFee);
        const bnShares = abi.bignum(trade.amount);
        const bnPrice = marketType === SCALAR ? abi.bignum(augur.shrinkScalarPrice(minValue, trade.price)) : abi.bignum(trade.price);
        const totalCost = bnPrice.times(bnShares).plus(tradingFees);
        const totalCostPerShare = totalCost.dividedBy(bnShares);

        const actual = store.dispatch(action.constructLogFillTxTransaction(trade, marketID, marketType, minValue, description, outcomeID, null, status));

        const expected = {
          '0xHASH-0xTRADEID': {
            type: BUY,
            hash: trade.transactionHash,
            tradeGroupID: trade.tradeGroupID,
            status,
            description,
            data: {
              marketType,
              outcomeName: outcomeID,
              outcomeID,
              marketID,
              marketLink: {}
            },
            message: `${BUY} ${shares.full} for ${formatEther(totalCostPerShare).full} / share`,
            numShares: shares,
            noFeePrice: price,
            avgPrice: price,
            timestamp: formatDate(new Date(trade.timestamp * 1000)),
            tradingFees: formatEther(tradingFees),
            feePercent: formatPercent(tradingFees.dividedBy(totalCost).times(100)),
            totalCost: formatEther(totalCost),
            totalReturn: undefined,
            gasFees: formatRealEther(trade.gasFees),
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
          tradeid: '0xTRADEID',
          tradeGroupID: '0xTRADEGROUPID',
          price: '0.1',
          amount: '2',
          maker: false,
          takerFee: '0.01',
          type: SELL,
          timestamp: 1491843278,
          blockNumber: 123456,
          gasFees: 0.001
        };
        const marketID = '0xMARKETID';
        const marketType = BINARY;
        const minValue = '0';
        const description = 'test description';
        const outcomeID = '1';
        const status = 'testing';

        const price = formatEther(trade.price);
        const shares = formatShares(trade.amount);
        const tradingFees = trade.maker ? abi.bignum(trade.makerFee) : abi.bignum(trade.takerFee);
        const bnShares = abi.bignum(trade.amount);
        const bnPrice = marketType === SCALAR ? abi.bignum(augur.shrinkScalarPrice(minValue, trade.price)) : abi.bignum(trade.price);
        const totalCost = bnPrice.times(bnShares).plus(tradingFees);
        const totalReturn = bnPrice.times(bnShares).minus(tradingFees);
        const totalReturnPerShare = totalReturn.dividedBy(bnShares);

        const actual = store.dispatch(action.constructLogFillTxTransaction(trade, marketID, marketType, minValue, description, outcomeID, null, status));

        const expected = {
          '0xHASH-0xTRADEID': {
            type: SELL,
            hash: trade.transactionHash,
            tradeGroupID: trade.tradeGroupID,
            status,
            description,
            data: {
              marketType,
              outcomeName: outcomeID,
              outcomeID,
              marketID,
              marketLink: {}
            },
            message: `sold ${shares.full} for ${formatEther(totalReturnPerShare).full} / share`,
            numShares: shares,
            noFeePrice: price,
            avgPrice: price,
            timestamp: formatDate(new Date(trade.timestamp * 1000)),
            tradingFees: formatEther(tradingFees),
            feePercent: formatPercent(tradingFees.dividedBy(totalCost).times(100)),
            totalCost: undefined,
            totalReturn: formatEther(totalReturn),
            gasFees: formatRealEther(trade.gasFees),
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
          tradeid: '0xTRADEID',
          tradeGroupID: '0xTRADEGROUPID',
          price: '0.1',
          amount: '2',
          maker: false,
          takerFee: '0.01',
          type: SELL,
          timestamp: 1491843278,
          blockNumber: 123456,
          gasFees: 0.001,
          inProgress: true
        };
        const marketID = '0xMARKETID';
        const marketType = BINARY;
        const minValue = '0';
        const description = 'test description';
        const outcomeID = '1';
        const status = 'testing';

        const price = formatEther(trade.price);
        const shares = formatShares(trade.amount);
        const tradingFees = trade.maker ? abi.bignum(trade.makerFee) : abi.bignum(trade.takerFee);
        const bnShares = abi.bignum(trade.amount);
        const bnPrice = marketType === SCALAR ? abi.bignum(augur.shrinkScalarPrice(minValue, trade.price)) : abi.bignum(trade.price);
        const totalCost = bnPrice.times(bnShares).plus(tradingFees);
        const totalReturn = bnPrice.times(bnShares).minus(tradingFees);
        const totalReturnPerShare = totalReturn.dividedBy(bnShares);

        const actual = store.dispatch(action.constructLogFillTxTransaction(trade, marketID, marketType, minValue, description, outcomeID, null, status));

        const expected = {
          '0xHASH-0xTRADEID': {
            type: SELL,
            hash: trade.transactionHash,
            tradeGroupID: trade.tradeGroupID,
            status,
            description,
            data: {
              marketType,
              outcomeName: outcomeID,
              outcomeID,
              marketID,
              marketLink: {}
            },
            message: `${SELL} ${shares.full} for ${formatEther(totalReturnPerShare).full} / share`,
            numShares: shares,
            noFeePrice: price,
            avgPrice: price,
            timestamp: formatDate(new Date(trade.timestamp * 1000)),
            tradingFees: formatEther(tradingFees),
            feePercent: formatPercent(tradingFees.dividedBy(totalCost).times(100)),
            totalCost: undefined,
            totalReturn: formatEther(totalReturn),
            gasFees: formatRealEther(trade.gasFees),
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
          tradeid: '0xTRADEID',
          tradeGroupID: '0xTRADEGROUPID',
          price: '0.1',
          amount: '2',
          maker: false,
          takerFee: '0.01',
          type: SELL,
          timestamp: 1491843278,
          blockNumber: 123456,
          gasFees: 0.001,
          inProgress: true
        };
        const marketID = '0xMARKETID';
        const marketType = SCALAR;
        const minValue = '0';
        const description = 'test description';
        const outcomeID = '1';
        const status = 'testing';

        const price = formatEther(trade.price);
        const shares = formatShares(trade.amount);
        const tradingFees = trade.maker ? abi.bignum(trade.makerFee) : abi.bignum(trade.takerFee);
        const bnShares = abi.bignum(trade.amount);
        const bnPrice = abi.bignum(augur.shrinkScalarPrice(minValue, trade.price));
        const totalCost = bnPrice.times(bnShares).plus(tradingFees);
        const totalReturn = bnPrice.times(bnShares).minus(tradingFees);
        const totalReturnPerShare = totalReturn.dividedBy(bnShares);

        const actual = store.dispatch(action.constructLogFillTxTransaction(trade, marketID, marketType, minValue, description, outcomeID, null, status));

        const expected = {
          '0xHASH-0xTRADEID': {
            type: SELL,
            hash: trade.transactionHash,
            tradeGroupID: trade.tradeGroupID,
            status,
            description,
            data: {
              marketType,
              outcomeName: outcomeID,
              outcomeID,
              marketID,
              marketLink: {}
            },
            message: `${SELL} ${shares.full} for ${formatEther(totalReturnPerShare).full} / share`,
            numShares: shares,
            noFeePrice: price,
            avgPrice: price,
            timestamp: formatDate(new Date(trade.timestamp * 1000)),
            tradingFees: formatEther(tradingFees),
            feePercent: formatPercent(tradingFees.dividedBy(totalCost).times(100)),
            totalCost: undefined,
            totalReturn: formatEther(totalReturn),
            gasFees: formatRealEther(trade.gasFees),
            blockNumber: trade.blockNumber
          }
        };

        assert.deepEqual(actual, expected, `Didn't return the expected value`);
      }
    });
  });

  describe('constructLogFillTxTransaction', () => {
    const mockLinks = {
      selectMarketLink: sinon.stub().returns({})
    };
    const action = proxyquire('../../../src/modules/transactions/actions/construct-transaction', {
      '../../link/selectors/links': mockLinks
    });

    const test = t => it(t.description, () => {
      const store = mockStore();
      t.assertions(store);
    });

    test({
      description: `should return the expected object with inProgress false`,
      assertions: (store) => {
        const trade = {
          transactionHash: '0xHASH',
          tradeid: '0xTRADEID',
          tradeGroupID: '0xTRADEGROUPID',
          price: '0.1',
          amount: '2',
          maker: false,
          takerFee: '0.01',
          type: SELL,
          timestamp: 1491843278,
          blockNumber: 123456,
          gasFees: 0.001
        };
        const marketID = '0xMARKETID';
        const marketType = BINARY;
        const maxValue = '1';
        const description = 'test description';
        const outcomeID = '1';
        const status = 'testing';

        const price = formatEther(trade.price);
        const shares = formatShares(trade.amount);
        const bnPrice = abi.bignum(trade.price);
        const tradingFees = abi.bignum(trade.takerFee);
        const bnShares = abi.bignum(trade.amount);
        const totalCost = bnShares.minus(bnPrice.times(bnShares).plus(tradingFees));
        const totalCostPerShare = totalCost.dividedBy(bnShares);

        const actual = store.dispatch(action.constructLogShortFillTxTransaction(trade, marketID, marketType, maxValue, description, outcomeID, null, status));

        const expected = {
          '0xHASH-0xTRADEID': {
            type: SHORT_SELL,
            hash: trade.transactionHash,
            status,
            description,
            data: {
              marketType,
              outcomeName: outcomeID,
              outcomeID,
              marketID,
              marketLink: {}
            },
            message: `short sold ${shares.full} for ${formatEther(totalCostPerShare).full} / share`,
            numShares: shares,
            noFeePrice: price,
            avgPrice: formatEther(totalCost.minus(bnShares).dividedBy(bnShares).abs()),
            timestamp: formatDate(new Date(trade.timestamp * 1000)),
            tradingFees: formatEther(tradingFees),
            feePercent: formatPercent(tradingFees.dividedBy(totalCost).times(100)),
            totalCost: formatEther(totalCost),
            gasFees: formatRealEther(trade.gasFees),
            blockNumber: trade.blockNumber
          }
        };

        assert.deepEqual(actual, expected, `Didn't return the expected object`);
      }
    });

    test({
      description: `should return the expected object with inProgress`,
      assertions: (store) => {
        const trade = {
          transactionHash: '0xHASH',
          tradeid: '0xTRADEID',
          tradeGroupID: '0xTRADEGROUPID',
          price: '0.1',
          amount: '2',
          maker: false,
          takerFee: '0.01',
          type: SELL,
          timestamp: 1491843278,
          blockNumber: 123456,
          gasFees: 0.001,
          inProgress: true
        };
        const marketID = '0xMARKETID';
        const marketType = BINARY;
        const maxValue = '1';
        const description = 'test description';
        const outcomeID = '1';
        const status = 'testing';

        const price = formatEther(trade.price);
        const shares = formatShares(trade.amount);
        const bnPrice = abi.bignum(trade.price);
        const tradingFees = abi.bignum(trade.takerFee);
        const bnShares = abi.bignum(trade.amount);
        const totalCost = bnShares.minus(bnPrice.times(bnShares).plus(tradingFees));
        const totalCostPerShare = totalCost.dividedBy(bnShares);

        const actual = store.dispatch(action.constructLogShortFillTxTransaction(trade, marketID, marketType, maxValue, description, outcomeID, null, status));

        const expected = {
          '0xHASH-0xTRADEID': {
            type: SHORT_SELL,
            hash: trade.transactionHash,
            status,
            description,
            data: {
              marketType,
              outcomeName: outcomeID,
              outcomeID,
              marketID,
              marketLink: {}
            },
            message: `short selling ${shares.full} for ${formatEther(totalCostPerShare).full} / share`,
            numShares: shares,
            noFeePrice: price,
            avgPrice: formatEther(totalCost.minus(bnShares).dividedBy(bnShares).abs()),
            timestamp: formatDate(new Date(trade.timestamp * 1000)),
            tradingFees: formatEther(tradingFees),
            feePercent: formatPercent(tradingFees.dividedBy(totalCost).times(100)),
            totalCost: formatEther(totalCost),
            gasFees: formatRealEther(trade.gasFees),
            blockNumber: trade.blockNumber
          }
        };

        assert.deepEqual(actual, expected, `Didn't return the expected object`);
      }
    });

    test({
      description: `should return the expected object with type scalar and inProgress`,
      assertions: (store) => {
        const trade = {
          transactionHash: '0xHASH',
          tradeid: '0xTRADEID',
          tradeGroupID: '0xTRADEGROUPID',
          price: '0.1',
          amount: '2',
          maker: false,
          takerFee: '0.01',
          type: SELL,
          timestamp: 1491843278,
          blockNumber: 123456,
          gasFees: 0.001,
          inProgress: true
        };
        const marketID = '0xMARKETID';
        const marketType = SCALAR;
        const maxValue = '1';
        const description = 'test description';
        const outcomeID = '1';
        const status = 'testing';

        const price = formatEther(trade.price);
        const shares = formatShares(trade.amount);
        const bnPrice = abi.bignum(trade.price);
        const tradingFees = abi.bignum(trade.takerFee);
        const bnShares = abi.bignum(trade.amount);
        const totalCost = abi.bignum(maxValue).times(bnShares).minus(bnPrice.times(bnShares).plus(tradingFees));
        const totalCostPerShare = totalCost.dividedBy(bnShares);

        const actual = store.dispatch(action.constructLogShortFillTxTransaction(trade, marketID, marketType, maxValue, description, outcomeID, null, status));

        const expected = {
          '0xHASH-0xTRADEID': {
            type: SHORT_SELL,
            hash: trade.transactionHash,
            status,
            description,
            data: {
              marketType,
              outcomeName: outcomeID,
              outcomeID,
              marketID,
              marketLink: {}
            },
            message: `short selling ${shares.full} for ${formatEther(totalCostPerShare).full} / share`,
            numShares: shares,
            noFeePrice: price,
            avgPrice: formatEther(totalCost.minus(bnShares).dividedBy(bnShares).abs()),
            timestamp: formatDate(new Date(trade.timestamp * 1000)),
            tradingFees: formatEther(tradingFees),
            feePercent: formatPercent(tradingFees.dividedBy(totalCost).times(100)),
            totalCost: formatEther(totalCost),
            gasFees: formatRealEther(trade.gasFees),
            blockNumber: trade.blockNumber
          }
        };

        assert.deepEqual(actual, expected, `Didn't return the expected object`);
      }
    });
  });
});
