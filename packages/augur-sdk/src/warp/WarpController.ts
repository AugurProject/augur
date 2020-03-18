import Dexie from 'dexie';
import { Block } from 'ethers/providers';
import * as IPFS from 'ipfs';
import * as Unixfs from 'ipfs-unixfs';
import { DAGNode } from 'ipld-dag-pb';
import _ from 'lodash';
import { Provider, Augur, NULL_ADDRESS, MarketReportingState } from '..';

import { DB } from '../state/db/DB';
import { IpfsInfo } from '../state/db/WarpSyncCheckpointsDB';
import { Markets } from '../state/getter/Markets';
import { Address, Log } from '../state/logs/types';
import { Log as SerializedLog } from '@augurproject/types';
import { Checkpoints } from './Checkpoints';
import { SubscriptionEventName } from '../constants';

export const WARPSYNC_VERSION = '1';

type NameOfType<T, R> = {
  [P in keyof T]: T[P] extends R ? P : never;
}[keyof T];

type AllDBNames = NameOfType<DB, Dexie.Table<Log, unknown>>;
type AllDbs = {
  [P in AllDBNames]: DB[P] extends Dexie.Table<infer R, unknown> ? R : never;
};

// Assuming indexes we need are simple ones e.g. 'market'.
// Will need to rethink this for something like '[universe+reporter]'.
type DbExpander<P, G extends keyof AllDbs> = P extends keyof AllDbs
  ? {
      databaseName: P;
      indexes?: Readonly<Array<keyof AllDbs[P]>>;
      join?: G extends keyof AllDbs
        ? Readonly<{
            // Indexes to query source db on.
            indexes: Readonly<Array<keyof AllDbs[G]>>;
            // The common index between the two DBs.
            // length 2 or more is treated
            on: Readonly<Array<keyof AllDbs[P] & keyof AllDbs[G]>>;
            // This is the source of the criteria to filter the `dataBaseName` db with.
            source: G;
          }>
        : never;
    }
  : never;
type Db = DbExpander<keyof AllDbs, keyof AllDbs>;
export type RollupDescription = Readonly<Db[]>;

interface IPFSObject {
  Hash: string;
  Name?: string;
  Size: number;
}

export const databasesToSync: RollupDescription = [
  { databaseName: 'CompleteSetsPurchased' },
  { databaseName: 'CompleteSetsSold' },
  { databaseName: 'DisputeCrowdsourcerContribution' },
  { databaseName: 'DisputeCrowdsourcerCompleted' },
  { databaseName: 'DisputeCrowdsourcerCreated' },
  { databaseName: 'DisputeCrowdsourcerRedeemed' },
  { databaseName: 'DisputeWindowCreated' },
  { databaseName: 'InitialReporterRedeemed' },
  { databaseName: 'InitialReportSubmitted' },
  { databaseName: 'InitialReporterTransferred' },
  { databaseName: 'MarketCreated' },
  { databaseName: 'MarketFinalized' },
  { databaseName: 'MarketMigrated' },
  { databaseName: 'MarketParticipantsDisavowed' },
  { databaseName: 'MarketTransferred' },
  { databaseName: 'MarketVolumeChanged' },
  { databaseName: 'MarketOIChanged' },
  { databaseName: 'OrderEvent' },
  { databaseName: 'ParticipationTokensRedeemed' },
  { databaseName: 'ProfitLossChanged' },
  { databaseName: 'ReportingParticipantDisavowed' },
  { databaseName: 'TimestampSet' },
  { databaseName: 'TokenBalanceChanged' },
  { databaseName: 'TokensMinted' },
  { databaseName: 'TokensTransferred' },
  { databaseName: 'TradingProceedsClaimed' },
  { databaseName: 'UniverseCreated' },
  { databaseName: 'UniverseForked' },
  { databaseName: 'TransferSingle' },
  { databaseName: 'TransferBatch' },
  { databaseName: 'ShareTokenBalanceChanged' },
];

export interface CheckpointInterface {
  startBlockNumber: number;
  endBlockNumber: number;
  logs: SerializedLog[];
}

export class WarpController {
  private checkpointCreationInProgress = false;
  private static DEFAULT_NODE_TYPE = { format: 'dag-pb', hashAlg: 'sha2-256' };
  checkpoints: Checkpoints;
  private ipfs: Promise<IPFS>;

  constructor(
    private db: DB,
    private augur: Augur<Provider>,
    private provider: Provider,
    private uploadBlockNumber: number,
    ipfs?: Promise<IPFS>,
    // This is to simplify swapping out file retrieval mechanism.
    private _fileRetrievalFn: (ipfsPath: string) => Promise<any> = (
      ipfsPath: string
    ) =>
      fetch(`https://cloudflare-ipfs.com/ipfs/${ipfsPath}`).then(item =>
        item.json()
      )
  ) {
    this.checkpoints = new Checkpoints(provider);
    if (ipfs) {
      this.ipfs = ipfs;
    } else {
      this.ipfs = IPFS.create({
        repo: './data',
      });
    }
  }

