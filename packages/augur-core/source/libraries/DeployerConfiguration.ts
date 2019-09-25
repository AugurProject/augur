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
  legacyRepAddress?: string;
  cashAddress?: string;
  vatAddress?: string;
  potAddress?: string;
  joinAddress?: string;
  colAddress?: string,
  colJoinAddress?: string,
  daiFaucet?: string,
  repPriceOracleAddress?: string;
  gnosisSafeAddress?: string;
  proxyFactoryAddress?: string;
  zeroXExchange?: string;
}

type NetworksToExternalAddresses = {
  [P in NETWORKS]?: ExternalAddresses;
}

const EXTERNAL_ADDRESSES: NetworksToExternalAddresses = {
  thunder: {},
  ropsten: {},
  kovan: {
    colAddress: "0xC7aa227823789E363f29679F23f7e8F6d9904a9B",
    colJoinAddress: "0x8218a5a1ff5320e763127320A1A2c5f16E2e5933",
    daiFaucet: "0x94598157fcf0715c3bc9b4a35450cce82ac57b20",
    cashAddress: "0x98738f2ca303a7e8bf22b252e4418f2b14bbdfa2",
    vatAddress: "0x1cc5abe5c0464f3af2a10df0c711236a8446bf75",
    potAddress: "0x3d9afbed6ee2c2d17749b003875eaa38c0ce0c7f",
    joinAddress: "0xa9ac4ae91f3e933cbb12a4229c425b7cfd3ac458",
  },
  rinkeby: {},
  clique: {},
  aura: {},
  environment: {},
  testrpc: {},
  mainnet: {
    legacyRepAddress: "0x1985365e9f78359a9B6AD760e32412f4a445E862",
    gnosisSafeAddress: "0xb6029EA3B2c51D09a50B53CA8012FeEB05bDa35A",
    proxyFactoryAddress: "0x12302fE9c02ff50939BaAaaf415fc226C078613C",
    zeroXExchange: "0x080bf510FCbF18b91105470639e9561022937712",
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
  return Object.assign({}, defaultDeployerConfiguration, overwrites, externalAddresses);
}
