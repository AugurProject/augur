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
  createGenesisUniverse: boolean;
  useNormalTime: boolean;
  isProduction: boolean;
  writeArtifacts: boolean;
  externalAddresses: ExternalAddresses;
}

type ExternalAddresses = {
  legacyRepAddress?: string;
  cashAddress?: string;
  vatAddress?: string;
  potAddress?: string;
  joinAddress?: string;
  repPriceOracleAddress?: string;
  gnosisSafeAddress?: string;
  proxyFactoryAddress?: string;
  zeroXExchange?: string;
}

type NetworksToExternalAddresses = {
  [P in NETWORKS]?: ExternalAddresses;
}

const externalAddresses: NetworksToExternalAddresses = {
  thunder: {},
  ropsten: {},
  kovan: {
    cashAddress: "",
    vatAddress: "",
    potAddress: "",
    joinAddress: "",
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
  createGenesisUniverse: envOrDefault('CREATE_GENESIS_UNIVERSE', true),
  isProduction: envOrDefault('IS_PRODUCTION', false),
  useNormalTime: envOrDefault('USE_NORMAL_TIME', true),
  writeArtifacts: true,
  externalAddresses: {},
};

export function CreateDeployerConfiguration(overwrites: DeployerConfigurationOverwrite = {}): DeployerConfiguration {
  // TODO take netid arg and use to map to externalAddresses
  return Object.assign({}, defaultDeployerConfiguration, overwrites);
}
