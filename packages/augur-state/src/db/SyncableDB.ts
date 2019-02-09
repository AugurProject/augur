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
        dbController.notifySyncableDBAdded(eventName, this);
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

    public async simulateAddingNewBlock(uploadBlockNumber: number, logs: Array<ParsedLog>): Promise<boolean> {
        const documents = _.sortBy(_.map(logs, this.processLog), "_id");
        return await this.bulkUpsertDocuments(documents[0]._id, documents);
    }

    public async rollback(sequenceId: number) {
        // Remove each change since sequenceId
        try {
            const changes = await this.db.changes({
                since: sequenceId,
            });
            // console.log("Deleting changes seqId " + sequenceId + " and onward in " + this.dbName)
            // console.log(changes);
            for (let result of changes.results) {
                const id = result.id;
                // Delete the oldest change in the list, which automatically deletes subsequent changes
                const change = result.changes[0];
                await this.db.remove(id, change.rev);
            }
        } catch (err) {
            console.log(err);
        }
    }
}
