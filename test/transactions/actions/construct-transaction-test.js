import { describe, it } from 'mocha';
import { assert } from 'chai';
import sinon from 'sinon';
import proxyquire from 'proxyquire';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';

import { abi } from 'services/augurjs';

import { formatRealEther, formatEther, formatRep, formatPercent } from 'utils/format-number';
import { formatDate } from 'utils/format-date';

import {
  constructBasicTransaction,
  constructDefaultTransaction,
  constructApprovalTransaction,
  constructCollectedFeesTransaction,
  constructDepositTransaction,
  constructRegistrationTransaction,
  constructPenalizationCaughtUpTransaction
} from 'modules/transactions/actions/construct-transaction';

describe('modules/transactions/actions/contruct-transaction.js', () => {
  proxyquire.noPreserveCache().noCallThru();

  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);

  const MOCK_ACTION_TYPES = {
    LOAD_MARKET_THEN_RETRY_CONVERSION: 'LOAD_MARKET_THEN_RETRY_CONVERSION',
    LOOKUP_EVENT_MARKETS_THEN_RETRY_CONVERSION: 'LOOKUP_EVENT_MARKETS_THEN_RETRY_CONVERSION'
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
});
