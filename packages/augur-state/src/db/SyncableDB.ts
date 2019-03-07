import { AbstractDB, BaseDocument, PouchDBFactoryType } from "./AbstractDB";
import { Augur, Log, ParsedLog } from "@augurproject/api";
import { DB } from "./DB";
import { SyncStatus } from "./SyncStatus";
import * as _ from "lodash";

/**
 * Stores event logs for non-user-specific events.
 */
export class SyncableDB<TBigNumber> extends AbstractDB {
    private syncStatus: SyncStatus;
    protected eventName: string;
    protected contractName: string; // TODO Remove if unused

    constructor(dbController: DB<TBigNumber>, networkId: number, eventName: string, dbName?: string) {
        dbName = dbName || dbController.getDatabaseName(eventName);
        super(networkId, dbName, dbController.pouchDBFactory);
        this.eventName = eventName;
        this.syncStatus = dbController.syncStatus;
        // TODO Set other indexes as need be
        this.db.createIndex({
            index: {
              fields: ['blockNumber']
            }
        });
        dbController.notifySyncableDBAdded(this);
    }

    public async sync(augur: Augur<TBigNumber>, chunkSize: number, blockStreamDelay: number, highestAvailableBlockNumber: number): Promise<void> {
        let highestSyncedBlockNumber = await this.syncStatus.getHighestSyncBlock(this.dbName);
        const goalBlock = highestAvailableBlockNumber - blockStreamDelay;
        console.log(`SYNCING ${this.dbName} from ${highestSyncedBlockNumber} to ${goalBlock}`);
        while (highestSyncedBlockNumber < goalBlock) {
            const endBlockNumber = Math.min(highestSyncedBlockNumber + chunkSize, highestAvailableBlockNumber);
            const logs = await this.getLogs(augur, highestSyncedBlockNumber, endBlockNumber);
            let success = true;
            if (logs.length > 1) {
                const documents = _.sortBy(_.map(logs, this.processLog), "_id");
                success = await this.bulkUpsertDocuments(documents[0]._id, documents);
            }
            if (success) {
                highestSyncedBlockNumber = endBlockNumber;
                await this.syncStatus.setHighestSyncBlock(this.dbName, highestSyncedBlockNumber);
            }
        }
        console.log(`SYNCING SUCCESS ${this.dbName} up to ${goalBlock}`);

        // TODO Make any external calls as needed (such as pushing user's balance to UI)

        // TODO start blockstream
    }

    protected async getLogs(augur: Augur<TBigNumber>, startBlock: number, endBlock: number): Promise<Array<ParsedLog>> {
        return await augur.events.getLogs(this.eventName, startBlock, endBlock);
    }

    protected processLog(log: Log): BaseDocument {
        if (!log.blockNumber) throw new Error(`Corrupt log: ${JSON.stringify(log)}`);
        const _id = `${log.blockNumber.toPrecision(21)}${log.logIndex}`;
        return Object.assign(
            { _id },
            log
        );
    }

    public async addNewBlock(logs: Array<ParsedLog>): Promise<void> {
        const highestSyncedBlockNumber = await this.syncStatus.getHighestSyncBlock(this.dbName);
        const documents = _.sortBy(_.map(logs, this.processLog), "_id");
        if (await this.bulkUpsertDocuments(documents[0]._id, documents)) {
            await this.syncStatus.setHighestSyncBlock(this.dbName, highestSyncedBlockNumber + 1);
        } else {
            throw new Error(`Unable to add new block`);
        }
    }

    public async rollback(blockNumber: number): Promise<void> {
        // Remove each change from blockNumber onward
        try {
            let highestSyncBlock = await this.syncStatus.getHighestSyncBlock(this.dbName);
            // Sort blocks so newest blocks are removed first
            let blocksToRemove = await this.db.find({
                selector: { blockNumber: { $gte: blockNumber } },
                fields: ['_id', 'blockNumber', '_rev'],
                sort: [{blockNumber: 'desc'}],
            });
            if (blocksToRemove.docs.length > 0) {
              console.log("\n\nDeleting the following blocks from " + this.dbName);
                console.log(blocksToRemove.docs);
                for (let doc of blocksToRemove.docs) {
                    // Remove block number from event DB
                    await this.db.remove(doc._id, doc._rev);
                    // Update highest sync block with decremented block number
                    await this.syncStatus.setHighestSyncBlock(this.dbName, --highestSyncBlock);
                }
            }
        } catch (err) {
            console.error(err);
        }
    }
}
