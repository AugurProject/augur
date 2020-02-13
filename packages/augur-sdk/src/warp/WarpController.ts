import Dexie from 'dexie';
import { Block } from 'ethers/providers';
import * as IPFS from 'ipfs';
import * as Unixfs from 'ipfs-unixfs';
import { DAGNode } from 'ipld-dag-pb';
import _ from 'lodash';
import { Provider } from '..';

import { DB } from '../state/db/DB';
import { Address, Log } from '../state/logs/types';
import { Checkpoints } from './Checkpoints';

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

export class WarpController {
  private checkpointCreationInProgress = false;
  private static DEFAULT_NODE_TYPE = { format: 'dag-pb', hashAlg: 'sha2-256' };
  checkpoints: Checkpoints;

  get ready() {
    return this.ipfs.ready;
  }

  static async create(db: DB, provider: Provider, uploadBlockNumber: Block) {
    const ipfs = await IPFS.create({
      repo: './data',
    });
    return new WarpController(db, ipfs, provider, uploadBlockNumber);
  }

  constructor(
    private db: DB,
    private ipfs: IPFS,
    provider: Provider,
    private uploadBlockNumber: Block,
  ) {
    this.checkpoints = new Checkpoints(provider);
  }

  onNewBlock = async (newBlock: Block): Promise<void> => {
    const mostRecentCheckpoint = await this.db.warpCheckpoints.getMostRecentCheckpoint();
    if (
      mostRecentCheckpoint &&
      this.checkpoints.isSameDay(mostRecentCheckpoint.begin, newBlock)
    ) {
      return;
    }

    // Presumably we would report here.

    this.createAllCheckpoints(newBlock);
  };

  async createInitialCheckpoint() {
    const mostRecentCheckpoint = await this.db.warpCheckpoints.getMostRecentCheckpoint();
    if (!mostRecentCheckpoint) {
      this.db.warpCheckpoints.createInitialCheckpoint(this.uploadBlockNumber);
    }
  }

  async createAllCheckpoints(highestBlock: Block) {
    // Skip this warpSyncFile run. Will get em' next time.
    if(this.checkpointCreationInProgress) return;
    this.checkpointCreationInProgress = true;
    await this.createInitialCheckpoint();
    await this.createCheckpoints(highestBlock);
    this.checkpointCreationInProgress = false;

    // For reproducibility we need hash consistent block number ranges for each warp sync.
    const [
      begin,
      end,
    ] = await this.db.warpCheckpoints.getCheckpointBlockRange();

    const topLevelDirectory = new DAGNode(
      Unixfs.default('directory').marshal(),
    );
    const versionFile = await this.ipfs.add({
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
        await this.db.warpCheckpoints.getAllIPFSObjects(),
      ),
    );

    let indexFileLinks = [];
    const tableNode = new DAGNode(Unixfs.default('directory').marshal());
    for (const { databaseName } of databasesToSync) {
      const [links, r] = await this.addDBToIPFS(
        this.db[databaseName].where('blockNumber').
          between(begin.number, end.number, true, true),
        databaseName,
      );
      indexFileLinks = [...indexFileLinks, ...links];
      tableNode.addLink(r);
    }

    topLevelDirectory.addLink({
      Name: 'tables',
      Hash: await this.ipfs.dag.put(
        tableNode,
        WarpController.DEFAULT_NODE_TYPE,
      ),
      Size: 0,
    });

    const file = Unixfs.default('file');
    for (let i = 0; i < indexFileLinks.length; i++) {
      file.addBlockSize(indexFileLinks[i].Size);
    }

    const indexFile = new DAGNode(file.marshal(), indexFileLinks);

    const indexFileResponse = await this.ipfs.dag.put(
      indexFile,
      WarpController.DEFAULT_NODE_TYPE,
    );
    topLevelDirectory.addLink({
      Name: 'index',
      Hash: indexFileResponse,
      Size: file.fileSize(),
    });

    const d = await this.ipfs.dag.put(
      topLevelDirectory,
      WarpController.DEFAULT_NODE_TYPE,
    );

    console.log('checkpoint', d.toString());
    return d.toString();
  }

