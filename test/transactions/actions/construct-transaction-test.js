import { describe, it } from 'mocha';
import { assert } from 'chai';
import sinon from 'sinon';
import proxyquire from 'proxyquire';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';

import { abi } from 'services/augurjs';

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

import { CREATE_MARKET } from 'modules/transactions/constants/types';

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
});
