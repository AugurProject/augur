import { Block, BlockAndLogStreamer, FilterOptions, Log } from "ethereumjs-blockstream";
import * as adapters from "./blockstream-adapters";
import { GetBlockByString, isSupportedAdapter, SUPPORTED_ADAPTER } from "./blockstream-adapters";

const POLLING_FREQUENCY = parseInt(process.env.POLLING_FREQUENCY || "3000");;
const STARTUP_BLOCKS = parseInt(process.env.STARTUP_BLOCKS || "5");
const ETHEREUM_HTTP = process.env.ETHEREUM_HTTP || "http://127.0.0.1:8545";
const ADAPTER_TYPE = process.env.ADAPTER_TYPE || "ethrpc";
const LOG_FILTER = {
  address: process.env.FILTER_ADDRESS || "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
};


function startPollingForBlocks(blockstream: BlockAndLogStreamer<Block, Log>, getBlockByNumber: GetBlockByString) {
  setInterval(async function () {
    let block = await getBlockByNumber("latest");
    if (block === null) return console.warn("bad block");
    blockstream.reconcileNewBlock(block);
  }, POLLING_FREQUENCY);
}

function describeLogs(blockHash: string, logs: Log[]) {
  return `(${logs.length}) [${logs.map(log => parseInt(log.logIndex, 16))}] to block ${blockHash}`;
}

function describeBlock(block: Block) {
  return `${parseInt(block.number, 16)} ${block.hash}`;
}

function setupLogging(blockstream: BlockAndLogStreamer<Block, Log>) {
  blockstream.addLogFilter(LOG_FILTER)

  blockstream.subscribeToOnBlockAdded((block: Block) => {
    console.log("BLOCK Added " + describeBlock(block))
  });
  blockstream.subscribeToOnBlockRemoved((block: Block) => {
    console.log("BLOCK Removed " + describeBlock(block))
  });
  blockstream.subscribeToOnLogsAdded((blockHash, logs) => {
    if (logs.length > 0) {
      console.log(" ┗ Added LOGS " + describeLogs(blockHash, logs) + "\n");
    }
  });
  blockstream.subscribeToOnLogsRemoved((blockHash, logs) => {
    if (logs.length > 0) {
      console.log("\n ┏ Removed LOGS " + describeLogs(blockHash, logs));
    }
  });
}

function getBlockBehind(blockNumber: string, howManyBlocks: number) {
  return "0x" + (parseInt(blockNumber, 16) - howManyBlocks).toString(16);
}

async function doStuff(adapterType: SUPPORTED_ADAPTER) {
  const dependencies = await adapters[adapterType](ETHEREUM_HTTP);
  const blockstream = new BlockAndLogStreamer(dependencies.getBlockByHash, dependencies.getLogs, console.warn);

  const block = await dependencies.getBlockByNumber("latest");
  if (block === null) throw new Error("Could not get latest block");

  const fromBlockNumber = getBlockBehind(block.number, STARTUP_BLOCKS);
  const fromBlock = await dependencies.getBlockByNumber(fromBlockNumber);
  if (fromBlock === null) throw new Error("Could not get block " + fromBlockNumber);

  setupLogging(blockstream);
  await blockstream.reconcileNewBlock(fromBlock);
  await blockstream.reconcileNewBlock(block);
  startPollingForBlocks(blockstream, dependencies.getBlockByNumber);
}

if (isSupportedAdapter(ADAPTER_TYPE)) {
  doStuff(ADAPTER_TYPE);
} else {
  console.error("Use supported ADAPTER_TYPE: " + SUPPORTED_ADAPTER)
}
