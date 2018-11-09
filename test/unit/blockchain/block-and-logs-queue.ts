import { BlockAndLogsQueue } from "src/blockchain/block-and-logs-queue";

function yieldLoop() {
  return new Promise((resolve) => setImmediate(resolve));
}

describe("blockchain/block-and-logs-queue", () => {
  const blockHash = "0x404";
  const block = {
    hash: blockHash,
    number: "0x194",
  };
  const logs = [{
    blockHash,
    transactionHash: "0x808",
  }];

  let blockAndLogsQueue: BlockAndLogsQueue;
  let mockCallback: jest.Mock<Promise<void>>;

  beforeEach( () => {
    mockCallback = jest.fn().mockResolvedValue();
    blockAndLogsQueue = new BlockAndLogsQueue(mockCallback);
  });

  test(`Add Block Then Logs`, async () => {
    blockAndLogsQueue.acceptAddBlock(block);
    await yieldLoop();
    expect(mockCallback).not.toHaveBeenCalled();

    blockAndLogsQueue.acceptAddLogs(blockHash, logs);
    await yieldLoop();
    expect(mockCallback).toHaveBeenCalledWith("add", block, logs);
  });
  test(`Remove Logs Then Block`, async () => {
    const mockCallback = jest.fn(() => Promise.resolve());
    const blockAndLogsQueue = new BlockAndLogsQueue(mockCallback);

    blockAndLogsQueue.acceptRemoveLogs(blockHash, logs);
    await yieldLoop();
    expect(mockCallback).not.toHaveBeenCalled();

    blockAndLogsQueue.acceptRemoveBlock(block);
    await new Promise((resolve) => setImmediate(resolve));
    expect(mockCallback).toHaveBeenCalledWith("remove", block, logs);
  });
});