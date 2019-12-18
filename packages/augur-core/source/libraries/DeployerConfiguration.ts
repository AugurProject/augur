import * as path from 'path';
import { NETWORKS } from './NetworkConfiguration';

const ARTIFACT_OUTPUT_ROOT = (typeof process.env.ARTIFACT_OUTPUT_ROOT === 'undefined') ? path.join(__dirname, '../../output/contracts') : path.normalize(process.env.ARTIFACT_OUTPUT_ROOT);
const CONTRACT_INPUT_ROOT  = (typeof process.env.CONTRACT_INPUT_ROOT === 'undefined')  ? path.join(__dirname, '../../output/contracts') : path.normalize(process.env.CONTRACT_INPUT_ROOT);

// TODO: organize these into per-network mappings that fulfil an interface
// Get rid of isProduction and simply make toggles for real-time
// Review faucet abilities of DAI on Kovan
// Confirm their contracts match our interfaces
// Do a Kovan deploy
// Create a market
// Trade on it
// Sweep interest

export interface DeployerConfiguration {
  contractInputPath: string;
  contractAddressesOutputPath: string;
  uploadBlockNumbersOutputPath: string;
  augurAddress: string|undefined;
  useNormalTime: boolean;
  isProduction: boolean; // Determines if faucets are enabled / created
  writeArtifacts: boolean;
  externalAddresses: ExternalAddresses;
}

type ExternalAddresses = {
  LegacyReputationToken?: string;
  Cash?: string;
  DaiVat?: string;
  DaiPot?: string;
  DaiJoin?: string;
  MCDCol?: string,
  MCDColJoin?: string,
  MCDFaucet?: string,
  RepPriceOracle?: string;
  GnosisSafe?: string;
  ProxyFactory?: string;
  ZeroXExchange?: string;
  UniswapV2Factory?: string;
}

type NetworksToExternalAddresses = {
  [P in NETWORKS]?: ExternalAddresses;
}

const EXTERNAL_ADDRESSES: NetworksToExternalAddresses = {
  thunder: {},
  ropsten: {},
  kovan: {
    // from https://github.com/0xProject/0x-mesh/blob/a428703d64b084f41ff11d678b47a1d01135c6f1/ethereum/contract_addresses.go
    ZeroXExchange: "0x30589010550762d2f0d06f650d8e8b6ade6dbf4b",
    /*
    MCDCol: "0xc7aa227823789e363f29679f23f7e8f6d9904a9b",
    MCDColJoin: "0xebbd300bb527f1d50abd937f8ca11d7fd0e5b68b",
    MCDFaucet: "0x94598157fcf0715c3bc9b4a35450cce82ac57b20",
    Cash: "0x1f9beaf12d8db1e50ea8a5ed53fb970462386aa0",
    DaiVat: "0x6e6073260e1a77dfaf57d0b92c44265122da8028",
    DaiPot: "0x24e89801dad4603a3e2280ee30fb77f183cb9ed9",
    DaiJoin: "0x61af28390d0b3e806bbaf09104317cb5d26e215d",
    */
  },
  rinkeby: {},
  clique: {},
  aura: {},
  environment: {},
  testrpc: {},
  mainnet: {
    LegacyReputationToken: "0x1985365e9f78359a9B6AD760e32412f4a445E862",
    GnosisSafe: "0xb6029EA3B2c51D09a50B53CA8012FeEB05bDa35A",
    ProxyFactory: "0x12302fE9c02ff50939BaAaaf415fc226C078613C",
    ZeroXExchange: "0x61935cbdd02287b511119ddb11aeb42f1593b7ef",
  },
};

export type DeployerConfigurationOverwrite = Partial<DeployerConfiguration>;

function envOrDefault(envName: string, default_: boolean): boolean {
  const value = process.env[envName];

  if (typeof value !== "undefined") {
    return value === 'true';
  } else {
    return default_;
  }
}

export const defaultDeployerConfiguration: DeployerConfiguration = {
  contractInputPath: path.join(CONTRACT_INPUT_ROOT, 'contracts.json'),
  contractAddressesOutputPath: path.join(ARTIFACT_OUTPUT_ROOT, 'addresses.json'),
  uploadBlockNumbersOutputPath: path.join(ARTIFACT_OUTPUT_ROOT, 'upload-block-numbers.json'),
  augurAddress: process.env.AUGUR_ADDRESS,
  isProduction: envOrDefault('IS_PRODUCTION', false),
  useNormalTime: envOrDefault('USE_NORMAL_TIME', true),
  writeArtifacts: true,
  externalAddresses: {},
};

export function CreateDeployerConfiguration(networkId: NETWORKS, overwrites: DeployerConfigurationOverwrite = {}): DeployerConfiguration {
  const externalAddresses = EXTERNAL_ADDRESSES[networkId];
  return Object.assign({}, defaultDeployerConfiguration, overwrites, { externalAddresses });
}