  async getIpfs(): Promise<IPFS> {
    return this.ipfs;
  }

  onNewBlock = async (newBlock: Block): Promise<string | void> => {
    await this.createInitialCheckpoint();
    /*
      0. Base case: need to have created initial warp checkpoint.
      1. Check if we need to create warp sync
        1. This will happen if the active market endTime has elapsed
      2. Check if we have a market finalization
        1. If so, do we dispute?
        2. If no dispute we make note of new market end time
    */

    const mostRecentCheckpoint = await this.db.warpCheckpoints.getMostRecentCheckpoint();

    // Universe not initialized.
    if (
      !mostRecentCheckpoint
    ) {
      return;
    }

    // Warp sync has been created. Need to report, dispute or create next unfinished checkpoint record.
    if(mostRecentCheckpoint.end) {
      const [marketRecord] = await Markets.getMarketsInfo(this.augur, this.db, {
        marketIds: [
          mostRecentCheckpoint.market
        ]
      });




      switch (marketRecord.reportingState) {
        case(MarketReportingState.OpenReporting):
        // Emit event to notify UI to report.

        break;
        case(MarketReportingState.Finalized):
          const [begin, end] = await this.checkpoints.calculateBoundary(mostRecentCheckpoint.endTimestamp, mostRecentCheckpoint.end);

          await this.db.warpCheckpoints.createInitialCheckpoint(
            end,
            await this.augur.warpSync.getWarpSyncMarket(this.augur.contracts.universe.address)
          );

          break;
        default:
      }

      return;
    }

    // WarpSync Market has ended. Need to create checkpoint.
    if(mostRecentCheckpoint.endTimestamp < newBlock.timestamp) {
      /*
      * To create the checkpoint properly we need to discover the boundary blocks around the end time.
      **/
      const hash = await this.createAllCheckpoints(newBlock);

      this.augur.events.emit(SubscriptionEventName.WarpSyncHashUpdated, { hash});

      return hash;
    }

    // nothing left to do.
  };

  async createInitialCheckpoint() {
    const mostRecentCheckpoint = await this.db.warpCheckpoints.getMostRecentCheckpoint();
    if (!mostRecentCheckpoint) {
      const market = await this.augur.warpSync.getWarpSyncMarket(this.augur.contracts.universe.address);

      if(market.address === NULL_ADDRESS) {
        console.log(`Warp sync market not initialized for current universe ${this.augur.contracts.universe.address}.`);
        return
      }

      await this.db.warpCheckpoints.createInitialCheckpoint(
        await this.provider.getBlock(this.uploadBlockNumber),
        market
      );
    }
  }

  async createAllCheckpoints(highestBlock: Block) {
    // Skip this warpSyncFile run. Will get em' next time.
    if (this.checkpointCreationInProgress) return;
    this.checkpointCreationInProgress = true;
    await this.createInitialCheckpoint();
    await this.createCheckpoints(highestBlock);
    this.checkpointCreationInProgress = false;

    // For reproducibility we need hash consistent block number ranges for each warp sync.
    const [
      beginBlock,
      endBlock,
    ] = await this.db.warpCheckpoints.getCheckpointBlockRange();

    const topLevelDirectory = new DAGNode(
      Unixfs.default('directory').marshal()
    );
    const versionFile = await (await this.ipfs).add({
      content: Buffer.from(WARPSYNC_VERSION),
    });
    topLevelDirectory.addLink({
      Name: 'VERSION',
      Hash: versionFile[0].hash,
      Size: 1,
    });

    topLevelDirectory.addLink(
      await this.buildDirectory(
        'checkpoints',
        await this.db.warpCheckpoints.getAllIPFSObjects()
      )
    );

    const d = await (await this.ipfs).dag.put(
      topLevelDirectory,
      WarpController.DEFAULT_NODE_TYPE
    );

    console.log('checkpoint', d.toString());

    // Add checkpoint to db.
    await this.db.warpSync.createCheckpoint(beginBlock, endBlock, d.toString());

    return d.toString();
  }

  private async buildDirectory(name: string, items: IPFSObject[] = []) {
    const file = Unixfs.default('file');
    const directory = Unixfs.default('directory');
    for (let i = 0; i < items.length; i++) {
      directory.addBlockSize(items[i].Size);
    }

    directory.addBlockSize(file.fileSize());
    const directoryNode = new DAGNode(directory.marshal());

    for (let i = 0; i < items.length; i++) {
      await directoryNode.addLink(items[i]);
    }

    const q = await (await this.ipfs).dag.put(
      directoryNode,
      WarpController.DEFAULT_NODE_TYPE
    );

    return {
      Name: name,
      Hash: q.toString(),
      Size: 0,
    };
  }

