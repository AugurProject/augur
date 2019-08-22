import * as path from 'path';

const ARTIFACT_OUTPUT_ROOT = (typeof process.env.ARTIFACT_OUTPUT_ROOT === 'undefined') ? path.join(__dirname, '../../output/contracts') : path.normalize(process.env.ARTIFACT_OUTPUT_ROOT);
const CONTRACT_INPUT_ROOT  = (typeof process.env.CONTRACT_INPUT_ROOT === 'undefined')  ? path.join(__dirname, '../../output/contracts') : path.normalize(process.env.CONTRACT_INPUT_ROOT);

const PRODUCTION_LEGACY_REP_CONTRACT_ADDRESS = "0x1985365e9f78359a9B6AD760e32412f4a445E862";
const PRODUCTION_CASH_CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000"; // TODO when MC DAI is released
const PRODUCTION_VAT_CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000"; // TODO when MC DAI is released
const PRODUCTION_POT_CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000"; // TODO when MC DAI is released
const PRODUCTION_JOIN_CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000"; // TODO when MC DAI is released
const PRODUCTION_REP_PRICE_ORACLE_CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000"; // TODO when uniswap price oracle is released
const PRODUCTION_GNOSIS_SAFE = "0xb6029EA3B2c51D09a50B53CA8012FeEB05bDa35A";
const PRODUCTION_PROXY_FACTORY = "0x12302fE9c02ff50939BaAaaf415fc226C078613C";
const PRODUCTION_ZEROX_EXCHANGE = "0x080bf510FCbF18b91105470639e9561022937712";

export interface DeployerConfiguration {
  contractInputPath: string;
  contractAddressesOutputPath: string;
  uploadBlockNumbersOutputPath: string;
  augurAddress: string|undefined;
  createGenesisUniverse: boolean;
  useNormalTime: boolean;
  isProduction: boolean;
  legacyRepAddress: string;
  cashAddress: string;
  vatAddress: string;
  potAddress: string;
  joinAddress: string;
  repPriceOracleAddress: string;
  gnosisSafeAddress: string;
  proxyFactoryAddress: string;
  zeroXExchange: string;
  writeArtifacts: boolean;
}

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
  legacyRepAddress: PRODUCTION_LEGACY_REP_CONTRACT_ADDRESS,
  cashAddress: PRODUCTION_CASH_CONTRACT_ADDRESS,
  repPriceOracleAddress: PRODUCTION_REP_PRICE_ORACLE_CONTRACT_ADDRESS,
  vatAddress: PRODUCTION_VAT_CONTRACT_ADDRESS,
  potAddress: PRODUCTION_POT_CONTRACT_ADDRESS,
  joinAddress: PRODUCTION_JOIN_CONTRACT_ADDRESS,
  gnosisSafeAddress: PRODUCTION_GNOSIS_SAFE,
  proxyFactoryAddress: PRODUCTION_PROXY_FACTORY,
  zeroXExchange: PRODUCTION_ZEROX_EXCHANGE,
  writeArtifacts: true,
};

export function CreateDeployerConfiguration(overwrites: DeployerConfigurationOverwrite = {}): DeployerConfiguration {
  return Object.assign({}, defaultDeployerConfiguration, overwrites);
}
