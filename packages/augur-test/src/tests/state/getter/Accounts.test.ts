import { API } from '@augurproject/sdk/build/state/getter/API';
import { DB } from '@augurproject/sdk/build/state/db/DB';
import { Action, Coin } from '@augurproject/sdk/build/state/getter/Accounts';
import {
  MarketReportingState,
} from '@augurproject/sdk/build/state/getter/Markets';
import { AllOrders } from '@augurproject/sdk/build/state/getter/Trading';
import { makeDbMock, makeProvider } from '../../../libs';
import { ContractAPI, loadSeedFile, ACCOUNTS, defaultSeedPath } from '@augurproject/tools';
import { stringTo32ByteHex } from '../../../libs/Utils';
import { BigNumber } from 'bignumber.js';
import { SECONDS_IN_A_DAY } from '@augurproject/sdk';

const mock = makeDbMock();

describe('State API :: Accounts :: ', () => {
  let db: Promise<DB>;
  let api: API;
  let john: ContractAPI;
  let mary: ContractAPI;

  beforeAll(async () => {
    const seed = await loadSeedFile(defaultSeedPath);
    const provider = await makeProvider(seed, ACCOUNTS);

    john = await ContractAPI.userWrapper(ACCOUNTS[0], provider, seed.addresses);
    mary = await ContractAPI.userWrapper(ACCOUNTS[1], provider, seed.addresses);
    db = mock.makeDB(john.augur, ACCOUNTS);
    api = new API(john.augur, db);
    await john.approveCentralAuthority();
    await mary.approveCentralAuthority();
  }, 200000);

  test(':getAccountTransactionHistory', async () => {
    // Create markets with multiple users
    const johnYesNoMarket = await john.createReasonableYesNoMarket();
    const johnCategoricalMarket = await john.createReasonableMarket([
      stringTo32ByteHex('A'),
      stringTo32ByteHex('B'),
      stringTo32ByteHex('C'),
    ]);
    const johnScalarMarket = await john.createReasonableScalarMarket();

    await (await db).sync(john.augur, mock.constants.chunkSize, 0);

    let accountTransactionHistory = await api.route(
      'getAccountTransactionHistory',
      {
        universe: john.augur.contracts.universe.address.toLowerCase(), // Test that lower-case addresses can be passed in
        account: ACCOUNTS[0].publicKey,
        action: Action.ALL,
      }
    );
    expect(accountTransactionHistory).toMatchObject([
      {
        action: 'MARKET_CREATION',
        coin: 'ETH',
        details: 'ETH validity bond for market creation',
        fee: '0',
        marketDescription: 'description',
        outcome: null,
        outcomeDescription: null,
        price: '0',
        quantity: '0',
        total: '0',
      },
      {
        action: 'MARKET_CREATION',
        coin: 'ETH',
        details: 'ETH validity bond for market creation',
        fee: '0',
        marketDescription: 'description',
        outcome: null,
        outcomeDescription: null,
        price: '0',
        quantity: '0',
        total: '0',
      },
      {
        action: 'MARKET_CREATION',
        coin: 'ETH',
        details: 'ETH validity bond for market creation',
        fee: '0',
        marketDescription: 'description',
        outcome: null,
        outcomeDescription: null,
        price: '0',
        quantity: '0',
        total: '0',
      },
    ]);

    // Place orders
    const bid = new BigNumber(0);
    const outcome0 = new BigNumber(0);
    const outcome1 = new BigNumber(1);
    const outcome2 = new BigNumber(2);
    const numShares = new BigNumber(10).pow(12);
    const price = new BigNumber(22);
    await john.placeOrder(
      johnYesNoMarket.address,
      bid,
      numShares,
      price,
      outcome0,
      stringTo32ByteHex(''),
      stringTo32ByteHex(''),
      stringTo32ByteHex('42')
    );
    await john.placeOrder(
      johnYesNoMarket.address,
      bid,
      numShares,
      price,
      outcome1,
      stringTo32ByteHex(''),
      stringTo32ByteHex(''),
      stringTo32ByteHex('42')
    );
    await john.placeOrder(
      johnYesNoMarket.address,
      bid,
      numShares,
      price,
      outcome2,
      stringTo32ByteHex(''),
      stringTo32ByteHex(''),
      stringTo32ByteHex('42')
    );
    await john.placeOrder(
      johnCategoricalMarket.address,
      bid,
      numShares,
      price,
      outcome0,
      stringTo32ByteHex(''),
      stringTo32ByteHex(''),
      stringTo32ByteHex('42')
    );
    await john.placeOrder(
      johnCategoricalMarket.address,
      bid,
      numShares,
      price,
      outcome1,
      stringTo32ByteHex(''),
      stringTo32ByteHex(''),
      stringTo32ByteHex('42')
    );
    await john.placeOrder(
      johnCategoricalMarket.address,
      bid,
      numShares,
      price,
      outcome2,
      stringTo32ByteHex(''),
      stringTo32ByteHex(''),
      stringTo32ByteHex('42')
    );
    await john.placeOrder(
      johnScalarMarket.address,
      bid,
      numShares,
      price,
      outcome0,
      stringTo32ByteHex(''),
      stringTo32ByteHex(''),
      stringTo32ByteHex('42')
    );
    await john.placeOrder(
      johnScalarMarket.address,
      bid,
      numShares,
      price,
      outcome1,
      stringTo32ByteHex(''),
      stringTo32ByteHex(''),
      stringTo32ByteHex('42')
    );
    await john.placeOrder(
      johnScalarMarket.address,
      bid,
      numShares,
      price,
      outcome2,
      stringTo32ByteHex(''),
      stringTo32ByteHex(''),
      stringTo32ByteHex('42')
    );

    await (await db).sync(john.augur, mock.constants.chunkSize, 0);

    accountTransactionHistory = await api.route(
      'getAccountTransactionHistory',
      {
        universe: john.augur.contracts.universe.address,
        account: ACCOUNTS[0].publicKey,
        action: Action.BUY,
      }
    );
    expect(accountTransactionHistory).toMatchObject([
      {
        action: 'BUY',
        coin: 'ETH',
        details: 'Buy order',
        fee: '0',
        marketDescription: 'description',
        outcome: 0,
        outcomeDescription: 'Invalid',
        price: '22',
        quantity: '1000000000000',
        total: '-22000000000000',
      },
      {
        action: 'BUY',
        coin: 'ETH',
        details: 'Buy order',
        fee: '0',
        marketDescription: 'description',
        outcome: 1,
        outcomeDescription: 'No',
        price: '22',
        quantity: '1000000000000',
        total: '-22000000000000',
      },
      {
        action: 'BUY',
        coin: 'ETH',
        details: 'Buy order',
        fee: '0',
        marketDescription: 'description',
        outcome: 2,
        outcomeDescription: 'Yes',
        price: '22',
        quantity: '1000000000000',
        total: '-22000000000000',
      },
      {
        action: 'BUY',
        coin: 'ETH',
        details: 'Buy order',
        fee: '0',
        marketDescription: 'description',
        outcome: 0,
        outcomeDescription:
          'A\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000',
        price: '22',
        quantity: '1000000000000',
        total: '-22000000000000',
      },
      {
        action: 'BUY',
        coin: 'ETH',
        details: 'Buy order',
        fee: '0',
        marketDescription: 'description',
        outcome: 1,
        outcomeDescription:
          'B\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000',
        price: '22',
        quantity: '1000000000000',
        total: '-22000000000000',
      },
      {
        action: 'BUY',
        coin: 'ETH',
        details: 'Buy order',
        fee: '0',
        marketDescription: 'description',
        outcome: 2,
        outcomeDescription:
          'C\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000',
        price: '22',
        quantity: '1000000000000',
        total: '-22000000000000',
      },
      {
        action: 'BUY',
        coin: 'ETH',
        details: 'Buy order',
        fee: '0',
        marketDescription: 'description',
        outcome: 0,
        outcomeDescription: 'Invalid',
        price: '22',
        quantity: '1000000000000',
        total: '-22000000000000',
      },
      {
        action: 'BUY',
        coin: 'ETH',
        details: 'Buy order',
        fee: '0',
        marketDescription: 'description',
        outcome: 1,
        outcomeDescription: '50000000000000000000',
        price: '22',
        quantity: '1000000000000',
        total: '-22000000000000',
      },
      {
        action: 'BUY',
        coin: 'ETH',
        details: 'Buy order',
        fee: '0',
        marketDescription: 'description',
        outcome: 2,
        outcomeDescription: '250000000000000000000',
        price: '22',
        quantity: '1000000000000',
        total: '-22000000000000',
      },
    ]);

    // Fill orders
    const cost = numShares.times(78).div(10).times(1e18);
    await mary.fillOrder(
      await john.getBestOrderId(bid, johnYesNoMarket.address, outcome0),
      numShares.div(10).times(2),
      '42',
      cost
    );
    await mary.fillOrder(
      await john.getBestOrderId(bid, johnYesNoMarket.address, outcome1),
      numShares.div(10).times(3),
      '43',
      cost
    );
    await mary.fillOrder(
      await john.getBestOrderId(bid, johnYesNoMarket.address, outcome2),
      numShares.div(10).times(3),
      '43',
      cost
    );
    await mary.fillOrder(
      await john.getBestOrderId(bid, johnCategoricalMarket.address, outcome0),
      numShares.div(10).times(2),
      '42',
      cost
    );
    await mary.fillOrder(
      await john.getBestOrderId(bid, johnCategoricalMarket.address, outcome1),
      numShares.div(10).times(3),
      '43',
      cost
    );
    await mary.fillOrder(
      await john.getBestOrderId(bid, johnCategoricalMarket.address, outcome2),
      numShares.div(10).times(3),
      '43',
      cost
    );
    await mary.fillOrder(
      await john.getBestOrderId(bid, johnScalarMarket.address, outcome0),
      numShares.div(10).times(2),
      '42',
      cost
    );
    await mary.fillOrder(
      await john.getBestOrderId(bid, johnScalarMarket.address, outcome1),
      numShares.div(10).times(3),
      '43',
      cost
    );

    await (await db).sync(john.augur, mock.constants.chunkSize, 0);

    accountTransactionHistory = await api.route(
      'getAccountTransactionHistory',
      {
        universe: john.augur.contracts.universe.address,
        account: ACCOUNTS[1].publicKey,
        action: Action.SELL,
      }
    );
    expect(accountTransactionHistory).toMatchObject([
      {
        action: 'SELL',
        coin: 'ETH',
        details: 'Sell order',
        fee: '0',
        marketDescription: 'description',
        outcome: 0,
        outcomeDescription: 'Invalid',
        price: '22',
        quantity: '800000000000',
        total: '-17600000000000',
      },
      {
        action: 'SELL',
        coin: 'ETH',
        details: 'Sell order',
        fee: '0',
        marketDescription: 'description',
        outcome: 1,
        outcomeDescription: 'No',
        price: '22',
        quantity: '700000000000',
        total: '-15400000000000',
      },
      {
        action: 'SELL',
        coin: 'ETH',
        details: 'Sell order',
        fee: '0',
        marketDescription: 'description',
        outcome: 2,
        outcomeDescription: 'Yes',
        price: '22',
        quantity: '700000000000',
        total: '-15400000000000',
      },
      {
        action: 'SELL',
        coin: 'ETH',
        details: 'Sell order',
        fee: '0',
        marketDescription: 'description',
        outcome: 0,
        outcomeDescription:
          'A\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000',
        price: '22',
        quantity: '800000000000',
        total: '-17600000000000',
      },
      {
        action: 'SELL',
        coin: 'ETH',
        details: 'Sell order',
        fee: '0',
        marketDescription: 'description',
        outcome: 1,
        outcomeDescription:
          'B\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000',
        price: '22',
        quantity: '700000000000',
        total: '-15400000000000',
      },
      {
        action: 'SELL',
        coin: 'ETH',
        details: 'Sell order',
        fee: '0',
        marketDescription: 'description',
        outcome: 2,
        outcomeDescription:
          'C\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000',
        price: '22',
        quantity: '700000000000',
        total: '-15400000000000',
      },
      {
        action: 'SELL',
        coin: 'ETH',
        details: 'Sell order',
        fee: '0',
        marketDescription: 'description',
        outcome: 0,
        outcomeDescription: 'Invalid',
        price: '22',
        quantity: '800000000000',
        total: '-17600000000000',
      },
      {
        action: 'SELL',
        coin: 'ETH',
        details: 'Sell order',
        fee: '0',
        marketDescription: 'description',
        outcome: 1,
        outcomeDescription: '50000000000000000000',
        price: '22',
        quantity: '700000000000',
        total: '-15400000000000',
      },
    ]);

    // Cancel an order
    await john.cancelOrder(
      await john.getBestOrderId(bid, johnScalarMarket.address, outcome2)
    );

    await (await db).sync(john.augur, mock.constants.chunkSize, 0);

    accountTransactionHistory = await api.route(
      'getAccountTransactionHistory',
      {
        universe: john.augur.contracts.universe.address,
        account: ACCOUNTS[0].publicKey,
        action: Action.CANCEL,
      }
    );
    expect(accountTransactionHistory).toMatchObject([
      {
        action: 'CANCEL',
        coin: 'ETH',
        details: 'Cancel order',
        fee: '0',
        marketDescription: 'description',
        outcome: 0,
        outcomeDescription: 'Invalid',
        price: '0',
        quantity: '0',
        total: '0',
      },
    ]);

    // Purchase & sell complete sets
    const numberOfCompleteSets = new BigNumber(1);
    await john.buyCompleteSets(johnYesNoMarket, numberOfCompleteSets);
    await john.sellCompleteSets(johnYesNoMarket, numberOfCompleteSets);

    await (await db).sync(john.augur, mock.constants.chunkSize, 0);

    accountTransactionHistory = await api.route(
      'getAccountTransactionHistory',
      {
        universe: john.augur.contracts.universe.address,
        account: ACCOUNTS[0].publicKey,
        action: Action.COMPLETE_SETS,
      }
    );
    expect(accountTransactionHistory).toMatchObject([
      {
        action: 'COMPLETE_SETS',
        coin: 'ETH',
        details: 'Buy complete sets',
        fee: '0',
        marketDescription: 'description',
        outcome: null,
        outcomeDescription: null,
        price: '100',
        quantity: '1',
        total: '0',
      },
      {
        action: 'COMPLETE_SETS',
        coin: 'ETH',
        details: 'Sell complete sets',
        fee: '0',
        marketDescription: 'description',
        outcome: null,
        outcomeDescription: null,
        price: '100',
        quantity: '1',
        total: '0',
      },
    ]);

    // Move time to open reporting
    let newTime = (await johnYesNoMarket.getEndTime_()).plus(
      SECONDS_IN_A_DAY.times(7)
    );
    await john.setTimestamp(newTime);

    // Submit initial report
    const noPayoutSet = [
      new BigNumber(0),
      new BigNumber(100),
      new BigNumber(0),
    ];
    const yesPayoutSet = [
      new BigNumber(0),
      new BigNumber(0),
      new BigNumber(100),
    ];
    await john.doInitialReport(johnYesNoMarket, noPayoutSet);

    await (await db).sync(john.augur, mock.constants.chunkSize, 0);

    accountTransactionHistory = await api.route(
      'getAccountTransactionHistory',
      {
        universe: john.augur.contracts.universe.address,
        account: ACCOUNTS[0].publicKey,
        action: Action.INITIAL_REPORT,
      }
    );
    expect(accountTransactionHistory).toMatchObject([
      {
        action: 'INITIAL_REPORT',
        coin: 'REP',
        details: 'REP staked in initial reports',
        fee: '0',
        marketDescription: 'description',
        outcome: 1,
        outcomeDescription: 'No',
        price: '0',
        quantity: '349680582682291667',
        total: '0',
      },
    ]);

    // Move time to dispute window start time
    const disputeWindowAddress = await johnYesNoMarket.getDisputeWindow_();
    const disputeWindow = await john.augur.contracts.disputeWindowFromAddress(
      disputeWindowAddress
    );
    newTime = new BigNumber(await disputeWindow.getStartTime_()).plus(1);
    await john.setTimestamp(newTime);

    // Purchase participation tokens
    await john.buyParticipationTokens(disputeWindow.address, new BigNumber(1));

    // Dispute 2 times
    for (let disputeRound = 1; disputeRound <= 3; disputeRound++) {
      if (disputeRound % 2 !== 0) {
        // TODO this is a problem. `mary.contribute` does not involve mary: only
        //  the market johnYesNoMarket is used
        //  this used to work because john has a ton of extra REP. now he doesn't
        const market = await mary.getMarketContract(johnYesNoMarket.address);
        await mary.contribute(
          market,
          yesPayoutSet,
          new BigNumber(25000)
        );
        const remainingToFill = await john.getRemainingToFill(
          johnYesNoMarket,
          yesPayoutSet
        );
        await mary.contribute(market, yesPayoutSet, remainingToFill);
      } else {
        await john.contribute(
          johnYesNoMarket,
          noPayoutSet,
          new BigNumber(25000)
        );
        const remainingToFill = await john.getRemainingToFill(
          johnYesNoMarket,
          noPayoutSet
        );
        await john.contribute(johnYesNoMarket, noPayoutSet, remainingToFill);
      }
    }

    await (await db).sync(john.augur, mock.constants.chunkSize, 0);

    accountTransactionHistory = await api.route(
      'getAccountTransactionHistory',
      {
        universe: john.augur.contracts.universe.address,
        account: ACCOUNTS[0].publicKey,
        action: Action.DISPUTE,
      }
    );
    expect(accountTransactionHistory).toMatchObject([
      {
        action: 'DISPUTE',
        coin: 'REP',
        details: 'REP staked in dispute crowdsourcers',
        fee: '0',
        marketDescription: 'description',
        outcome: 1,
        outcomeDescription: 'No',
        price: '0',
        quantity: '25000',
        total: '0',
      },
      {
        action: 'DISPUTE',
        coin: 'REP',
        details: 'REP staked in dispute crowdsourcers',
        fee: '0',
        marketDescription: 'description',
        outcome: 1,
        outcomeDescription: 'No',
        price: '0',
        quantity: '1049041748046850001',
        total: '0',
      },
    ]);

    // Move time forward by 2 weeks
    newTime = newTime.plus(SECONDS_IN_A_DAY.times(14));
    await john.setTimestamp(newTime);

    // Finalize markets & redeem crowdsourcer funds
    await johnYesNoMarket.finalize();

    // Transfer cash to dispute window (so participation tokens can be redeemed -- normally this would come from fees)
    await john.augur.contracts.cash.transfer(
      disputeWindow.address,
      new BigNumber(1)
    );

    // Redeem participation tokens
    await john.redeemParticipationTokens(disputeWindow.address, john.account.publicKey);

    // Claim initial reporter
    const initialReporter = await john.getInitialReporter(johnYesNoMarket);
    await initialReporter.redeem(john.account.publicKey);

    // Claim winning crowdsourcers
    const winningReportingParticipant = await john.getWinningReportingParticipant(
      johnYesNoMarket
    );
    await winningReportingParticipant.redeem(john.account.publicKey);

    // Claim trading proceeds
    await john.augur.contracts.claimTradingProceeds.claimTradingProceeds(
      johnYesNoMarket.address,
      john.account.publicKey,
      "0x0000000000000000000000000000000000000000",
    );

    await (await db).sync(john.augur, mock.constants.chunkSize, 0);

    accountTransactionHistory = await api.route(
      'getAccountTransactionHistory',
      {
        universe: john.augur.contracts.universe.address,
        account: ACCOUNTS[0].publicKey,
        action: Action.CLAIM_PARTICIPATION_TOKENS,
      }
    );
    expect(accountTransactionHistory).toMatchObject([
      {
        action: 'CLAIM_PARTICIPATION_TOKENS',
        coin: 'ETH',
        details: 'Claimed reporting fees from participation tokens',
        fee: '0',
        marketDescription: '',
        outcome: null,
        outcomeDescription: null,
        price: '0',
        quantity: '1',
        total: '1',
      },
    ]);

    accountTransactionHistory = await api.route(
      'getAccountTransactionHistory',
      {
        universe: john.augur.contracts.universe.address,
        account: ACCOUNTS[0].publicKey,
        action: Action.CLAIM_WINNING_CROWDSOURCERS,
      }
    );
    expect(accountTransactionHistory).toMatchObject([
      {
        action: 'CLAIM_WINNING_CROWDSOURCERS',
        coin: 'ETH',
        details: 'Claimed reporting fees from crowdsourcers',
        fee: '0',
        marketDescription: 'description',
        outcome: 1,
        outcomeDescription: 'No',
        price: '0',
        quantity: '0',
        total: '349680582682291667',
      },
      {
        action: 'CLAIM_WINNING_CROWDSOURCERS',
        coin: 'REP',
        details: 'Claimed REP fees from crowdsourcers',
        fee: '0',
        marketDescription: 'description',
        outcome: 1,
        outcomeDescription: 'No',
        price: '0',
        quantity: '0',
        total: '0',
      },
      {
        action: 'CLAIM_WINNING_CROWDSOURCERS',
        coin: 'ETH',
        details: 'Claimed reporting fees from crowdsourcers',
        fee: '0',
        marketDescription: 'description',
        outcome: 2,
        outcomeDescription: 'Yes',
        price: '0',
        quantity: '0',
        total: '0',
      },
      {
        action: 'CLAIM_WINNING_CROWDSOURCERS',
        coin: 'REP',
        details: 'Claimed REP fees from crowdsourcers',
        fee: '0',
        marketDescription: 'description',
        outcome: 2,
        outcomeDescription: 'Yes',
        price: '0',
        quantity: '0',
        total: '0',
      },
    ]);

    accountTransactionHistory = await api.route(
      'getAccountTransactionHistory',
      {
        universe: john.augur.contracts.universe.address,
        account: ACCOUNTS[0].publicKey,
        action: Action.CLAIM_TRADING_PROCEEDS,
      }
    );
    expect(accountTransactionHistory).toMatchObject([
      {
        action: 'CLAIM_TRADING_PROCEEDS',
        coin: 'ETH',
        details: 'Claimed trading proceeds',
        fee: '2200000000000',
        marketDescription: 'description',
        outcome: 1,
        outcomeDescription: 'No',
        price: '22',
        quantity: '100000000000',
        total: '0',
      },
      {
        action: 'CLAIM_TRADING_PROCEEDS',
        coin: 'ETH',
        details: 'Claimed trading proceeds',
        fee: '-7699000000000',
        marketDescription: 'description',
        outcome: 2,
        outcomeDescription: 'Yes',
        price: '22',
        quantity: '100000000000',
        total: '9899000000000',
      },
    ]);

    // Test earliestTransactionTime/latestTransactionTime params
    accountTransactionHistory = await api.route(
      'getAccountTransactionHistory',
      {
        universe: john.augur.contracts.universe.address,
        account: ACCOUNTS[0].publicKey,
        action: Action.ALL,
        coin: Coin.ALL,
        earliestTransactionTime: new BigNumber(
          await disputeWindow.getStartTime_()
        )
          .plus(1)
          .toNumber(),
        latestTransactionTime: (await john.getTimestamp()).toNumber(),
      }
    );
    expect(accountTransactionHistory.length).toEqual(9);

    // Test limit/offset params
    accountTransactionHistory = await api.route(
      'getAccountTransactionHistory',
      {
        universe: john.augur.contracts.universe.address,
        account: ACCOUNTS[0].publicKey,
        action: Action.ALL,
        coin: Coin.ALL,
        earliestTransactionTime: 0,
        latestTransactionTime: (await john.getTimestamp()).toNumber(),
        sortBy: 'action',
        limit: 2,
        offset: 2,
      }
    );
    expect(accountTransactionHistory).toMatchObject([
      {
        action: 'MARKET_CREATION',
        coin: 'ETH',
        details: 'ETH validity bond for market creation',
        fee: '0',
        marketDescription: 'description',
        outcome: null,
        outcomeDescription: null,
        price: '0',
        quantity: '0',
        total: '0',
      },
      {
        action: 'INITIAL_REPORT',
        coin: 'REP',
        details: 'REP staked in initial reports',
        fee: '0',
        marketDescription: 'description',
        outcome: 1,
        outcomeDescription: 'No',
        price: '0',
        quantity: '349680582682291667',
        total: '0',
      },
    ]);

    // Test isDescending param
    accountTransactionHistory = await api.route(
      'getAccountTransactionHistory',
      {
        universe: john.augur.contracts.universe.address,
        account: ACCOUNTS[0].publicKey,
        action: Action.ALL,
        coin: Coin.ALL,
        earliestTransactionTime: 0,
        latestTransactionTime: (await john.getTimestamp()).toNumber(),
        sortBy: 'action',
        isSortDescending: false,
        limit: 2,
        offset: 17,
      }
    );
    expect(accountTransactionHistory).toMatchObject([
      {
        action: 'BUY',
        coin: 'ETH',
        details: 'Buy order',
        fee: '0',
        marketDescription: 'description',
        outcome: 1,
        outcomeDescription: 'No',
        price: '22',
        quantity: '1000000000000',
        total: '-22000000000000',
      },
      {
        action: 'CANCEL',
        coin: 'ETH',
        details: 'Cancel order',
        fee: '0',
        marketDescription: 'description',
        outcome: 0,
        outcomeDescription: 'Invalid',
        price: '0',
        quantity: '0',
        total: '0',
      },
    ]);
  }, 200000);

  test(':getAllOrders', async () => {
    let allOrders: AllOrders = await api.route('getAllOrders', {
      account: john.account.publicKey,
    });
    await expect(Object.keys(allOrders).length).toEqual(8);

    allOrders = await api.route('getAllOrders', {
      account: john.account.publicKey,
      makerTaker: 'either',
    });
    await expect(Object.keys(allOrders).length).toEqual(8);

    allOrders = await api.route('getAllOrders', {
      account: john.account.publicKey,
      makerTaker: 'maker',
    });
    await expect(Object.keys(allOrders).length).toEqual(8);

    allOrders = await api.route('getAllOrders', {
      account: john.account.publicKey,
      makerTaker: 'taker',
    });
    await expect(allOrders).toEqual({});

    allOrders = await api.route('getAllOrders', {
      account: john.account.publicKey,
      ignoreReportingStates: [MarketReportingState.PreReporting],
    });
    await expect(Object.keys(allOrders).length).toEqual(8);

    allOrders = await api.route('getAllOrders', {
      account: john.account.publicKey,
      ignoreReportingStates: [MarketReportingState.DesignatedReporting],
    });
    await expect(Object.keys(allOrders).length).toEqual(8);

    allOrders = await api.route('getAllOrders', {
      account: john.account.publicKey,
      ignoreReportingStates: [MarketReportingState.OpenReporting],
    });
    await expect(Object.keys(allOrders).length).toEqual(3);

    allOrders = await api.route('getAllOrders', {
      account: john.account.publicKey,
      ignoreReportingStates: [MarketReportingState.CrowdsourcingDispute],
    });
    await expect(Object.keys(allOrders).length).toEqual(8);

    allOrders = await api.route('getAllOrders', {
      account: john.account.publicKey,
      ignoreReportingStates: [MarketReportingState.AwaitingNextWindow],
    });
    await expect(Object.keys(allOrders).length).toEqual(8);

    allOrders = await api.route('getAllOrders', {
      account: john.account.publicKey,
      ignoreReportingStates: [MarketReportingState.Finalized],
    });
    await expect(Object.keys(allOrders).length).toEqual(5);

    allOrders = await api.route('getAllOrders', {
      account: john.account.publicKey,
      ignoreReportingStates: [MarketReportingState.Forking],
    });
    await expect(Object.keys(allOrders).length).toEqual(8);

    allOrders = await api.route('getAllOrders', {
      account: john.account.publicKey,
      ignoreReportingStates: [MarketReportingState.AwaitingNoReportMigration],
    });
    await expect(Object.keys(allOrders).length).toEqual(8);

    allOrders = await api.route('getAllOrders', {
      account: john.account.publicKey,
      ignoreReportingStates: [MarketReportingState.AwaitingForkMigration],
    });
    await expect(Object.keys(allOrders).length).toEqual(8);
  }, 60000);
});
