import { WSClient } from '@0x/mesh-rpc-client';
import { SDKConfiguration } from '@augurproject/artifacts';
import { ContractInterfaces } from '@augurproject/core';
import { EthersProvider } from '@augurproject/ethersjs-provider';
import {
  Augur,
  BrowserMesh,
  Connectors,
  EmptyConnector,
  ZeroX,
} from '@augurproject/sdk';
import { SubscriptionEventName } from '@augurproject/sdk/build';
import { DB } from '@augurproject/sdk/build/state/db/DB';
import { BlockAndLogStreamerSyncStrategy } from '@augurproject/sdk/build/state/sync/BlockAndLogStreamerSyncStrategy';
import { BulkSyncStrategy } from '@augurproject/sdk/build/state/sync/BulkSyncStrategy';
import { BigNumber } from 'bignumber.js';
import { Account } from '../constants';
import { makeGSNDependencies, makeSigner } from './blockchain';
import { ContractAPI } from './contract-api';
import { makeDbMock } from './MakeDbMock';
import { API } from '@augurproject/sdk/build/state/getter/API';
import { ContractDependenciesGSN } from 'contract-dependencies-gsn';

export class TestContractAPI extends ContractAPI {
  protected bulkSyncStrategy: BulkSyncStrategy;
  api: API;
  blockAndLogStreamerSyncStrategy: BlockAndLogStreamerSyncStrategy;
  needsToBulkSync = true;

  static async userWrapper(
    account: Account,
    provider: EthersProvider,
    config: SDKConfiguration,
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
      account.publicKey,
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

    return new TestContractAPI(augur, provider, dependencies, account, db, config);
  }

  constructor(
    readonly augur: Augur,
    readonly provider: EthersProvider,
    readonly dependencies: ContractDependenciesGSN,
    public account: Account,
    public db: DB,
    public config: SDKConfiguration,
  ) {
    super(augur, provider, dependencies, account);

    this.api = new API(augur, Promise.resolve(db));

    const contractAddresses = augur.contractEvents.getAugurContractAddresses();

    this.bulkSyncStrategy = new BulkSyncStrategy(
      provider.getLogs,
      contractAddresses,
      db.logFilters.onLogsAdded,
      augur.contractEvents.parseLogs,
    );

    this.blockAndLogStreamerSyncStrategy = BlockAndLogStreamerSyncStrategy.create(provider, contractAddresses, db.logFilters, augur.contractEvents.parseLogs)
  }

  sync = async (highestBlockNumberToSync?: number) => {
    const { number: blockNumber } = await this.provider.getBlock(highestBlockNumberToSync || 'latest');
    if(this.needsToBulkSync) {
      const syncStartingBlock = await this.db.getSyncStartingBlock();
      await this.bulkSyncStrategy.start(
        syncStartingBlock,
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
      }
    }
  };

  async reportAndFinalizeWarpSyncMarket(hash:string) {
    const warpSyncMarket = await this.reportWarpSyncMarket(hash);
    return this.finalizeWarpSyncMarket(warpSyncMarket);
  }

  async finalizeWarpSyncMarket(warpSyncMarket: ContractInterfaces.Market) {
    const timestamp = (await this.getTimestamp()).plus(1000000);;
    await this.setTimestamp(timestamp);

    await this.finalizeMarket(warpSyncMarket);

    return warpSyncMarket;
  }

  async reportWarpSyncMarket(hash?:string) {
    if(!hash) {
      const mostRecentWarpSync = await this.db.warpSync.getMostRecentWarpSync();
      hash = mostRecentWarpSync.hash;
    }

    const payoutNumerators = await this.getPayoutFromWarpSyncHash(hash);
    const warpSyncMarket = await this.getWarpSyncMarket();

    const timestamp = (await this.getTimestamp()).plus(1000000);
    await this.setTimestamp(timestamp);
    await this.doInitialReport(warpSyncMarket, payoutNumerators);

    return warpSyncMarket;
  }

  async initializeUniverse() {
    return this.augur.warpSync.initializeUniverse(this.augur.contracts.universe.address);
  }
}
