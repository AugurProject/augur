import { Config, ContractAddresses as ZeroXContractAddresses, Mesh } from '@0x/mesh-browser';
import { getAddressesForNetwork, NetworkId, SDKConfiguration } from '@augurproject/artifacts';
import { ZeroX } from '@augurproject/sdk';

type BrowserMeshErrorFunction = (err: Error, mesh: Mesh) => void;
/**
 * @forceIgnoreCustomAddresses: bool - Pass if you're attempting to restart a
 * browser mesh that has crashed. ZeroX will error if the custom addresses
 * are specified multiple times.
 */
function createBrowserMeshConfig(
  ethereumRPCURL: string,
  web3Provider: SupportedProvider,
  ethereumChainID: number,
  verbosity = 5,
  bootstrapList: string[],
  forceIgnoreCustomAddresses = false,
) {
  const meshConfig: Config = {
    ethereumChainID,
    verbosity,
    bootstrapList,
  };

  if (web3Provider) {
    meshConfig.web3Provider = web3Provider;
  } else if (ethereumRPCURL) {
    meshConfig.ethereumRPCURL = ethereumRPCURL;
  } else {
    throw new Error('No Web3 provider or RPC URL provided to Browser Mesh');
  }

  const contractAddresses = getAddressesForNetwork(
    ethereumChainID.toString() as NetworkId
  );

  if (
    ![NetworkId.Kovan, NetworkId.Mainnet].includes(
      ethereumChainID.toString() as NetworkId
    ) &&
    !forceIgnoreCustomAddresses
  ) {
    // Our contract addresses have a different type than `customContractAddresses` but the 0x code
    // normalizes them so it still works. Thus, we just cast it here.
    meshConfig.customContractAddresses = (contractAddresses as unknown) as ZeroXContractAddresses;
  }

  meshConfig.customOrderFilter = {
    properties: {
      makerAssetData: {
          pattern: `.*${contractAddresses.ZeroXTrade.slice(2).toLowerCase()}.*`
      }
    }
  }

  return meshConfig;
}

function createBrowserMeshRestartFunction(
  meshConfig: Config,
  web3Provider: SupportedProvider,
  zeroX: ZeroX
) {
  return err => {
    console.error('Browser mesh error: ', err.message, err.stack);
      console.log('Restarting Mesh Sync');

      // Passing `true` as the last parameter to make sure the config doesn't include custom addresses on retry
      const mesh = new Mesh(
        createBrowserMeshConfig(
          meshConfig.ethereumRPCURL,
          web3Provider,
          meshConfig.ethereumChainID,
          meshConfig.verbosity,
          meshConfig.bootstrapList,
          true
        )
      );
      mesh.onError(createBrowserMeshRestartFunction(meshConfig, web3Provider, zeroX));
      mesh.startAsync().then(() => {
        zeroX.mesh = mesh;
      })
  };
}

export async function createBrowserMesh(
  config: SDKConfiguration,
  web3Provider: SupportedProvider,
  zeroX: ZeroX
) {
  if (!config.zeroX?.mesh?.enabled) {
    throw new Error(`Attempting to create browser mesh without it being enabled in config ${JSON.stringify(config)}`);
  }

  const meshConfig = createBrowserMeshConfig(
    config.ethereum.http,
    web3Provider,
    Number(config.networkId),
    config.zeroX.mesh.verbosity || 5,
    config.zeroX.mesh.bootstrapList
  );

  const mesh = new Mesh(meshConfig);
  mesh.onError(createBrowserMeshRestartFunction(meshConfig, web3Provider, zeroX));
  await mesh.startAsync();
  zeroX.mesh = mesh;
}
