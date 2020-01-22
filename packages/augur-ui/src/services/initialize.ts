import logError from 'utils/log-error';
import { augurSdk } from 'services/augursdk';
import { JsonRpcProvider } from 'ethers/providers';
import { EnvObject, NodeStyleCallback } from 'modules/types';

export const connect = async (
  env: EnvObject,
  callback: NodeStyleCallback = logError
) => {
  const signer = undefined;
  const signerNetworkId = undefined;
  const account = null;
  const enableFlexSearch = true;
  const sdk = await augurSdk.makeClient(
    new JsonRpcProvider(env['ethereum-node'].http),
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
