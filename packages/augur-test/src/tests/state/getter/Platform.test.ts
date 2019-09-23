import { API } from '@augurproject/sdk/build/state/getter/API';
import { DB } from '@augurproject/sdk/build/state/db/DB';
import { makeDbMock, makeProvider } from '../../../libs';
import { ContractAPI, ACCOUNTS, loadSeedFile, defaultSeedPath } from '@augurproject/tools';
import { stringTo32ByteHex } from '../../../libs/Utils';
import { BigNumber } from 'bignumber.js';
import { SECONDS_IN_A_DAY } from '@augurproject/sdk';
import { ContractInterfaces } from '@augurproject/core';
import { PlatformActivityStatsResult } from '@augurproject/sdk/build/state/getter/Platform';
import { NULL_ADDRESS } from '@augurproject/tools/build/constants';
import { fork } from '@augurproject/tools';

const mock = makeDbMock();

describe('State API :: get-platform-activity-stats :: ', () => {
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

  test('getPlatformActivityStats', async () => {
    // Create markets with multiple users
    const universe = john.augur.contracts.universe;
    const yesNoMarket = await john.createReasonableYesNoMarket();
    const categoricalMarket = await john.createReasonableMarket([
      stringTo32ByteHex('A'),
      stringTo32ByteHex('B'),
      stringTo32ByteHex('C'),
    ]);
    const scalarMarket = await john.createReasonableScalarMarket();

    const bid = new BigNumber(0);
    const outcome2 = new BigNumber(2);
    const numShares = new BigNumber(10).pow(12);
    const price = new BigNumber(22);
    const cost = numShares.times(78).div(10);

    await john.faucet(new BigNumber(1e18));
    await mary.faucet(new BigNumber(1e18));
    mary.repFaucet(new BigNumber(1e18).multipliedBy(1000000));
    john.repFaucet(new BigNumber(1e18).multipliedBy(1000000));

    // Trade
    await placeOrders(john, yesNoMarket, numShares, price);
    await placeOrders(john, categoricalMarket, numShares, price);
    await placeOrders(john, scalarMarket, numShares, price);
    await fillOrders(mary, yesNoMarket, numShares, cost);
    await fillOrders(mary, categoricalMarket, numShares, cost);
    await fillOrders(mary, scalarMarket, numShares, cost);

    // Cancel an order
    await john.cancelOrder(
      await john.getBestOrderId(bid, scalarMarket.address, outcome2)
    );

    // Purchase & sell complete sets
    const numberOfCompleteSets = new BigNumber(1);
    await john.buyCompleteSets(yesNoMarket, numberOfCompleteSets);
    await john.sellCompleteSets(yesNoMarket, numberOfCompleteSets);

    // Move time to open reporting
    // let newTime = (await yesNoMarket.getEndTime_()).plus(
    //   SECONDS_IN_A_DAY.times(7)
    // );
    // await john.setTimestamp(newTime);
    // Submit initial report
    const noPayoutSet = [
      new BigNumber(0),
      new BigNumber(100),
      new BigNumber(0),
    ];
    // await john.doInitialReport(yesNoMarket, noPayoutSet);

    // Move time to dispute window start time
    // let disputeWindowAddress = await yesNoMarket.getDisputeWindow_();
    // let disputeWindow = await john.augur.contracts.disputeWindowFromAddress(
    //   disputeWindowAddress
    // );
    // newTime = new BigNumber(await disputeWindow.getStartTime_()).plus(1);
    // await john.setTimestamp(newTime);
    //
    // // Purchase participation tokens
    // await john.buyParticipationTokens(disputeWindow.address, new BigNumber(1));
    //
    // console.log('BETTY')
    // // await dispute(john, yesNoMarket);

    await (await db).sync(john.augur, mock.constants.chunkSize, 0);
    const markets = await api.route('getMarketsInfo', { marketIds: [yesNoMarket.address]});
    await fork(john, markets[0]);
    let stats = await getPlatformActivityStats(john, db, api, universe);
    expect(stats).toEqual({
      activeUsers: 2,
      amountStaked: '4650537188053131103515648',
      disputedMarkets: 1,
      marketsCreated: 3,
      numberOfTrades: 3,
      openInterest: '2040000000000000',
      volume: '6093000000000000',
    });

    // console.log('BETTY')
    // // Move time forward by 2 weeks
    // newTime = newTime.plus(SECONDS_IN_A_DAY.times(14));
    // console.log('BETTY')
    // await john.setTimestamp(newTime);
    //
    // console.log('BETTY')
    // // Claim initial reporter
    // let initialReporter = await john.getInitialReporter(yesNoMarket);
    // console.log('BETTY')
    // await initialReporter.redeem(john.account.publicKey);
    // console.log('BETTY')
    // // Claim winning crowdsourcers
    // let winningReportingParticipant = await john.getWinningReportingParticipant(
    //   yesNoMarket
    // );
    // await winningReportingParticipant.redeem(john.account.publicKey);
    // await john.claimTradingProceeds(yesNoMarket);
    //
    // console.log('BETTY')
    // await (await db).sync(john.augur, mock.constants.chunkSize, 0);
    // let stats = await getPlatformActivityStats(john, db, api, universe);
    // expect(stats).toMatchObject({
    //   marketsCreated: 3,
    //   numberOfTrades: 3,
    // });
    //
    // // Test endTime and startTime
    // let errorMessage = '';
    // try {
    //   await getPlatformActivityStats(john, db, api, universe, 123456, 12);
    // } catch (error) {
    //   errorMessage = error.message;
    // }
    // expect(errorMessage).toEqual('startTime must be less than or equal to endTime');
    //
    // console.log('BETTY')
    // // Create markets with multiple users again
    // const yesNoMarket2 = await john.createReasonableYesNoMarket();
    // const categoricalMarket2 = await john.createReasonableMarket([
    //   stringTo32ByteHex('A'),
    //   stringTo32ByteHex('B'),
    //   stringTo32ByteHex('C'),
    // ]);
    // const scalarMarket2 = await john.createReasonableScalarMarket();
    //
    // // Trade
    // await placeOrders(john, yesNoMarket2, numShares, price);
    // await placeOrders(john, categoricalMarket2, numShares, price);
    // await placeOrders(john, scalarMarket2, numShares, price);
    // await fillOrders(mary, yesNoMarket2, numShares, cost);
    // await fillOrders(mary, categoricalMarket2, numShares, cost);
    // await fillOrders(mary, scalarMarket2, numShares, cost);
    //
    // console.log('BETTY')
    // // Cancel an order
    // await john.cancelOrder(
    //   await john.getBestOrderId(bid, scalarMarket2.address, outcome2)
    // );
    //
    // // Purchase & sell complete sets
    // numberOfCompleteSets = new BigNumber(1);
    // await john.buyCompleteSets(yesNoMarket2, numberOfCompleteSets);
    // await john.sellCompleteSets(yesNoMarket2, numberOfCompleteSets);
    //
    // // Move time to open reporting
    // newTime = (await yesNoMarket2.getEndTime_()).plus(
    //   SECONDS_IN_A_DAY.times(7)
    // );
    // await john.setTimestamp(newTime);
    //
    // console.log('BETTY')
    // await john.doInitialReport(yesNoMarket2, noPayoutSet);
    //
    // console.log('BETTY')
    // // Move time to dispute window start time
    // disputeWindowAddress = await yesNoMarket2.getDisputeWindow_();
    // disputeWindow = await john.augur.contracts.disputeWindowFromAddress(
    //   disputeWindowAddress
    // );
    // newTime = new BigNumber(await disputeWindow.getStartTime_()).plus(1);
    // await john.setTimestamp(newTime);
    //
    // // Purchase participation tokens
    // await john.buyParticipationTokens(disputeWindow.address, new BigNumber(1));
    // console.log('BETTY')
    // await dispute(john, yesNoMarket2);
    //
    // console.log('BETTY')
    // // Move time forward by 2 weeks
    // newTime = newTime.plus(SECONDS_IN_A_DAY.times(14));
    // await john.setTimestamp(newTime);
    //
    // // Finalize markets & redeem crowdsourcer funds
    // await yesNoMarket2.finalize();
    //
    // console.log('BETTY')
    // // Transfer cash to dispute window (so participation tokens can be redeemed -- normally this would come from fees)
    // await john.augur.contracts.cash.transfer(
    //   disputeWindow.address,
    //   new BigNumber(1)
    // );
    //
    // // Redeem participation tokens
    // await john.redeemParticipationTokens(disputeWindow.address, john.account.publicKey);
    // // Claim initial reporter
    // initialReporter = await john.getInitialReporter(yesNoMarket2);
    // await initialReporter.redeem(john.account.publicKey);
    //
    // // Claim winning crowdsourcers
    // winningReportingParticipant = await john.getWinningReportingParticipant(
    //   yesNoMarket2
    // );
    // await winningReportingParticipant.redeem(john.account.publicKey);
    //
    // await john.claimTradingProceeds(yesNoMarket2);
    //
    // console.log('BETTY')
    // stats = await getPlatformActivityStats(john, db, api, universe);
    // expect(stats).toMatchObject({
    //   marketsCreated: 6,
    //   numberOfTrades: 3,
    // });
  }, 200000);
});

