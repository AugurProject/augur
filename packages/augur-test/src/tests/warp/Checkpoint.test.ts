import { Checkpoints } from '@augurproject/sdk/build/warp/Checkpoints';
import { Block, JsonRpcProvider } from 'ethers/providers';

describe('Checkpoint', () => {
  // These blocks span approx 5.066759259259259 days apart.
  // Jan-09-2020 07:02:56 AM +UTC
  const uploadBlock = 16000000;

  // Jan-09-2020 04:33:04 PM +UTC
  const earlyMiddleBlock = 16008500;

  // Jan-10-2020 12:54:16 AM +UTC
  const laterMiddleBlock = 16016000;

  // Jan-10-2020 02:01:00 AM +UTC
  const blockNumberApproxOneDayLater = 16017000;

  // Jan-14-2020 07:32:16 AM +UTC
  const currentBlockNumber = 16109000;

  let provider;
  let checkpoints;
  let uploadBlockHeaders: Block;
  let earlyMiddleBlockHeaders: Block;
  let laterMiddleBlockHeaders: Block;
  let blockNumberApproxOneDayLaterHeaders: Block;
  let currentBlockNumberHeaders: Block;

  beforeAll(async () => {
    // Sadly getting enough history in ganache is a pain so I'm going to use an actual chain.
    // If you are working on a plane right now, my apologies.
    provider = new JsonRpcProvider(
      'https://eth-kovan.alchemyapi.io/jsonrpc/1FomA6seLdWDvpIRvL9J5NhwPHLIGbWA'
    );

    checkpoints = new Checkpoints(provider);

    uploadBlockHeaders = await provider.getBlock(uploadBlock);
    earlyMiddleBlockHeaders = await provider.getBlock(earlyMiddleBlock);
    laterMiddleBlockHeaders = await provider.getBlock(laterMiddleBlock);
    blockNumberApproxOneDayLaterHeaders = await provider.getBlock(
      blockNumberApproxOneDayLater
    );
    currentBlockNumberHeaders = await provider.getBlock(currentBlockNumber);
  });

  describe('compareTimestampDay method', () => {
    test('middle block is on earlier day', async () => {
      const result = checkpoints.compareTimestampDay(
        uploadBlockHeaders,
        earlyMiddleBlockHeaders,
        blockNumberApproxOneDayLaterHeaders
      );
      expect(result).toEqual([
        earlyMiddleBlockHeaders,
        blockNumberApproxOneDayLaterHeaders,
      ]);
    });

    test('middle block is on later day', async () => {
      const result = checkpoints.compareTimestampDay(
        uploadBlockHeaders,
        laterMiddleBlockHeaders,
        blockNumberApproxOneDayLaterHeaders
      );
      expect(result).toEqual([uploadBlockHeaders, laterMiddleBlockHeaders]);
    });

    // This shouldn't happen but when in rome.
    test('middle block is outside of range', async () => {
      const result = checkpoints.compareTimestampDay(
        uploadBlockHeaders,
        laterMiddleBlockHeaders,
        earlyMiddleBlockHeaders
      );
      expect(result).toEqual([uploadBlockHeaders, earlyMiddleBlockHeaders]);
    });
  });

  describe('calculateBoundary', () => {
    test('block on next day', async () => {
      await expect(
        checkpoints.calculateBoundary(
          uploadBlockHeaders,
          blockNumberApproxOneDayLaterHeaders
        )
      ).resolves.toEqual([
        expect.objectContaining({
          number: 16015186,
        }),
        expect.objectContaining({
          number: 16015187,
        }),
      ]);
    });

    test('blocks on same day', async () => {
      await expect(
        checkpoints.calculateBoundary(
          uploadBlockHeaders,
          earlyMiddleBlockHeaders
        )
      ).resolves.toEqual([
        expect.objectContaining({
          number: 16015186,
        }),
        expect.objectContaining({
          number: 16015187,
        }),
      ]);
    });

    test('blocks multiple day in future', async () => {
      await expect(
        checkpoints.calculateBoundary(
          uploadBlockHeaders,
          currentBlockNumberHeaders,
        )
      ).resolves.toEqual([
        expect.objectContaining({
          number: 16015186,
        }),
        expect.objectContaining({
          number: 16015187,
        }),
      ]);
    });
  });
});
