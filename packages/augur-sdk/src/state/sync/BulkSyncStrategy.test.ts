import { getLogs } from './test-data';
import { BulkSyncStrategy } from './BulkSyncStrategy';

describe('BulkSyncStrategy', () => {
  test('should sync stuff', async () => {
    const result = await getLogs({
      blockhash: '0x5c92ffaae1778dd867d639423ea8781a198cc5f5c18188d909941a0521aaf605'
    });

    expect(result[0].blockNumber).toBe(139);
  });

  test('should call onLogsAdded for each chunk', async () => {
    const onLogsAdded = jest.fn();
    const target = new BulkSyncStrategy(
      getLogs,
      () => ({
        topics: [
          '0xea17ae24b0d40ea7962a6d832db46d1f81eaec1562946d0830d1c21d4c000ec1',
        ],
      }),
      onLogsAdded,
      (log) => log,
      1
    )
    await target.start(0, 139);

    expect(onLogsAdded).toHaveBeenCalledTimes(139);
  });
});
