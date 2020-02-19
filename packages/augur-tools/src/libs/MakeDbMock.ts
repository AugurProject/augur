import { DB } from '@augurproject/sdk/build/state/db/DB';
import { LogFilterAggregator } from '@augurproject/sdk/build/state/logs/LogFilterAggregator';
import { BlockAndLogStreamerListenerInterface } from '@augurproject/sdk/build/state/sync/BlockAndLogStreamerSyncStrategy';
import { configureDexieForNode } from '@augurproject/sdk/build/state/utils/DexieIDBShim';
import uuid = require('uuid');

configureDexieForNode(true);

function* infiniteSequence(): IterableIterator<number> {
  let i = 0;
  while (true) {
    yield i++;
  }
}
const iterator = infiniteSequence();

export function makeDbMock(prefix:string = uuid.v4()) {
  const mockState = {
    db: undefined as Promise<DB>,
  };

  async function wipeDB(): Promise<void> {
    const db = await mockState.db;
    await Promise.all(Object.values(db.dexieDB.tables).map((db) => {
      return db.clear();
    }));
  }

  function makeBlockAndLogStreamerListener(): BlockAndLogStreamerListenerInterface {
    return {
      listenForBlockRemoved: jest.fn(),
      listenForBlockAdded: jest.fn(),
    };
  }

  const networkId = iterator.next();
  const constants = {
    chunkSize: 100000,
    blockstreamDelay: 10,
    networkId: networkId.value,
    defaultStartSyncBlockNumber: 0,
  };

  return {
    wipeDB,
    constants,
    makeDB: augur => {
      const logFilterAggregator = LogFilterAggregator.create(
        augur.contractEvents.getEventTopics,
        augur.contractEvents.parseLogs,
        augur.contractEvents.getEventContractAddress,
      );

      const db = DB.createAndInitializeDB(
        iterator.next().value,
        logFilterAggregator,
        augur,
        !!augur.zeroX,
      );
      mockState.db = db;

      return db;
    }
  };
}