  async addDBToIPFS(
    table: Pick<Dexie.Table<any, any>, 'toArray'>,
    name: string,
  ): Promise<[IPFSObject[], IPFSObject]> {
    const results = await this.ipfsAddRows(await table.toArray());

    const file = Unixfs.default('file');
    for (let i = 0; i < results.length; i++) {
      file.addBlockSize(results[i].Size);
    }
    const links = results;
    const indexFile = new DAGNode(file.marshal(), results);

    const indexFileResponse = await this.ipfs.dag.put(
      indexFile,
      WarpController.DEFAULT_NODE_TYPE,
    );

    const directory = Unixfs.default('directory');
    for (let i = 0; i < results.length; i++) {
      directory.addBlockSize(results[i].Size);
    }

    directory.addBlockSize(file.fileSize());
    const directoryNode = new DAGNode(directory.marshal());
    for (let i = 0; i < results.length; i++) {
      directoryNode.addLink({
        Name: `file${i}`,
        Hash: results[i].Hash,
        Size: results[i].Size,
      });
    }

    directoryNode.addLink({
      Name: 'index',
      Hash: indexFileResponse.toString(),
      Size: file.fileSize(),
    });

    const q = await this.ipfs.dag.put(
      directoryNode,
      WarpController.DEFAULT_NODE_TYPE,
    );
    return [
      links,
      {
        Name: name,
        Hash: q.toString(),
        Size: 0,
      },
    ];
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

    const q = await this.ipfs.dag.put(
      directoryNode,
      WarpController.DEFAULT_NODE_TYPE,
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

    const data = await this.ipfs.add(requests);
    return data.map(item => ({
      Hash: item.hash,
      Size: item.size,
    }));
  }

  async createCheckpoint(begin: Block, end: Block) {
    const logs = [];
    for (const { databaseName } of databasesToSync) {
      // Awaiting here to reduce load on db.
      logs.push(await this.db[databaseName].where('blockNumber').
        between(begin.number, end.number, true, true).toArray());
    }

    const sortedLogs = _.orderBy(
      _.flatten(logs),
      ['blockNumber', 'logIndex'],
      ['asc', 'asc']
    );

    const [result] = await this.ipfs.add({
      content: Buffer.from(JSON.stringify(sortedLogs)),
    });

    return {
      Name: `${begin.number}`,
      Hash: result.hash,
      Size: result.size,
    };
  }

  async createCheckpoints(end: Block) {
    let endBlock = (await this.db.warpCheckpoints.getMostRecentCheckpoint()).begin;
    while(!this.checkpoints.isSameDay(endBlock, end)) {
      const mostRecentCheckpoint = await this.db.warpCheckpoints.getMostRecentCheckpoint();
      const [
        newBeginBlock,
        newEndBlock,
      ] = await this.checkpoints.calculateBoundary(
        mostRecentCheckpoint.begin,
        end,
      );

      // This is where we actually create the checkpoint.
      const checkPointIPFSObject = await this.createCheckpoint(
        mostRecentCheckpoint.begin,
        newBeginBlock,
      );
      await this.db.warpCheckpoints.createCheckpoint(
        newBeginBlock,
        newEndBlock,
        checkPointIPFSObject,
      );
      endBlock = newEndBlock;
    }
  }

  queryDB = <P extends AllDBNames>(
    dbName: P,
    properties: Readonly<string[]> = [],
    criteria: Address,
    startBlockNumber = 0,
    endBlockNumber?: number,
  ): Dexie.Promise<Array<AllDbs[P]>> => {
    // I really hate that I have to do this.
    // @ts-ignore
    return this.db[dbName].where('blockNumber').
      between(startBlockNumber, endBlockNumber, true, true).
      and(item => properties.some(property => item[property] === criteria)).
      toArray();
  };

  queryDBWithAddRow = async (
    dbName: AllDBNames,
    properties: Readonly<string[]> = [],
    criteria: Address,
    startBlockNumber = 0,
    endBlockNumber?: number,
  ) => {
    const logs = await this.queryDB(
      dbName,
      properties,
      criteria,
      startBlockNumber,
      endBlockNumber,
    );

    return this.ipfsAddRows(logs);
  };

  async createRollup(
    rollupDescriptions: RollupDescription,
    ids: Address[],
    startBlockNumber?: number,
    endBlockNumber?: number,
  ) {
    const resultPromises = ids.map(
      async (id): Promise<[IPFSObject[], IPFSObject[]]> => {
        const links: IPFSObject[] = [];
        const items = _.flatten(
          await Promise.all(
            rollupDescriptions.map(async r => {
              if (r.join) {
                // This exists if we need to lookup logs using another db.
                const { indexes, source, on } = r.join;

                const logs = await this.queryDB(
                  source,
                  indexes,
                  id,
                  startBlockNumber,
                  endBlockNumber,
                );

                // Types are fun!
                const conditions = (logs.map(log => {
                  const result = [];
                  for (let i = 0; i < on.length; i++) {
                    result.push(log[on[i]]);
                  }
                  return result.length === 1 ? result[0] : result;
                }) as unknown) as void[][];
                const rows = await this.db[r.databaseName].where(
                  on.length > 1 ? `[${on.join('+')}]` : `${on.slice()[0]}`).
                  anyOf(conditions).
                  toArray();

                return this.ipfsAddRows(rows);
              } else {
                return this.queryDBWithAddRow(
                  r.databaseName,
                  r.indexes,
                  id,
                  startBlockNumber,
                  endBlockNumber,
                );
              }
            }),
          ),
        );

        const file = Unixfs.default('file');
        for (let i = 0; i < items.length; i++) {
          file.addBlockSize(items[i].Size);
        }

        const indexFile = new DAGNode(file.marshal());
        for (let i = 0; i < items.length; i++) {
          links.push(items[i]);
          indexFile.addLink(items[i]);
        }

        const indexFileResponse = await this.ipfs.dag.put(
          indexFile,
          WarpController.DEFAULT_NODE_TYPE,
        );

        return [
          links,
          [
            {
              Name: id,
              Hash: indexFileResponse.toString(),
              Size: file.fileSize(),
            },
          ],
        ];
      },
    );

    const result = await Promise.all(resultPromises);
    const [links, files] = result.reduce<[IPFSObject[], IPFSObject[]]>(
      (acc, item) => {
        return [[...acc[0], ...item[0]], [...acc[1], ...item[1]]];
      },
      [[], []],
    );

    const file = Unixfs.default('file');
    for (let i = 0; i < links.length; i++) {
      file.addBlockSize(links[i].Size);
    }

    const indexFile = new DAGNode(file.marshal());
    for (let i = 0; i < links.length; i++) {
      indexFile.addLink(links[i]);
    }

    const indexFileResponse = await this.ipfs.dag.put(
      indexFile,
      WarpController.DEFAULT_NODE_TYPE,
    );

    return [
      links.slice(),
      [
        {
          Name: 'index',
          Hash: indexFileResponse.toString(),
          Size: file.fileSize(),
        },
        ...files,
      ],
    ];
  }

  getFile(ipfsPath: string) {
    return this.ipfs.cat(ipfsPath).then((item) => item.toString());
  }

  async getAvailableCheckpointsByHash(ipfsRootHash: string): Promise<number[]> {
    const files = await this.ipfs.ls(`${ipfsRootHash}/checkpoints/`);
    return files.map(item => Number(item.name));
  }

  async getCheckpointFile(
    ipfsRootHash: string,
    checkpointBlockNumber: string | number,
  ) {
    return this.getFile(`${ipfsRootHash}/checkpoints/${checkpointBlockNumber}`);
  }

  async pinHashByGatewayUrl(urlString: string) {
    const url = new URL(urlString);
    try {
      await this.ipfs.pin.add(url.pathname);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  async getMostRecentCheckpoint() {
    return this.db.warpCheckpoints.getMostRecentCheckpoint();
  }

  async hasMostRecentCheckpoint() {
    return (await this.getMostRecentCheckpoint()) !== undefined;
  }
}
