import { SECONDS_IN_A_DAY } from '@augurproject/sdk';
import { ACCOUNTS, TestContractAPI } from '@augurproject/tools';
import { TestEthersProvider } from '@augurproject/tools/build/libs/TestEthersProvider';
import { stringTo32ByteHex } from '@augurproject/tools/build/libs/Utils';
import { BigNumber } from 'bignumber.js';
import { formatBytes32String } from 'ethers/utils';
import { _beforeAll, _beforeEach } from './common';

describe('State API :: Users :: ', () => {
  let john: TestContractAPI;
  let mary: TestContractAPI;
  let baseProvider: TestEthersProvider;

  beforeAll(async () => {
    const state = await _beforeAll();
    baseProvider = state.baseProvider;
  });

  beforeEach(async () => {
    const state = await _beforeEach({ baseProvider });
    john = state.john;
    mary = state.mary;
  });

  test(':getAccountTimeRangedStats', async () => {
    // Create markets with multiple users
    const universe = john.augur.contracts.universe;
    const johnYesNoMarket = await john.createReasonableYesNoMarket();
    const johnCategoricalMarket = await john.createReasonableMarket([
      stringTo32ByteHex('A'),
      stringTo32ByteHex('B'),
      stringTo32ByteHex('C'),
    ]);
    const johnScalarMarket = await john.createReasonableScalarMarket();

    await john.sync();

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

    await john.sync();

    // Fill orders
    await mary.faucet(new BigNumber(1e18)); // faucet enough cash for the various fill orders
    await mary.fillOrder(
      await john.getBestOrderId(bid, johnYesNoMarket.address, outcome0),
      numShares.div(10).times(2),
      '42'
    );
    await mary.fillOrder(
      await john.getBestOrderId(bid, johnYesNoMarket.address, outcome1),
      numShares.div(10).times(3),
      '43'
    );
    await mary.fillOrder(
      await john.getBestOrderId(bid, johnYesNoMarket.address, outcome2),
      numShares.div(10).times(3),
      '43'
    );
    await mary.fillOrder(
      await john.getBestOrderId(bid, johnCategoricalMarket.address, outcome0),
      numShares.div(10).times(2),
      '42'
    );
    await mary.fillOrder(
      await john.getBestOrderId(bid, johnCategoricalMarket.address, outcome1),
      numShares.div(10).times(3),
      '43'
    );
    await mary.fillOrder(
      await john.getBestOrderId(bid, johnCategoricalMarket.address, outcome2),
      numShares.div(10).times(3),
      '43'
    );
    await mary.fillOrder(
      await john.getBestOrderId(bid, johnScalarMarket.address, outcome0),
      numShares.div(10).times(2),
      '42'
    );
    await mary.fillOrder(
      await john.getBestOrderId(bid, johnScalarMarket.address, outcome1),
      numShares.div(10).times(3),
      '43'
    );

    await john.sync();

    // Cancel an order
    await john.cancelNativeOrder(
      await john.getBestOrderId(bid, johnScalarMarket.address, outcome2)
    );

    await john.sync();

    // Purchase & sell complete sets
    let numberOfCompleteSets = new BigNumber(1);
    await john.buyCompleteSets(johnYesNoMarket, numberOfCompleteSets);
    await john.sellCompleteSets(johnYesNoMarket, numberOfCompleteSets);

    await john.sync();

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
    // implicitly creates dispute window
    await john.doInitialReport(johnYesNoMarket, noPayoutSet);

    await john.sync();

    // Move time to dispute window start time
    let disputeWindowAddress = await johnYesNoMarket.getDisputeWindow_();
    let disputeWindow = await john.augur.contracts.disputeWindowFromAddress(
      disputeWindowAddress
    );
    newTime = new BigNumber(await disputeWindow.getStartTime_()).plus(1);
    await john.setTimestamp(newTime);

    // Purchase participation tokens
    let curDisputeWindowAddress = await john.getOrCreateCurrentDisputeWindow(
      false
    );
    let curDisputeWindow = await john.augur.contracts.disputeWindowFromAddress(
      curDisputeWindowAddress
    );
    await john.buyParticipationTokens(
      curDisputeWindow.address,
      new BigNumber(1)
    );

    await john.repFaucet(new BigNumber(1e25));
    await mary.repFaucet(new BigNumber(1e25));

    // Dispute 2 times
    for (let disputeRound = 1; disputeRound <= 3; disputeRound++) {
      if (disputeRound % 2 !== 0) {
        const market = await mary.getMarketContract(johnYesNoMarket.address);
        await mary.contribute(market, yesPayoutSet, new BigNumber(25000));
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
          new BigNumber(25000)
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
    await john.redeemParticipationTokens(
      disputeWindow.address,
      john.account.publicKey
    );

    // Claim initial reporter
    let initialReporter = await john.getInitialReporter(johnYesNoMarket);
    await initialReporter.redeem(john.account.publicKey);

    // Claim winning crowdsourcers
    let winningReportingParticipant = await john.getWinningReportingParticipant(
      johnYesNoMarket
    );
    await winningReportingParticipant.redeem(john.account.publicKey);

    // Claim trading proceeds
    await john.augur.contracts.shareToken.claimTradingProceeds(
      johnYesNoMarket.address,
      john.account.publicKey,
      formatBytes32String('')
    );

    await john.sync();

    // Test non-existent universe address
    const nonexistentAddress = '0x1111111111111111111111111111111111111111';

    let errorMessage = '';
    try {
      await john.api.route('getAccountTimeRangedStats', {
        universe: nonexistentAddress,
        account: nonexistentAddress,
        startTime: 1234,
        endTime: 45678,
      });
    } catch (error) {
      errorMessage = error.message;
    }
    expect(errorMessage).toEqual(
      'Unknown universe: 0x1111111111111111111111111111111111111111'
    );

    await john.api.route('getAccountTimeRangedStats', {
      universe: universe.address,
      account: nonexistentAddress,
    });

    // Test endTime and startTime
    try {
      await john.api.route('getAccountTimeRangedStats', {
        universe: universe.address,
        account: ACCOUNTS[0].publicKey,
        startTime: 123456,
        endTime: 12,
      });
    } catch (error) {
      errorMessage = error.message;
    }
    expect(errorMessage).toEqual(
      'startTime must be less than or equal to endTime'
    );

    let stats = await john.api.route('getAccountTimeRangedStats', {
      universe: universe.address,
      account: ACCOUNTS[0].publicKey,
      startTime: 0,
      endTime: newTime.minus(1).toNumber(),
    });
    expect(stats).toMatchObject({});

    stats = await john.api.route('getAccountTimeRangedStats', {
      universe: universe.address,
      account: ACCOUNTS[0].publicKey,
      startTime: newTime.plus(1).toNumber(),
      endTime: newTime.plus(100).toNumber(),
    });
    expect(stats).toMatchObject({});

    stats = await john.api.route('getAccountTimeRangedStats', {
      universe: universe.address,
      account: ACCOUNTS[0].publicKey,
    });
    expect(stats).toMatchObject({
      marketsCreated: 3,
      marketsTraded: 3,
      numberOfTrades: 2,
      positions: 8,
      redeemedPositions: 2,
      successfulDisputes: 1,
    });

    // Create markets with multiple users again
    const johnYesNoMarket2 = await john.createReasonableYesNoMarket();
    const johnCategoricalMarket2 = await john.createReasonableMarket([
      stringTo32ByteHex('A'),
      stringTo32ByteHex('B'),
      stringTo32ByteHex('C'),
    ]);
    const johnScalarMarket2 = await john.createReasonableScalarMarket();

    await john.sync();

    // Place orders
    await john.placeOrder(
      johnYesNoMarket2.address,
      bid,
      numShares,
      price,
      outcome0,
      stringTo32ByteHex(''),
      stringTo32ByteHex(''),
      stringTo32ByteHex('42')
    );
    await john.placeOrder(
      johnYesNoMarket2.address,
      bid,
      numShares,
      price,
      outcome1,
      stringTo32ByteHex(''),
      stringTo32ByteHex(''),
      stringTo32ByteHex('42')
    );
    await john.placeOrder(
      johnYesNoMarket2.address,
      bid,
      numShares,
      price,
      outcome2,
      stringTo32ByteHex(''),
      stringTo32ByteHex(''),
      stringTo32ByteHex('42')
    );
    await john.placeOrder(
      johnCategoricalMarket2.address,
      bid,
      numShares,
      price,
      outcome0,
      stringTo32ByteHex(''),
      stringTo32ByteHex(''),
      stringTo32ByteHex('42')
    );
    await john.placeOrder(
      johnCategoricalMarket2.address,
      bid,
      numShares,
      price,
      outcome1,
      stringTo32ByteHex(''),
      stringTo32ByteHex(''),
      stringTo32ByteHex('42')
    );
    await john.placeOrder(
      johnCategoricalMarket2.address,
      bid,
      numShares,
      price,
      outcome2,
      stringTo32ByteHex(''),
      stringTo32ByteHex(''),
      stringTo32ByteHex('42')
    );
    await john.placeOrder(
      johnScalarMarket2.address,
      bid,
      numShares,
      price,
      outcome0,
      stringTo32ByteHex(''),
      stringTo32ByteHex(''),
      stringTo32ByteHex('42')
    );
    await john.placeOrder(
      johnScalarMarket2.address,
      bid,
      numShares,
      price,
      outcome1,
      stringTo32ByteHex(''),
      stringTo32ByteHex(''),
      stringTo32ByteHex('42')
    );
    await john.placeOrder(
      johnScalarMarket2.address,
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
    await mary.fillOrder(
      await john.getBestOrderId(bid, johnYesNoMarket2.address, outcome0),
      numShares.div(10).times(2),
      '42'
    );
    await mary.fillOrder(
      await john.getBestOrderId(bid, johnYesNoMarket2.address, outcome1),
      numShares.div(10).times(3),
      '43'
    );
    await mary.fillOrder(
      await john.getBestOrderId(bid, johnYesNoMarket2.address, outcome2),
      numShares.div(10).times(3),
      '43'
    );
    await mary.fillOrder(
      await john.getBestOrderId(bid, johnCategoricalMarket2.address, outcome0),
      numShares.div(10).times(2),
      '42'
    );

    await mary.fillOrder(
      await john.getBestOrderId(bid, johnCategoricalMarket2.address, outcome1),
      numShares.div(10).times(3),
      '43'
    );

    await mary.fillOrder(
      await john.getBestOrderId(bid, johnCategoricalMarket2.address, outcome2),
      numShares.div(10).times(3),
      '43'
    );

    await mary.fillOrder(
      await john.getBestOrderId(bid, johnScalarMarket2.address, outcome0),
      numShares.div(10).times(2),
      '42'
    );
    await mary.fillOrder(
      await john.getBestOrderId(bid, johnScalarMarket2.address, outcome1),
      numShares.div(10).times(3),
      '43'
    );

    await john.sync();

    // Re-test startTime and endTime with order filler account
    stats = await john.api.route('getAccountTimeRangedStats', {
      universe: universe.address,
      account: ACCOUNTS[1].publicKey,
      startTime: 0,
      endTime: newTime.minus(1).toNumber(),
    });
    expect(stats).toMatchObject({});

    stats = await john.api.route('getAccountTimeRangedStats', {
      universe: universe.address,
      account: ACCOUNTS[1].publicKey,
      startTime: 0,
      endTime: newTime.toNumber(),
    });
    expect(stats).toMatchObject({
      positions: 16,
      numberOfTrades: 2,
      marketsCreated: 0,
      marketsTraded: 6,
      successfulDisputes: 0,
      redeemedPositions: 0,
    });

    stats = await john.api.route('getAccountTimeRangedStats', {
      universe: universe.address,
      account: ACCOUNTS[1].publicKey,
      startTime: newTime.plus(1).toNumber(),
      endTime: newTime.plus(100).toNumber(),
    });
    expect(stats).toMatchObject({});

    // Cancel an order
    await john.cancelNativeOrder(
      await john.getBestOrderId(bid, johnScalarMarket2.address, outcome2)
    );

    await john.sync();

    // Purchase & sell complete sets
    numberOfCompleteSets = new BigNumber(1);
    await john.buyCompleteSets(johnYesNoMarket2, numberOfCompleteSets);
    await john.sellCompleteSets(johnYesNoMarket2, numberOfCompleteSets);

    await john.sync();

    // Move time to open reporting
    newTime = (await johnYesNoMarket2.getEndTime_()).plus(
      SECONDS_IN_A_DAY.times(7)
    );
    await john.setTimestamp(newTime);

    await john.doInitialReport(johnYesNoMarket2, noPayoutSet);

    await john.sync();

    // Move time to dispute window start time
    disputeWindowAddress = await johnYesNoMarket2.getDisputeWindow_();
    disputeWindow = await john.augur.contracts.disputeWindowFromAddress(
      disputeWindowAddress
    );
    newTime = new BigNumber(await disputeWindow.getStartTime_()).plus(1);
    await john.setTimestamp(newTime);

    // Purchase participation tokens
    curDisputeWindowAddress = await john.getOrCreateCurrentDisputeWindow(false);
    curDisputeWindow = await john.augur.contracts.disputeWindowFromAddress(
      curDisputeWindowAddress
    );
    await john.buyParticipationTokens(
      curDisputeWindow.address,
      new BigNumber(1)
    );

    // Dispute 2 times
    for (let disputeRound = 1; disputeRound <= 3; disputeRound++) {
      if (disputeRound % 2 !== 0) {
        const market = await mary.getMarketContract(johnYesNoMarket2.address);
        await mary.contribute(market, yesPayoutSet, new BigNumber(25000));
        const remainingToFill = await john.getRemainingToFill(
          johnYesNoMarket2,
          yesPayoutSet
        );
        if (remainingToFill.gte(0)) {
          await mary.contribute(market, yesPayoutSet, remainingToFill);
        }
      } else {
        await john.contribute(
          johnYesNoMarket2,
          noPayoutSet,
          new BigNumber(25000)
        );
        const remainingToFill = await john.getRemainingToFill(
          johnYesNoMarket2,
          noPayoutSet
        );
        if (remainingToFill.gte(0)) {
          await john.contribute(johnYesNoMarket2, noPayoutSet, remainingToFill);
        }
      }
    }

    await john.sync();

    // Move time forward by 2 weeks
    newTime = newTime.plus(SECONDS_IN_A_DAY.times(14));
    await john.setTimestamp(newTime);

    // Finalize markets & redeem crowdsourcer funds
    await johnYesNoMarket2.finalize();

    // Transfer cash to dispute window (so participation tokens can be redeemed -- normally this would come from fees)
    await john.augur.contracts.cash.transfer(
      disputeWindow.address,
      new BigNumber(1)
    );

    // Redeem participation tokens
    await john.redeemParticipationTokens(
      disputeWindow.address,
      john.account.publicKey
    );

    // Claim initial reporter
    initialReporter = await john.getInitialReporter(johnYesNoMarket2);
    await initialReporter.redeem(john.account.publicKey);

    // Claim winning crowdsourcers
    winningReportingParticipant = await john.getWinningReportingParticipant(
      johnYesNoMarket2
    );
    await winningReportingParticipant.redeem(john.account.publicKey);

    // Claim trading proceeds
    await john.augur.contracts.shareToken.claimTradingProceeds(
      johnYesNoMarket2.address,
      john.account.publicKey,
      formatBytes32String('')
    );

    await john.sync();

    stats = await john.api.route('getAccountTimeRangedStats', {
      universe: universe.address,
      account: ACCOUNTS[0].publicKey,
    });
    expect(stats).toMatchObject({
      marketsCreated: 6,
      marketsTraded: 6,
      numberOfTrades: 2,
      positions: 16,
      redeemedPositions: 4,
      successfulDisputes: 2,
    });
  });
});
