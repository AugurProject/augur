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
    await target.start(0, 39);

    expect(onLogsAdded).toHaveBeenCalledTimes(40);
  });

  test('should call onLogsAdded for each chunk with no overlap', async () => {
    const onLogsAdded = jest.fn();
    const mockGetLogs = jest.fn(f => getLogs(f))
    const target = new BulkSyncStrategy(
      mockGetLogs,
      ['0x0fF6ee01f88145298761a29A0372Ed24E16E73B1'],
      onLogsAdded,
      log => log,
      5
    );
    await target.start(10, 30);

    expect(mockGetLogs).toHaveBeenCalledTimes(5);
    expect(mockGetLogs.mock.calls[0][0]).toMatchObject({fromBlock: 10, toBlock: 14});
    expect(mockGetLogs.mock.calls[1][0]).toMatchObject({fromBlock: 15, toBlock: 19});
    expect(mockGetLogs.mock.calls[2][0]).toMatchObject({fromBlock: 20, toBlock: 24});
    expect(mockGetLogs.mock.calls[3][0]).toMatchObject({fromBlock: 25, toBlock: 29});
    expect(mockGetLogs.mock.calls[4][0]).toMatchObject({fromBlock: 30, toBlock: 30});


    expect(onLogsAdded).toHaveBeenCalledTimes(5);
    expect(onLogsAdded.mock.calls[0][0]).toEqual(14);
    expect(onLogsAdded.mock.calls[1][0]).toEqual(19);
    expect(onLogsAdded.mock.calls[2][0]).toEqual(24);
    expect(onLogsAdded.mock.calls[3][0]).toEqual(29);
    expect(onLogsAdded.mock.calls[4][0]).toEqual(30);

  });
});
