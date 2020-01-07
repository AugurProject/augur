import { Block, BlockTag } from "ethers/providers";
import { ContractEvents } from "./ContractEvents";
import { NetworkId } from "@augurproject/artifacts";
import { Filter, Log, LogValues, Provider } from "..";
import { Abi } from "ethereum";
import { JSONRPCRequestPayload } from "ethereum-types";

function makeProviderMock(opts?: any): Provider {
  const networkId = opts.networkId || "4";
  const logs = opts.logs || [];
  const blockNumber = opts.blockNumber || 0;
  const eventTopic = opts.eventTopic || "xyz";
  const logValues = opts.logValues || [];
  const balance = opts.balance || "1";
  const block = opts.block || null;

  return {
    getNetworkId: (): Promise<NetworkId> => Promise.resolve(networkId),
    getLogs: (filter: Filter): Promise<Log[]> => Promise.resolve(logs),
    getBlockNumber: (): Promise<number> => Promise.resolve(blockNumber),
    getBlock: (blockHashOrBlockNumber: BlockTag | string): Promise<Block> => Promise.resolve(block),
    storeAbiData: (abi: Abi, contractName: string): void => { },
    getEventTopic: (contractName: string, eventName: string): string => eventTopic,
    encodeContractFunction: (contractName: string, functionName: string, funcParams: any[]): string => "0x0",
    parseLogValues: (contractName: string, log: Log): LogValues => logValues,
    getBalance: (address: string) => balance,
    sendAsync: (payload: JSONRPCRequestPayload) => Promise.resolve(null)
  };
}

test("get logs", async () => {
  const logs: Log[] = [{
    name: "fake",
    blockNumber: 19,
    address: "0xthere",
    data: "some data",
    topics: ["some topic"],
    blockHash: "0x123",
    logIndex: 2,
    removed: false,
    transactionHash: "0x9876",
    transactionIndex: 3,  // not specified in logValues
    transactionLogIndex: 0,
  }];
  const logValues: LogValues = {
    name: "joy",
    blockNumber: 12,
    address: "0xthere",
    data: "other data",
    topics: ["some topic", "another topic"],
    blockHash: "0x4444",
    logIndex: 22,
    removed: true,
    transactionHash: "0x7777",
    transactionLogIndex: 4,  // not specified in log but could be
    fakeValueIMadeUp: "ddr3",  // not specified in log and cannot be
  };
  const provider = makeProviderMock({ logs, logValues });
  const contractEvents = new ContractEvents(provider, "0x0", "0x0", "0x0");

  const eventName = "some event name";
  const fromBlock = 0;
  const toBlock = 42;

  const eventLogs = await contractEvents.getLogs(eventName, fromBlock, toBlock);
  expect(eventLogs).toEqual([
    {
      name: "joy",
      blockNumber: 19,
      address: "0xthere",
      data: "other data",
      topics: ["some topic"],
      blockHash: "0x123",
      logIndex: 2,
      removed: false,
      transactionHash: "0x9876",
      transactionIndex: 3,
      transactionLogIndex: 0,  // value comes only from `log` despite `logValues` specifying it
      fakeValueIMadeUp: "ddr3",  // `log` only overwrites certain predefined values, which this is not one of
    },
  ]);
});

test("get event topics", async () => {
  const eventTopic = "foobarington";
  const provider = makeProviderMock({ eventTopic });

  const contractEvents = new ContractEvents(provider, "0x0", "0x0", "0x0");
  const topics = await contractEvents.getEventTopics("foobar");

  expect(topics).toEqual([eventTopic]);
});
