export const abi = require('./abi.json');
export const abiV1 = require('./abi.v1.json');
export const Contracts = require('./contracts.json');
export * from './templates';
export { ContractEvents } from './events';

import { exists, readFile, writeFile } from 'async-file';
import deepmerge from 'deepmerge';
import path from 'path';
import requireAll from 'require-all';

export interface SDKConfiguration {
  networkId: NetworkId,
  ethereum?: {
    http?: string,
    ws?: string,
    useWeb3Transport?: boolean,
    rpcRetryCount: number,
    rpcRetryInterval: number,
    rpcConcurrency: number
  },
  gas?: {
    limit?: number,
    price?: number
  },
  deploy?: {
    isProduction: boolean,
    enableFaucets: boolean,
    normalTime: boolean,
    privateKey: string,
    contractInputPath: string,
    writeArtifacts?: boolean,
    externalAddresses?: ExternalAddresses,
  },
  gnosis?: {
    enabled: boolean,
    http?: string,
    relayerAddress?: string,
  },
  zeroX?: {
    rpc?: {
      enabled: boolean,
      ws?: string
    },
    mesh?: {
      enabled: boolean,
      verbosity?: 0|1|2|3|4|5,
      bootstrapList?: string[]
    }
  },
  syncing?: {
    enabled: boolean,
  }
  sdk?: {
    enabled: boolean,
    ws?: string,
  },
  server?: {
    httpPort: number;
    startHTTP: boolean;
    httpsPort: number;
    startHTTPS: boolean;
    wsPort: number;
    startWS: boolean;
    wssPort: number;
    startWSS: boolean;
    certificateFile?: string;
    certificateKeyFile?: string;
  },
  uploadBlockNumber?: number,
  addresses?: ContractAddresses,
};

