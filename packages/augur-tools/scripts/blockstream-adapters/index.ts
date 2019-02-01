import ethrpc from "./ethrpc";
import ethers from "./ethers";
export { ethrpc, ethers };
import { Block, FilterOptions, Log } from "ethereumjs-blockstream";

export type GetBlockByString = (hash: string) => Promise<Block | null>

export interface Dependencies {
  getBlockByNumber: GetBlockByString,
  getBlockByHash: GetBlockByString,
  getLogs: (filterOptions: FilterOptions) => Promise<Log[]>,
}

export type SUPPORTED_ADAPTER = "ethrpc" | "ethers";
export const SUPPORTED_ADAPTER = ["ethrpc", "ethers"];

export function isSupportedAdapter(adapterName: string): adapterName is SUPPORTED_ADAPTER {
  if (SUPPORTED_ADAPTER.includes(adapterName)) return true;
  return false;
}
