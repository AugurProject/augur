import { SECONDS_IN_A_DAY } from '@augurproject/sdk-lite';
import { Action, Coin } from '@augurproject/sdk/build/state/getter/Accounts';
import { ACCOUNTS, defaultSeedPath, loadSeed } from '@augurproject/tools';
import { TestContractAPI } from '@augurproject/tools';
import { BigNumber } from 'bignumber.js';
import { makeProvider } from '../../../libs';
import { SDKConfiguration, stringTo32ByteHex } from '@augurproject/utils';

describe('State API :: Accounts :: ', () => {
  let john: TestContractAPI;
  let mary: TestContractAPI;
  let config: SDKConfiguration;

  beforeAll(async () => {
    const seed = await loadSeed(defaultSeedPath);
    const provider = await makeProvider(seed, ACCOUNTS);
    config = provider.getConfig();

    john = await TestContractAPI.userWrapper(
      ACCOUNTS[0],
      provider,
      config
    );
    mary = await TestContractAPI.userWrapper(
      ACCOUNTS[1],
      provider,
      config
    );

    await john.approve();
    await mary.approve();
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

    await john.sync();

    let accountTransactionHistory = await john.api.route(
      'getAccountTransactionHistory',
      {
        universe: john.augur.contracts.universe.address.toLowerCase(), // Test that lower-case addresses can be passed in
        account: ACCOUNTS[0].address,
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
    const numShares = new BigNumber(10).pow(17);
    const price = new BigNumber(220);
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

    await john.sync();

    // Fill orders
    const cost = numShares
      .times(780)
      .div(10)
      .times(1e18);
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

    await john.sync();

    accountTransactionHistory = await john.api.route(
      'getAccountTransactionHistory',
      {
        universe: john.augur.contracts.universe.address,
        account: ACCOUNTS[1].address,
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
        outcomeDescription: 'A',
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
        outcomeDescription: 'B',
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
        price: '52.2',
        quantity: '2',
        total: '395.6',
      },
      {
        action: 'Sell',
        coin: 'DAI',
        details: 'Sell',
        fee: '0',
        marketDescription: 'Scalar market description',
        outcome: 1,
        outcomeDescription: 'scalar denom 1',
        price: '52.2',
        quantity: '3',
        total: '593.4',
      },
    ]);

    await john.sync();

    // Move time to open reporting
    let newTime = (await johnYesNoMarket.getEndTime_()).plus(
      SECONDS_IN_A_DAY.times(7)
    );
    await john.setTimestamp(newTime);

    // Submit initial report
    const noPayoutSet = [
      new BigNumber(0),
      new BigNumber(1000),
      new BigNumber(0),
    ];
    const yesPayoutSet = [
      new BigNumber(0),
      new BigNumber(0),
      new BigNumber(1000),
    ];
    await john.doInitialReport(johnYesNoMarket, noPayoutSet);

    await john.sync();

    accountTransactionHistory = await john.api.route(
      'getAccountTransactionHistory',
      {
        universe: john.augur.contracts.universe.address,
        account: ACCOUNTS[0].address,
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
        quantity: '0.349680582682291667',
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
    const curDisputeWindowAddress = await john.getOrCreateCurrentDisputeWindow(
      false
    );
    const curDisputeWindow = await john.augur.contracts.disputeWindowFromAddress(
      curDisputeWindowAddress
    );
    const amountParticipationTokens = new BigNumber(1).pow(18);
    await john.buyParticipationTokens(
      curDisputeWindow.address,
      amountParticipationTokens
    );

    await john.faucetRep(new BigNumber(1e25));
    await mary.faucetRep(new BigNumber(1e25));

    // Dispute 2 times
    for (let disputeRound = 1; disputeRound <= 3; disputeRound++) {
      if (disputeRound % 2 !== 0) {
        // TODO this is a problem. `mary.contribute` does not involve mary: only
        //  the market johnYesNoMarket is used
        //  this used to work because john has a ton of extra REP. now he doesn't
        const market = await mary.getMarketContract(johnYesNoMarket.address);
        await mary.contribute(market, yesPayoutSet, new BigNumber(2).pow(18));
        const remainingToFill = await john.getRemainingToFill(
          johnYesNoMarket,
          yesPayoutSet
        );
        if (remainingToFill.gte(0)) {
          await mary.contribute(market, yesPayoutSet, remainingToFill);
        }
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
        if (remainingToFill.gte(0)) {
          await john.contribute(johnYesNoMarket, noPayoutSet, remainingToFill);
        }
      }
    }

    await john.sync();

    accountTransactionHistory = await john.api.route(
      'getAccountTransactionHistory',
      {
        universe: john.augur.contracts.universe.address,
        account: ACCOUNTS[0].address,
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
        quantity: '1.049041748046612857',
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
    await john.redeemParticipationTokens(
      curDisputeWindow.address,
      john.account.address
    );

    // Claim initial reporter
    const initialReporter = await john.getInitialReporter(johnYesNoMarket);
    await initialReporter.redeem(john.account.address);

    // Claim winning crowdsourcers
    const winningReportingParticipant = await john.getWinningReportingParticipant(
      johnYesNoMarket
    );
    await winningReportingParticipant.redeem(john.account.address);

    // Claim trading proceeds
    await john.augur.contracts.shareToken.claimTradingProceeds(
      johnYesNoMarket.address,
      john.account.address,
      stringTo32ByteHex('')
    );

    await john.sync();

    accountTransactionHistory = await john.api.route(
      'getAccountTransactionHistory',
      {
        universe: john.augur.contracts.universe.address,
        account: ACCOUNTS[0].address,
        action: Action.CLAIM_PARTICIPATION_TOKENS,
      }
    );
    expect(accountTransactionHistory).toMatchObject([
      {
        action: 'CLAIM_PARTICIPATION_TOKENS',
        coin: 'REP',
        details: 'Claimed reporting fees from participation tokens',
        fee: '0',
        marketDescription: '',
        outcome: null,
        outcomeDescription: null,
        price: '0',
        quantity: '0.000000000000000001',
        total: '0.000000000000000001',
      },
    ]);

    accountTransactionHistory = await john.api.route(
      'getAccountTransactionHistory',
      {
        universe: john.augur.contracts.universe.address,
        account: ACCOUNTS[0].address,
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

    accountTransactionHistory = await john.api.route(
      'getAccountTransactionHistory',
      {
        universe: john.augur.contracts.universe.address,
        account: ACCOUNTS[0].address,
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
        quantity: '0.01',
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
        price: '989.9',
        quantity: '0.01',
        total: '9.899',
      },
    ]);

    // Test earliestTransactionTime/latestTransactionTime params
    accountTransactionHistory = await john.api.route(
      'getAccountTransactionHistory',
      {
        universe: john.augur.contracts.universe.address,
        account: ACCOUNTS[0].address,
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
    const newTime = (await johnYesNoMarket.getEndTime_()).plus(
      SECONDS_IN_A_DAY.times(7)
    );
    await john.setTimestamp(newTime);

    // Submit initial report
    const invalidPayoutSet = [
      new BigNumber(1000),
      new BigNumber(0),
      new BigNumber(0),
    ];
    const noPayoutSet = [
      new BigNumber(0),
      new BigNumber(1000),
      new BigNumber(0),
    ];
    const yesPayoutSet = [
      new BigNumber(0),
      new BigNumber(0),
      new BigNumber(1000),
    ];

    await john.faucetRep(new BigNumber(1e25));
    await john.doInitialReport(johnYesNoMarket, yesPayoutSet);

    // Now do multiple dispute contributions
    await john.contribute(johnYesNoMarket, invalidPayoutSet, new BigNumber(1));
    await john.contribute(johnYesNoMarket, invalidPayoutSet, new BigNumber(3));
    await john.contribute(johnYesNoMarket, noPayoutSet, new BigNumber(5));
    await john.contribute(johnYesNoMarket, noPayoutSet, new BigNumber(7));

    await john.sync();

    const userCurrentDisputeStake = await john.api.route(
      'getUserCurrentDisputeStake',
      {
        marketId: johnYesNoMarket.address,
        account: ACCOUNTS[0].address,
      }
    );

    await expect(userCurrentDisputeStake).toContainEqual({
      outcome: '0',
      isInvalid: true,
      malformed: undefined,
      payoutNumerators: ['1000', '0', '0'],
      userStakeCurrent: '4',
    });

    await expect(userCurrentDisputeStake).toContainEqual({
      outcome: '1',
      isInvalid: undefined,
      malformed: undefined,
      payoutNumerators: ['0', '1000', '0'],
      userStakeCurrent: '12',
    });
  });
});
