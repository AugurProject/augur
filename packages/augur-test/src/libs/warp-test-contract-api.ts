import { WSClient } from '@0x/mesh-rpc-client';
import { SDKConfiguration } from '@augurproject/artifacts';
import { EthersProvider } from '@augurproject/ethersjs-provider';
import {
  Augur,
  BrowserMesh,
  Connectors,
  EmptyConnector,
  SubscriptionEventName,
  ZeroX,
} from '@augurproject/sdk';
import { DB } from '@augurproject/sdk/build/state/db/DB';
import { WarpSyncStrategy } from '@augurproject/sdk/build/state/sync/WarpSyncStrategy';
import { WarpController } from '@augurproject/sdk/build/warp/WarpController';
import { TestContractAPI } from '@augurproject/tools';
import { Account } from '@augurproject/tools';
import { makeGSNDependencies, makeSigner } from '@augurproject/tools/build';
import { makeDbMock } from '@augurproject/tools/build/libs/MakeDbMock';
import * as IPFS from 'ipfs';

const filterRetrievelFn = (ipfs: Promise<IPFS>) => async (ipfsPath: string) =>
  (await ipfs)
  .cat(ipfsPath);

export class WarpTestContractApi extends TestContractAPI {
  warpController: WarpController;
  warpSyncStrategy: WarpSyncStrategy;

  constructor(
    readonly augur: Augur,
    readonly provider: EthersProvider,
    public account: Account,
    public db: DB,
    public config: SDKConfiguration,
    ipfsServer: Promise<IPFS>,
  ) {
    super(augur, provider, account, db, config);

    this.warpController = new WarpController(db, augur, provider, config.uploadBlockNumber, ipfsServer, filterRetrievelFn(ipfsServer));

    this.warpSyncStrategy = new WarpSyncStrategy(
      this.warpController,
      db.logFilters.onLogsAdded
    );
  }

  static async warpUserWrapper(
    account: Account,
    provider: EthersProvider,
    config: SDKConfiguration,
    ipfsServer: Promise<IPFS>,
    connector: Connectors.BaseConnector = new EmptyConnector(),
    meshClient: WSClient = undefined,
    meshBrowser: BrowserMesh = undefined,
  ) {
    const signer = await makeSigner(account, provider);
    const dependencies = await makeGSNDependencies(
      provider,
      signer,
      config.addresses.AugurWalletRegistry,
      config.addresses.EthExchange,
      config.addresses.WETH9,
      config.addresses.Cash,
      account.address,
    );

    let zeroX = null;
    if (meshClient || meshBrowser) {
      zeroX = new ZeroX();
      zeroX.rpc = meshClient;
    }
    const augur = await Augur.create(
      provider,
      dependencies,
      config,
      connector,
      zeroX,
      true,
    );
    if (zeroX && meshBrowser) {
      zeroX.mesh = meshBrowser;
    }

    const db = await makeDbMock().makeDB(augur);

    return new WarpTestContractApi(augur, provider, account, db, config, ipfsServer);
  }

  sync = async (highestBlockNumberToSync?: number) => {
    const { number: blockNumber } = await this.provider.getBlock(highestBlockNumberToSync || 'latest');
    if(this.needsToBulkSync) {
      const { warpSyncHash } = await this.getLastWarpSyncData();

      console.log('warpSyncHash', JSON.stringify(warpSyncHash));

      const highestSyncedBlock = await this.warpSyncStrategy.start(warpSyncHash);
      await this.bulkSyncStrategy.start(
        highestSyncedBlock || this.config.uploadBlockNumber,
        blockNumber
      );

      await this.db.sync(blockNumber);

      this.augur.events.emit(SubscriptionEventName.BulkSyncComplete, {
        eventName: SubscriptionEventName.BulkSyncComplete,
      });

      this.needsToBulkSync = false;
    } else {
      let highestSyncedBlock = (await this.db.getSyncStartingBlock());
      while(highestSyncedBlock <= blockNumber) {
        const block = await this.provider.getBlock(highestSyncedBlock);
        await this.blockAndLogStreamerSyncStrategy.onBlockAdded({
          ...block,
          number: block.number.toString(),
        });
        highestSyncedBlock++;
        await this.warpController.onNewBlock(block);
      }
    }
  };
}
