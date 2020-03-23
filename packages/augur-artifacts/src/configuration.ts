import path from 'path';
import deepmerge from 'deepmerge';
import requireAll from 'require-all';
import { writeFile } from 'async-file';
import { bool, deepCopy, RecursivePartial } from './util';

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
    savePrivateKey?: boolean,
    privateKey: string,
    contractInputPath: string,
    writeArtifacts?: boolean,
    externalAddresses?: ExternalAddresses,
  },
  useWarpSync?: boolean,
  gsn?: {
    enabled: boolean,
  },
  zeroX?: {
    rpc?: {
      enabled: boolean,
      ws?: string
    },
    mesh?: {
      enabled: boolean,
      verbosity?: 0|1|2|3|4|5,
      useBootstrapList?: boolean,
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
  plugins?: {
    chat?: '3box'|'orbit',
    comments?: '3box'|'facebook',
  }
};

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
  AugurWalletRegistry?: string;
  OICash?: string;

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
    price: 1e9,
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
  useWarpSync: false,
  gsn: {
    enabled: true
  },
  zeroX: {
    rpc: {
      enabled: false,
      ws: 'ws://localhost:60557'
    },
    mesh: {
      enabled: true,
      useBootstrapList: true,
      bootstrapList: [
        '/dns4/localhost/tcp/60558/ipfs/16Uiu2HAmRMgvPQV2UYKXuuCnNaFLpc36PhLp2UKVcL1ePseVcz4y',
        '/dns4/localhost/tcp/60559/ws/ipfs/16Uiu2HAmRMgvPQV2UYKXuuCnNaFLpc36PhLp2UKVcL1ePseVcz4y'
      ],
    }
  },
  sdk: {
    enabled: false,
    ws: 'ws://localhost:60557',
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

export function isDevNetworkId(id: NetworkId): boolean {
  return [
    NetworkId.Mainnet,
    NetworkId.Ropsten,
    NetworkId.Rinkeby,
    NetworkId.Kovan,
  ].indexOf(id) === -1;
}

export function getConfigForNetwork(networkId: NetworkId, breakOnMulti=true, validate=true): SDKConfiguration {
  let targetConfig: SDKConfiguration = null;
  Object.values(environments).forEach((config) => {
    if (config.networkId === networkId) {
      if (breakOnMulti && targetConfig) throw Error(`Multiple environment configs for network "${networkId}"`);
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

export async function updateConfig(env: string, config: RecursivePartial<SDKConfiguration>): Promise<SDKConfiguration> {
  const original = environments[env] || {};
  const updated = mergeConfig(original, config);
  const valid = validConfigOrDie(updated);
  writeConfig(env, valid);
  return valid;
}

export function serializeConfig(config: RecursivePartial<SDKConfiguration>): string {
  // Prefer not to save private key.
  let finalConfig = config;
  if (config.deploy?.privateKey && !config.deploy?.savePrivateKey) {
    finalConfig = deepCopy(config);
    delete finalConfig.deploy.privateKey;
  }
  // contractInputPath is ephemeral
  if (config.deploy?.contractInputPath) {
    delete finalConfig.deploy.contractInputPath;
  }
  return JSON.stringify(finalConfig, null, 2);
}

export async function writeConfig(env: string, config: SDKConfiguration): Promise<void> {
  await Promise.all(['src', 'build'].map(async (dir: string) => {
    const filepath = path.join(__dirname, '..', dir, 'environments', `${env}.json`);
    await writeFile(filepath, serializeConfig(config), 'utf8');
  }));

  // Now that config is changed on filesystem, reflect it in the runtime.
  environments[env] = config;
}

export function printConfig(config: RecursivePartial<SDKConfiguration>): void {
  console.log(serializeConfig(config));
}

export function isValidConfig(suspect: RecursivePartial<SDKConfiguration>): suspect is SDKConfiguration {
  function fail(where: string): boolean {
    console.error(`Bad config due to: ${where}`);
    return false;
  }

  if (typeof suspect.networkId === 'undefined') return fail('suspect.networkId');
  if (suspect.deploy) {
    if (typeof suspect.deploy.enableFaucets === 'undefined') return fail('deploy.enableFaucets');
    if (typeof suspect.deploy.normalTime === 'undefined') return fail('deploy.normalTime');
    if (typeof suspect.deploy.privateKey === 'undefined') return fail('deploy.privateKey');
    if (typeof suspect.deploy.contractInputPath === 'undefined') return fail('deploy.contractInputPath');
    if (typeof suspect.deploy.writeArtifacts === 'undefined') return fail('deploy.writeArtifacts');
  }
  if (suspect.ethereum) {
    if (typeof suspect.ethereum.rpcRetryCount === 'undefined') return fail('ethereum.rpcRetryCount');
    if (typeof suspect.ethereum.rpcRetryInterval === 'undefined') return fail('ethereum.rpcRetryInterval');
    if (typeof suspect.ethereum.rpcConcurrency === 'undefined') return fail('ethereum.rpcConcurrency');
  }
  if (suspect.sdk) {
    if (typeof suspect.sdk.enabled === 'undefined') return fail('sdk.enabled');
    if (suspect.sdk.enabled && typeof suspect.sdk.ws === 'undefined') return fail('sdk.ws');
  }
  if (suspect.gsn && typeof suspect.gsn.enabled === 'undefined') return fail('gsn.enabled');
  if (suspect.zeroX) {
    if (suspect.zeroX.rpc) {
      if (typeof suspect.zeroX.rpc.enabled === 'undefined') return fail('zeroX.rpc.enabled');
    }
    if (suspect.zeroX.mesh) {
      if (typeof suspect.zeroX.mesh.enabled === 'undefined') return fail('zeroX.mesh.enabled');
      if (suspect.zeroX.mesh.useBootstrapList && typeof suspect.zeroX.mesh.bootstrapList === 'undefined') {
        return fail('zeroX.mesh.bootstrapList');
      }
    }
  }
  if (suspect.server) {
    if (typeof suspect.server.httpPort === 'undefined') return fail('server.httpPort');
    if (typeof suspect.server.startHTTP === 'undefined') return fail('server.startHTTP');
    if (typeof suspect.server.httpsPort === 'undefined') return fail('server.httpsPort');
    if (typeof suspect.server.startHTTPS === 'undefined') return fail('server.startHTTPS');
    if (typeof suspect.server.wsPort === 'undefined') return fail('server.wsPort');
    if (typeof suspect.server.startWS === 'undefined') return fail('server.startWS');
    if (typeof suspect.server.wssPort === 'undefined') return fail('server.wssPort');
    if (typeof suspect.server.startWSS === 'undefined') return fail('server.startWSS');
  }
  return true;
}

export function validConfigOrDie(config: RecursivePartial<SDKConfiguration>): SDKConfiguration {
  if (isValidConfig(config)) {
    return config;
  } else {
    throw Error(`Invalid config: ${JSON.stringify(config, null, 2)}`);
  }
}

export function buildConfig(env: string, specified: RecursivePartial<SDKConfiguration> = {}): SDKConfiguration {
  const config: RecursivePartial<SDKConfiguration> = mergeConfig(
    DEFAULT_SDK_CONFIGURATION,
    environments[env] || {},
    specified,
    configFromEnvvars()
  );
  return validConfigOrDie(config);
}

export function mergeConfig(...configs: Array<RecursivePartial<SDKConfiguration>>): RecursivePartial<SDKConfiguration> {
  return configs.reduce((left, right) => {
    return deepmerge(left, right, { arrayMerge: (target, source) => source });
  }, {})
}

export function configFromEnvvars(): RecursivePartial<SDKConfiguration> {
  let config: RecursivePartial<SDKConfiguration> = {};
  const e = process.env;
  const d = mergeConfig;

  if (e.NETWORK_ID) config = d(config, { networkId: e.NETWORK_ID as NetworkId });

  if (e.ETHEREUM_HTTP) config = d(config, { ethereum: { http: e.ETHEREUM_HTTP }});
  if (e.ETHEREUM_WS) config = d(config, { ethereum: { ws: e.ETHEREUM_WS }});
  if (e.ETHEREUM_RPC_RETRY_COUNT) config = d(config, { ethereum: { rpcRetryCount: Number(e.ETHEREUM_RPC_RETRY_COUNT) }});
  if (e.ETHEREUM_RPC_RETRY_INTERVAL) config = d(config, { ethereum: { rpcRetryInterval: Number(e.ETHEREUM_RPC_RETRY_INTERVAL) }});
  if (e.ETHEREUM_RPC_CONCURRENCY) config = d(config, { ethereum: { rpcConcurrency: Number(e.ETHEREUM_RPC_CONCURRENCY) }});

  if (e.GAS_LIMIT) config = d(config, { gas: { limit: Number(e.GAS_LIMIT) }});
  if (e.GAS_PRICE) config = d(config, { gas: { price: Number(e.GAS_PRICE) }});

  if (e.ENABLE_FAUCETS) config = d(config, { deploy: { enableFaucets: bool(e.ENABLE_FAUCETS) }});
  if (e.NORMAL_TIME) config = d(config, { deploy: { normalTime: bool(e.NORMAL_TIME) }});
  if (e.ETHEREUM_PRIVATE_KEY) config = d(config, { deploy: { privateKey: e.ETHEREUM_PRIVATE_KEY }});
  if (e.SAVE_PRIVATE_KEY) config = d(config, { deploy: { savePrivateKey: bool(e.SAVE_PRIVATE_KEY) }});
  if (e.CONTRACT_INPUT_PATH) config = d(config, { deploy: { contractInputPath: e.CONTRACT_INPUT_PATH }});
  if (e.WRITE_ARTIFACTS) config = d(config, { deploy: { writeArtifacts: bool(e.WRITE_ARTIFACTS) }});

  if (e.GSN_ENABLED) config = d(config, { gsn: { enabled: bool(e.GSN_ENABLED) }});

  if (e.ZEROX_RPC_ENABLED) config = d(config, { zeroX: { rpc: { enabled: bool(e.ZEROX_RPC_ENABLED) }}});
  if (e.ZEROX_RPC_WS) config = d(config, { zeroX: { rpc: { ws: e.ZEROX_RPC_WS }}});
  if (e.ZEROX_MESH_ENABLED) config = d(config, { zeroX: { mesh: { enabled: bool(e.ZEROX_MESH_ENABLED) }}});
  if (e.ZEROX_USE_BOOTSTRAP_LIST) config = d(config, { zeroX: { mesh: { useBootstrapList: bool(e.ZEROX_USE_BOOTSTRAP_LIST) }}});
  if (e.ZEROX_MESH_BOOTSTRAP_LIST) config = d(config, { zeroX: { mesh: { bootstrapList: JSON.parse(e.ZEROX_MESH_BOOTSTRAP_LIST) }}});

  if (e.SDK_ENABLED) config = d(config, { sdk: { enabled: bool(e.SDK_ENABLED) }});
  if (e.SDK_WS) config = d(config, { sdk: { ws: e.SDK_WS }});

  if (e.SERVER_HTTP_PORT) config = d(config, { server: { httpPort: Number(e.SERVER_HTTP_PORT) }});
  if (e.SERVER_START_HTTP) config = d(config, { server: { startHTTP: bool(e.SERVER_START_HTTP) }});
  if (e.SERVER_HTTPS_PORT) config = d(config, { server: { httpsPort: Number(e.SERVER_HTTPS_PORT) }});
  if (e.SERVER_START_HTTPS) config = d(config, { server: { startHTTPS: bool(e.SERVER_START_HTTPS) }});
  if (e.SERVER_WS_PORT) config = d(config, { server: { wsPort: Number(e.SERVER_WS_PORT) }});
  if (e.SERVER_START_WS) config = d(config, { server: { startWS: bool(e.SERVER_START_WS) }});
  if (e.SERVER_WSS_PORT) config = d(config, { server: { wssPort: Number(e.SERVER_WSS_PORT) }});
  if (e.SERVER_START_WSS) config = d(config, { server: { startWSS: bool(e.SERVER_START_WSS) }});

  if (e.UPLOAD_BLOCK_NUMBER) config = d(config, { uploadBlockNumber: Number(e.UPLOAD_BLOCK_NUMBER) });

  if (e.ADDRESSES) config = d(config, { addresses: JSON.parse(e.ADDRESSES) });

  return config
}

export function refreshSDKConfig(): void {
  // be sure to be in src dir, not build
  loadSDKConfigs('../src/environments');
}

function loadSDKConfigs(relativePath: string) {
  Object.keys(require.cache).forEach((id: string) => {
    if (/\/environments\/.*?\.json$/.test(id)) {
      console.log('deleting cache for module:', id);
      delete require.cache[id];
    }
  });

  if (process?.versions?.node) {
    const envs = requireAll({
      dirname: path.join(__dirname, relativePath),
      filter: /^(.+)\.json/,
      recursive: false,
    });
    Object.keys(envs).forEach((key) => {
      environments[key] = envs[key];
    })
  } else {
    throw Error('Cannot reload SDK config files in browser')
  }
}

export const environments: {[network: string]: SDKConfiguration} = {};

if (process?.versions?.node) {
  loadSDKConfigs('./environments');
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

