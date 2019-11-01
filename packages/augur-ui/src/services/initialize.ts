import logError from 'utils/log-error';
import { augurSdk } from 'services/augursdk';
import { JsonRpcProvider, Web3Provider } from 'ethers/providers';
import { EnvObject, NodeStyleCallback } from 'modules/types';

export const connect = async (env: EnvObject, callback: NodeStyleCallback = logError) => {
  const signer = undefined;
  const signerNetworkId = undefined;
  const account = undefined;
  const sdk = await augurSdk.makeApi(new JsonRpcProvider(env["ethereum-node"].http), account, signer, env, signerNetworkId, false);
  callback(null, sdk);

  // temporarily used to generate template validations
  //window.genTemplate = generateTemplateValidations
};
