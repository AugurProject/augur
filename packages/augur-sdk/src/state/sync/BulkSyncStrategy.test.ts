import { BulkSyncStrategy } from './BulkSyncStrategy';
import { getLogs } from './test-data';

describe('BulkSyncStrategy', () => {
  test('should sync stuff', async () => {
    const result = await getLogs({
      blockhash:
        '0x5c92ffaae1778dd867d639423ea8781a198cc5f5c18188d909941a0521aaf605',
    });

    expect(result[0].blockNumber).toBe(139);
  });

  test('should call onLogsAdded for each chunk', async () => {
    const onLogsAdded = jest.fn();
    const target = new BulkSyncStrategy(
      getLogs,
      ['0x0fF6ee01f88145298761a29A0372Ed24E16E73B1'],
      onLogsAdded,
      log => log,
      1
    );
    await target.start(0, 139);

    expect(onLogsAdded).toHaveBeenCalledTimes(140);
  });
});
