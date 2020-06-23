import { EthersProvider } from '@augurproject/ethersjs-provider';
import { Augur, Connectors, createClient, ZeroX } from '@augurproject/sdk';
import { SubscriptionEventName } from '@augurproject/sdk-lite';
import { Controller } from '@augurproject/sdk/build/state/Controller';
import { DB } from '@augurproject/sdk/build/state/db/DB';
import { API } from '@augurproject/sdk/build/state/getter/API';
import { BlockAndLogStreamerSyncStrategy } from '@augurproject/sdk/build/state/sync/BlockAndLogStreamerSyncStrategy';
import { BulkSyncStrategy } from '@augurproject/sdk/build/state/sync/BulkSyncStrategy';
import { SDKConfiguration } from '@augurproject/utils';
import { SupportedProvider } from 'ethereum-types';
import { Account } from '../constants';
import { makeSigner } from './blockchain';
import { ContractAPI } from './contract-api';
import { makeDbMock } from './MakeDbMock';

export class TestContractAPI extends ContractAPI {
  protected bulkSyncStrategy: BulkSyncStrategy;
  api: API;
  blockAndLogStreamerSyncStrategy: BlockAndLogStreamerSyncStrategy;
  needsToBulkSync = true;

  static async userWrapper(
    account: Account,
    provider: EthersProvider,
    config: SDKConfiguration,
    connector: Connectors.DirectConnector = new Connectors.DirectConnector(),
    dbPrefix: string = undefined,
    createBrowserMesh?: (
      config: SDKConfiguration,
      web3Provider: SupportedProvider,
      zeroX: ZeroX
    ) => void
  ) {
    const signer = await makeSigner(account, provider);
    const client = await createClient(
      config,
      connector,
      signer,
      provider,
      true,
      createBrowserMesh
    );

    const db = await makeDbMock(dbPrefix).makeDB(client);

    connector.initialize(client, db);

    return new TestContractAPI(client, provider, account, db, config);
  }

  constructor(
    readonly augur: Augur,
    readonly provider: EthersProvider,
    public account: Account,
    public db: DB,
    public config: SDKConfiguration
  ) {
    super(augur, provider, account);

    this.api = new API(augur, Promise.resolve(db));

    const contractAddresses = augur.contractEvents.getAugurContractAddresses();

    new Controller(augur, Promise.resolve(db), db.logFilters);

    this.bulkSyncStrategy = new BulkSyncStrategy(
      provider.getLogs,
      contractAddresses,
      db.logFilters.onLogsAdded,
      augur.contractEvents.parseLogs
    );

    this.blockAndLogStreamerSyncStrategy = BlockAndLogStreamerSyncStrategy.create(
      provider,
      contractAddresses,
      db.logFilters,
      augur.contractEvents.parseLogs
    );
  }

  sync = async (highestBlockNumberToSync?: number) => {
    const { number: blockNumber } = await this.provider.getBlock(
      highestBlockNumberToSync || 'latest'
    );
    if (this.needsToBulkSync) {
      const syncStartingBlock = await this.db.getSyncStartingBlock();
      await this.bulkSyncStrategy.start(syncStartingBlock, blockNumber);

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
      }
    }
  };

  async reportWarpSyncMarket(hash?: string) {
    if (!hash) {
      const mostRecentWarpSync = await this.db.warpCheckpoints.getMostRecentWarpSync();
      hash = mostRecentWarpSync.hash;
    }
    return super.reportWarpSyncMarket(hash);
  }

  async initializeUniverse() {
    return this.augur.warpSync.initializeUniverse(
      this.augur.contracts.universe.address
    );
  }
}
