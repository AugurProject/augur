import {
  Mesh,
  Config,
  ValidationResults,
  ContractAddresses as ZeroXContractAddresses,
} from '@0x/mesh-browser';
import { getAddressesForNetwork, NetworkId } from '@augurproject/artifacts';
import { SDKConfiguration } from '../state/create-api';

type BrowserMeshErrorFunction = (err: Error, mesh: Mesh) => void;
/**
 * @forceIgnoreCustomAddresses: bool - Pass if you're attempting to restart a
 * browser mesh that has crashed. ZeroX will error if the custom addresses
 * are specified multiple times.
 */
function createBrowserMeshConfig(
  ethereumRPCURL: string,
  ethereumChainID: number,
  verbosity: number = 5,
  bootstrapList: string[],
  forceIgnoreCustomAddresses: boolean = false
) {
  let meshConfig: Config = {
    ethereumRPCURL,
    ethereumChainID,
    verbosity,
    bootstrapList,
  };

  if (
    ![NetworkId.Kovan, NetworkId.Mainnet].includes(
      ethereumChainID.toString() as NetworkId
    ) &&
    !forceIgnoreCustomAddresses
  ) {
    // Our contract addresses have a different type than `customContractAddresses` but the 0x code
    // normalizes them so it still works. Thus, we just cast it here.
    meshConfig.customContractAddresses = (getAddressesForNetwork(
      ethereumChainID.toString() as NetworkId
    ) as unknown) as ZeroXContractAddresses;
  }

  return meshConfig;
}

function createBrowserMeshRestartFunction(
  meshConfig: Config,
  onRestart?: BrowserMeshErrorFunction
) {
  return err => {
    console.log('Browser mesh error: ', err.message, err.stack);
    if (typeof onRestart === 'undefined') return;
    if (
      err.message ===
      'timed out waiting for first block to be processed by Mesh node. Check your backing Ethereum RPC endpoint'
    ) {
      console.log('Restarting Mesh Sync');

      // Passing `true` as the last parameter to make sure the config doesn't include custom addresses on retry
      const mesh = new Mesh(
        createBrowserMeshConfig(
          meshConfig.ethereumRPCURL,
          meshConfig.ethereumChainID,
          meshConfig.verbosity,
          meshConfig.bootstrapList,
          true
        )
      );
      mesh.onError(createBrowserMeshRestartFunction(meshConfig, onRestart));
      onRestart(err, mesh);
    }
  };
}

export function createBrowserMesh(
  config: SDKConfiguration,
  onRestart?: BrowserMeshErrorFunction
) {
  const meshConfig = createBrowserMeshConfig(
    config.ethereum.http,
    Number(config.networkId),
    config.zeroX.verbosity || 5,
    config.zeroX.mesh.bootstrapList
  );

  const mesh = new Mesh(meshConfig);
  mesh.onError(createBrowserMeshRestartFunction(meshConfig, onRestart));
  return mesh;
}
