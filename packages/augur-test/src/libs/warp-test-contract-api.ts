import { SubscriptionEventName } from '@augurproject/sdk-lite';
import { SDKConfiguration } from '@augurproject/utils';
import { EthersProvider } from '@augurproject/ethersjs-provider';
import {
  Augur,
  Connectors,
  createClient,
  EmptyConnector,
} from '@augurproject/sdk';
import { DB } from '@augurproject/sdk/build/state/db/DB';
import { WarpSyncStrategy } from '@augurproject/sdk/build/state/sync/WarpSyncStrategy';
import { WarpController } from '@augurproject/sdk/build/warp/WarpController';
import { Account, makeSigner, TestContractAPI } from '@augurproject/tools';
import { makeDbMock } from '@augurproject/tools/build/libs/MakeDbMock';
import { IPFSHashVersion } from '@augurproject/utils';
import * as IPFS from 'ipfs';

export class WarpTestContractApi extends TestContractAPI {
  warpController: WarpController;
  warpSyncStrategy: WarpSyncStrategy;

  constructor(
    readonly augur: Augur,
    readonly provider: EthersProvider,
    public account: Account,
    public db: DB,
    public config: SDKConfiguration,
    ipfsServer: Promise<IPFS>
  ) {
    super(augur, provider, account, db, config);

    this.warpController = new WarpController(
      db,
      augur,
      provider,
      config.uploadBlockNumber,
      {
        version: IPFSHashVersion.IPFS,
        url: null
      },
      ipfsServer
    );

    this.warpSyncStrategy = new WarpSyncStrategy(
      this.warpController,
      db.logFilters.onLogsAdded,
      db,
      provider
    );
  }

  static async warpUserWrapper(
    account: Account,
    provider: EthersProvider,
    config: SDKConfiguration,
    ipfsServer: Promise<IPFS>,
    connector: Connectors.BaseConnector = new EmptyConnector()
  ) {
    const signer = await makeSigner(account, provider);
    const client = await createClient(
      config,
      connector,
      signer,
      provider,
      true
    );

    const db = await makeDbMock().makeDB(client);

    return new WarpTestContractApi(
      client,
      provider,
      account,
      db,
      config,
      ipfsServer
    );
  }

  sync = async (highestBlockNumberToSync?: number) => {
    const { number: blockNumber } = await this.provider.getBlock(
      highestBlockNumberToSync || 'latest'
    );
    if (this.needsToBulkSync) {
      const { warpSyncHash } = await this.getLastWarpSyncData();

      console.log('warpSyncHash', JSON.stringify(warpSyncHash));

      const currentBlock = await this.provider.getBlock('latest');
      const highestSyncedBlock = await this.warpSyncStrategy.start(
        currentBlock,
        warpSyncHash
      );
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
      let highestSyncedBlock = await this.db.getSyncStartingBlock();
      while (highestSyncedBlock <= blockNumber) {
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
