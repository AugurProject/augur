import deepmerge from 'deepmerge';
import path from 'path';
import { NetworkId } from './constants';
import { IPFSEndpointInfo, IPFSHashVersion } from './extract-ipfs-url';
import { LoggerLevels } from './logger';

export type RecursivePartial<T> = {
  [P in keyof T]?:
  T[P] extends Array<infer U> ? Array<RecursivePartial<U>> :
    T[P] extends object ? RecursivePartial<T[P]> :
      T[P];
};

export function bool(s: string|boolean): boolean {
  if (typeof s === 'boolean') return s;

  if (s.toLowerCase() === 'true') {
    return true;
  } else if (s.toLowerCase() === 'false') {
    return false;
  } else {
    // TODO should this instead throw an error?
    return undefined;
  }
}

export function deepCopy<T>(x: T): T {
  return JSON.parse(JSON.stringify(x));
}

export interface SDKConfiguration {
  networkId: NetworkId,
  uploadBlockNumber?: number,
  addresses?: ContractAddresses,
  averageBlocktime?: number,
  logLevel?: LoggerLevels, // In the JSON configs an integer will need to be used.
  ethereum?: {
    http?: string,
    ws?: string,
    rpcRetryCount: number,
    rpcRetryInterval: number,
    rpcConcurrency: number
  },
  gas?: {
    override?: boolean,
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
    serial?: boolean,
    writeArtifacts?: boolean,
    externalAddresses?: ExternalAddresses,
  },
  graph?: {
    logSubgraphURL: string
  }
  warpSync?: {
    createCheckpoints?: boolean,
    autoReport?: boolean
    ipfsEndpoint?: IPFSEndpointInfo
  },
  uniswap?: {
    exchangeRateBufferMultiplier: number;
  }
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
    delayTillSDKReady?: boolean
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
  plugins?: {
    chat?: 'orbit',
    comments?: 'facebook',
  },
  flash?: {
    syncSDK?: boolean,
    skipApproval?: boolean,
  },
  ui?: {
    showReloadModal?: boolean,
    trackBestOffer?: boolean,
    trackMarketInvalidBids?: boolean,
    fallbackProvider?: 'jsonrpc' | 'torus',
    liteProvider?: 'jsonrpc' | 'default',
    primaryProvider?: 'jsonrpc' | 'wallet'
  },
  concurrentDBOperationsLimit?: number
}

