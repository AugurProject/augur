import logError from 'utils/log-error';
import { augurSdk } from 'services/augursdk';
import { JsonRpcProvider, Web3Provider } from 'ethers/providers';
import { EnvObject, NodeStyleCallback } from 'modules/types';

export const connect = async (
  env: EnvObject,
  provider: Web3Provider,
  callback: NodeStyleCallback = logError
) => {
  const signer = undefined;
  const signerNetworkId = undefined;
  const account = null;
  const enableFlexSearch = true;
  const sdk = await augurSdk.makeClient(
    provider ? provider : new JsonRpcProvider(env['ethereum-node'].http),
    signer,
    env,
    account,
    false,
    enableFlexSearch,
    signerNetworkId,
    env['gnosis-relay']
  );
  callback(null, sdk);
};
