export const abi = require('./abi.json');
export const abiV1 = require('./abi.v1.json');
export const Addresses: AllContractAddresses = require('./addresses.json');
export const Contracts = require('./contracts.json');
export const UploadBlockNumbers: UploadBlockNumbers = require('./upload-block-numbers.json');
export const Networks = require('./networks.json');
export * from './templates';
export { ContractEvents } from './events';

import { exists, readFile, writeFile } from 'async-file';
import path from 'path';

try {
  const localAddresses: { [networkId: string]: ContractAddresses } = require('./local-addresses.json');
  Object.keys(localAddresses).forEach((networkId) => {
    Addresses[networkId] = localAddresses[networkId];
  });
} catch (e) {
  // if the local addresses don't exist, do nothing
}
try {
  const localUploadBlockNumbers: UploadBlockNumbers = require('./local-upload-block-numbers.json');
  Object.keys(localUploadBlockNumbers).forEach((networkId) => {
    UploadBlockNumbers[networkId] = localUploadBlockNumbers[networkId];
  });
} catch (e) {
  // if the local upload block numbers don't exist, do nothing
}

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

export interface UploadBlockNumbers {
  [networkId: string]: number
}

export interface ContractAddresses {
  Universe: string;
  Augur: string;
  AugurTrading: string;
  LegacyReputationToken: string;
  CancelOrder: string;
  Cash: string;
  ShareToken: string;
  CreateOrder: string;
  FillOrder: string;
  Order: string;
  Orders: string;
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
  BuyParticipationTokens?: string;
  RedeemStake?: string;
  CashFaucet?: string;
  GnosisSafeRegistry?: string;
  HotLoading?: string;
  ZeroXTrade?: string;
  Affiliates?: string;
  AffiliateValidator?: string;
  ProfitLoss?: string;

  // 0x
  //   The 0x contract names must be what 0x mesh expects.
  ERC20Proxy?: string;
  ERC721Proxy?: string;
  ERC1155Proxy?: string;
  Exchange?: string; // ZeroXExchange
  Coordinator?: string; // ZeroXCoordinator
  DevUtils?: string;
  WETH9?: string;
  ZRXToken?: string;
}

export interface AllContractAddresses {
  [networkId: string]: ContractAddresses
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
  const filepath = path.join(__dirname, '../src/local-addresses.json'); // be sure to be in src dir, not build

  let contents: AllContractAddresses = {};
  if (await exists(filepath)) {
    const blob = await readFile(filepath, 'utf8');
    try {
      contents = JSON.parse(blob);
    } catch {
      contents = {}; // throw out unparseable addresses file
    }
  }

  contents[networkId] = addresses;

  await writeFile(filepath, JSON.stringify(contents, null, 2), 'utf8');
}

export async function setUploadBlockNumber(networkId: NetworkId, uploadBlock: number): Promise<void> {
  const filepath = path.join(__dirname, '../src/local-upload-block-numbers.json'); // be sure to be in src dir, not build

  let contents: UploadBlockNumbers = {};
  if (await exists(filepath)) {
    const blob = await readFile(filepath, 'utf8');
    try {
      contents = JSON.parse(blob);
    } catch {
      contents = {}; // throw out unparseable block numbers file
    }

    contents[networkId] = uploadBlock;

    await writeFile(filepath, JSON.stringify(contents, null, 2), 'utf8');
  }
}
