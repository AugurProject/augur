import { Block, Log, FilterOptions } from "ethereumjs-blockstream";
import { Dependencies } from "./index";
const ethrpc = require("ethrpc");

function getBlockByHash(hash: string): Promise<Block> {
  return new Promise<Block>(function (resolve, reject) {
    ethrpc.getBlockByHash(hash, false, function (err: Error | null, block: Block | undefined) {
      if (err) return reject(err);
      resolve(block);
    });
  });
}

function getBlockByNumber(number: string): Promise<Block> {
  return new Promise<Block>(function (resolve, reject) {
    console.error("Querying block: " + number)
    ethrpc.getBlockByNumber(number, false, function (err: Error | null, block: Block | undefined) {
      if (err) return reject(err);
      console.error("Finished querying block: " + number);
      resolve(block);
    });
  });
}

function getLogs(filterOptions: FilterOptions): Promise<Log[]> {
  return new Promise((resolve, reject) => {
    console.error("Querying logs: " + JSON.stringify(filterOptions));
    ethrpc.getLogs(filterOptions, (err: Error|null, logs: Log[]|undefined) => {
        if (err) return reject(err);
        if (logs === undefined) return reject(new Error("Logs undefined for filter " + JSON.stringify(filterOptions)));
      console.error(`Finished querying logs ${JSON.stringify(filterOptions)} (${logs.length})`);
      resolve(logs);
      });
  });
}

export default function connect(httpAddress: string): Promise<Dependencies> {
  return new Promise<Dependencies>((resolve, reject) => {
    const configuration = {
      httpAddresses: [httpAddress],
      wsAddresses: [],
      ipcAddresses: [],
    };
    ethrpc.connect(
      configuration, function (err: Error | undefined) {
        if (err) return reject(err);
        resolve({
          getBlockByNumber,
          getBlockByHash,
          getLogs,
        });
      });
  });
}
