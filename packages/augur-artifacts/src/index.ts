export const abi = require("./abi.json");
export const Addresses = require("./addresses.json");
export const Contracts = require("./contracts.json");
export const UploadBlockNumbers = require("./upload-block-numbers.json");
export const Networks = require("./networks.json");
export { ContractEvents } from "./events";

import { exists, readFile, writeFile } from "async-file";
import path from "path";

export type NetworkId =
    '1'
    | '3'
    | '4'
    | '19'
    | '42'
    | '101'
    | '102'
    | '103'
    | '104';

export interface ContractAddresses {
    Universe: string;
    Augur: string;
    LegacyReputationToken: string;
    CancelOrder: string;
    Cash: string;
    ClaimTradingProceeds: string;
    CompleteSets: string;
    CreateOrder: string;
    FillOrder: string;
    Order: string;
    Orders: string;
    ShareToken: string;
    Trade: string;
    SimulateTrade: string;
    Controller?: string;
    OrdersFinder?: string;
    OrdersFetcher?: string;
    TradingEscapeHatch?: string;
    Time?: string;
    TimeControlled?: string;
    GnosisSafe?: string;
    ProxyFactory?: string;
}

// TS doesn't allow mapping of any type but string or number so we list it out manually
export interface NetworkContractAddresses {
    1: ContractAddresses;
    3: ContractAddresses;
    4: ContractAddresses;
    19: ContractAddresses;
    42: ContractAddresses;
    101: ContractAddresses;
    102: ContractAddresses;
    103: ContractAddresses;
    104: ContractAddresses;
}

export async function setAddresses(networkId: NetworkId, addresses: ContractAddresses): Promise<void> {
  const filepath = path.join(__dirname, "../src/addresses.json"); // be sure to be in src dir, not build

  let contents = {};
  if (await exists(filepath)) {
    contents = JSON.parse(await readFile(filepath, "utf8"));
  }

  contents[networkId] = addresses;

  await writeFile(filepath, JSON.stringify(contents, null, 1), "utf8");
}
