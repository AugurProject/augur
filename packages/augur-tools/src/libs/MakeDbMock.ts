import { DB } from '@augurproject/sdk/build/state/db/DB';
import { LogFilterAggregator } from '@augurproject/sdk/build/state/logs/LogFilterAggregator';
import { BlockAndLogStreamerListenerInterface } from '@augurproject/sdk/build/state/sync/BlockAndLogStreamerSyncStrategy';
import { configureDexieForNode } from '@augurproject/sdk/build/state/utils/DexieIDBShim';

configureDexieForNode(true);

function* infiniteSequence(): IterableIterator<number> {
  let i = 0;
  while (true) {
    yield i++;
  }
}
const iterator = infiniteSequence();

export function makeDbMock(prefix = undefined) {
  const mockState = {
    db: undefined as Promise<DB>,
  };

  async function wipeDB(): Promise<void> {
    const db = await mockState.db;
    await Promise.all(
      Object.values(db.dexieDB.tables).map(db => {
        return db.clear();
      })
    );
  }

  return {
    wipeDB,
    makeDB: augur => {
      const logFilterAggregator = LogFilterAggregator.create(
        augur.contractEvents.getEventTopics,
        augur.contractEvents.parseLogs
      );

      const db = DB.createAndInitializeDB(
        prefix ? prefix : iterator.next().value,
        0,
        logFilterAggregator,
        augur,
        !!augur.zeroX
      );
      mockState.db = db;

      return db;
    },
  };
}
