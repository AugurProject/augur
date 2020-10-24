import { SDKConfiguration, serializeConfig } from '@augurproject/utils';
import { ethers, providers } from 'ethers';
import { EthersProvider } from '@augurproject/ethersjs-provider';

export const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';

// TODO: Replace this with ethers/utils "formatBytes32String"
export function stringTo32ByteHex(stringToEncode: string): string {
    return `0x${Buffer.from(stringToEncode, 'utf8').toString('hex').padEnd(64, '0')}`;
}

export function providerFromConfig(config: SDKConfiguration) {
  const provider = jsonProviderFromConfig(config);
  const ethersProvider = new EthersProvider(
    provider,
    config.ethereum.rpcRetryCount,
    config.ethereum.rpcRetryInterval,
    config.ethereum.rpcConcurrency);
  if (config.gas?.override) {
    if (config.gas?.price) ethersProvider.overrideGasPrice = ethers.BigNumber.from(config.gas.price);
    if (config.gas?.limit) ethersProvider.gasLimit = ethers.BigNumber.from(config.gas.limit);
  }
  return ethersProvider;
}

export function jsonProviderFromConfig(config: SDKConfiguration): providers.JsonRpcProvider {
  if (!config.ethereum || !config.ethereum.http) {
    throw Error(`cannot create provider from config lacking ethereum and ethereum.http. Config: ${serializeConfig(config)}`);
  }

  return new providers.JsonRpcProvider(config.ethereum.http);
}
