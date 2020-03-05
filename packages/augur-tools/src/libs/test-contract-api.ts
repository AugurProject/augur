import { WSClient } from '@0x/mesh-rpc-client';
import { SDKConfiguration } from '@augurproject/artifacts';
import { EthersProvider } from '@augurproject/ethersjs-provider';
import { IGnosisRelayAPI } from '@augurproject/gnosis-relay-api';
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
import { ContractDependenciesGnosis } from 'contract-dependencies-gnosis/build';
import { Account } from '../constants';
import { makeGnosisDependencies, makeSigner } from './blockchain';
import { ContractAPI } from './contract-api';
import { makeDbMock } from './MakeDbMock';
import { API } from '@augurproject/sdk/build/state/getter/API';

const biggestNumber = new BigNumber(2).pow(256).minus(2);

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
    gnosisRelay: IGnosisRelayAPI = undefined,
    meshClient: WSClient = undefined,
    meshBrowser: BrowserMesh = undefined,
  ) {
    const signer = await makeSigner(account, provider);
    const dependencies = makeGnosisDependencies(
      provider,
      gnosisRelay,
      signer,
      config.addresses.Cash,
      new BigNumber(0),
      null,
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

    return new TestContractAPI(augur, provider, dependencies, account, db);
  }

  constructor(
    readonly augur: Augur,
    readonly provider: EthersProvider,
    readonly dependencies: ContractDependenciesGnosis,
    public account: Account,
    public db: DB,
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
      console.log('highestSyncedBlock', blockNumber);
      await this.bulkSyncStrategy.start(
        0,
        blockNumber
      );

      await this.db.sync(0);

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

  async reportWarpSyncMarket(hash:string) {
    const payoutNumerators = await this.getPayoutFromWarpSyncHash(hash);
    const warpSyncMarket = await this.getWarpSyncMarket();

    const reportedValue = new BigNumber(465);
    let timestamp = await this.getTimestamp();
    timestamp = timestamp.plus(1000000);
    await this.setTimestamp(timestamp);
    await this.doInitialReport(warpSyncMarket, payoutNumerators);

    timestamp = timestamp.plus(1000000);
    await this.setTimestamp(timestamp);
    await this.finalizeMarket(warpSyncMarket);

    return warpSyncMarket;
  }
}