async function getPlatformActivityStats(
  user: ContractAPI,
  db: Promise<DB>,
  api: API,
  universe: ContractInterfaces.Universe,
  startTime?: number,
  endTime?: number
): Promise<PlatformActivityStatsResult> {
  const params: any = { universe: universe.address };
  if (startTime) params.startTime = startTime;
  if (endTime) params.endTime = endTime;

  await (await db).sync(user.augur, mock.constants.chunkSize, 0);
  return api.route('getPlatformActivityStats', params);
}

async function placeOrders(
  user: ContractAPI,
  market: ContractInterfaces.Market,
  numShares: BigNumber,
  price: BigNumber
): Promise<void> {
  const bid = new BigNumber(0);
  const outcomes = [0, 1, 2].map((n) => new BigNumber(n));

  for (const outcome of outcomes) {
    await user.placeOrder(
      market.address,
      bid,
      numShares,
      price,
      outcome,
      stringTo32ByteHex(''),
      stringTo32ByteHex(''),
      stringTo32ByteHex('42')
    );
  }
}

async function fillOrders(
  user: ContractAPI,
  market: ContractInterfaces.Market,
  numShares: BigNumber,
  cost: BigNumber
): Promise<void> {
  const bid = new BigNumber(0);
  const outcomes = [0, 1, 2].map((n) => new BigNumber(n));
  const variation = [2, 3, 3];

  for (let i = 0; i < outcomes.length; i++) {
    const outcome = outcomes[i];
    const vary = variation[i];
    const tradeGroupId = String(40 + vary);
    const sharesMultiply = vary;
    await user.fillOrder(
      await user.getBestOrderId(bid, market.address, outcome),
      numShares.div(10).times(sharesMultiply),
      tradeGroupId,
      cost
    );
  }
}

