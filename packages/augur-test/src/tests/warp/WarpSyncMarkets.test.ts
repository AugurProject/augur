import { Market } from '@augurproject/core/build/libraries/ContractInterfaces';
import {
  ORDER_TYPES,
  SECONDS_IN_A_DAY,
} from '@augurproject/sdk-lite';
import { stringTo32ByteHex } from '@augurproject/sdk';
import { databasesToSync } from '@augurproject/sdk/build/warp/WarpController';
import { ACCOUNTS, defaultSeedPath, loadSeed, Seed } from '@augurproject/tools';
import { TestEthersProvider } from '@augurproject/tools/build/libs/TestEthersProvider';
import { BigNumber } from 'bignumber.js';
import * as IPFS from 'ipfs';
import { tmpdir } from 'os';
import { disableZeroX, makeProvider } from '../../libs';
import { WarpTestContractApi } from '../../libs/warp-test-contract-api';

const outcome0 = new BigNumber(0);
const outcome1 = new BigNumber(1);

describe('Warp Sync markets', () => {
  let ipfs: Promise<IPFS>;
  let provider: TestEthersProvider;
  let john: WarpTestContractApi;
  let otherJohn: WarpTestContractApi;
  let mary: WarpTestContractApi;
  let mark: WarpTestContractApi;
  let seed: Seed;

  beforeAll(async () => {
    ipfs = IPFS.create({
      silent: true,
      repo: tmpdir(),
    });
  });

  afterAll(async () => {
    (await ipfs).stop();
  });

  beforeEach(async () => {
    seed = await loadSeed(defaultSeedPath);
    provider = await makeProvider(seed, ACCOUNTS);
    const config = disableZeroX(provider.getConfig());

    john = await WarpTestContractApi.warpUserWrapper(
      ACCOUNTS[0],
      provider,
      config,
      ipfs
    );

    otherJohn = await WarpTestContractApi.warpUserWrapper(
      ACCOUNTS[0],
      provider,
      config,
      ipfs
    );

    mary = await WarpTestContractApi.warpUserWrapper(
      ACCOUNTS[1],
      provider,
      config,
      ipfs
    );

    mark = await WarpTestContractApi.warpUserWrapper(
      ACCOUNTS[2],
      provider,
      config,
      ipfs
    );

    await john.faucetCash(new BigNumber(1000000000));

    await john.approve();
    await mary.approve();

    await john.sync();
  });

  afterEach(() => {
    john = null;
    otherJohn = null;
    mary = null;
  });

  // @TODO This test has to be at the beginning of the file or it fails indicating something isn't being properly cleaned up.
  describe('uninitialized universe', () => {
    test('should have an empty checkpoint db', async () => {
      await expect(john.db.warpCheckpoints.table.toArray()).resolves.toEqual(
        []
      );
    });
  });

  describe('initialized market', () => {
    beforeEach(async () => {
      await john.augur.warpSync.initializeUniverse(seed.addresses.Universe);
    });

    describe('with reported and finalized market', () => {
      beforeEach(async () => {
        await john.faucetCash(new BigNumber(1e18)); // faucet enough cash for the various fill orders
        await mary.faucetCash(new BigNumber(1e18)); // faucet enough cash for the various fill orders

        await john.createReasonableYesNoMarket();
        await john.createReasonableYesNoMarket();

        const yesNoMarket = await john.createReasonableYesNoMarket();
        const categoricalMarket = await john.createReasonableMarket([
          stringTo32ByteHex('A'),
          stringTo32ByteHex('B'),
          stringTo32ByteHex('C'),
        ]);

        // Move timestamp ahead 12 hours.
        await provider.provider.send('evm_increaseTime', [
          SECONDS_IN_A_DAY.toNumber() / 2,
        ]);

        // Place orders
        const numShares = new BigNumber(10000000000000);
        const price = new BigNumber(22);
        await john.placeOrder(
          yesNoMarket.address,
          ORDER_TYPES.BID,
          numShares,
          price,
          outcome0,
          stringTo32ByteHex(''),
          stringTo32ByteHex(''),
          stringTo32ByteHex('42')
        );

        await john.placeOrder(
          yesNoMarket.address,
          ORDER_TYPES.BID,
          numShares,
          price,
          outcome1,
          stringTo32ByteHex(''),
          stringTo32ByteHex(''),
          stringTo32ByteHex('42')
        );

        // Move timestamp ahead 12 hours.
        await provider.provider.send('evm_increaseTime', [
          SECONDS_IN_A_DAY.toNumber() / 2,
        ]);

        await john.placeOrder(
          categoricalMarket.address,
          ORDER_TYPES.BID,
          numShares,
          price,
          outcome0,
          stringTo32ByteHex(''),
          stringTo32ByteHex(''),
          stringTo32ByteHex('42')
        );

        await john.placeOrder(
          categoricalMarket.address,
          ORDER_TYPES.BID,
          numShares,
          price,
          outcome1,
          stringTo32ByteHex(''),
          stringTo32ByteHex(''),
          stringTo32ByteHex('42')
        );

        // Fill orders
        const yesNoOrderId0 = await john.getBestOrderId(
          ORDER_TYPES.BID,
          yesNoMarket.address,
          outcome0
        );
        const yesNoOrderId1 = await john.getBestOrderId(
          ORDER_TYPES.BID,
          yesNoMarket.address,
          outcome1
        );

        // Move timestamp ahead 12 hours.
        await provider.provider.send('evm_increaseTime', [
          SECONDS_IN_A_DAY.toNumber() / 2,
        ]);

        const categoricalOrderId0 = await john.getBestOrderId(
          ORDER_TYPES.BID,
          categoricalMarket.address,
          outcome0
        );
        const categoricalOrderId1 = await john.getBestOrderId(
          ORDER_TYPES.BID,
          categoricalMarket.address,
          outcome1
        );
        await john.fillOrder(
          yesNoOrderId0,
          numShares.div(10).multipliedBy(2),
          '42'
        );

        // Move timestamp ahead 12 hours.
        await provider.provider.send('evm_increaseTime', [
          SECONDS_IN_A_DAY.toNumber() / 2,
        ]);
        await mary.fillOrder(
          yesNoOrderId1,
          numShares.div(10).multipliedBy(3),
          '43'
        );

        // Move timestamp ahead 12 hours.
        await provider.provider.send('evm_increaseTime', [
          SECONDS_IN_A_DAY.toNumber() / 2,
        ]);
        await mary.fillOrder(
          categoricalOrderId0,
          numShares.div(10).multipliedBy(2),
          '43'
        );

        // Move timestamp ahead 12 hours.
        await provider.provider.send('evm_increaseTime', [
          SECONDS_IN_A_DAY.toNumber() / 2,
        ]);
        await mary.fillOrder(
          categoricalOrderId1,
          numShares.div(10).multipliedBy(4),
          '43'
        );

        await john.sync();
      });

      describe('db is empty ', () => {
        describe('load current hash', () => {
          it('should populate dbs', async () => {
            await mary.sync();
          });
        });
      });
    });
  });

  describe('initialized universe', () => {
    let endTimestamp: number;
    let market: Market;

    beforeEach(async () => {
      await john.initializeUniverse();
      await john.sync();

      market = await john.getWarpSyncMarket();
      endTimestamp = (await market.getEndTime_()).toNumber();
    });

    test('should create an initial checkpoint', async () => {
      await expect(john.db.warpCheckpoints.table.toArray()).resolves.toEqual([
        {
          _id: 1,
          begin: expect.objectContaining({
            number: john.config.uploadBlockNumber,
          }),
          endTimestamp,
          market: market.address,
        },
      ]);
    });
    // Giant omnibus test because speed.
    test('should create subsequent checkpoints after warp market end time', async () => {
      const amountToTransfer = new BigNumber(1000);
      const { timestamp: currentBlockTimestamp } = await provider.getBlock(
        'latest'
      );

      const sizeOfStep = Math.floor((endTimestamp - currentBlockTimestamp) / 2);

      await provider.provider.send('evm_increaseTime', [sizeOfStep]);

      await john.transferCash(mary.account.address, amountToTransfer);
      await john.transferCash(mary.account.address, amountToTransfer);

      const end = await provider.getBlock('latest');

      await provider.provider.send('evm_increaseTime', [sizeOfStep]);

      await john.transferCash(mary.account.address, amountToTransfer);
      await john.transferCash(mary.account.address, amountToTransfer);

      await expect(john.db.warpCheckpoints.table.toArray()).resolves.toEqual([
        {
          _id: expect.any(Number),
          begin: expect.objectContaining({
            number: john.config.uploadBlockNumber,
          }),
          endTimestamp,
          market: market.address,
        },
      ]);

      // Force the db to prune.
      for (let i = 0; i < 30; i++) {
        await provider.providerSend('evm_mine', []);
        await john.sync();
      }

      await expect(john.db.warpCheckpoints.table.toArray()).resolves.toEqual([
        expect.objectContaining({
          begin: expect.objectContaining({
            number: john.config.uploadBlockNumber,
          }),
          endTimestamp,
          end,
          hash: expect.any(String),
          market: market.address,
        }),
      ]);

      const { hash } = await john.api.route('getMostRecentWarpSync', undefined);

      const currentBlock = await john.provider.getBlock('latest');

      await otherJohn.warpSyncStrategy.start(currentBlock, hash);

      let johnLogs = {};
      let otherJohnLogs = {};

      for (let i = 0; i < databasesToSync.length; i++) {
        const { databaseName } = databasesToSync[i];

        johnLogs[databaseName] = await john.db[databaseName].toArray();
        otherJohnLogs[databaseName] = await otherJohn.db[
          databaseName
        ].toArray();
      }

      expect(otherJohnLogs).toEqual(johnLogs);

      const warpSyncMarket = await john.reportWarpSyncMarket(hash);
      await john.finalizeWarpSyncMarket(warpSyncMarket);

      await john.sync();

      const newMarket = await john.getWarpSyncMarket();
      const newEndTimestamp = (await newMarket.getEndTime_()).toNumber();

      await expect(john.db.warpCheckpoints.table.toArray()).resolves.toEqual([
        expect.objectContaining({
          begin: expect.objectContaining({
            number: john.config.uploadBlockNumber,
          }),
          endTimestamp,
          end,
          hash: expect.any(String),
          market: market.address,
        }),
        expect.objectContaining({
          endTimestamp: newEndTimestamp,
          market: newMarket.address,
        }),
      ]);

      // advance 8 days to force a full reload.
      for (let i = 0; i < 8; i++) {
        await john.advanceTimestamp(SECONDS_IN_A_DAY);
        await provider.provider.send('evm_mine', [
          (await john.getTimestamp()).toNumber(),
        ]);
      }

      // Mine 30 blocks to get warp sync to generate.
      for (let i = 0; i < 30; i++) {
        await provider.provider.send('evm_mine', []);
        await john.sync();
      }

      console.log(
        '(await john.getTimestamp()).toNumber()',
        JSON.stringify((await john.getTimestamp()).toNumber())
      );

      await expect(john.db.warpCheckpoints.table.toArray()).resolves.toEqual([
        expect.objectContaining({
          begin: expect.objectContaining({
            number: john.config.uploadBlockNumber,
          }),
          endTimestamp,
          end,
          hash: expect.any(String),
          market: market.address,
        }),
        expect.objectContaining({
          endTimestamp: newEndTimestamp,
          market: newMarket.address,
          end: expect.any(Object),
        }),
      ]);

      const { timestamp: newCurrentBlockTimestamp } = await provider.getBlock(
        'latest'
      );

      expect(newCurrentBlockTimestamp).toBeGreaterThan(newEndTimestamp);

      const { hash: newHash } = await john.api.route(
        'getMostRecentWarpSync',
        undefined
      );

      await otherJohn.warpSyncStrategy.start(
        await provider.getBlock('latest'),
        newHash
      );

      johnLogs = {};
      otherJohnLogs = {};

      // Doing this as one test for speed. Would be prettier to do it as many.
      for (let i = 0; i < databasesToSync.length; i++) {
        const { databaseName } = databasesToSync[i];

        if (databaseName === 'TimestampSet') continue;

        johnLogs[databaseName] = await john.db[databaseName].toArray();
        otherJohnLogs[databaseName] = await otherJohn.db[
          databaseName
        ].toArray();
      }

      expect(hash).not.toEqual(newHash);

      expect(johnLogs).toEqual(otherJohnLogs);
    });

    test('should remove markets from db that have been finalized for a period.', async () => {
      await john.sync();

      await john.faucetCash(new BigNumber(1000000000));

      await john.approve();
      await mary.approve();
      await mark.approve();

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

      await expect(
        john.db.warpCheckpoints.table.toArray()
      ).resolves.toHaveLength(1);

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
      const hash = 'bad';

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
      await expect(
        john.db.MarketVolumeChangedRollup.toArray()
      ).resolves.toEqual([]);
      await expect(john.db.MarketOIChangedRollup.toArray()).resolves.toEqual(
        []
      );
      await expect(
        john.db.ShareTokenBalanceChangedRollup.toArray()
      ).resolves.toEqual([]);
    });
  });
});
