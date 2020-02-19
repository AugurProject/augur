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

export enum NetworkId {
  Mainnet = '1',
  Ropsten = '3',
  Rinkeby = '4',
  Kovan = '42',
  Private1 = '101',
  Private2 = '102',
  Private3 = '103',
  Private4 = '104',
  PrivateGanache = '123456',
};

export function isDevNetworkId(id: NetworkId): boolean {
  return [
    NetworkId.Mainnet,
    NetworkId.Ropsten,
    NetworkId.Rinkeby,
    NetworkId.Kovan,
  ].indexOf(id) === -1;
}

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
  EthExchange?: string;
  WarpSync?: string;

  // 0x
  //   The 0x contract names must be what 0x mesh expects.
  ERC20Proxy?: string;
  ERC721Proxy?: string;
  ERC1155Proxy?: string;
  Exchange?: string; // ZeroXExchange
  Coordinator?: string; // ZeroXCoordinator
  ChaiBridge?: string;
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
  const isDev = isDevNetworkId(networkId);
  // be sure to be in src dir, not build
  const filename = isDev ? '../src/local-addresses.json' : '../src/addresses.json';
  const filepath = path.join(__dirname, filename);

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
  const isDev = isDevNetworkId(networkId);
  // be sure to be in src dir, not build
  const filename = isDev ? '../src/local-upload-block-numbers.json' : '../src/upload-block-numbers.json';
  const filepath = path.join(__dirname, filename);

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

export function getAddressesForNetwork(networkId: NetworkId): ContractAddresses {
  const addresses = Addresses[networkId];
  if (typeof addresses === 'undefined') {
    if (networkId !== '1') {
      console.log(
        `Contract addresses aren't available for network ${networkId}. If you're running in development mode, be sure to have started a local ethereum node, and then have rebuilt using yarn build before starting the dev server`
      );
    }
    throw new Error(
      `Unable to read contract addresses for network: ${
        networkId
      }. Known addresses: ${JSON.stringify(Addresses)}`
    );
  }

  return addresses;
}

export function getStartingBlockForNetwork(networkId: NetworkId): number {
  const blockNumber = UploadBlockNumbers[networkId];
  if (typeof blockNumber === 'undefined') {
    if (networkId !== '1') {
      console.log(
        `Starting block number isn't available for network ${networkId}. If you're running in development mode, be sure to have started a local ethereum node, and then have rebuilt using yarn build before starting the dev server`
      );
    }
    throw new Error(
      `Unable to read starting block number for network: ${
        networkId
      }. Known starting block numbers: ${JSON.stringify(UploadBlockNumbers)}`
    );
  }

  return blockNumber;
}

export async function updateAddresses(): Promise<void> {
  // be sure to be in src dir, not build
  await Promise.all(['../src/local-addresses.json', '../src/addresses.json'].map(async (filename) => {
    const filepath = path.join(__dirname, filename);

    if (await exists(filepath)) {
      const blob = await readFile(filepath, 'utf8');
      try {
        const addresses = JSON.parse(blob);
        Object.keys(addresses).forEach((networkId) => {
          Addresses[networkId] = addresses[networkId];
        });

      } catch {
        throw Error(`Cannot parse addresses file ${filepath}`)
      }
    }
  }));
}
