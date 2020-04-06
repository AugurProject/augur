import { ContractInterfaces } from '@augurproject/core';
import { SECONDS_IN_A_DAY } from '@augurproject/sdk';
import { Seed, TestContractAPI } from '@augurproject/tools';
import { TestEthersProvider } from '@augurproject/tools/build/libs/TestEthersProvider';
import { BigNumber } from 'bignumber.js';
import { makeProvider } from '../../libs';
import { ACCOUNTS, defaultSeedPath, loadSeedFile } from '@augurproject/tools';
import Dexie from 'dexie';

describe('market pruning', () => {
  let provider: TestEthersProvider;
  let john: TestContractAPI;
  let mary: TestContractAPI;
  let mark: TestContractAPI;
  let seed: Seed;

  let market: ContractInterfaces.Market;

  beforeEach(async () => {
    seed = await loadSeedFile(defaultSeedPath);
    provider = await makeProvider(seed, ACCOUNTS);
    const config = provider.getConfig();

    john = await TestContractAPI.userWrapper(ACCOUNTS[0], provider, config);

    mary = await TestContractAPI.userWrapper(ACCOUNTS[1], provider, config);

    mark = await TestContractAPI.userWrapper(ACCOUNTS[2], provider, config);

    await john.faucet(new BigNumber(1000000000));

    await john.approveCentralAuthority();
    await mary.approveCentralAuthority();
    await mark.approveCentralAuthority();

    // Market to sunset.
    market = await john.createReasonableYesNoMarket();

    const marketEndTime = await market.getEndTime_();

    const orderAmount = new BigNumber(1);
    const orderPrice = new BigNumber(0.4);

    await john.placeBasicYesNoTrade(
      0,
      market,
      1,
      orderAmount,
      orderPrice,
      new BigNumber(0)
    );

    await mary.placeBasicYesNoTrade(
      1,
      market,
      1,
      orderAmount.multipliedBy(2),
      orderPrice,
      new BigNumber(0)
    );

    await mark.placeBasicYesNoTrade(
      0,
      market,
      1,
      orderAmount,
      orderPrice,
      new BigNumber(0)
    );

    await john.setTimestamp(marketEndTime.plus(SECONDS_IN_A_DAY));

    const yesPayoutSet = [
      new BigNumber(0),
      new BigNumber(100),
      new BigNumber(0),
    ];
    await john.doInitialReport(market, yesPayoutSet);

    const finalTimestamp = (await john.getTimestamp()).plus(
      SECONDS_IN_A_DAY.multipliedBy(2)
    );

    await john.setTimestamp(finalTimestamp);

    await market.finalize();

    await john.sync();

    await mark.claimTradingProceeds(market);

    await john.sync();
  });

  afterEach(() => {
    john = null;
    mary = null;
  });

  test('should remove markets from db that have been finalized for a period.', async () => {
    await john.sync();

    await expect(
      john.api.route('getMarkets', {
        universe: seed.addresses.Universe,
      })
    ).resolves.toEqual({
      markets: [expect.any(Object)],
      meta: expect.any(Object),
    });

    // advance 30 days.
    for (let i = 0; i < 31; i++) {
      await john.advanceTimestamp(SECONDS_IN_A_DAY);
      await john.sync();
    }

    const allGenericLogs = await Promise.all(
      john.db.genericEventDBDescriptions.map(({ EventName }) =>
        john.db[EventName].toArray()
      )
    )
      .then((...logs) => [].concat.apply([], ...logs))
      .then(logs => logs.filter(item => item.market === market.address));

    await expect(
      john.api.route('getMarkets', {
        universe: seed.addresses.Universe,
      })
    ).resolves.toEqual({
      markets: [],
      meta: expect.any(Object),
    });

    // Confirm data was removed from rollup dbs.
    await expect(john.db.MarketVolumeChangedRollup.toArray()).resolves.toEqual(
      []
    );
    await expect(john.db.MarketOIChangedRollup.toArray()).resolves.toEqual([]);

    const result = await john.db.ShareTokenBalanceChanged.toArray();
    expect(result).toHaveLength(4);
    expect(result).toEqual(
      expect.arrayContaining(await john.db.ShareTokenBalanceChangedRollup.toArray())
    );
  });
});