export let environments: {[network: string]: SDKConfiguration} = {};
if (process?.versions?.node) {
  environments = requireAll({
    dirname: path.join(__dirname, '/environments'),
    filter: /^(.+)\.json/,
    recursive: false,
  });
} else {
  // tslint:disable-next-line:ban-ts-ignore
  // @ts-ignore
  const context = require.context('./environments', false, /.*\.json$/);
  const envNameRegex = new RegExp('([^\/]*)\.json$');
  context.keys().forEach((file: string) => {
    const key = file.match(envNameRegex)[1];
    environments[key] = context(file);
  });
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
  Order?: string;
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

export interface ExternalAddresses {
  LegacyReputationToken?: string;
  Cash?: string;
  DaiVat?: string;
  DaiPot?: string;
  DaiJoin?: string;
  MCDCol?: string,
  MCDColJoin?: string,
  MCDFaucet?: string,
  GnosisSafe?: string;
  ProxyFactory?: string;
  Exchange?: string;
  UniswapV2Factory?: string;
  ENSRegistry?: string;
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

export async function setEnvironmentConfig(env: string, config: SDKConfiguration): Promise<void> {
  await Promise.all(['src', 'build'].map(async (dir: string) => {
    const filepath = path.join(__dirname, '..', dir, 'environments', `${env}.json`);
    await writeFile(filepath, JSON.stringify(config, null, 2), 'utf8');
  }));
}

export async function updateConfig(env: string, config: Partial<SDKConfiguration>): Promise<SDKConfiguration> {
  const original: Partial<SDKConfiguration> = await readConfig(env).then((c) => c || {}).catch(() => ({}));
  const updated = {
    ...original,
    ...config
  };
  const valid = validConfigOrDie(updated);
  setEnvironmentConfig(env, valid);
  return valid;
}

export function getEnvironmentConfigForNetwork(networkId: NetworkId, breakOnMulti=false, validate=true): SDKConfiguration {
  let targetConfig: SDKConfiguration = null;
  Object.values(environments).forEach((config) => {
    if (config.networkId === networkId) {
      if (breakOnMulti && targetConfig) throw Error(`Multiple environment configs for network "${networkId}"`)
      targetConfig = config;
    }
  });

  if (validate) {
    if (!targetConfig) {
      throw new Error(`No config for network "${networkId}". Existing configs: ${JSON.stringify(environments)}`);
    }
    if (!targetConfig.addresses) {
      throw new Error(`Config for network is missing addresses. Config: ${JSON.stringify(targetConfig)}`)
    }
    if (!targetConfig.uploadBlockNumber) {
      throw new Error(`Config for network is missing uploadBlockNumber. Config: ${JSON.stringify(targetConfig)}`)
    }
  }

  return targetConfig;
}

export function getAddressesForNetwork(networkId: NetworkId): ContractAddresses {
  return getEnvironmentConfigForNetwork(networkId).addresses;
}

export function getStartingBlockForNetwork(networkId: NetworkId): number {
  return getEnvironmentConfigForNetwork(networkId).uploadBlockNumber;
}

export async function updateEnvironmentsConfig(): Promise<void> {
  const updatedEnvironments = requireAll({
    dirname: path.join(__dirname, '../src/environments'), // be sure to be in src dir, not build
    filter: /^(.+)\.json/,
    recursive: false,
  });
  Object.keys(updatedEnvironments).forEach((env) => {
    environments[env] = updatedEnvironments[env];
  })
}

async function readConfig(env: string): Promise<SDKConfiguration> {
  const filepath = path.join(__dirname, '../src/environments', `${env}.json`);
  if (await exists(filepath)) {
    let config;
    try {
      const blob = await readFile(filepath, 'utf8');
      config = JSON.parse(blob);
    } catch {
      throw Error(`Cannot parse config file ${filepath}`)
    }

    if (isValidConfig(config)) {
      return config;
    } else {
      throw Error(`Bad config file at ${filepath}`)
    }
  } else {
    return null;
  }
}

export function isValidConfig(suspect: Partial<SDKConfiguration>): suspect is SDKConfiguration {
  if (typeof suspect.networkId === 'undefined') return false;
  if (suspect.deploy) {
    if (typeof suspect.deploy.enableFaucets === 'undefined') return false;
    if (typeof suspect.deploy.normalTime === 'undefined') return false;
    if (typeof suspect.deploy.privateKey === 'undefined') return false;
    if (typeof suspect.deploy.contractInputPath === 'undefined') return false;
    if (typeof suspect.deploy.writeArtifacts === 'undefined') return false;
  }
  if (suspect.ethereum) {
    if (typeof suspect.ethereum.rpcRetryCount === 'undefined') return false;
    if (typeof suspect.ethereum.rpcRetryInterval === 'undefined') return false;
    if (typeof suspect.ethereum.rpcConcurrency === 'undefined') return false;
  }
  if (suspect.sdk) {
    if (typeof suspect.sdk.enabled === 'undefined') return false;
    if (suspect.sdk.enabled && typeof suspect.sdk.ws === 'undefined') return false;
  }
  if (suspect.gnosis && typeof suspect.gnosis.enabled === 'undefined') return false;
  if (suspect.zeroX) {
    if (suspect.zeroX.rpc) {
      if (typeof suspect.zeroX.rpc.enabled === 'undefined') return false;
    }
    if (suspect.zeroX.mesh) {
      if (typeof suspect.zeroX.mesh.enabled === 'undefined') return false;
    }
  }
  if (suspect.server) {
    if (typeof suspect.server.httpPort === 'undefined') return false;
    if (typeof suspect.server.startHTTP === 'undefined') return false;
    if (typeof suspect.server.httpsPort === 'undefined') return false;
    if (typeof suspect.server.startHTTPS === 'undefined') return false;
    if (typeof suspect.server.wsPort === 'undefined') return false;
    if (typeof suspect.server.startWS === 'undefined') return false;
    if (typeof suspect.server.wssPort === 'undefined') return false;
    if (typeof suspect.server.startWSS === 'undefined') return false;
  }
  return true;
}

export const DEFAULT_SDK_CONFIGURATION: SDKConfiguration = {
  networkId: NetworkId.PrivateGanache,
  ethereum: {
    http: 'http://localhost:8545',
    ws: 'ws://localhost:8546',
    rpcRetryCount: 5,
    rpcRetryInterval: 0,
    rpcConcurrency: 40
  },
  gas: {
    price: 20e9,
    limit: 75e5
  },
  deploy: {
    isProduction: false,
    enableFaucets: true,
    normalTime: true,
    privateKey: 'fae42052f82bed612a724fec3632f325f377120592c75bb78adfcceae6470c5a',
    contractInputPath: path.join(__dirname, 'contracts.json'),
    writeArtifacts: true,
  },
  gnosis: {
    enabled: false,
    http: 'http://localhost:8888/api/',
    relayerAddress: '0x9d4c6d4b84cd046381923c9bc136d6ff1fe292d9'
  },
  zeroX: {
    rpc: {
      enabled: false,
      ws: 'ws://localhost:60557'
    },
    mesh: {
      enabled: false,
    }
  },
  server: {
    httpPort: 9003,
    startHTTP: true,
    httpsPort: 9004,
    startHTTPS: true,
    wsPort: 9001,
    startWS: true,
    wssPort: 9002,
    startWSS: true,
  },
  uploadBlockNumber: 0,
};

export function buildConfig(env: string, specified: RecursivePartial<SDKConfiguration> = {}): SDKConfiguration {
  const existing = deepmerge(DEFAULT_SDK_CONFIGURATION, environments[env] || {});
  return configFromEnvvars(deepmerge(existing, specified) as SDKConfiguration) as SDKConfiguration;
}

export function configFromEnvvars(config?: Partial<SDKConfiguration>): Partial<SDKConfiguration> {
  const e = process.env;

  if (e.NETWORK_ID) config = deepmerge(config, { networkId: e.NETWORK_ID });

  if (e.ETHEREUM_HTTP) config = deepmerge(config, { ethereum: { http: e.ETHEREUM_HTTP }});
  if (e.ETHEREUM_WS) config = deepmerge(config, { ethereum: { ws: e.ETHEREUM_WS }});
  if (e.ETHEREUM_RPC_RETRY_COUNT) config = deepmerge(config, { ethereum: { rpcRetryCount: e.ETHEREUM_RPC_RETRY_COUNT }});
  if (e.ETHEREUM_RPC_RETRY_INTERVAL) config = deepmerge(config, { ethereum: { rpcRetryInterval: e.ETHEREUM_RPC_RETRY_INTERVAL }});
  if (e.ETHEREUM_RPC_CONCURRENCY) config = deepmerge(config, { ethereum: { rpcConcurrency: e.ETHEREUM_RPC_CONCURRENCY }});

  if (e.GAS_LIMIT) config = deepmerge(config, { gas: { limit: e.GAS_LIMIT }});
  if (e.GAS_PRICE) config = deepmerge(config, { gas: { price: e.GAS_PRICE }});

  if (e.ENABLE_FAUCETS) config = deepmerge(config, { deploy: { enableFaucets: e.ENABLE_FAUCETS }});
  if (e.NORMAL_TIME) config = deepmerge(config, { deploy: { normalTime: e.NORMAL_TIME }});
  if (e.ETHEREUM_PRIVATE_KEY) config = deepmerge(config, { deploy: { privateTime: e.ETHEREUM_PRIVATE_KEY }});
  if (e.CONTRACT_INPUT_PATH) config = deepmerge(config, { deploy: { contractInputPath: e.CONTRACT_INPUT_PATH }});
  if (e.WRITE_ARTIFACTS) config = deepmerge(config, { deploy: { writeArtifacts: e.WRITE_ARTIFACTS }});

  if (e.GNOSIS_ENABLED) config = deepmerge(config, { gnosis: { enabled: e.GNOSIS_ENABLED }});
  if (e.GNOSIS_HTTP) config = deepmerge(config, { gnosis: { http: e.GNOSIS_HTTP }});
  if (e.GNOSIS_RELAYER_ADDRESS) config = deepmerge(config, { gnosis: { relayerAddress: e.GNOSIS_RELAYER_ADDRESS }});

  if (e.ZEROX_RPC_ENABLED) config = deepmerge(config, { zeroX: { rpc: { enabled: e.ZEROX_RPC_ENABLED }}});
  if (e.ZEROX_RPC_WS) config = deepmerge(config, { zeroX: { rpc: { ws: e.ZEROX_RPC_WS }}});
  if (e.ZEROX_MESH_ENABLED) config = deepmerge(config, { zeroX: { mesh: { enabled: e.ZEROX_MESH_ENABLED }}});

  if (e.SDK_ENABLED) config = deepmerge(config, { sdk: { enabled: e.SDK_ENABLED }});
  if (e.SDK_WS) config = deepmerge(config, { sdk: { ws: e.SDK_WS }});

  if (e.SERVER_HTTP_PORT) config = deepmerge(config, { server: { httpPort: e.SERVER_HTTP_PORT }});
  if (e.SERVER_START_HTTP) config = deepmerge(config, { server: { startHTTP: e.SERVER_START_HTTP }});
  if (e.SERVER_HTTPS_PORT) config = deepmerge(config, { server: { httpsPort: e.SERVER_HTTPS_PORT }});
  if (e.SERVER_START_HTTPS) config = deepmerge(config, { server: { startHTTPS: e.SERVER_START_HTTPS }});
  if (e.SERVER_WS_PORT) config = deepmerge(config, { server: { wsPort: e.SERVER_WS_PORT }});
  if (e.SERVER_START_WS) config = deepmerge(config, { server: { startWS: e.SERVER_START_WS }});
  if (e.SERVER_WSS_PORT) config = deepmerge(config, { server: { wssPort: e.SERVER_WSS_PORT }});
  if (e.SERVER_START_WSS) config = deepmerge(config, { server: { startWSS: e.SERVER_START_WSS }});

  if (e.UPLOAD_BLOCK_NUMBER) config = deepmerge(config, { uploadBlockNumber: e.UPLOAD_BLOCK_NUMBER });

  if (e.ADDRESSES) config = deepmerge(config, { addresses: JSON.parse(e.ADDRESSES) });

  return config
}

export function validConfigOrDie(config: Partial<SDKConfiguration>): SDKConfiguration {
  if (isValidConfig(config)) {
    return config;
  } else {
    throw Error(`Invalid config: ${JSON.stringify(config, null, 2)}`);
  }
}

type RecursivePartial<T> = {
  [P in keyof T]?:
  T[P] extends (infer U)[] ? Array<RecursivePartial<U>> :
    T[P] extends object ? RecursivePartial<T[P]> :
      T[P];
};
