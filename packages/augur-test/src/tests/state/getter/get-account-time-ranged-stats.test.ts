import { API } from '@augurproject/sdk/build/state/getter/API';
import {
  MarketInfo,
  MarketInfoReportingState,
  MarketOrderBook,
  SECONDS_IN_A_DAY,
} from '@augurproject/sdk/build/state/getter/Markets';
import { DB } from '@augurproject/sdk/build/state/db/DB';
import { makeDbMock, makeProvider } from "../../../libs";
import { ContractAPI, ACCOUNTS, loadSeedFile, defaultSeedPath } from "@augurproject/tools";
import { NULL_ADDRESS, stringTo32ByteHex } from '../../../libs/Utils';
import { BigNumber } from 'bignumber.js';
import { ORDER_TYPES } from '@augurproject/sdk';
import { ContractInterfaces } from '@augurproject/core';

const mock = makeDbMock();

const outcome0 = new BigNumber(0);
const outcome1 = new BigNumber(1);
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

  // NOTE: Full-text searching is tested more in SyncableDB.test.ts
  test(':getAccountTimeRangedStats', async () => {
    const universe = john.augur.contracts.universe;
    const endTime = (await john.getTimestamp()).plus(SECONDS_IN_A_DAY);
    const lowFeePerCashInAttoCash = new BigNumber(10).pow(18).div(20); // 5% creator fee
    const highFeePerCashInAttoCash = new BigNumber(10).pow(18).div(10); // 10% creator fee
    const affiliateFeeDivisor = new BigNumber(0);
    const designatedReporter = john.account.publicKey;

    const johnYesNoMarket = await john.createReasonableYesNoMarket();
    const johnSecondMarket = await john.createReasonableYesNoMarket();

    await (await db).sync(john.augur, mock.constants.chunkSize, 0);
    // await (await db).sync(mary.augur, mock.constants.chunkSize, 0);

    const numShares = new BigNumber(10000000000000);
    const price = new BigNumber(22);
    const yesNoOrderId = await john.placeOrder(
      johnYesNoMarket.address,
      ORDER_TYPES.BID,
      numShares,
      price,
      outcome0,
      stringTo32ByteHex(''),
      stringTo32ByteHex(''),
      stringTo32ByteHex('42')
    );

    await (await db).sync(john.augur, mock.constants.chunkSize, 0);

    console.log(price);

    const cost = numShares.multipliedBy(78).div(2);

    await mary.fillOrder(yesNoOrderId, cost, numShares.div(2), '42');
    await (await db).sync(john.augur, mock.constants.chunkSize, 0);

    // // Move time to open reporting
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
    const disputeWindowAddress = await johnYesNoMarket.getDisputeWindow_();
    const disputeWindow = await john.augur.contracts.disputeWindowFromAddress(
      disputeWindowAddress
    );

    newTime = newTime.plus(SECONDS_IN_A_DAY.times(14));
    await john.setTimestamp(newTime);

    await (await db).sync(john.augur, mock.constants.chunkSize, 0);

    // // Dispute 2 times
    // for (let disputeRound = 1; disputeRound <= 3; disputeRound++) {
    //   if (disputeRound % 2 !== 0) {
    //     await mary.contribute(
    //       johnYesNoMarket,
    //       yesPayoutSet,
    //       new BigNumber(25000)
    //     );
    //     const remainingToFill = await john.getRemainingToFill(
    //       johnYesNoMarket,
    //       yesPayoutSet
    //     );
    //     await mary.contribute(johnYesNoMarket, yesPayoutSet, remainingToFill);
    //   } else {
    //     await john.contribute(
    //       johnYesNoMarket,
    //       noPayoutSet,
    //       new BigNumber(25000)
    //     );
    //     const remainingToFill = await john.getRemainingToFill(
    //       johnYesNoMarket,
    //       noPayoutSet
    //     );
    //     await john.contribute(johnYesNoMarket, noPayoutSet, remainingToFill);
    //   }
    // }

    await (await db).sync(john.augur, mock.constants.chunkSize, 0);

    johnYesNoMarket.finalize();
    johnSecondMarket.finalize();

    await (await db).sync(john.augur, mock.constants.chunkSize, 0);

    // Test non-existent universe address
    const nonexistentAddress = '0x1111111111111111111111111111111111111111';
    let errorMessage = '';
    try {
      const markets: MarketInfo[] = await api.route('getAccountTimeRangedStats', {
        universe: nonexistentAddress,
        creator: nonexistentAddress,
        endTime: 123456,
        startTime: 123456,
      });
    } catch (error) {
      errorMessage = error.message;
    }
    expect(errorMessage).toEqual(
      'Unknown universe: 0x1111111111111111111111111111111111111111'
    );

    // Test creator
    let stats = await api.route('getAccountTimeRangedStats', {
      universe: universe.address,
      account: ACCOUNTS[0].publicKey,
    });
    expect(stats).toEqual({});


    markets = await api.route('getAccountTimeRangedStats', {
      universe: universe.address,
      account: nonexistentAddress,
    });
    expect(markets).toEqual({});

    // Test endTime and startTime
    markets = await api.route('getAccountTimeRangedStats', {
      universe: universe.address,
      account: ACCOUNTS[0].publicKey,
      startTime: 123456,
      endTime: 12,
    });
    expect(markets).toEqual({});

    // await john.augur.contracts.cash.transfer(
    //   disputeWindow.address,
    //   new BigNumber(1)
    // );

    // await (await db).sync(john.augur, mock.constants.chunkSize, 0);

    // // Redeem participation tokens
    // await john.redeemParticipationTokens(disputeWindow.address, john.account.publicKey);

    // // Claim initial reporter
    // const initialReporter = await john.getInitialReporter(johnYesNoMarket);
    // await initialReporter.redeem(john.account.publicKey);

    // // Claim winning crowdsourcers
    // const winningReportingParticipant = await john.getWinningReportingParticipant(
    //   johnYesNoMarket
    // );
    // await winningReportingParticipant.redeem(john.account.publicKey);

    // await (await db).sync(john.augur, mock.constants.chunkSize, 0);

    // // Claim trading proceeds
    // await john.augur.contracts.claimTradingProceeds.claimTradingProceeds(
    //   johnYesNoMarket.address,
    //   john.account.publicKey
    // );

    // await (await db).sync(john.augur, mock.constants.chunkSize, 0);

    // let markets: MarketInfo[];



    // // Place orders on some markets

    // await (await db).sync(john.augur, mock.constants.chunkSize, 0);

    // // // Partially fill orders
    // // const cost = numShares.multipliedBy(78).div(2);
    // // const yesNoOrderId1 = await john.getBestOrderId(
    // //   ORDER_TYPES.BID,
    // //   johnYesNoMarket.address,
    // //   outcome0
    // // );
    // // await john.fillOrder(yesNoOrderId1, cost, numShares.div(2), '42');

    // // await (await db).sync(john.augur, mock.constants.chunkSize, 0);

    // // markets = await api.route('getAccountTimeRangedStats', {
    // //   universe: universe.address,
    // //   creator: ACCOUNTS[0].publicKey,
    // // });
    // // expect(markets).toEqual([
    // //   johnYesNoMarket.address,
    // // ]);

    // // // Completely fill orders
    // // await john.fillOrder(yesNoOrderId1, cost, numShares.div(2), '42');

    // // await (await db).sync(john.augur, mock.constants.chunkSize, 0);

    // // markets = await api.route('getAccountTimeRangedStats', {
    // //   universe: universe.address,
    // //   creator: ACCOUNTS[0].publicKey,
    // // });
    // // expect(markets).toEqual([]);

    // // // Move timestamp to designated reporting phase
    // // await john.setTimestamp(endTime);

    // // await (await db).sync(john.augur, mock.constants.chunkSize, 0);


    // // await (await db).sync(john.augur, mock.constants.chunkSize, 0);

  }, 120000);
});
