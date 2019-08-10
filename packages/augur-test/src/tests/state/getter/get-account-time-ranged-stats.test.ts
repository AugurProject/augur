import { API } from '@augurproject/sdk/build/state/getter/API';
import {
  MarketInfo,
  SECONDS_IN_A_DAY,
} from '@augurproject/sdk/build/state/getter/Markets';
import { DB } from '@augurproject/sdk/build/state/db/DB';
import { makeDbMock, makeProvider } from "../../../libs";
import { ContractAPI, ACCOUNTS, loadSeedFile, defaultSeedPath } from "@augurproject/tools";
import { stringTo32ByteHex } from '../../../libs/Utils';
import { BigNumber } from 'bignumber.js';

const mock = makeDbMock();

const outcome0 = new BigNumber(0);
describe('State API :: get-account-time-ranged-stats :: ', () => {
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
  }, 120000);

  test('getAccountTimeRngedAStatsa', async () => {
    // Create markets with multiple users
    const universe = john.augur.contracts.universe;
    const johnYesNoMarket = await john.createReasonableYesNoMarket();
    const johnCategoricalMarket = await john.createReasonableMarket([
      stringTo32ByteHex('A'),
      stringTo32ByteHex('B'),
      stringTo32ByteHex('C'),
    ]);
    const johnScalarMarket = await john.createReasonableScalarMarket();

    await (await db).sync(john.augur, mock.constants.chunkSize, 0);

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

    // Fill orders
    const cost = numShares.times(78).div(10);
    await mary.fillOrder(
      await john.getBestOrderId(bid, johnYesNoMarket.address, outcome0),
      cost,
      numShares.div(10).times(2),
      '42'
    );
    await mary.fillOrder(
      await john.getBestOrderId(bid, johnYesNoMarket.address, outcome1),
      cost,
      numShares.div(10).times(3),
      '43'
    );
    await mary.fillOrder(
      await john.getBestOrderId(bid, johnYesNoMarket.address, outcome2),
      cost,
      numShares.div(10).times(3),
      '43'
    );
    await mary.fillOrder(
      await john.getBestOrderId(bid, johnCategoricalMarket.address, outcome0),
      cost,
      numShares.div(10).times(2),
      '42'
    );
    await mary.fillOrder(
      await john.getBestOrderId(bid, johnCategoricalMarket.address, outcome1),
      cost,
      numShares.div(10).times(3),
      '43'
    );
    await mary.fillOrder(
      await john.getBestOrderId(bid, johnCategoricalMarket.address, outcome2),
      cost,
      numShares.div(10).times(3),
      '43'
    );
    await mary.fillOrder(
      await john.getBestOrderId(bid, johnScalarMarket.address, outcome0),
      cost,
      numShares.div(10).times(2),
      '42'
    );
    await mary.fillOrder(
      await john.getBestOrderId(bid, johnScalarMarket.address, outcome1),
      cost,
      numShares.div(10).times(3),
      '43'
    );

    await (await db).sync(john.augur, mock.constants.chunkSize, 0);

    // Cancel an order
    await john.cancelOrder(
      await john.getBestOrderId(bid, johnScalarMarket.address, outcome2)
    );

    await (await db).sync(john.augur, mock.constants.chunkSize, 0);

    // Purchase & sell complete sets
    let numberOfCompleteSets = new BigNumber(1);
    await john.buyCompleteSets(johnYesNoMarket, numberOfCompleteSets);
    await john.sellCompleteSets(johnYesNoMarket, numberOfCompleteSets);

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

    // Move time to dispute window start time
    let disputeWindowAddress = await johnYesNoMarket.getDisputeWindow_();
    let disputeWindow = await john.augur.contracts.disputeWindowFromAddress(
      disputeWindowAddress
    );
    newTime = new BigNumber(await disputeWindow.getStartTime_()).plus(1);
    await john.setTimestamp(newTime);

    // Purchase participation tokens
    await john.buyParticipationTokens(disputeWindow.address, new BigNumber(1));

    // Dispute 2 times
    for (let disputeRound = 1; disputeRound <= 3; disputeRound++) {
      if (disputeRound % 2 !== 0) {
        await mary.contribute(
          johnYesNoMarket,
          yesPayoutSet,
          new BigNumber(25000)
        );
        const remainingToFill = await john.getRemainingToFill(
          johnYesNoMarket,
          yesPayoutSet
        );
        await mary.contribute(johnYesNoMarket, yesPayoutSet, remainingToFill);
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
    let initialReporter = await john.getInitialReporter(johnYesNoMarket);
    await initialReporter.redeem(john.account.publicKey);

    // Claim winning crowdsourcers
    let winningReportingParticipant = await john.getWinningReportingParticipant(
      johnYesNoMarket
    );
    await winningReportingParticipant.redeem(john.account.publicKey);

    // Claim trading proceeds
    await john.augur.contracts.claimTradingProceeds.claimTradingProceeds(
      johnYesNoMarket.address,
      john.account.publicKey,
      "0x0000000000000000000000000000000000000000"
    );

    await (await db).sync(john.augur, mock.constants.chunkSize, 0);

    // Test non-existent universe address
    const nonexistentAddress = '0x1111111111111111111111111111111111111111';
    let errorMessage = '';
    try {
      const markets: MarketInfo[] = await api.route('getAccountTimeRangedStats', {
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

    let stats = await api.route('getAccountTimeRangedStats', {
      universe: universe.address,
      account: nonexistentAddress,
    });
    // console.log("stats1", stats);
    // expect(stats).toEqual({});

    // Test endTime and startTime
    try {
      const markets: MarketInfo[] = await api.route('getAccountTimeRangedStats', {
        universe: universe.address,
        account: ACCOUNTS[0].publicKey,
        startTime: 123456,
        endTime: 12,
      });
    } catch (error) {
      errorMessage = error.message;
    }
    expect(errorMessage).toEqual('startTime must be less than or equal to endTime');

    stats = await api.route('getAccountTimeRangedStats', {
      universe: universe.address,
      account: ACCOUNTS[0].publicKey,
    });
    // console.log("stats2", stats);
    expect(stats).toMatchObject({
      marketsCreated: 3,
      marketsTraded: 3,
      numberOfTrades: 3,
      positions: 9,
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

    await (await db).sync(john.augur, mock.constants.chunkSize, 0);

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

    await (await db).sync(john.augur, mock.constants.chunkSize, 0);

    // Fill orders
    await mary.fillOrder(
      await john.getBestOrderId(bid, johnYesNoMarket2.address, outcome0),
      cost,
      numShares.div(10).times(2),
      '42'
    );
    await mary.fillOrder(
      await john.getBestOrderId(bid, johnYesNoMarket2.address, outcome1),
      cost,
      numShares.div(10).times(3),
      '43'
    );
    await mary.fillOrder(
      await john.getBestOrderId(bid, johnYesNoMarket2.address, outcome2),
      cost,
      numShares.div(10).times(3),
      '43'
    );
    await mary.fillOrder(
      await john.getBestOrderId(bid, johnCategoricalMarket2.address, outcome0),
      cost,
      numShares.div(10).times(2),
      '42'
    );
    await mary.fillOrder(
      await john.getBestOrderId(bid, johnCategoricalMarket2.address, outcome1),
      cost,
      numShares.div(10).times(3),
      '43'
    );
    await mary.fillOrder(
      await john.getBestOrderId(bid, johnCategoricalMarket2.address, outcome2),
      cost,
      numShares.div(10).times(3),
      '43'
    );
    await mary.fillOrder(
      await john.getBestOrderId(bid, johnScalarMarket2.address, outcome0),
      cost,
      numShares.div(10).times(2),
      '42'
    );
    await mary.fillOrder(
      await john.getBestOrderId(bid, johnScalarMarket2.address, outcome1),
      cost,
      numShares.div(10).times(3),
      '43'
    );

    await (await db).sync(john.augur, mock.constants.chunkSize, 0);

    // Cancel an order
    await john.cancelOrder(
      await john.getBestOrderId(bid, johnScalarMarket2.address, outcome2)
    );

    await (await db).sync(john.augur, mock.constants.chunkSize, 0);

    // Purchase & sell complete sets
    numberOfCompleteSets = new BigNumber(1);
    await john.buyCompleteSets(johnYesNoMarket2, numberOfCompleteSets);
    await john.sellCompleteSets(johnYesNoMarket2, numberOfCompleteSets);

    await (await db).sync(john.augur, mock.constants.chunkSize, 0);

    // Move time to open reporting
    newTime = (await johnYesNoMarket2.getEndTime_()).plus(
      SECONDS_IN_A_DAY.times(7)
    );
    await john.setTimestamp(newTime);

    await john.doInitialReport(johnYesNoMarket2, noPayoutSet);

    await (await db).sync(john.augur, mock.constants.chunkSize, 0);

    // Move time to dispute window start time
    disputeWindowAddress = await johnYesNoMarket2.getDisputeWindow_();
    disputeWindow = await john.augur.contracts.disputeWindowFromAddress(
      disputeWindowAddress
    );
    newTime = new BigNumber(await disputeWindow.getStartTime_()).plus(1);
    await john.setTimestamp(newTime);

    // Purchase participation tokens
    await john.buyParticipationTokens(disputeWindow.address, new BigNumber(1));

    // Dispute 2 times
    for (let disputeRound = 1; disputeRound <= 3; disputeRound++) {
      if (disputeRound % 2 !== 0) {
        await mary.contribute(
          johnYesNoMarket2,
          yesPayoutSet,
          new BigNumber(25000)
        );
        const remainingToFill = await john.getRemainingToFill(
          johnYesNoMarket2,
          yesPayoutSet
        );
        await mary.contribute(johnYesNoMarket2, yesPayoutSet, remainingToFill);
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
        await john.contribute(johnYesNoMarket2, noPayoutSet, remainingToFill);
      }
    }

    await (await db).sync(john.augur, mock.constants.chunkSize, 0);

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
    await john.redeemParticipationTokens(disputeWindow.address, john.account.publicKey);

    // Claim initial reporter
    initialReporter = await john.getInitialReporter(johnYesNoMarket2);
    await initialReporter.redeem(john.account.publicKey);

    // Claim winning crowdsourcers
    winningReportingParticipant = await john.getWinningReportingParticipant(
      johnYesNoMarket2
    );
    await winningReportingParticipant.redeem(john.account.publicKey);

    // Claim trading proceeds
    await john.augur.contracts.claimTradingProceeds.claimTradingProceeds(
      johnYesNoMarket2.address,
      john.account.publicKey,
      "0x0000000000000000000000000000000000000000"
    );

    await (await db).sync(john.augur, mock.constants.chunkSize, 0);

    stats = await api.route('getAccountTimeRangedStats', {
      universe: universe.address,
      account: ACCOUNTS[0].publicKey,
    });
    // console.log("stats3", stats);
    expect(stats).toMatchObject({
      marketsCreated: 6,
      marketsTraded: 6,
      numberOfTrades: 3,
      positions: 18,
      redeemedPositions: 4,
      successfulDisputes: 2,
    });
  }, 200000);
});
