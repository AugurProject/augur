import {PouchDBFactoryType} from "@augurproject/state/src/db/AbstractDB";
import PouchDB from "pouchdb";
import * as _ from "lodash";
import { DB } from "@augurproject/state/build/db/DB";
import {Augur} from "@augurproject/api";
import { AccountList } from "./LocalAugur";

export function makeDbMock() {
  const mockState = {
    dbNames: [] as Array<string>,
    failCountdown: -1,  // default state never fails
    alwaysFail: false,
  };

  function fail() {
    mockState.failCountdown--;
    return mockState.alwaysFail || mockState.failCountdown === 0;
  }

  class MockPouchDB extends PouchDB {
    public allDocs<Model>(options?: any): Promise<any> {
      if (fail()) {
        throw Error("This was an intentional, mocked failure of allDocs");
      }
      if (options) {
        return super.allDocs(options);
      } else {
        return super.allDocs();
      }
    }

    public get<Model>(docId: any, options?: any): Promise<any> {
      if (fail()) {
        throw Error("This was an intentional, mocked failure of get");
      }
      if (options) {
        return super.get(docId, options);
      } else {
        return super.get(docId);
      }
    }

    public put<Model>(doc: any, options?: any): Promise<any> {
      if (fail()) {
        throw Error("This was an intentional, mocked failure of put");
      }
      if (options) {
        return super.put(doc, options);
      } else {
        return super.put(doc);
      }
    }
  }

  function makeFactory(): PouchDBFactoryType {
    return (dbName: string) => {
      const fullDbName = `db/${dbName}`;
      mockState.dbNames.push(fullDbName);
      return new MockPouchDB(fullDbName, {adapter: "memory"});
    };
  }

  async function wipeDB(): Promise<void> {
    await Promise.all(_.map(mockState.dbNames, (dbName) => {
      const db = new PouchDB(dbName, {adapter: "memory"});
      return db.destroy();
    }));

    mockState.dbNames = [];
  }

  const constants = {
    chunkSize: 100000,
      blockstreamDelay: 10,
      networkId: 4,
      defaultStartSyncBlockNumber: 0,
  };

  return {
    makeFactory,
    wipeDB,
    constants,
    failNext: () => mockState.failCountdown = 1,
    failInN: (n: number) => mockState.failCountdown = n,
    failForever: () => mockState.alwaysFail = true,
    cancelFail: () => {
      mockState.failCountdown = -1;
      mockState.alwaysFail = false;
    },
    makeDB: (augur: Augur<any>, accounts: AccountList) => DB.createAndInitializeDB(
        constants.networkId,
        constants.blockstreamDelay,
        constants.defaultStartSyncBlockNumber,
        [accounts[0].publicKey],
        augur.genericEventNames,
        augur.userSpecificEvents,
        makeFactory(),
      ),
    };
}
