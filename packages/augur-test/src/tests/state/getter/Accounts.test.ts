import { API } from '@augurproject/sdk/build/state/getter/API';
import { DB } from '@augurproject/sdk/build/state/db/DB';
import { Action, Coin } from '@augurproject/sdk/build/state/getter/Accounts';
import { makeDbMock, makeProvider } from '../../../libs';
import { ContractAPI, loadSeedFile, ACCOUNTS, defaultSeedPath } from '@augurproject/tools';
import { stringTo32ByteHex } from '@augurproject/tools/build/libs/Utils';
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
  });

  test(':getAccountTransactionHistoryTest', async () => {
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
        coin: 'DAI',
        details: 'DAI validity bond for market creation',
        fee: '0',
        marketDescription: 'YesNo market description',
        outcome: null,
        outcomeDescription: null,
        price: '0',
        quantity: '0',
        total: '0',
      },
      {
        action: 'MARKET_CREATION',
        coin: 'DAI',
        details: 'DAI validity bond for market creation',
        fee: '0',
        marketDescription: 'Categorical market description',
        outcome: null,
        outcomeDescription: null,
        price: '0',
        quantity: '0',
        total: '0',
      },
      {
        action: 'MARKET_CREATION',
        coin: 'DAI',
        details: 'DAI validity bond for market creation',
        fee: '0',
        marketDescription: 'Scalar market description',
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
    const numShares = new BigNumber(10).pow(18);
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
        action: Action.FILLED,
      }
    );
    expect(accountTransactionHistory).toMatchObject([
      {
        action: 'Sell',
        coin: 'DAI',
        details: 'Sell',
        fee: '0',
        marketDescription: 'YesNo market description',
        outcome: 0,
        outcomeDescription: 'Invalid',
        price: '0.22',
        quantity: '20',
        total: '15.6',
      },
      {
        action: 'Sell',
        coin: 'DAI',
        details: 'Sell',
        fee: '0',
        marketDescription: 'YesNo market description',
        outcome: 1,
        outcomeDescription: 'No',
        price: '0.22',
        quantity: '30',
        total: '23.4',
      },
      {
        action: 'Sell',
        coin: 'DAI',
        details: 'Sell',
        fee: '0',
        marketDescription: 'YesNo market description',
        outcome: 2,
        outcomeDescription: 'Yes',
        price: '0.22',
        quantity: '30',
        total: '23.4',
      },
      {
        action: 'Sell',
        coin: 'DAI',
        details: 'Sell',
        fee: '0',
        marketDescription: 'Categorical market description',
        outcome: 0,
        outcomeDescription: 'Invalid',
        price: '0.22',
        quantity: '20',
        total: '15.6',
      },
      {
        action: 'Sell',
        coin: 'DAI',
        details: 'Sell',
        fee: '0',
        marketDescription: 'Categorical market description',
        outcome: 1,
        outcomeDescription:'A'.padEnd(32, '\u0000'),

        price: '0.22',
        quantity: '30',
        total: '23.4',
      },
      {
        action: 'Sell',
        coin: 'DAI',
        details: 'Sell',
        fee: '0',
        marketDescription: 'Categorical market description',
        outcome: 2,
        outcomeDescription: 'B'.padEnd(32, '\u0000'),
        price: '0.22',
        quantity: '30',
        total: '23.4',
      },
      {
        action: 'Sell',
        coin: 'DAI',
        details: 'Sell',
        fee: '0',
        marketDescription: 'Scalar market description',
        outcome: 0,
        outcomeDescription: 'Invalid',
        price: '50.22',
        quantity: '20',
        total: '3995.6',
      },
      {
        action: 'Sell',
        coin: 'DAI',
        details: 'Sell',
        fee: '0',
        marketDescription: 'Scalar market description',
        outcome: 1,
        outcomeDescription: 'scalar denom 1',
        price: '50.22',
        quantity: '30',
        total: '5993.4',
      },
    ]);

    await (await db).sync(john.augur, mock.constants.chunkSize, 0);

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
        marketDescription: 'YesNo market description',
        outcome: 1,
        outcomeDescription: 'No',
        price: '0',
        quantity: '0.349680625587481902',
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
    const curDisputeWindowAddress = await john.getOrCreateCurrentDisputeWindow(false);
    const curDisputeWindow = await john.augur.contracts.disputeWindowFromAddress(
      curDisputeWindowAddress
    );
    const amountParticipationTokens = new BigNumber(1).pow(18);
    await john.buyParticipationTokens(curDisputeWindow.address, amountParticipationTokens);

    await john.repFaucet(new BigNumber(1e25));
    await mary.repFaucet(new BigNumber(1e25));

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
          new BigNumber(2).pow(18)
        );
        const remainingToFill = await john.getRemainingToFill(
          johnYesNoMarket,
          yesPayoutSet
        );
        if (remainingToFill.gte(0)) await mary.contribute(market, yesPayoutSet, remainingToFill);
      } else {
        await john.contribute(
          johnYesNoMarket,
          noPayoutSet,
          new BigNumber(2).pow(18)
        );
        const remainingToFill = await john.getRemainingToFill(
          johnYesNoMarket,
          noPayoutSet
        );
        if (remainingToFill.gte(0)) await john.contribute(johnYesNoMarket, noPayoutSet, remainingToFill);
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
        marketDescription: 'YesNo market description',
        outcome: 1,
        outcomeDescription: 'No',
        price: '0',
        quantity: '0.000000000000262144',
        total: '0',
      },
      {
        action: 'DISPUTE',
        coin: 'REP',
        details: 'REP staked in dispute crowdsourcers',
        fee: '0',
        marketDescription: 'YesNo market description',
        outcome: 1,
        outcomeDescription: 'No',
        price: '0',
        quantity: '1.049041876762183562',
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
      curDisputeWindow.address,
      new BigNumber(1)
    );

    // Redeem participation tokens
    await john.redeemParticipationTokens(curDisputeWindow.address, john.account.publicKey);

    // Claim initial reporter
    const initialReporter = await john.getInitialReporter(johnYesNoMarket);
    await initialReporter.redeem(john.account.publicKey);

    // Claim winning crowdsourcers
    const winningReportingParticipant = await john.getWinningReportingParticipant(
      johnYesNoMarket
    );
    await winningReportingParticipant.redeem(john.account.publicKey);

    // Claim trading proceeds
    await john.augur.contracts.shareToken.claimTradingProceeds(
      johnYesNoMarket.address,
      john.account.publicKey,
      stringTo32ByteHex(''),
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
        coin: 'DAI',
        details: 'Claimed reporting fees from participation tokens',
        fee: '0',
        marketDescription: '',
        outcome: null,
        outcomeDescription: null,
        price: '0',
        quantity: '0.000000000000000001',
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
        coin: 'REP',
        details: 'Claimed REP fees from crowdsourcers',
        fee: '0',
        marketDescription: 'YesNo market description',
        outcome: 1,
        outcomeDescription: 'No',
        price: '0',
        quantity: '0',
        total: '0',
      },
      {
        action: 'CLAIM_WINNING_CROWDSOURCERS',
        coin: 'REP',
        details: 'Claimed REP fees from crowdsourcers',
        fee: '0',
        marketDescription: 'YesNo market description',
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
        coin: 'DAI',
        details: 'Claimed trading proceeds',
        fee: '0',
        marketDescription: 'YesNo market description',
        outcome: 1,
        outcomeDescription: 'No',
        price: '0',
        quantity: '0.1',
        total: '0',
      },
      {
        action: 'CLAIM_TRADING_PROCEEDS',
        coin: 'DAI',
        details: 'Claimed trading proceeds',
        fee: '0.101',
        marketDescription: 'YesNo market description',
        outcome: 2,
        outcomeDescription: 'Yes',
        price: '98.99',
        quantity: '0.1',
        total: '9.899',
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
    expect(accountTransactionHistory.length).toEqual(7);

  });

  test(':getUserCurrentDisputeStake', async () => {
    // Create market, do an initial report, and then dispute to multiple outcomes and multiple times
    const johnYesNoMarket = await john.createReasonableYesNoMarket();

    // Move time to open reporting
    let newTime = (await johnYesNoMarket.getEndTime_()).plus(
      SECONDS_IN_A_DAY.times(7)
    );
    await john.setTimestamp(newTime);

    // Submit initial report
    const invalidPayoutSet = [
      new BigNumber(100),
      new BigNumber(0),
      new BigNumber(0),
    ];
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

    await john.repFaucet(new BigNumber(1e25));
    await john.doInitialReport(johnYesNoMarket, yesPayoutSet);

    // Now do multiple dispute contributions
    await john.contribute(johnYesNoMarket, invalidPayoutSet, new BigNumber(1));
    await john.contribute(johnYesNoMarket, invalidPayoutSet, new BigNumber(3));
    await john.contribute(johnYesNoMarket, noPayoutSet, new BigNumber(5));
    await john.contribute(johnYesNoMarket, noPayoutSet, new BigNumber(7));

    await (await db).sync(john.augur, mock.constants.chunkSize, 0);

    let userCurrentDisputeStake = await api.route(
      'getUserCurrentDisputeStake',
      {
        marketId: johnYesNoMarket.address,
        account: ACCOUNTS[0].publicKey,
      }
    );

    await expect(userCurrentDisputeStake).toContainEqual({
      outcome: "0",
      isInvalid: true,
      malformed: undefined,
      payoutNumerators: ["100", "0", "0"],
      userStakeCurrent: "4",
    });

    await expect(userCurrentDisputeStake).toContainEqual({
      outcome: "1",
      isInvalid: undefined,
      malformed: undefined,
      payoutNumerators: ["0", "100", "0"],
      userStakeCurrent: "12",
    });
  });
});
