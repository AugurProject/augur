import {
  Mesh,
  Config,
  ContractAddresses as ZeroXContractAddresses,
} from '@0x/mesh-browser';
import { getAddressesForNetwork, NetworkId } from '@augurproject/artifacts';
import { SDKConfiguration, ZeroX } from '@augurproject/sdk';

type BrowserMeshErrorFunction = (err: Error, mesh: Mesh) => void;
/**
 * @forceIgnoreCustomAddresses: bool - Pass if you're attempting to restart a
 * browser mesh that has crashed. ZeroX will error if the custom addresses
 * are specified multiple times.
 */
function createBrowserMeshConfig(
  ethereumRPCURL: string,
  ethereumChainID: number,
  verbosity = 5,
  bootstrapList: string[],
  forceIgnoreCustomAddresses = false
) {
  const meshConfig: Config = {
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
  zeroX: ZeroX
) {
  return err => {
    console.error('Browser mesh error: ', err.message, err.stack);
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
      mesh.onError(createBrowserMeshRestartFunction(meshConfig, zeroX));
      mesh.startAsync().then(() => {
        zeroX.mesh = mesh;
      })
    }
  };
}

export async function createBrowserMesh(
  config: SDKConfiguration,
  zeroX: ZeroX
) {
  if (!config.zeroX || !config.zeroX.mesh || !config.zeroX.mesh.enabled) {
    throw new Error(`Attempting to create browser mesh without it being enabled in config ${JSON.stringify(config)}`);
  }

  const meshConfig = createBrowserMeshConfig(
    config.ethereum.http,
    Number(config.networkId),
    config.zeroX.mesh.verbosity || 5,
    config.zeroX.mesh.bootstrapList
  );

  const mesh = new Mesh(meshConfig);
  mesh.onError(createBrowserMeshRestartFunction(meshConfig, zeroX));
  await mesh.startAsync();
  zeroX.mesh = mesh;
}
