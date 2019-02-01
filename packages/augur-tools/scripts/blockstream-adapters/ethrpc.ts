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
    ethrpc.getBlockByNumber(number, false, function (err: Error | null, block: Block | undefined) {
      if (err) return reject(err);
      resolve(block);
    });
  });
}

function getLogs(filterOptions: FilterOptions): Promise<Log[]> {
  return new Promise((resolve, reject) => {
    ethrpc.getLogs(filterOptions, (err: Error|null, logs: Log[]|undefined) => {
        if (err) return reject(err);
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
