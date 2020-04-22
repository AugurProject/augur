import { Config, ContractAddresses as ZeroXContractAddresses, Mesh, loadMeshStreamingWithURLAsync } from '@0x/mesh-browser-lite';
import { NetworkId, SDKConfiguration, ContractAddresses } from '@augurproject/artifacts';
import { ZeroX, SubscriptionEventName } from '@augurproject/sdk';

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
  contractAddresses: ContractAddresses,
  verbosity = 5,
  useBootstrapList: boolean,
  bootstrapList: string[],
  forceIgnoreCustomAddresses = false,
) {
  const meshConfig: Config = {
    ethereumChainID,
    verbosity,
    useBootstrapList,
    bootstrapList,
  };

  if (web3Provider) {
    meshConfig.web3Provider = web3Provider;
  } else if (ethereumRPCURL) {
    meshConfig.ethereumRPCURL = ethereumRPCURL;
  } else {
    throw new Error('No Web3 provider or RPC URL provided to Browser Mesh');
  }

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
  };

  return meshConfig;
}

function createBrowserMeshRestartFunction(
  meshConfig: Config,
  web3Provider: SupportedProvider,
  zeroX: ZeroX,
  sdkConfig: SDKConfiguration
) {
  return err => {
    console.error('Browser mesh error: ', err.message, err.stack);
    console.log('Restarting Mesh Sync');
    zeroX.client.events.emit(SubscriptionEventName.ZeroXStatusRestarting, {error: err});

    // Passing `true` as the last parameter to make sure the config doesn't include custom addresses on retry
    const mesh = new Mesh(
      createBrowserMeshConfig(
        meshConfig.ethereumRPCURL,
        web3Provider,
        meshConfig.ethereumChainID,
        sdkConfig.addresses,
        meshConfig.verbosity,
        meshConfig.useBootstrapList,
        meshConfig.bootstrapList,
        true
      )
    );
    mesh.onError(createBrowserMeshRestartFunction(meshConfig, web3Provider, zeroX, sdkConfig));
    mesh.startAsync().then(() => {
      zeroX.client.events.emit(SubscriptionEventName.ZeroXStatusRestarted);
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

  // NB: Polyfill to support Safari, this can go away with the next browser-mesh release
  if (!WebAssembly.instantiateStreaming) {
    WebAssembly.instantiateStreaming = async (resp, importObject) => {
      const source = await (await resp).arrayBuffer();
      return await WebAssembly.instantiate(source, importObject);
    };
  }
  // NB: Remove this when we move to the version of 0x after 9.2.1

  await loadMeshStreamingWithURLAsync("zerox.wasm");

  const meshConfig = createBrowserMeshConfig(
    config.ethereum.http,
    web3Provider,
    Number(config.networkId),
    config.addresses,
    config.zeroX.mesh.verbosity || 5,
    config.zeroX.mesh.useBootstrapList,
    config.zeroX.mesh.bootstrapList,
  );

  console.log('new Mesh(meshConfig); Starting Mesh');
  zeroX.client.events.emit(SubscriptionEventName.ZeroXStatusStarting);
  const mesh = new Mesh(meshConfig);
  mesh.onError(createBrowserMeshRestartFunction(meshConfig, web3Provider, zeroX, config));
  await mesh.startAsync();
  zeroX.client.events.emit(SubscriptionEventName.ZeroXStatusStarted);
  zeroX.mesh = mesh;
}
