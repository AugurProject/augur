import { ACCOUNTS, defaultSeedPath, loadSeed } from '@augurproject/tools';
import { TestContractAPI } from '@augurproject/tools';
import { BigNumber } from 'bignumber.js';
import { makeProvider } from '../../libs';

let john: TestContractAPI;

const biggestNumber = new BigNumber(2).pow(256).minus(2);
describe('WarpSync', () => {
  beforeAll(async () => {
    const seed = await loadSeed(defaultSeedPath);
    const provider = await makeProvider(seed, ACCOUNTS);

    john = await TestContractAPI.userWrapper(
      ACCOUNTS[0],
      provider,
      provider.getConfig()
    );
    await john.approve();
    // Note: no need to initialize warp sync market for universe because the deploy does so.
  });

  test('Warp Sync :: getWarpSyncMarket', async () => {
    const warpSyncMarket = await john.getWarpSyncMarket();

    await expect(await warpSyncMarket.getNumTicks_()).toEqual(biggestNumber);
  });

  test('Warp Sync :: getLastWarpSyncData', async () => {
    const warpSyncMarket = await john.getWarpSyncMarket();

    const reportedValue = new BigNumber(465);
    let timestamp = await john.getTimestamp();
    timestamp = timestamp.plus(1000000);
    await john.setTimestamp(timestamp);

    await john.doInitialReport(warpSyncMarket, [
      new BigNumber(0),
      biggestNumber.minus(reportedValue),
      reportedValue,
    ]);

    timestamp = timestamp.plus(1000000);
    await john.setTimestamp(timestamp);

    await john.finalizeMarket(warpSyncMarket);

    const marketEndTime = await warpSyncMarket.getEndTime_();
    const warpSyncData = await john.getLastWarpSyncData();

    await expect(await warpSyncData.warpSyncHash).toEqual(
      'QmNLei78zWmzUdbeRB3CiUfAizWUrbeeZh5K1rhAQKChD2'
    );
    await expect(await warpSyncData.timestamp).toEqual(
      marketEndTime.toNumber()
    );

    const warpSyncHash = await john.getWarpSyncHashFromMarket(warpSyncMarket);

    await expect(warpSyncHash).toEqual(
      'QmNLei78zWmzUdbeRB3CiUfAizWUrbeeZh5K1rhAQKChD2'
    );
  });

  test('Warp Sync :: getWarpSyncHashFromPayout', async () => {
    const reportedValue = new BigNumber(465);
    const payout = [
      new BigNumber(0),
      biggestNumber.minus(reportedValue),
      reportedValue,
    ];

    const warpSyncHash = await john.getWarpSyncHashFromPayout(payout);

    await expect(warpSyncHash).toEqual(
      'QmNLei78zWmzUdbeRB3CiUfAizWUrbeeZh5K1rhAQKChD2'
    );
  });

  test('Warp Sync :: getWarpSyncHashFromPayout to Hash', async () => {
    const hashValue = 'Qme6s3PJJxqmCfgY7o5pK6sgSpem6ysgosYRuCSCNQ2X6t';
    const calculatedPayouts = await john.getPayoutFromWarpSyncHash(hashValue);
    const warpSyncHash = await john.getWarpSyncHashFromPayout(calculatedPayouts);
    await expect(warpSyncHash).toEqual(hashValue);
  });


  test('Warp Sync :: getPayoutFromWarpSyncHash', async () => {
    const warpSyncHash = 'QmNLei78zWmzUdbeRB3CiUfAizWUrbeeZh5K1rhAQKChD2';
    const payout = await john.getPayoutFromWarpSyncHash(warpSyncHash);

    await expect(payout[2].toNumber()).toEqual(465);
  });
});