  private async ipfsAddRows(rows: any[]): Promise<IPFSObject[]> {
    if (_.isEmpty(rows)) {
      return [];
    }

    const requests = rows.map((row, i) => ({
      content: Buffer.from(JSON.stringify(row) + '\n'),
    }));

    const data = await (await this.ipfs).add(requests);
    return data.map(item => ({
      Hash: item.hash,
      Size: item.size,
    }));
  }

  async createCheckpoint(startBlockNumber: number, endBlockNumber: number): Promise<IpfsInfo> {
    const logs = [];
    for (const { databaseName } of databasesToSync) {
      // Awaiting here to reduce load on db.
      logs.push(
        await this.db[databaseName]
          .where('blockNumber')
          .between(startBlockNumber, endBlockNumber, true, true)
          .toArray()
      );
    }

    const sortedLogs = _.orderBy(
      _.flatten(logs),
      ['blockNumber', 'logIndex'],
      ['asc', 'asc']
    );

    const [result] = await (await this.ipfs).add({
      content: Buffer.from(
        JSON.stringify(<CheckpointInterface>{
          startBlockNumber,
          endBlockNumber,
          logs: sortedLogs,
        })
      ),
    });

    return {
      Name: `${startBlockNumber}`,
      Hash: result.hash,
      Size: 0,
    };
  }

  async updateCheckpointDbByNumber(begin:number, checkPointIPFSObject: IpfsInfo) {
    return this.db.warpCheckpoints.createCheckpoint(
      await this.provider.getBlock(begin),
      checkPointIPFSObject
    );
  };

  async createCheckpoints(end: Block) {
    const mostRecentCheckpoint = await this.db.warpCheckpoints.getMostRecentCheckpoint();

    // Ain't quite time yet.
    if (end.timestamp < mostRecentCheckpoint.endTimestamp) return;

    const [
      newBeginBlock,
      newEndBlock,
    ] = await this.checkpoints.calculateBoundary(
      mostRecentCheckpoint.endTimestamp,
      mostRecentCheckpoint.begin,
      end
    );

    // This is where we actually create the checkpoint.
    const checkPointIPFSObject = await this.createCheckpoint(
      mostRecentCheckpoint.begin.number,
      newBeginBlock.number
    );
    await this.db.warpCheckpoints.createCheckpoint(
      newBeginBlock,
      checkPointIPFSObject
    );

    // We need to be sure we have a checkpoint record for each warp sync market regardless of market status.
    const allWarpSyncMarkets = await this.db.marketDatabase.getAllWarpSyncMarkets();
    const nextMarketToCheckpoint = allWarpSyncMarkets.find(
      (market) => market.endTime < mostRecentCheckpoint.endTimestamp);

    if (!nextMarketToCheckpoint) return;

    await this.db.warpCheckpoints.createInitialCheckpoint(
      newEndBlock,
      await this.augur.getMarket(nextMarketToCheckpoint.market)
    );

    return this.createCheckpoints(end);
  }

  queryDB = <P extends AllDBNames>(
    dbName: P,
    properties: Readonly<string[]> = [],
    criteria: Address,
    startBlockNumber = 0,
    endBlockNumber?: number
  ): Dexie.Promise<Array<AllDbs[P]>> => {
    // I really hate that I have to do this.
    // @ts-ignore
    return this.db[dbName]
      .where('blockNumber')
      .between(startBlockNumber, endBlockNumber, true, true)
      .and(item => properties.some(property => item[property] === criteria))
      .toArray();
  };

  getFile(ipfsPath: string) {
    return this._fileRetrievalFn(ipfsPath);
  }

  async getAvailableCheckpointsByHash(
    ipfsRootHash: string
  ): Promise<IpfsInfo[]> {
    const files = await (await this.ipfs).ls(`${ipfsRootHash}/checkpoints/`);
    return files.map(({ name, hash }) => ({
      Name: name,
      Hash: hash,
      Size: 0,
    }));
  }

  async getCheckpointFile(
    ipfsRootHash: string,
    checkpointBlockNumber: string | number
  ): Promise<CheckpointInterface> {
    return this.getFile(`${ipfsRootHash}/checkpoints/${checkpointBlockNumber}`);
  }

  async pinHashByGatewayUrl(urlString: string) {
    const url = new URL(urlString);
    try {
      await (await this.ipfs).pin.add(url.pathname);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  async getMostRecentWarpSync() {
    return this.db.warpSync.getMostRecentWarpSync();
  }

  async getMostRecentCheckpoint() {
    return this.db.warpCheckpoints.getMostRecentCheckpoint();
  }

  async hasMostRecentCheckpoint() {
    return (await this.getMostRecentCheckpoint()) !== undefined;
  }
}