export interface ContractAddresses {
  Universe: string;
  Augur: string;
  AugurTrading: string;
  LegacyReputationToken: string;
  CancelOrder: string;
  Cash: string;
  USDC: string;
  USDT: string;
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
  GnosisSafeRegistry?: string;
  HotLoading?: string;
  ZeroXTrade?: string;
  Affiliates?: string;
  AffiliateValidator?: string;
  ProfitLoss?: string;
  WarpSync?: string;
  AugurWalletRegistry?: string;
  OICash?: string;
  UniswapV2Factory?: string;
  EthExchange?: string;
  UniswapV2Router02?: string;
  AuditFunds?: string;
  RelayHubV2?: string;
  AugurWalletRegistryV2?: string;
  AccountLoader?: string;
  ERC20Proxy1155Nexus?: string;

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
  USDC?: string;
  USDT?: string;
  WETH9?: string;
  Exchange?: string;
  UniswapV2Factory?: string;
  UniswapV2Router02?: string;
  RelayHubV2?: string;
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

export const DEFAULT_SDK_CONFIGURATION: SDKConfiguration = {
  networkId: NetworkId.PrivateGanache,
  uploadBlockNumber: 0,
  logLevel: LoggerLevels.warn,
  averageBlocktime: 2000,
  ethereum: {
    http: 'http://localhost:8545',
    ws: 'ws://localhost:8546',
    rpcRetryCount: 5,
    rpcRetryInterval: 0,
    rpcConcurrency: 40
  },
  gas: {
    override: false,
    price: 1e9,
    limit: 95e5
  },
  deploy: {
    isProduction: false,
    enableFaucets: true,
    normalTime: true,
    privateKey: 'fae42052f82bed612a724fec3632f325f377120592c75bb78adfcceae6470c5a',
    contractInputPath: path.join(__dirname, '../../augur-artifacts/build/contracts.json'),
    writeArtifacts: true,
    serial: true,
  },
  warpSync: {
    createCheckpoints: false,
    autoReport: false,
    ipfsEndpoint: {
      version: IPFSHashVersion.CIDv0,
      url: 'https://cloudflare-ipfs.com/'
    }
  },
  uniswap: {
    // mainnet will be <= 1.005 but for dev we can get away with a wide spread
    exchangeRateBufferMultiplier: 1.075,
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
  syncing: {
    enabled: true
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
  ui: {
    showReloadModal: true,
    trackBestOffer: false,
    trackMarketInvalidBids: true,
    fallbackProvider: 'torus',
    liteProvider: 'jsonrpc',
    primaryProvider: 'wallet'
  }
};

export function sanitizeConfig(config: RecursivePartial<SDKConfiguration>): RecursivePartial<SDKConfiguration> {
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
  // flash isn't saved
  if (config.flash) {
    delete finalConfig.flash;
  }
  return finalConfig;
}

export function serializeConfig(config: RecursivePartial<SDKConfiguration>): string {
  return JSON.stringify(sanitizeConfig(config), null, 2);
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
  if (suspect.uniswap && typeof suspect.uniswap.exchangeRateBufferMultiplier === 'undefined') {
    return fail('uniswap.exchangeRateBufferMultiplier');
  }

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

export function mergeConfig(...configs: Array<RecursivePartial<SDKConfiguration>>): RecursivePartial<SDKConfiguration> {
  if (configs.length < 2) throw Error(`mergeConfig must be passed at least 2 configs, not ${configs.length} configs`);

  return configs.reduce((left, right) => {
    return deepmerge(left, right, { arrayMerge: (target, source) => source });
  }, {})
}

// NOTE: must also add these to webpack config at packages/augur-ui/config/webpack.common.config.js
export function configFromEnvvars(): RecursivePartial<SDKConfiguration> {
  let config: RecursivePartial<SDKConfiguration> = {};
  const e = process.env;
  const d = mergeConfig;
  const t = (envvar) => typeof envvar !== 'undefined';

  if (t(e.NETWORK_ID)) config = d(config, { networkId: e.NETWORK_ID as NetworkId });

  if (t(e.ETHEREUM_HTTP)) config = d(config, { ethereum: { http: e.ETHEREUM_HTTP }});
  if (t(e.ETHEREUM_WS)) config = d(config, { ethereum: { ws: e.ETHEREUM_WS }});
  if (t(e.ETHEREUM_RPC_RETRY_COUNT)) config = d(config, { ethereum: { rpcRetryCount: Number(e.ETHEREUM_RPC_RETRY_COUNT) }});
  if (t(e.ETHEREUM_RPC_RETRY_INTERVAL)) config = d(config, { ethereum: { rpcRetryInterval: Number(e.ETHEREUM_RPC_RETRY_INTERVAL) }});
  if (t(e.ETHEREUM_RPC_CONCURRENCY)) config = d(config, { ethereum: { rpcConcurrency: Number(e.ETHEREUM_RPC_CONCURRENCY) }});

  if (t(e.GAS_OVERRIDE)) config = d(config, { gas: { override: bool(e.GAS_OVERRIDE) }});
  if (t(e.GAS_LIMIT)) config = d(config, { gas: { limit: Number(e.GAS_LIMIT) }});
  if (t(e.GAS_PRICE)) config = d(config, { gas: { price: Number(e.GAS_PRICE) }});

  if (t(e.ENABLE_FAUCETS)) config = d(config, { deploy: { enableFaucets: bool(e.ENABLE_FAUCETS) }});
  if (t(e.NORMAL_TIME)) config = d(config, { deploy: { normalTime: bool(e.NORMAL_TIME) }});
  if (t(e.ETHEREUM_PRIVATE_KEY)) config = d(config, { deploy: { privateKey: e.ETHEREUM_PRIVATE_KEY }});
  if (t(e.SAVE_PRIVATE_KEY)) config = d(config, { deploy: { savePrivateKey: bool(e.SAVE_PRIVATE_KEY) }});
  if (t(e.CONTRACT_INPUT_PATH)) config = d(config, { deploy: { contractInputPath: e.CONTRACT_INPUT_PATH }});
  if (t(e.WRITE_ARTIFACTS)) config = d(config, { deploy: { writeArtifacts: bool(e.WRITE_ARTIFACTS) }});
  if (t(e.DEPLOY_SERIAL)) config = d(config, { deploy: { serial: bool(e.DEPLOY_SERIAL) }});

  if (t(e.UNISWAP_EXCHANGE_RATE_BUFFER_MULTIPLIER)) config = d(config, { uniswap: { exchangeRateBufferMultiplier: Number(e.UNISWAP_EXCHANGE_RATE_BUFFER_MULTIPLIER) }});

  if (t(e.ZEROX_RPC_ENABLED)) config = d(config, { zeroX: { rpc: { enabled: bool(e.ZEROX_RPC_ENABLED) }}});
  if (t(e.ZEROX_RPC_WS)) config = d(config, { zeroX: { rpc: { ws: e.ZEROX_RPC_WS }}});
  if (t(e.ZEROX_MESH_ENABLED)) config = d(config, { zeroX: { mesh: { enabled: bool(e.ZEROX_MESH_ENABLED) }}});
  if (t(e.ZEROX_USE_BOOTSTRAP_LIST)) config = d(config, { zeroX: { mesh: { useBootstrapList: bool(e.ZEROX_USE_BOOTSTRAP_LIST) }}});
  if (t(e.ZEROX_MESH_BOOTSTRAP_LIST)) config = d(config, { zeroX: { mesh: { bootstrapList: JSON.parse(e.ZEROX_MESH_BOOTSTRAP_LIST) }}});

  if (t(e.SDK_ENABLED)) config = d(config, { sdk: { enabled: bool(e.SDK_ENABLED) }});
  if (t(e.SDK_WS)) config = d(config, { sdk: { ws: e.SDK_WS }});

  // skipped in webpack.common.config.js because these only apply to node, not browser
  if (t(e.SERVER_HTTP_PORT)) config = d(config, { server: { httpPort: Number(e.SERVER_HTTP_PORT) }});
  if (t(e.SERVER_START_HTTP)) config = d(config, { server: { startHTTP: bool(e.SERVER_START_HTTP) }});
  if (t(e.SERVER_HTTPS_PORT)) config = d(config, { server: { httpsPort: Number(e.SERVER_HTTPS_PORT) }});
  if (t(e.SERVER_START_HTTPS)) config = d(config, { server: { startHTTPS: bool(e.SERVER_START_HTTPS) }});
  if (t(e.SERVER_WS_PORT)) config = d(config, { server: { wsPort: Number(e.SERVER_WS_PORT) }});
  if (t(e.SERVER_START_WS)) config = d(config, { server: { startWS: bool(e.SERVER_START_WS) }});
  if (t(e.SERVER_WSS_PORT)) config = d(config, { server: { wssPort: Number(e.SERVER_WSS_PORT) }});
  if (t(e.SERVER_START_WSS)) config = d(config, { server: { startWSS: bool(e.SERVER_START_WSS) }});

  if (t(e.UPLOAD_BLOCK_NUMBER)) config = d(config, { uploadBlockNumber: Number(e.UPLOAD_BLOCK_NUMBER) });

  if (t(e.ADDRESSES)) config = d(config, { addresses: JSON.parse(e.ADDRESSES) });

  return config;
}

