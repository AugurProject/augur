import { DB } from './db/DB';
import { Augur } from 'augur-api';
const uploadBlockNumbers = require('augur-artifacts/upload-block-numbers.json');

export class Controller<TBigNumber> {
  private dbController: DB<TBigNumber>;
  private augur: Augur<TBigNumber>;
  private networkId: number;
  private trackedUsers: Array<string>;

  public constructor (augur: Augur<TBigNumber>, networkId: number, trackedUsers: Array<string>) {
    this.augur = augur;
    this.networkId = networkId;
    this.trackedUsers = trackedUsers;
  }

  public async run(): Promise<void> {
    this.dbController = await DB.createAndInitializeDB(this.networkId, this.trackedUsers);
    await this.dbController.sync(this.augur, 100000, 5, uploadBlockNumbers[this.networkId]);

    // TODO Move this function into separate test
    await this.testRollback();

    // TODO begin server process
  }

  /**
   * Adds 2 new blocks to DisputeCrowdsourcerCompleted DB and performs a rollback.
   * Queries before & after rollback to ensure blocks are removed successfully.
   */
  public async testRollback() {
    const dbName = this.networkId + "-DisputeCrowdsourcerCompleted";
    const universe = "0x11149d40d255fCeaC54A3ee3899807B0539bad60";

    let highestSyncedBlockNumber = await this.dbController.syncStatus.getHighestSyncBlock(dbName, uploadBlockNumbers[this.networkId]);
    // console.log("\n\nHighest synced block number: ", highestSyncedBlockNumber);

    let blockLogs = [
      {
        "universe": universe,
        "market": "0xC0ffe3F654d442589BAb472937F094970339d214",
        "disputeCrowdsourcer": "0x65d4f86927D1f10eFa2Fb884e4DEe0aB86137caD",
        "blockHash": "0x8132a0cdb4226b3bbb5bcf8429ec0883859255751be2c321c58b488395188040",
        "blockNumber": highestSyncedBlockNumber + 1,
        "transactionIndex": 8,
        "removed": false,
        "transactionHash": "0xf750ebb0d039c623385f8227f7a6cbe49f5efbc5485ac0e38b5a7b0e389726d8",
        "logIndex": 1,
      },
    ];

    // console.log("Adding new block: ", blockLogs);
    await this.dbController.addNewBlock(dbName, blockLogs);
    highestSyncedBlockNumber = await this.dbController.syncStatus.getHighestSyncBlock(dbName, uploadBlockNumbers[this.networkId]);
    // console.log("Highest synced block number: ", highestSyncedBlockNumber);

    blockLogs[0].blockNumber = highestSyncedBlockNumber + 1;
    // console.log("Adding new block: " + newBlockNumber);
    await this.dbController.addNewBlock(dbName, blockLogs);
    highestSyncedBlockNumber = await this.dbController.syncStatus.getHighestSyncBlock(dbName, uploadBlockNumbers[this.networkId]);
    // console.log("Highest synced block number: ", highestSyncedBlockNumber);

    let queryObj = {
      selector: {universe: '0x11149d40d255fCeaC54A3ee3899807B0539bad60'},
      fields: ['_id', 'universe'],
      sort: ['_id']
    };
    let result = await this.dbController.findInSyncableDB(dbName, queryObj);
    console.log("\n\nBefore rollback: ", result);

    await this.dbController.rollback(highestSyncedBlockNumber - 1);

    result = await this.dbController.findInSyncableDB(dbName, queryObj);
    console.log("\n\nAfter rollback: ", result);
  }
}
