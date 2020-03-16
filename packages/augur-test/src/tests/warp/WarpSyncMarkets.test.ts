import { Market } from '@augurproject/core/build/libraries/ContractInterfaces';
import { databasesToSync } from '@augurproject/sdk/build/warp/WarpController';
import { ACCOUNTS, defaultSeedPath, loadSeedFile } from '@augurproject/tools';
import { TestEthersProvider } from '@augurproject/tools/build/libs/TestEthersProvider';
import { BigNumber } from 'bignumber.js';
import { makeProvider } from '../../libs';
import { WarpTestContractApi } from '../../libs/warp-test-contract-api';
import * as IPFS from 'ipfs';
import { tmpdir } from 'os'
describe('Warp Sync markets', () => {
  let ipfs: Promise<IPFS>;
  let provider: TestEthersProvider;
  let john: WarpTestContractApi;
  let otherJohn: WarpTestContractApi;
  let mary: WarpTestContractApi;

  beforeAll( async () => {
    ipfs = IPFS.create({
      silent: true,
      repo: tmpdir(),
    });
  });

  beforeEach(async () => {
    const seed = await loadSeedFile(defaultSeedPath);
    provider = await makeProvider(seed, ACCOUNTS);
    const config = provider.getConfig();

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

    await john.faucet(new BigNumber(1000000000));

    await john.approveCentralAuthority();
    await mary.approveCentralAuthority();

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
      await expect(john.db.warpCheckpoints.table.toArray()).resolves.toEqual([]);
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
      await expect(john.db.warpCheckpoints.table.toArray()).resolves.toEqual([{
        _id: 1,
        begin: expect.objectContaining({
            number: john.config.uploadBlockNumber,
          }),
          endTimestamp,
          market: market.address
        }
      ]);
    });
    // Giant omnibus test because speed.
    test('should create subsequent checkpoints after warp market end time', async () => {
      const amountToTransfer = new BigNumber(1000);
      const { timestamp: currentBlockTimestamp } = await provider.getBlock('latest');

      const sizeOfStep = Math.floor((endTimestamp - currentBlockTimestamp) / 2);

      await provider.provider.send('evm_increaseTime', [sizeOfStep]);

      await john.transferCash(mary.account.publicKey, amountToTransfer);
      await john.transferCash(mary.account.publicKey, amountToTransfer);

      const end = await provider.getBlock('latest');

      await provider.provider.send('evm_increaseTime', [sizeOfStep]);

      await john.transferCash(mary.account.publicKey, amountToTransfer);
      await john.transferCash(mary.account.publicKey, amountToTransfer);

      const { timestamp: newestBlockTimestamp } = await provider.getBlock('latest');

      await john.sync();

      await expect(john.db.warpCheckpoints.table.toArray()).resolves.toEqual([
        expect.objectContaining({
          begin: expect.objectContaining({
            number: john.config.uploadBlockNumber,
          }),
          endTimestamp,
          end,
          ipfsInfo: expect.objectContaining({
            Hash: expect.any(String),
          }),
          market: market.address
        })
      ]);

      await expect(john.db.warpSync.table.toArray()).resolves.toEqual([{
        begin: expect.objectContaining({
          number: john.config.uploadBlockNumber,
        }),
        end,
        hash: expect.any(String),
      }]);

      const { hash } = await john.api.route('getMostRecentWarpSync', undefined);

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
          ipfsInfo: expect.objectContaining({
            Hash: expect.any(String),
          }),
          market: market.address
        }),
        expect.objectContaining({
          begin: expect.objectContaining({
            number: end.number + 1
          }),
          endTimestamp: newEndTimestamp,
          market: newMarket.address
        }),
      ]);

      const spy = jest.spyOn(otherJohn.warpSyncStrategy, 'start');

      await otherJohn.sync();

      expect(spy).toHaveBeenCalledWith(hash);

      const johnLogs = {};
      const otherJohnLogs = {};

      // Doing this as one test for speed. Would be prettier to do it as many.
      for (let i = 0; i < databasesToSync.length; i++) {
        const { databaseName } = databasesToSync[i];

        johnLogs[databaseName] = await john.db[databaseName].toArray();
        otherJohnLogs[databaseName] = await otherJohn.db[databaseName].toArray();
      }

      expect(otherJohnLogs).toEqual(johnLogs);
    });
  });

  test('otherJohn should load from warp sync  ', async () => {

  });
});
