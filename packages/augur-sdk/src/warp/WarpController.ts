import Dexie from 'dexie';
import * as IPFS from 'ipfs';
import * as Unixfs from 'ipfs-unixfs';
import { DAGNode } from 'ipld-dag-pb';
import moment from 'moment';

import { DB } from '../state/db/DB';
import { Address, Log } from '../state/logs/types';
import _ from 'lodash';
import All = moment.unitOfTime.All;

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
type DbExpander<P> = P extends keyof AllDbs
  ? { databaseName: P; indexes: Array<keyof AllDbs[P]> }
  : never;
type Db = DbExpander<keyof AllDbs>;
type RollupDescription = Readonly<Db[]>;

interface IPFSObject {
  Hash: string;
  Size: string;
}

export class WarpController {
  private static DEFAULT_NODE_TYPE = { format: 'dag-pb', hashAlg: 'sha2-256' };

  get ready() {
    return this.ipfs.ready;
  }

  static async create(db: DB) {
    const ipfs = await IPFS.create();
    return new WarpController(db, ipfs);
  }

  constructor(private db: DB, private ipfs: IPFS) {}

  async createAllCheckpoints() {
    const topLevelDirectory = new DAGNode(
      Unixfs.default('directory').marshal()
    );
    const versionFile = await this.ipfs.add({
      content: Buffer.from(WARPSYNC_VERSION),
    });
    topLevelDirectory.addLink({
      Name: 'VERSION',
      Hash: versionFile[0].hash,
      Size: 1,
    });

    topLevelDirectory.addLink(await this.buildDirectory('accounts'));
    topLevelDirectory.addLink(await this.buildDirectory('checkpoints'));

    topLevelDirectory.addLink(
      await this.buildDirectory('account', await this.createAccountRollups())
    );

    topLevelDirectory.addLink(
      await this.buildDirectory('market', await this.createMarketRollups())
    );

    let indexFileLinks = [];

    const tableNode = new DAGNode(Unixfs.default('directory').marshal());
    for (const table of this.db.databasesToSync()) {
      const [links, r] = await this.addDBToIPFS(table);
      indexFileLinks = [...indexFileLinks, ...links];
      tableNode.addLink(r);
    }
    topLevelDirectory.addLink({
      Name: 'tables',
      Hash: await this.ipfs.dag.put(
        tableNode,
        WarpController.DEFAULT_NODE_TYPE
      ),
      Size: 0,
    });

    const file = Unixfs.default('file');
    for (let i = 0; i < indexFileLinks.length; i++) {
      file.addBlockSize(indexFileLinks[i].Size);
    }

    const indexFile = new DAGNode(file.marshal());
    for (let i = 0; i < indexFileLinks.length; i++) {
      indexFile.addLink(indexFileLinks[i]);
    }

    const indexFileResponse = await this.ipfs.dag.put(
      indexFile,
      WarpController.DEFAULT_NODE_TYPE
    );
    topLevelDirectory.addLink({
      Name: 'index',
      Hash: indexFileResponse,
      Size: file.fileSize(),
    });

    const d = await this.ipfs.dag.put(
      topLevelDirectory,
      WarpController.DEFAULT_NODE_TYPE
    );

    console.log('checkpoint', d.toString());
    return d.toString();
  }

  async addDBToIPFS(table: Dexie.Table<any, any>) {
    const results = await this.ipfsAddRows(await table.toArray());

    const file = Unixfs.default('file');
    for (let i = 0; i < results.length; i++) {
      file.addBlockSize(results[i].Size);
    }
    const links = [];
    const indexFile = new DAGNode(file.marshal());
    for (let i = 0; i < results.length; i++) {
      const link = results[i];
      links.push(link);
      indexFile.addLink(link);
    }

    const indexFileResponse = await this.ipfs.dag.put(
      indexFile,
      WarpController.DEFAULT_NODE_TYPE
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
      WarpController.DEFAULT_NODE_TYPE
    );
    return [
      links,
      {
        Name: table.name,
        Hash: q.toString(),
        Size: 0,
      },
    ];
  }

