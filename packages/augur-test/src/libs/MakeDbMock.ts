import Dexie from 'dexie';
import { DB } from "@augurproject/sdk/build/state/db/DB";
import { Augur } from "@augurproject/sdk";
import { Account } from "@augurproject/tools";
import { BlockAndLogStreamerListenerInterface } from "@augurproject/sdk/build/state/db/BlockAndLogStreamerListener";
import * as _ from "lodash";
import * as fs from "fs";
import uuid = require("uuid");
import { configureDexieForNode } from "@augurproject/sdk/build/state/utils/DexieIDBShim";

configureDexieForNode(true);

let MOCK_NET_ID = 0;

export function makeDbMock(prefix:string = uuid.v4()) {

  MOCK_NET_ID++;

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
      notifyNewBlockAfterLogsProcess: jest.fn(),
      listenForEvent: jest.fn(),
      listenForAllEvents: jest.fn(),
      startBlockStreamListener: jest.fn(),
    };
  }

  const constants = {
    chunkSize: 100000,
    blockstreamDelay: 10,
    networkId: MOCK_NET_ID,
    defaultStartSyncBlockNumber: 0,
  };

  return {
    wipeDB,
    constants,
    makeDB: (augur: Augur, accounts: Account[]) => {
      const db = DB.createAndInitializeDB(
        constants.networkId,
        constants.blockstreamDelay,
        constants.defaultStartSyncBlockNumber,
        augur,
        makeBlockAndLogStreamerListener()
      );
      mockState.db = db;

      return db;
    }
  };
}
