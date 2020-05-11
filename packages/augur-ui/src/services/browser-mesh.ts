import {
  Config,
  ContractAddresses as ZeroXContractAddresses,
  loadMeshStreamingWithURLAsync,
  Mesh,
} from '@0x/mesh-browser-lite';
import { OrderEvent } from '@0x/mesh-rpc-client';
import {
  ContractAddresses,
  NetworkId,
  SDKConfiguration,
} from '@augurproject/artifacts';
import { SubscriptionEventName, ZeroX } from '@augurproject/sdk';
import * as Comlink from 'comlink';
import { SupportedProvider } from 'ethereum-types';
import './MeshTransferHandler';

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
    zeroX.client.events.emit(SubscriptionEventName.ZeroXStatusError, {error: err});

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
      zeroX.mesh = mesh;
    })
  };
}

export async function createBrowserMeshWorker(
  config: SDKConfiguration,
  web3Provider: SupportedProvider,
  zeroX: ZeroX
) {
  if (!config.zeroX?.mesh?.enabled) {
    throw new Error(`Attempting to create browser mesh without it being enabled in config ${JSON.stringify(config)}`);
  }

  try {
    const meshConfig = createBrowserMeshConfig(
      config.ethereum.http,
      undefined,
      Number(config.networkId),
      config.addresses,
      config.zeroX.mesh.verbosity || 5,
      config.zeroX.mesh.useBootstrapList,
      config.zeroX.mesh.bootstrapList,
    );

    const meshWorker = new Worker('./MeshWorker', {type:'module'} );

    const {Mesh: MeshWorker, loadMesh} = Comlink.wrap(meshWorker);
    await loadMesh();
    const mesh = await new MeshWorker(meshConfig);

    await mesh.startAsync();
    await mesh.onOrderEvents(Comlink.proxy((orderEvents: OrderEvent[]) => {
      if (zeroX.client.client && orderEvents.length > 0) {
        zeroX.client.client.events.emit('ZeroX:Mesh:OrderEvent', orderEvents);
      }
    }));

    zeroX.mesh = mesh;
    zeroX.client.events.emit(SubscriptionEventName.ZeroXStatusReady, {});
  } catch(error) {
    zeroX.client.events.emit(SubscriptionEventName.ZeroXStatusError, {error});

    throw error;
  }
}

export async function createBrowserMesh(
  config: SDKConfiguration,
  web3Provider: SupportedProvider,
  zeroX: ZeroX
) {
  if (!config.zeroX?.mesh?.enabled) {
    throw new Error(`Attempting to create browser mesh without it being enabled in config ${JSON.stringify(config)}`);
  }

  try {
    const zeroXTimerLabel = 'ZeroX Wasm load duration: ';
    const newMeshTimerLabel = 'new Mesh() startup duration: ';

    zeroX.client.events.emit(SubscriptionEventName.ZeroXStatusStarting, {});
    console.time(zeroXTimerLabel);
    await loadMeshStreamingWithURLAsync('zerox.wasm');

    const meshConfig = createBrowserMeshConfig(
      config.ethereum.http,
      web3Provider,
      Number(config.networkId),
      config.addresses,
      config.zeroX.mesh.verbosity || 5,
      config.zeroX.mesh.useBootstrapList,
      config.zeroX.mesh.bootstrapList,
    );

    console.time(newMeshTimerLabel);
    const mesh = new Mesh(meshConfig);

    const cb = () => {
      console.timeEnd(zeroXTimerLabel);
      console.timeEnd(newMeshTimerLabel);

      // Only want to get this once and `once` doesn't seem to be working.
      zeroX.client.events.off(SubscriptionEventName.ZeroXStatusSynced, cb);
    }

    zeroX.client.events.on(SubscriptionEventName.ZeroXStatusSynced, cb);

    mesh.onError(createBrowserMeshRestartFunction(meshConfig, web3Provider, zeroX, config));
    await mesh.startAsync();
    await mesh.onOrderEvents((orderEvents: OrderEvent[]) => {
      if (zeroX.client.client && orderEvents.length > 0) {
        zeroX.client.client.events.emit('ZeroX:Mesh:OrderEvent', orderEvents);
      }
    });

    zeroX.client.events.emit(SubscriptionEventName.ZeroXStatusReady, {});
    zeroX.mesh = mesh;
  } catch(error) {
    zeroX.client.events.emit(SubscriptionEventName.ZeroXStatusError, {error});
    throw error;
  }
}
