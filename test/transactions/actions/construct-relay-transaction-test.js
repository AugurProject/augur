import { describe, it } from 'mocha';
import { assert } from 'chai';
import Augur from 'augur.js';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

describe(`modules/transactions/actions/construct-relay-transaction.js`, function () { // eslint-disable-line func-names, prefer-arrow-callback
  proxyquire.noPreserveCache();
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  const augur = new Augur();

  // save the default result for calling augur.trading.simulation.getTxGasEth
  const defaultTxGasEth = augur.abi.unfix(augur.abi.bignum(augur.rpc.constants.DEFAULT_GAS).times(augur.abi.bignum(augur.constants.DEFAULT_GASPRICE))).toFixed();
  const functionsAPI = augur.api;
  const contractAddresses = {
    Backstops: '0x708fdfe18bf28afe861a69e95419d183ace003eb',
    Branches: '0x482c57abdce592b39434e3f619ffc3db62ab6d01',
    BuyAndSellShares: '0xd70c6e1f3857d23bd96c3e4d2ec346fa7c3931f3',
    Cash: '0xbd19195b9e8a2d8ed14fc3a2823856b5c16f7f55',
    CloseMarket: '0x3f3276849a878a176b2f02dd48a483e8182a49e4',
    CollectFees: '0x81a7621e9a286d061b3dea040888a51c96693b1c',
    CompleteSets: '0x60cb05deb51f92ee25ce99f67181ecaeb0b743ea',
    CompositeGetters: '0x4803e0b158ab66eae81a48bba2799f905c379eb2',
    Consensus: '0xc1c4e2f32e4b84a60b8b7983b6356af4269aab79',
    ConsensusData: '0x4a61f3db785f1e2a23ffefeafaceeef2df551667',
    CreateBranch: '0x9fe69262bbaa47f013b7dbd6ca5f01e17446c645',
    CreateMarket: '0x2e5a882aa53805f1a9da3cf18f73673bca98fa0f',
    EventResolution: '0x35152caa07026203a1add680771afb690d872d7d',
    Events: '0x8f2c2267687cb0f047b28a1b6f945da6e101a0d7',
    ExpiringEvents: '0xe4714fcbdcdba49629bc408183ef40d120700b8d',
    Faucets: '0xc21cfa6688dbfd2eca2548d894aa55fd0bbf1c7e',
    ForkPenalize: '0xd15a6cfc462ae76b9ec590cab8b34bfa8e1302d7',
    Forking: '0xcd6c7bc634257f82903b182142aae7156d72a200',
    FxpFunctions: '0xe5b327630cfa7f4b2324f9066c897dceecfd88a3',
    Info: '0x8a4e2993a9972ee035453bb5674816fc3a698718',
    MakeReports: '0x8c19616de17acdfbc933b99d9f529a689d22098f',
    Markets: '0x8caf2c0ce7cdc2e81b58f74322cefdef440b3f8d',
    Payout: '0x52ccb0490bc81a2ae363fccbb2b367bca546cec7',
    PenalizationCatchup: '0xabe47f122a496a732d6c4b38b3ca376d597d75dd',
    PenalizeNotEnoughReports: '0x5f67ab9ff79be97b27ac8f26ef9f4b429b82e2df',
    ProportionCorrect: '0x0fbddb6bfb81c8d0965a894567cf4061446072c2',
    Register: '0xa34c9f6fc047cea795f69b34a063d32e6cb6288c',
    Reporting: '0x77c424f86a1b80f1e303d1c2651acd6aba653cb6',
    ReportingThreshold: '0x6c4c9fa11d6d8ed2c7a08ddcf4d4654c85194f68',
    RoundTwo: '0x9308cf21b5a11f182f9707ca284bbb71bb84f893',
    RoundTwoPenalize: '0x7d4b581a0868204b7481c316b430a97fd292a2fb',
    SendReputation: '0x70a893eb9569041e97a3787f0c76a1eb6378d8b2',
    SlashRep: '0x5069d883e31429c6dd1325d961f443007747c7a2',
    Trade: '0x031d9d02520cc708ea3c865278508c9cdb92bd51',
    Trades: '0x448c01a2e1fd6c2ef133402c403d2f48c99993e7'
  };

  beforeEach(() => {
    this.clock = sinon.useFakeTimers(1485907200000);
  });

  after(() => {
    this.clock.restore();
  });

  const test = (t) => {
    it(t.description, () => {
      const store = mockStore(t.state);
      const AugurJS = {
        abi: {
          bignum: (n, type) => augur.abi.bignum(n, type),
          format_int256: n => augur.abi.format_int256(n),
          unfix: (n, type) => augur.abi.unfix(n, type),
          unfix_signed: (n, type) => augur.abi.unfix_signed(n, type)
        },
        augur: {
          api: augur.api,
          create: {
            calculateRequiredMarketValue: augur.create.calculateRequiredMarketValue,
            calculateValidityBond: augur.create.calculateValidityBond,
          },
          trading: {
            takeOrder: { selectOrder: () => {} },
            simulation: { getTxGasEth: augur.trading.simulation.getTxGasEth }
          },
        },
        rpc: {
          gasPrice: 20000000000
        }
      };
      const ConstructTransaction = {
        constructTradingTransaction: () => {},
        constructTransaction: () => {}
      };
      const DeleteTransaction = {
        deleteTransaction: () => {}
      };
      const Market = {
        selectMarketFromEventID: () => {}
      };
      AugurJS.augur.trading.takeOrder.selectOrder = sinon.stub().returns(t.selectors.order);
      const UpdateTradeCommitment = {
        updateTradeCommitment: () => {}
      };
      const WinningPositions = sinon.stub().returns(t.selectors.winningPositions);
      const action = proxyquire('../../../src/modules/transactions/actions/construct-relay-transaction.js', {
        '../../../services/augurjs': AugurJS,
        '../../trade/actions/update-trade-commitment': UpdateTradeCommitment,
        './delete-transaction': DeleteTransaction,
        './construct-transaction': ConstructTransaction,
        '../../market/selectors/market': Market,
        '../../my-positions/selectors/winning-positions': WinningPositions
      });
      sinon.stub(Market, 'selectMarketFromEventID', eventID => t.selectors.marketFromEventID[eventID]);
      sinon.stub(ConstructTransaction, 'constructTradingTransaction', (label, trade, marketID, outcomeID, status) => (
        (dispatch) => {
          dispatch({ type: 'CONSTRUCT_TRADING_TRANSACTION', label, trade, marketID, outcomeID, status });
          return { label, trade, marketID, outcomeID, status };
        }
      ));
      sinon.stub(ConstructTransaction, 'constructTransaction', (label, log) => (
        (dispatch) => {
          dispatch({ type: 'CONSTRUCT_TRANSACTION', label, log });
          return { label, log };
        }
      ));
      sinon.stub(UpdateTradeCommitment, 'updateTradeCommitment', tradeCommitment => dispatch => (
        dispatch({ type: 'UPDATE_TRADE_COMMITMENT', tradeCommitment })
      ));
      const relayTransaction = store.dispatch(action.constructRelayTransaction(t.params.tx, t.params.status));
      t.assertions(store.getActions(), relayTransaction);
      store.clearActions();
    });
  };

  test({
    description: 'construct relayed buy transaction (sent)',
    params: {
      status: 'sent',
      tx: {
        type: 'Bid',
        status: 'sent',
        hash: '0x5bde43fc683d39c9f449424760401b2de067c8bda09acbf4c61dc923c0c98878',
        data: {
          events: [
            'log_add_tx',
            'sentCash'
          ],
          gas: 725202,
          inputs: [
            'amount',
            'price',
            'market',
            'outcome',
            'minimumTradeSize',
            'tradeGroupID'
          ],
          label: 'Bid',
          name: 'buy',
          mutable: true,
          send: true,
          signature: [
            'int256',
            'int256',
            'int256',
            'int256',
            'int256',
            'int256'
          ],
          to: '0xd70c6e1f3857d23bd96c3e4d2ec346fa7c3931f3',
          from: '0xdceb761b558e202c993f447b470a89cec2a3b6e9',
          params: [
            '0x4563918244f40000',
            '0x6f05b59d3b20000',
            '0xf7f7c43852ae0a73fe2a668b1a74a111848abeeff1797789f5b900e59eab25a2',
            '2',
            '0x2386f26fc10000',
            '0x00000000000000000000000000000000f26324c70bfc4d83a68fd9e01c9fb036'
          ]
        },
        response: {
          hash: '0x5bde43fc683d39c9f449424760401b2de067c8bda09acbf4c61dc923c0c98878',
          txHash: '0x5bde43fc683d39c9f449424760401b2de067c8bda09acbf4c61dc923c0c98878',
          callReturn: null
        }
      }
    },
    state: {
      branch: {
        id: '0xb1',
        reportPeriod: 7,
        baseReporters: 6,
        numEventsCreatedInPast24Hours: 10,
        numEventsInReportPeriod: 3
      },
      loginAccount: {
        address: '0x0000000000000000000000000000000000000b0b'
      },
      tradeCommitment: {},
      contractAddresses,
      functionsAPI,
      marketsData: {
        '0xf7f7c43852ae0a73fe2a668b1a74a111848abeeff1797789f5b900e59eab25a2': {
          description: 'test market'
        }
      }
    },
    selectors: {
      marketFromEventID: {
        '0xe1': {
          id: '0xa1',
          reportedOutcome: '2'
        }
      }
    },
    assertions: (actions, relayTransaction) => {
      const expectedRelayTransaction = {
        label: 'log_add_tx',
        trade: {
          type: 'buy',
          amount: '5',
          price: '0.5',
          market: '0xf7f7c43852ae0a73fe2a668b1a74a111848abeeff1797789f5b900e59eab25a2',
          outcome: '2',
          minimumTradeSize: '0x2386f26fc10000',
          tradeGroupID: '0x00000000000000000000000000000000f26324c70bfc4d83a68fd9e01c9fb036',
          transactionHash: '0x5bde43fc683d39c9f449424760401b2de067c8bda09acbf4c61dc923c0c98878',
          blockNumber: undefined,
          timestamp: relayTransaction.trade.timestamp,
          inProgress: true,
          gasFees: defaultTxGasEth
        },
        marketID: '0xf7f7c43852ae0a73fe2a668b1a74a111848abeeff1797789f5b900e59eab25a2',
        outcomeID: '2',
        status: 'sent',
      };
      const expected = [
        {
          data: {
            notification: {
              description: 'test market',
              href: '/?page=transactions',
              id: '0x5bde43fc683d39c9f449424760401b2de067c8bda09acbf4c61dc923c0c98878',
              seen: false,
              timestamp: 1485907200,
              title: 'Bid 5 Shares - sent',
            }
          },
          type: 'ADD_NOTIFICATION'
        },
        {
          ...expectedRelayTransaction,
          type: 'CONSTRUCT_TRADING_TRANSACTION'
        }
      ];

      assert.deepEqual(actions, expected);
      assert.deepEqual(relayTransaction, expectedRelayTransaction);
    }
  });

  test({
    description: 'construct relayed buy transaction (success)',
    params: {
      status: 'success',
      tx: {
        type: 'Bid',
        status: 'success',
        hash: '0x5bde43fc683d39c9f449424760401b2de067c8bda09acbf4c61dc923c0c98878',
        data: {
          events: [
            'log_add_tx',
            'sentCash'
          ],
          gas: 725202,
          inputs: [
            'amount',
            'price',
            'market',
            'outcome',
            'minimumTradeSize',
            'tradeGroupID'
          ],
          label: 'Bid',
          name: 'buy',
          mutable: true,
          send: true,
          signature: [
            'int256',
            'int256',
            'int256',
            'int256',
            'int256',
            'int256'
          ],
          to: '0xd70c6e1f3857d23bd96c3e4d2ec346fa7c3931f3',
          from: '0xdceb761b558e202c993f447b470a89cec2a3b6e9',
          params: [
            '0x4563918244f40000',
            '0x6f05b59d3b20000',
            '0xf7f7c43852ae0a73fe2a668b1a74a111848abeeff1797789f5b900e59eab25a2',
            '2',
            '0x2386f26fc10000',
            '0x00000000000000000000000000000000f26324c70bfc4d83a68fd9e01c9fb036'
          ]
        },
        response: {
          blockHash: '0xc7dbd9d454ca4ff9d846f1850c8c6c4f53ec92562b4076d415f1d68b89d278f7',
          blockNumber: 1741,
          from: '0xdceb761b558e202c993f447b470a89cec2a3b6e9',
          gas: '0x47e7c4',
          gasPrice: '0x4a817c800',
          hash: '0x5bde43fc683d39c9f449424760401b2de067c8bda09acbf4c61dc923c0c98878',
          input: '0x2187e6510000000000000000000000000000000000000000000000004563918244f4000000000000000000000000000000000000000000000000000006f05b59d3b20000f7f7c43852ae0a73fe2a668b1a74a111848abeeff1797789f5b900e59eab25a20000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000002386f26fc1000000000000000000000000000000000000f26324c70bfc4d83a68fd9e01c9fb036',
          nonce: '0x58',
          to: '0xd70c6e1f3857d23bd96c3e4d2ec346fa7c3931f3',
          transactionIndex: '0x0',
          value: '0x0',
          v: '0x1b',
          r: '0x204dd301bd7df803c7b906bfda582bae8eae92b44f926ac3cf852ff68d7b0689',
          s: '0x71565aa9a50e71c8a445ff734bf54382d0fa1733fb941c4616165fff6063180',
          timestamp: 1484208293,
          callReturn: '0x4a330392e495bdca39dd7d8617397502a21e5c6d975364471adfe76aea4b2ce7',
          gasFees: '0.00651868'
        }
      }
    },
    state: {
      branch: {
        id: '0xb1',
        reportPeriod: 7,
        baseReporters: 6,
        numEventsCreatedInPast24Hours: 10,
        numEventsInReportPeriod: 3
      },
      loginAccount: {
        address: '0x0000000000000000000000000000000000000b0b'
      },
      tradeCommitment: {},
      contractAddresses,
      functionsAPI,
      marketsData: {
        '0xf7f7c43852ae0a73fe2a668b1a74a111848abeeff1797789f5b900e59eab25a2': {
          description: 'test market'
        }
      }
    },
    selectors: {
      marketFromEventID: {
        '0xe1': {
          id: '0xa1',
          reportedOutcome: '2'
        }
      }
    },
    assertions: (actions, relayTransaction) => {
      const expectedRelayTransaction = {
        label: 'log_add_tx',
        trade: {
          type: 'buy',
          amount: '5',
          price: '0.5',
          market: '0xf7f7c43852ae0a73fe2a668b1a74a111848abeeff1797789f5b900e59eab25a2',
          outcome: '2',
          minimumTradeSize: '0x2386f26fc10000',
          tradeGroupID: '0x00000000000000000000000000000000f26324c70bfc4d83a68fd9e01c9fb036',
          transactionHash: '0x5bde43fc683d39c9f449424760401b2de067c8bda09acbf4c61dc923c0c98878',
          blockNumber: 0x1741,
          timestamp: 1484208293,
          inProgress: false,
          gasFees: '0.00651868'
        },
        marketID: '0xf7f7c43852ae0a73fe2a668b1a74a111848abeeff1797789f5b900e59eab25a2',
        outcomeID: '2',
        status: 'success'
      };
      const expected = [
        {
          data: {
            notification: {
              description: 'test market',
              href: '/?page=transactions',
              id: '0x5bde43fc683d39c9f449424760401b2de067c8bda09acbf4c61dc923c0c98878',
              seen: false,
              timestamp: 1484208293,
              title: 'Bid 5 Shares - success',
            }
          },
          type: 'ADD_NOTIFICATION'
        },
        {
          ...expectedRelayTransaction,
          type: 'CONSTRUCT_TRADING_TRANSACTION'
        }
      ];
      assert.deepEqual(actions, expected);
      assert.deepEqual(relayTransaction, expectedRelayTransaction);
    }
  });

  test({
    description: 'construct relayed shortAsk transaction (sent)',
    params: {
      status: 'sent',
      tx: {
        type: 'Short Ask',
        status: 'sent',
        hash: '0xe8109915cb0972d1aae971014ded4c744b7ad688704b0a973f626c42220a9ba4',
        data: {
          events: [
            'completeSets_logReturn',
            'sentCash',
            'log_add_tx'
          ],
          gas: 1500000,
          inputs: [
            'amount',
            'price',
            'market',
            'outcome',
            'minimumTradeSize',
            'tradeGroupID'
          ],
          label: 'Short Ask',
          name: 'shortAsk',
          mutable: true,
          signature: [
            'int256',
            'int256',
            'int256',
            'int256',
            'int256',
            'int256'
          ],
          to: '0xd70c6e1f3857d23bd96c3e4d2ec346fa7c3931f3',
          from: '0xdceb761b558e202c993f447b470a89cec2a3b6e9',
          params: [
            '0x4563918244f40000',
            '0x853a0d2313c0000',
            '0xf7f7c43852ae0a73fe2a668b1a74a111848abeeff1797789f5b900e59eab25a2',
            '2',
            '0x2386f26fc10000',
            '0x000000000000000000000000000000008a649a9af5874931863de583aea36e17'
          ],
          send: true,
          returns: 'int256'
        },
        response: {
          hash: '0xe8109915cb0972d1aae971014ded4c744b7ad688704b0a973f626c42220a9ba4',
          txHash: '0xe8109915cb0972d1aae971014ded4c744b7ad688704b0a973f626c42220a9ba4',
          callReturn: null
        }
      }
    },
    state: {
      branch: {
        id: '0xb1',
        reportPeriod: 7,
        baseReporters: 6,
        numEventsCreatedInPast24Hours: 10,
        numEventsInReportPeriod: 3
      },
      loginAccount: {
        address: '0x0000000000000000000000000000000000000b0b'
      },
      tradeCommitment: {},
      contractAddresses,
      functionsAPI,
      marketsData: {
        '0xf7f7c43852ae0a73fe2a668b1a74a111848abeeff1797789f5b900e59eab25a2': {
          description: 'test market'
        }
      }
    },
    selectors: {
      marketFromEventID: {
        '0xe1': {
          id: '0xa1',
          reportedOutcome: '2'
        }
      }
    },
    assertions: (actions, relayTransaction) => {
      const expectedRelayTransaction = {
        label: 'log_add_tx',
        trade: {
          type: 'sell',
          amount: '5',
          price: '0.6',
          market: '0xf7f7c43852ae0a73fe2a668b1a74a111848abeeff1797789f5b900e59eab25a2',
          outcome: '2',
          minimumTradeSize: '0x2386f26fc10000',
          tradeGroupID: '0x000000000000000000000000000000008a649a9af5874931863de583aea36e17',
          transactionHash: '0xe8109915cb0972d1aae971014ded4c744b7ad688704b0a973f626c42220a9ba4',
          blockNumber: undefined,
          timestamp: relayTransaction.trade.timestamp,
          inProgress: true,
          isShortAsk: true,
          gasFees: defaultTxGasEth
        },
        marketID: '0xf7f7c43852ae0a73fe2a668b1a74a111848abeeff1797789f5b900e59eab25a2',
        outcomeID: '2',
        status: 'sent'
      };
      const expected = [
        {
          data: {
            notification: {
              description: 'test market',
              href: '/?page=transactions',
              id: '0xe8109915cb0972d1aae971014ded4c744b7ad688704b0a973f626c42220a9ba4',
              seen: false,
              timestamp: 1485907200,
              title: 'short ask 5 Shares - sent',
            }
          },
          type: 'ADD_NOTIFICATION'
        },
        {
          ...expectedRelayTransaction,
          type: 'CONSTRUCT_TRADING_TRANSACTION'
        }
      ];
      assert.deepEqual(actions, expected);
      assert.deepEqual(relayTransaction, expectedRelayTransaction);
    }
  });

  test({
    description: 'construct relayed shortAsk transaction (success)',
    params: {
      status: 'success',
      tx: {
        type: 'Short Ask',
        status: 'success',
        hash: '0xe8109915cb0972d1aae971014ded4c744b7ad688704b0a973f626c42220a9ba4',
        data: {
          events: [
            'completeSets_logReturn',
            'sentCash',
            'log_add_tx'
          ],
          gas: 1500000,
          inputs: [
            'amount',
            'price',
            'market',
            'outcome',
            'minimumTradeSize',
            'tradeGroupID'
          ],
          label: 'Short Ask',
          name: 'shortAsk',
          mutable: true,
          signature: [
            'int256',
            'int256',
            'int256',
            'int256',
            'int256',
            'int256'
          ],
          to: '0xd70c6e1f3857d23bd96c3e4d2ec346fa7c3931f3',
          from: '0xdceb761b558e202c993f447b470a89cec2a3b6e9',
          params: [
            '0x4563918244f40000',
            '0x853a0d2313c0000',
            '0xf7f7c43852ae0a73fe2a668b1a74a111848abeeff1797789f5b900e59eab25a2',
            '2',
            '0x2386f26fc10000',
            '0x000000000000000000000000000000008a649a9af5874931863de583aea36e17'
          ],
          send: true,
          returns: 'int256'
        },
        response: {
          blockHash: '0xa64a20e1a8b3e2f1cb610ef0f88ab0b5156d8805caeed634b555b74aa4510073',
          blockNumber: 1805,
          from: '0xdceb761b558e202c993f447b470a89cec2a3b6e9',
          gas: '0x47e7c4',
          gasPrice: '0x4a817c800',
          hash: '0xe8109915cb0972d1aae971014ded4c744b7ad688704b0a973f626c42220a9ba4',
          input: '0x70f48c290000000000000000000000000000000000000000000000004563918244f400000000000000000000000000000000000000000000000000000853a0d2313c0000f7f7c43852ae0a73fe2a668b1a74a111848abeeff1797789f5b900e59eab25a20000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000002386f26fc10000000000000000000000000000000000008a649a9af5874931863de583aea36e17',
          nonce: '0x5b',
          to: '0xd70c6e1f3857d23bd96c3e4d2ec346fa7c3931f3',
          transactionIndex: '0x0',
          value: '0x0',
          v: '0x1b',
          r: '0x802d88fbd1edfdee30697a67f1383965887540d02b64dcc5be52630d1916f721',
          s: '0x76e5c667116873a6d1afef14e69c89648bc5231b35bfc4ed182f0665a232ba8b',
          timestamp: 1484210643,
          callReturn: '0x647788c0acbffb675493a93a3c0c8d10732c88be9166b8c5bb1299121841c161',
          gasFees: '0.01090406'
        }
      }
    },
    state: {
      branch: {
        id: '0xb1',
        reportPeriod: 7,
        baseReporters: 6,
        numEventsCreatedInPast24Hours: 10,
        numEventsInReportPeriod: 3
      },
      loginAccount: {
        address: '0x0000000000000000000000000000000000000b0b'
      },
      tradeCommitment: {},
      contractAddresses,
      functionsAPI,
      marketsData: {
        '0xf7f7c43852ae0a73fe2a668b1a74a111848abeeff1797789f5b900e59eab25a2': {
          description: 'test market'
        }
      }
    },
    selectors: {
      marketFromEventID: {
        '0xe1': {
          id: '0xa1',
          reportedOutcome: '2'
        }
      }
    },
    assertions: (actions, relayTransaction) => {
      const expectedRelayTransaction = {
        label: 'log_add_tx',
        trade: {
          type: 'sell',
          amount: '5',
          market: '0xf7f7c43852ae0a73fe2a668b1a74a111848abeeff1797789f5b900e59eab25a2',
          outcome: '2',
          price: '0.6',
          minimumTradeSize: '0x2386f26fc10000',
          tradeGroupID: '0x000000000000000000000000000000008a649a9af5874931863de583aea36e17',
          transactionHash: '0xe8109915cb0972d1aae971014ded4c744b7ad688704b0a973f626c42220a9ba4',
          blockNumber: 0x1805,
          timestamp: 1484210643,
          inProgress: false,
          isShortAsk: true,
          gasFees: '0.01090406'
        },
        marketID: '0xf7f7c43852ae0a73fe2a668b1a74a111848abeeff1797789f5b900e59eab25a2',
        outcomeID: '2',
        status: 'success'
      };
      const expected = [
        {
          data: {
            notification: {
              description: 'test market',
              href: '/?page=transactions',
              id: '0xe8109915cb0972d1aae971014ded4c744b7ad688704b0a973f626c42220a9ba4',
              seen: false,
              timestamp: 1484210643,
              title: 'short ask 5 Shares - success',
            }
          },
          type: 'ADD_NOTIFICATION'
        },
        {
          ...expectedRelayTransaction,
          type: 'CONSTRUCT_TRADING_TRANSACTION'
        }
      ];
      assert.deepEqual(actions, expected);
      assert.deepEqual(relayTransaction, expectedRelayTransaction);
    }
  });

  test({
    description: 'construct relayed sell transaction (sent)',
    params: {
      status: 'sent',
      tx: {
        type: 'Ask',
        status: 'sent',
        hash: '0xe8109915cb0972d1aae971014ded4c744b7ad688704b0a973f626c42220a9ba4',
        data: {
          events: [
            'sentCash',
            'log_add_tx'
          ],
          gas: 1500000,
          inputs: [
            'amount',
            'price',
            'market',
            'outcome',
            'minimumTradeSize',
            'tradeGroupID'
          ],
          label: 'Ask',
          name: 'sell',
          mutable: true,
          signature: [
            'int256',
            'int256',
            'int256',
            'int256',
            'int256',
            'int256'
          ],
          to: '0xd70c6e1f3857d23bd96c3e4d2ec346fa7c3931f3',
          from: '0xdceb761b558e202c993f447b470a89cec2a3b6e9',
          params: [
            '0x4563918244f40000',
            '0x853a0d2313c0000',
            '0xf7f7c43852ae0a73fe2a668b1a74a111848abeeff1797789f5b900e59eab25a2',
            '2',
            '0x2386f26fc10000',
            '0x000000000000000000000000000000008a649a9af5874931863de583aea36e17'
          ],
          send: true,
          returns: 'int256'
        },
        response: {
          hash: '0xe8109915cb0972d1aae971014ded4c744b7ad688704b0a973f626c42220a9ba4',
          txHash: '0xe8109915cb0972d1aae971014ded4c744b7ad688704b0a973f626c42220a9ba4',
          callReturn: null
        }
      }
    },
    state: {
      branch: {
        id: '0xb1',
        reportPeriod: 7,
        baseReporters: 6,
        numEventsCreatedInPast24Hours: 10,
        numEventsInReportPeriod: 3
      },
      loginAccount: {
        address: '0x0000000000000000000000000000000000000b0b'
      },
      tradeCommitment: {},
      contractAddresses,
      functionsAPI,
      marketsData: {
        '0xf7f7c43852ae0a73fe2a668b1a74a111848abeeff1797789f5b900e59eab25a2': {
          description: 'test market'
        }
      }
    },
    selectors: {
      marketFromEventID: {
        '0xe1': {
          id: '0xa1',
          reportedOutcome: '2'
        }
      }
    },
    assertions: (actions, relayTransaction) => {
      const expectedRelayTransaction = {
        label: 'log_add_tx',
        trade: {
          type: 'sell',
          amount: '5',
          price: '0.6',
          market: '0xf7f7c43852ae0a73fe2a668b1a74a111848abeeff1797789f5b900e59eab25a2',
          outcome: '2',
          minimumTradeSize: '0x2386f26fc10000',
          tradeGroupID: '0x000000000000000000000000000000008a649a9af5874931863de583aea36e17',
          transactionHash: '0xe8109915cb0972d1aae971014ded4c744b7ad688704b0a973f626c42220a9ba4',
          blockNumber: undefined,
          timestamp: relayTransaction.trade.timestamp,
          inProgress: true,
          gasFees: defaultTxGasEth
        },
        marketID: '0xf7f7c43852ae0a73fe2a668b1a74a111848abeeff1797789f5b900e59eab25a2',
        outcomeID: '2',
        status: 'sent'
      };
      const expected = [
        {
          data: {
            notification: {
              description: 'test market',
              href: '/?page=transactions',
              id: '0xe8109915cb0972d1aae971014ded4c744b7ad688704b0a973f626c42220a9ba4',
              seen: false,
              timestamp: 1485907200,
              title: 'ask 5 Shares - sent',
            }
          },
          type: 'ADD_NOTIFICATION'
        },
        {
          ...expectedRelayTransaction,
          type: 'CONSTRUCT_TRADING_TRANSACTION'
        }
      ];
      assert.deepEqual(actions, expected);
      assert.deepEqual(relayTransaction, expectedRelayTransaction);
    }
  });

  test({
    description: 'construct relayed sell transaction (success)',
    params: {
      status: 'success',
      hash: '0xe8109915cb0972d1aae971014ded4c744b7ad688704b0a973f626c42220a9ba4',
      tx: {
        type: 'Ask',
        status: 'success',
        hash: '0xe8109915cb0972d1aae971014ded4c744b7ad688704b0a973f626c42220a9ba4',
        data: {
          events: [
            'sentCash',
            'log_add_tx'
          ],
          gas: 1500000,
          inputs: [
            'amount',
            'price',
            'market',
            'outcome',
            'minimumTradeSize',
            'tradeGroupID'
          ],
          label: 'Ask',
          name: 'sell',
          mutable: true,
          signature: [
            'int256',
            'int256',
            'int256',
            'int256',
            'int256',
            'int256'
          ],
          to: '0xd70c6e1f3857d23bd96c3e4d2ec346fa7c3931f3',
          from: '0xdceb761b558e202c993f447b470a89cec2a3b6e9',
          params: [
            '0x4563918244f40000',
            '0x853a0d2313c0000',
            '0xf7f7c43852ae0a73fe2a668b1a74a111848abeeff1797789f5b900e59eab25a2',
            '2',
            '0x2386f26fc10000',
            '0x000000000000000000000000000000008a649a9af5874931863de583aea36e17'
          ],
          send: true,
          returns: 'int256'
        },
        response: {
          blockHash: '0xa64a20e1a8b3e2f1cb610ef0f88ab0b5156d8805caeed634b555b74aa4510073',
          blockNumber: 1805,
          from: '0xdceb761b558e202c993f447b470a89cec2a3b6e9',
          gas: '0x47e7c4',
          gasPrice: '0x4a817c800',
          hash: '0xe8109915cb0972d1aae971014ded4c744b7ad688704b0a973f626c42220a9ba4',
          input: '0x70f48c290000000000000000000000000000000000000000000000004563918244f400000000000000000000000000000000000000000000000000000853a0d2313c0000f7f7c43852ae0a73fe2a668b1a74a111848abeeff1797789f5b900e59eab25a20000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000002386f26fc10000000000000000000000000000000000008a649a9af5874931863de583aea36e17',
          nonce: '0x5b',
          to: '0xd70c6e1f3857d23bd96c3e4d2ec346fa7c3931f3',
          transactionIndex: '0x0',
          value: '0x0',
          v: '0x1b',
          r: '0x802d88fbd1edfdee30697a67f1383965887540d02b64dcc5be52630d1916f721',
          s: '0x76e5c667116873a6d1afef14e69c89648bc5231b35bfc4ed182f0665a232ba8b',
          timestamp: 1484210643,
          callReturn: '0x647788c0acbffb675493a93a3c0c8d10732c88be9166b8c5bb1299121841c161',
          gasFees: '0.01090406'
        }
      }
    },
    state: {
      branch: {
        id: '0xb1',
        reportPeriod: 7,
        baseReporters: 6,
        numEventsCreatedInPast24Hours: 10,
        numEventsInReportPeriod: 3
      },
      loginAccount: {
        address: '0x0000000000000000000000000000000000000b0b'
      },
      tradeCommitment: {},
      contractAddresses,
      functionsAPI,
      marketsData: {
        '0xf7f7c43852ae0a73fe2a668b1a74a111848abeeff1797789f5b900e59eab25a2': {
          description: 'test market'
        }
      }
    },
    selectors: {
      marketFromEventID: {
        '0xe1': {
          id: '0xa1',
          reportedOutcome: '2'
        }
      }
    },
    assertions: (actions, relayTransaction) => {
      const expectedRelayTransaction = {
        label: 'log_add_tx',
        trade: {
          type: 'sell',
          amount: '5',
          market: '0xf7f7c43852ae0a73fe2a668b1a74a111848abeeff1797789f5b900e59eab25a2',
          outcome: '2',
          price: '0.6',
          minimumTradeSize: '0x2386f26fc10000',
          tradeGroupID: '0x000000000000000000000000000000008a649a9af5874931863de583aea36e17',
          transactionHash: '0xe8109915cb0972d1aae971014ded4c744b7ad688704b0a973f626c42220a9ba4',
          blockNumber: 0x1805,
          timestamp: 1484210643,
          inProgress: false,
          gasFees: '0.01090406'
        },
        marketID: '0xf7f7c43852ae0a73fe2a668b1a74a111848abeeff1797789f5b900e59eab25a2',
        outcomeID: '2',
        status: 'success'
      };
      const expected = [
        {
          data: {
            notification: {
              description: 'test market',
              href: '/?page=transactions',
              id: '0xe8109915cb0972d1aae971014ded4c744b7ad688704b0a973f626c42220a9ba4',
              seen: false,
              timestamp: 1484210643,
              title: 'ask 5 Shares - success',
            }
          },
          type: 'ADD_NOTIFICATION'
        },
        {
          ...expectedRelayTransaction,
          type: 'CONSTRUCT_TRADING_TRANSACTION'
        }
      ];
      assert.deepEqual(actions, expected);
      assert.deepEqual(relayTransaction, expectedRelayTransaction);
    }
  });
});
