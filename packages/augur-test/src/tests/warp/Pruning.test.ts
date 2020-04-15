import { ContractInterfaces } from '@augurproject/core';
import { SECONDS_IN_A_DAY } from '@augurproject/sdk';
import { Seed } from '@augurproject/tools';
import { TestEthersProvider } from '@augurproject/tools/build/libs/TestEthersProvider';
import { BigNumber } from 'bignumber.js';
import { makeProvider } from '../../libs';
import { ACCOUNTS, defaultSeedPath, loadSeed } from '@augurproject/tools';
import * as IPFS from 'ipfs';
import { tmpdir } from 'os';
import { WarpTestContractApi } from '../../libs/warp-test-contract-api';

describe('market pruning', () => {
  let ipfs: Promise<IPFS>;
  let provider: TestEthersProvider;
  let john: WarpTestContractApi;
  let mary: WarpTestContractApi;
  let mark: WarpTestContractApi;
  let seed: Seed;

  let market: ContractInterfaces.Market;

  beforeAll(async () => {
    ipfs = IPFS.create({
      silent: true,
      repo: tmpdir(),
    });
  });

  beforeEach(async () => {
    seed = await loadSeed(defaultSeedPath);
    provider = await makeProvider(seed, ACCOUNTS);
    const config = provider.getConfig();

    john = await WarpTestContractApi.warpUserWrapper(ACCOUNTS[0], provider, config, ipfs);

    mary = await WarpTestContractApi.warpUserWrapper(ACCOUNTS[1], provider, config, ipfs);

    mark = await WarpTestContractApi.warpUserWrapper(ACCOUNTS[2], provider, config, ipfs);

    await john.faucetCash(new BigNumber(1000000000));

    await john.approve();
    await mary.approve();
    await mark.approve();

    await john.augur.warpSync.initializeUniverse(seed.addresses.Universe);

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

    await expect(john.db.warpCheckpoints.table.toArray()).resolves.toHaveLength(1);

    await expect(
      john.api.route('getMarkets', {
        universe: seed.addresses.Universe,
      })
    ).resolves.toEqual({
      markets: [expect.any(Object)],
      meta: expect.any(Object),
    });

    // advance 60 days
    await john.advanceTimestamp(SECONDS_IN_A_DAY.multipliedBy(60));
    await john.sync();

    // Finalize the initial warp sync market and then another now that 60 days has passed and its relatve timestamp will include pruning
    const hash = "bad";

    let warpSyncMarket = await john.reportWarpSyncMarket(hash);
    await john.finalizeWarpSyncMarket(warpSyncMarket);

    // Force the db to prune.
    for (let i = 0; i < 30; i++) {
      await provider.providerSend('evm_mine', []);
      await john.sync();
    }

    await john.advanceTimestamp(SECONDS_IN_A_DAY.multipliedBy(3));
    warpSyncMarket = await john.reportWarpSyncMarket(hash);
    await john.finalizeWarpSyncMarket(warpSyncMarket);

    // Force the db to prune.
    for (let i = 0; i < 30; i++) {
      await provider.providerSend('evm_mine', []);
      await john.sync();
    }

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
    await expect(john.db.ShareTokenBalanceChangedRollup.toArray()).resolves.toEqual([]);
  });
});