async function dispute(
  user: ContractAPI,
  market: ContractInterfaces.Market
): Promise<void> {
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
  const SOME_REP = new BigNumber(1e18).times(6e7);

  for (let i = 0; i < 20; i++) {
    const disputeWindow = user.augur.contracts.disputeWindowFromAddress(await market.getDisputeWindow_());
    // Enter the dispute window.
    const disputeWindowStartTime = await disputeWindow.getStartTime_();
    await user.setTimestamp(disputeWindowStartTime.plus(1));

    // Contribute aka dispute. Opposing sides to keep raising the stakes.
    const numerators = i % 2 === 0 ? yesPayoutSet : noPayoutSet;
    await user.contribute(market, numerators, SOME_REP);
  }
  //
  //
  // for (let disputeRound = 1; disputeRound <= 3; disputeRound++) {
  //   if (disputeRound % 2 !== 0) {
  //     await user.contribute(
  //       market,
  //       yesPayoutSet,
  //       SOME_REP
  //     );
  //     const remainingToFill = await user.getRemainingToFill(
  //       market,
  //       yesPayoutSet
  //     );
  //     await user.contribute(market, yesPayoutSet, remainingToFill);
  //   } else {
  //     await user.contribute(
  //       market,
  //       noPayoutSet,
  //       SOME_REP
  //     );
  //     const remainingToFill = await user.getRemainingToFill(
  //       market,
  //       noPayoutSet
  //     );
  //     await user.contribute(market, noPayoutSet, remainingToFill);
  //   }
  // }
}