  private async buildDirectory(name: string, items = []) {
    const file = Unixfs.default('file');
    const directory = Unixfs.default('directory');
    for (let i = 0; i < items.length; i++) {
      directory.addBlockSize(items[i].size);
    }

    directory.addBlockSize(file.fileSize());
    const directoryNode = new DAGNode(directory.marshal());

    for (let i = 0; i < items.length; i++) {
      await directoryNode.addLink(items[i]);
    }

    const q = await this.ipfs.dag.put(
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

    const data = await this.ipfs.add(requests);
    return data.map(item => ({
      Hash: item.hash,
      Size: item.size,
    }));
  }

  async createMarketRollups() {
    const dbNamesToSync: RollupDescription = [
      { databaseName: 'MarketCreated', indexes: ['market'] },
      { databaseName: 'MarketVolumeChanged', indexes: ['market'] },
      { databaseName: 'MarketOIChanged', indexes: ['market'] },
      { databaseName: 'InitialReportSubmitted', indexes: ['market'] },
      { databaseName: 'DisputeCrowdsourcerCompleted', indexes: ['market'] },
      { databaseName: 'MarketFinalized', indexes: ['market'] },
      { databaseName: 'MarketParticipantsDisavowed', indexes: ['market'] },
      { databaseName: 'MarketMigrated', indexes: ['market'] },
      { databaseName: 'OrderEvent', indexes: ['market'] },
      { databaseName: 'ProfitLossChanged', indexes: ['market'] },
    ];

    const result = (await this.db.MarketCreated.toArray()).map(
      ({ market }) => market
    );
    return this.createRollup(dbNamesToSync, result);
  }

  createMarketRollup = async (dbName: AllDBNames, marketId: Address) => {
    const logs = await this.db[dbName]
      .where('market')
      .equals(marketId)
      .toArray();

    return this.ipfsAddRows(logs);
  };

  async createAccountRollups() {
    const dbNamesToSync: RollupDescription = [
      {
        databaseName: 'TransferBatch',
        indexes: ['to', 'from'],
      },
      {
        databaseName: 'TransferSingle',
        indexes: ['from', 'to'],
      },
    ];

    const result = (await this.db.ProfitLossChanged.toArray()).map(
      ({ account }) => account
    );
    return this.createRollup(dbNamesToSync, result);
  }

  queryDB = async (
    dbName: AllDBNames,
    properties: string[],
    criteria: Address
  ) => {
    const query = properties.reduce(
      (table, value) => table.or(value).equalsIgnoreCase(criteria),
      this.db[dbName].where('blockNumber').aboveOrEqual(0)
    );
    const logs = await query.toArray();

    return this.ipfsAddRows(logs);
  };

  async createRollup(rollupDescriptions: RollupDescription, ids: Address[]) {
    const result = ids.map(async id => {
      const items = _.flatten(
        await Promise.all(
          rollupDescriptions.map(r =>
            this.queryDB(r.databaseName, r.indexes, id)
          )
        )
      );

      const file = Unixfs.default('file');
      for (let i = 0; i < items.length; i++) {
        file.addBlockSize(items[i].Size);
      }

      const indexFile = new DAGNode(file.marshal());
      for (let i = 0; i < items.length; i++) {
        const link = items[i];
        indexFile.addLink(link);
      }

      const indexFileResponse = await this.ipfs.dag.put(
        indexFile,
        WarpController.DEFAULT_NODE_TYPE
      );

      return {
        Name: id,
        Hash: indexFileResponse.toString(),
        Size: file.fileSize(),
      };
    });

    return Promise.all(result);
  }

  getFile(ipfsPath: string) {
    return this.ipfs.cat(ipfsPath);
  }
}
