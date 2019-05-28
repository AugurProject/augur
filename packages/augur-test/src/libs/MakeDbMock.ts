import { PouchDBFactoryType } from "@augurproject/sdk/build/state/db/AbstractDB";
import PouchDB from "pouchdb";
import { DB } from "@augurproject/sdk/build/state/db/DB";
import { Augur } from "@augurproject/sdk";
import { AccountList } from "./LocalAugur";
import { IBlockAndLogStreamerListener } from "@augurproject/sdk/build/state/db/BlockAndLogStreamerListener";
import { ethers } from "ethers";
import * as _ from "lodash";

interface Databases {
  [dbName: string]: PouchDB.Database;
}

export function makeDbMock() {
  const mockState = {
    dbs: {} as Databases,
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
      const db = new MockPouchDB(fullDbName, { adapter: "memory" });
      mockState.dbs[fullDbName] = db;
      return db;
    };
  }

  async function wipeDB(): Promise<void> {
    await Promise.all(Object.values(mockState.dbs).map((db) => {
      return db.destroy();
    }));

    mockState.dbs = {};
  }

  function makeBlockAndLogStreamerListener(): IBlockAndLogStreamerListener {
    return {
      listenForBlockRemoved: jest.fn(),
      listenForEvent: jest.fn(),
      startBlockStreamListener: jest.fn(),
    };
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
    getDatabases: () => mockState.dbs,
    failNext: () => mockState.failCountdown = 1,
    failInN: (n: number) => mockState.failCountdown = n,
    failForever: () => mockState.alwaysFail = true,
    cancelFail: () => {
      mockState.failCountdown = -1;
      mockState.alwaysFail = false;
    },
    makeDB: (augur: Augur, accounts: AccountList) => DB.createAndInitializeDB(
      constants.networkId,
      constants.blockstreamDelay,
      constants.defaultStartSyncBlockNumber,
      _.map(accounts, "publicKey"),
      augur.genericEventNames,
      augur.userSpecificEvents,
      makeFactory(),
      makeBlockAndLogStreamerListener(),
    ),
  };
}
