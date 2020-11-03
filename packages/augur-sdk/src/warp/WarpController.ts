import * as CIDTool from 'cid-tool';
import {
  Log,
  MarketReportingState,
  NULL_ADDRESS,
  SubscriptionEventName,
} from '@augurproject/sdk-lite';
import { Log as SerializedLog } from '@augurproject/types';
import { IPFSEndpointInfo, IPFSHashVersion, logger } from '@augurproject/utils';
import Dexie from 'dexie';
import { Block } from 'ethers/providers';
import { BigNumber } from 'ethers/utils';
import * as IPFS from 'ipfs';
import * as Unixfs from 'ipfs-unixfs';
import { DAGNode } from 'ipld-dag-pb';
import _ from 'lodash';
import LZString from 'lz-string';
import fetch from 'cross-fetch';
import { Augur, Provider } from '..';

import { DB } from '../state/db/DB';
import { IpfsInfo } from '../state/db/WarpSyncCheckpointsDB';
import { Markets } from '../state/getter/Markets';
import { Checkpoints } from './Checkpoints';

export const WARPSYNC_VERSION = '1';
const FILE_FETCH_TIMEOUT = 30000; // 10 seconds

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
  private static DEFAULT_NODE_TYPE = { format: 'dag-pb', hashAlg: 'sha2-256' };
  checkpoints: Checkpoints;
  ipfs: Promise<IPFS>;

  constructor(
    private db: DB,
    private augur: Augur<Provider>,
    private provider: Provider,
    private uploadBlockNumber: number,
    private ipfsEndpointInfo:IPFSEndpointInfo,
    ipfs?: Promise<IPFS>,
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
      2. Check if we have a market awaiting finalization
        1. If so, do we dispute?
      3. If market is finalized
        1. If no dispute we make note of new market end time
    */

    const mostRecentCheckpoint = await this.db.warpCheckpoints.getMostRecentCheckpoint();

    // Universe not initialized.
    if (!mostRecentCheckpoint) {
      return;
    }

    // Warp sync has been created. Need to report, dispute or create next unfinished checkpoint record.
    if (mostRecentCheckpoint.end) {
      const [marketRecord] = await Markets.getMarketsInfo(this.augur, this.db, {
        marketIds: [mostRecentCheckpoint.market],
      });

      switch (marketRecord.reportingState) {
        case MarketReportingState.OpenReporting:
          // Emit event to notify UI to report.

          break;

        case MarketReportingState.AwaitingFinalization:
          // confirm hash matches and emit dispute event if needed.

          break;

        case MarketReportingState.Finalized:
          const endBlock = Object.assign({}, mostRecentCheckpoint.end, {
            gasLimit: new BigNumber(mostRecentCheckpoint.end.gasLimit),
            gasUsed: new BigNumber(mostRecentCheckpoint.end.gasUsed),
          })
          const [begin, end] = await this.checkpoints.calculateBoundary(
            mostRecentCheckpoint.endTimestamp,
            endBlock
          );

          const newWarpSyncMarket = await this.augur.warpSync.getWarpSyncMarket(
            this.augur.contracts.universe.address
          );

          await this.db.warpCheckpoints.createInitialCheckpoint(
            end,
            newWarpSyncMarket
          );

          break;
        default:
      }

      return;
    }

    // WarpSync Market has ended. Need to create checkpoint.
    if (mostRecentCheckpoint.endTimestamp < newBlock.timestamp) {
      const [
        newEndBlock,
        newBeginBlock,
      ] = await this.checkpoints.calculateBoundary(
        mostRecentCheckpoint.endTimestamp,
        await this.provider.getBlock(this.uploadBlockNumber),
        newBlock
      );

      // Market has finished and now we need to wait 30 blocks.
      if (newBlock.number - newEndBlock.number < 30) return;

      await this.db.prune(newEndBlock.timestamp);

      // This version of the client will no longer generate a
      // warp sync because it does not know about the para deploy logs.
    }

    // nothing left to do.
  };

  async createInitialCheckpoint() {
    const mostRecentCheckpoint = await this.db.warpCheckpoints.getMostRecentCheckpoint();
    if (!mostRecentCheckpoint) {
      const market = await this.augur.warpSync.getWarpSyncMarket(
        this.augur.contracts.universe.address
      );

      if (market.address === NULL_ADDRESS) {
        console.log(
          `Warp sync market not initialized for current universe ${this.augur.contracts.universe.address}.`
        );
        return;
      }

      await this.db.warpCheckpoints.createInitialCheckpoint(
        await this.provider.getBlock(this.uploadBlockNumber),
        market
      );
    }
  }

  async destroyAndRecreateDB() {
    await this.db.delete();
    await this.db.initializeDB();
  }

  async createCheckpoint(endBlock: Block): Promise<IpfsInfo> {
    const logs = [];
    for (const { databaseName } of databasesToSync) {
      // Awaiting here to reduce load on db.
      logs.push(
        await this.db[databaseName]
          .where('blockNumber')
          .between(this.uploadBlockNumber, endBlock.number, true, true)
          .toArray()
      );
    }

    const sortedLogs = _.orderBy(
      _.flatten(logs),
      ['blockNumber', 'logIndex'],
      ['asc', 'asc']
    );

    const body = JSON.stringify({
      startBlockNumber: this.uploadBlockNumber,
      endBlockNumber: endBlock.number,
      logs: sortedLogs,
    } as CheckpointInterface);
    const content = LZString.compressToUint8Array(body);
    const [result] = await (await this.ipfs).add({
      content,
    });

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

    topLevelDirectory.addLink({
      Name: 'index',
      Hash: result.hash,
      Size: 0,
    });

    const hash = (await (await this.ipfs).dag.put(
      topLevelDirectory,
      WarpController.DEFAULT_NODE_TYPE
    )).toString();

    await this.db.warpCheckpoints.createCheckpoint(endBlock, hash);

    return hash;
  }

  getFile(ipfsHash: string, ipfsPath: string) {
    return new Promise<CheckpointInterface>(async (resolve, reject) => {
      const timeout = setTimeout(() => {reject(new Error('Request timed out'));}, FILE_FETCH_TIMEOUT);
      let fileResult;
      switch (this.ipfsEndpointInfo.version) {
        case IPFSHashVersion.CIDv0:
        case IPFSHashVersion.CIDv1:
          fileResult = await fetch(`${this.ipfsEndpointInfo.url}/${ipfsHash}${ipfsPath}`)
          .then(item => item.arrayBuffer())
          .then(item => new Uint8Array(item))
          break;
        case IPFSHashVersion.IPFS:
          try {
            fileResult = await (await this.ipfs).cat(`${ipfsHash}${ipfsPath}`);
          } catch(err) {
            if (err.message === 'this dag node is a directory') {
              throw Error(`IPFS: tried to read directory as if it were a file: hash=${ipfsHash} path=${ipfsPath}`)
            }
          }
          break;
        default:
          throw new Error('No IPFS gateway configured');
      }

      clearTimeout(timeout);
      const decompressedResult = await LZString.decompressFromUint8Array(fileResult);
      resolve(JSON.parse(decompressedResult));
    });
  }

  async getCheckpointFile(ipfsRootHash: string): Promise<CheckpointInterface> {
    return this.getFile(ipfsRootHash, '/index');
  }

  async pinHashByGatewayUrl(urlString: string) {
    const url = new URL(urlString);
    try {
      const matches = /^(\w+)\.ipfs\..+$/.exec(url.hostname);
      const thingToPin = (matches) ? matches[1] : url.pathname;

      await (await this.ipfs).pin.add(thingToPin);

      logger.info(`Client pinned with ipfs hash: ${thingToPin}`)

      return true;
    } catch (e) {
      return false;
    }
  }

  async getMostRecentWarpSync() {
    return this.db.warpCheckpoints.getMostRecentWarpSync();
  }

  async getMostRecentCheckpoint() {
    return this.db.warpCheckpoints.getMostRecentCheckpoint();
  }

  async hasMostRecentCheckpoint() {
    return (await this.getMostRecentCheckpoint()) !== undefined;
  }
}
