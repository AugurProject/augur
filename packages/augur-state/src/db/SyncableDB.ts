import { AbstractDB, BaseDocument } from './AbstractDB';
import { Augur, Log, ParsedLog } from 'augur-api';
import { DB } from './DB';
import { SyncStatus } from './SyncStatus';
import * as _ from "lodash";

// Stores generic events
export class SyncableDB<TBigNumber> extends AbstractDB {
    private syncStatus: SyncStatus;
    protected eventName: string;
    protected contractName: string;

    constructor(dbController: DB<TBigNumber>, networkId: number, eventName: string, dbName?: string) {
        super(dbName ? dbName : `${networkId}-${eventName}`);
        this.eventName = eventName;
        this.syncStatus = dbController.syncStatus;
        dbController.notifySyncableDBAdded(this);
    }

    public async sync(augur: Augur<TBigNumber>, chunkSize: number, blockStreamDelay: number, uploadBlockNumber: number): Promise<void> {
        let highestSyncedBlockNumber = await this.syncStatus.getHighestSyncBlock(this.dbName, uploadBlockNumber);
        const highestAvailableBlockNumber = await augur.provider.getBlockNumber();
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
                this.syncStatus.setHighestSyncBlock(this.dbName, highestSyncedBlockNumber);
            }
        }
        console.log(`SYNCING SUCCESS ${this.dbName} up to ${goalBlock}`);
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

    public async addNewBlock(uploadBlockNumber: number, logs: Array<ParsedLog>): Promise<void> {
        const highestSyncedBlockNumber = await this.syncStatus.getHighestSyncBlock(this.dbName, uploadBlockNumber);
        const documents = _.sortBy(_.map(logs, this.processLog), "_id");
        if (await this.bulkUpsertDocuments(documents[0]._id, documents)) {
            await this.syncStatus.setHighestSyncBlock(this.dbName, highestSyncedBlockNumber + 1);
        } else {
            throw new Error(`Unable to add new block`);
        }
    }
/*
    public async rollback(sequenceId: number): Promise<boolean> {
        // Remove each change since sequenceId
        try {
            const changes = await this.db.changes({
                since: sequenceId,
            });
            console.log("Deleting changes seqId " + sequenceId + " and onward in " + this.dbName)
            console.log(changes);
            for (let result of changes.results) {
                const id = result.id;
                for (let change of result.changes) {
                    await this.db.remove(id, change.rev);
                }
            }
            return true;
        } catch (err) {
            console.error(`ERROR in bulk sync: ${JSON.stringify(err)}`);
            return false;
        }
    }
*/
    public async rollback(blockNumber: number): Promise<boolean> {
        // Remove all blocks from blockNumber onward
        const docsToRemove = await this.db.find({
            selector: { blockNumber: { $gte: blockNumber } },
            fields: ['blockNumber', '_id', '_rev'],
        });
        console.log("Deleting docs from " + this.dbName);
        console.log(docsToRemove);
        let results = [];
        try {
            for (let doc of docsToRemove.docs) {
                results.push(await this.db.remove(doc._id, doc._rev));
            }
            return _.every(results, (response) => (<PouchDB.Core.Response>response).ok);
        } catch (err) {
            console.error(`ERROR in rollback: ${JSON.stringify(err)}`);
            return false;
        }
    }
}
