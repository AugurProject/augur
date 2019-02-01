import { Block, Log, FilterOptions } from "ethereumjs-blockstream";
import * as _ from "lodash";
import { ethers } from "ethers";
import { Dependencies } from "./index";

function convertEthersBlockToBlockstreamBlock(block: ethers.providers.Block): Block {
  return {
    number: "0x" + block.number.toString(16),
    hash: block.hash,
    parentHash: block.parentHash,
  }
}

function convertEthersLogToBlockstreamLog(log: ethers.providers.Log): Log {
  return {
    logIndex: (log.logIndex || "0").toString(),
    blockNumber: (log.blockNumber || "0").toString(),
    blockHash: log.blockHash || "0",
  }
}

async function getBlockByHashOrTag(provider: ethers.providers.Provider, hashOrTag: string): Promise<Block> {
  console.error("Querying block: " + hashOrTag)
  const block = await provider.getBlock(hashOrTag, false);
  console.error("Finished querying block: " + hashOrTag)
  return convertEthersBlockToBlockstreamBlock(block);
}

async function getLogs(provider: ethers.providers.Provider, filterOptions: FilterOptions): Promise<Log[]> {
  console.error("Querying logs " + JSON.stringify(filterOptions));
  const logs = await provider.getLogs({
    ...filterOptions,
    topics: _.compact(filterOptions.topics),
  });
  console.error(`Finished querying logs ${JSON.stringify(filterOptions)} (${logs.length})`);

  return _.map(logs, convertEthersLogToBlockstreamLog);
}

export default async function connect(httpAddress: string): Promise<Dependencies> {
  const provider = new ethers.providers.JsonRpcProvider(httpAddress)
  return {
    getBlockByNumber: _.partial(getBlockByHashOrTag, provider),
    getBlockByHash: _.partial(getBlockByHashOrTag, provider),
    getLogs: _.partial(getLogs, provider),
  }
}
