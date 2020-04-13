import { ACCOUNTS, defaultSeedPath, loadSeed } from '@augurproject/tools';
import { Checkpoints } from '@augurproject/sdk/build/warp/Checkpoints';
import { TestContractAPI } from '@augurproject/tools';
import { BigNumber } from 'bignumber.js';
import { Block } from 'ethers/providers';
import { makeProvider } from '../../libs';

describe('Checkpoint', () => {
  let john: TestContractAPI;
  let checkpoints: Checkpoints;
  let blocks: Block[];

  beforeAll(async () => {
    blocks = [];
    const seed = await loadSeed(defaultSeedPath);
    const provider = await makeProvider(seed, ACCOUNTS);
    const config = provider.getConfig();

    john = await TestContractAPI.userWrapper(
      ACCOUNTS[0],
      provider,
      config,
    );

    checkpoints = new Checkpoints(provider);
    const mary = await TestContractAPI.userWrapper(
      ACCOUNTS[1],
      provider,
      config,
    );

    await john.faucetCash(new BigNumber(1000000000));
    await john.approve();

    const amountToTransfer = new BigNumber(1000);

    // The actual value of the checkpoint isn't super important here.
    for (let i = 0; i < 5; i++) {
      // Advance time 15 seconds between blocks.
      await provider.provider.send('evm_increaseTime', [15]);
      await john.transferCash(mary.account.address, amountToTransfer.plus(i));
      blocks.push(await provider.getBlock('latest'));
    }

    console.log('blocks', JSON.stringify(blocks));
  });

  describe('timestamp between blocks', () => {
    test('should return blocks directly above and below', async () => {
      const targetTimestamp = Math.floor(
        (blocks[2].timestamp + blocks[3].timestamp) / 2);
      await expect(
        checkpoints.calculateBoundary(targetTimestamp, blocks[0], blocks[4])).
        resolves.
        toEqual([
          blocks[2],
          blocks[3],
        ]);
    });
  });

  describe('timestamp exactly as lower block in range', () => {
    test('should return the matching block and the one after', async () => {
      await expect(checkpoints.calculateBoundary(blocks[2].timestamp, blocks[0],
        blocks[4])).resolves.toEqual([
        blocks[2],
        blocks[3],
      ]);
    });
  });

  // The next three cases shouldn't happen but better to handle them than continue to fill the world with sad panda memes.
  describe('timestamp exactly the same as upper block in range', () => {
    test('should throw an exception', async () => {
      await expect(checkpoints.calculateBoundary(blocks[3].timestamp, blocks[2],
        blocks[3])).
        rejects.
        toEqual(new Error('timestamp outside of provided block range'));
    });
  });

  describe('timestamp above blocks provided', () => {
    test('should throw an exception', async () => {
      await expect(checkpoints.calculateBoundary(blocks[4].timestamp, blocks[2],
        blocks[3])).
        rejects.
        toEqual(new Error('timestamp outside of provided block range'));
    });
  });

  describe('timestamp below blocks provided', () => {
    test('should throw an exception', async () => {
      await expect(checkpoints.calculateBoundary(blocks[0].timestamp, blocks[2],
        blocks[3])).
        rejects.
        toEqual(new Error('timestamp outside of provided block range'));
    });
  });
});
