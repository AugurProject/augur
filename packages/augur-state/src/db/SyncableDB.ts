import { AbstractDB, BaseDocument } from './AbstractDB';
import { Augur, Log, ParsedLog } from 'augur-api';
import { DB } from './DB';
import { SyncStatus } from './SyncStatus';
import * as _ from "lodash";
const uploadBlockNumbers = require('augur-artifacts/upload-block-numbers.json');

/**
 * Stores event logs for non-user-specific events.
 */
export class SyncableDB<TBigNumber> extends AbstractDB {
    private syncStatus: SyncStatus;
    protected eventName: string;
    protected contractName: string; // TODO Remove if unused

    constructor(dbController: DB<TBigNumber>, networkId: number, eventName: string, dbName?: string) {
        super(networkId, dbName ? dbName : `${networkId}-${eventName}`);
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

    public async addNewBlock(uploadBlockNumber: number, logs: Array<ParsedLog>): Promise<void> {
        const highestSyncedBlockNumber = await this.syncStatus.getHighestSyncBlock(this.dbName, uploadBlockNumber);
        const documents = _.sortBy(_.map(logs, this.processLog), "_id");
        if (await this.bulkUpsertDocuments(documents[0]._id, documents)) {
            await this.syncStatus.setHighestSyncBlock(this.dbName, highestSyncedBlockNumber + 1);
        } else {
            throw new Error(`Unable to add new block`);
        }
    }

    public async rollback(blockNumber: number, sequenceId: number): Promise<void> {
        // Remove each change from sequenceId onward
        try {
            let highestSyncBlock = await this.syncStatus.getHighestSyncBlock(this.dbName, uploadBlockNumbers[this.networkId]);
            let changes = await this.db.changes({
                since: sequenceId,
            });
            // Reverse ordering of changes so that newest changes are rolled back first
            changes.results = changes.results.reverse();
            console.log("\n\nDeleting the following changes from " + this.dbName)
            console.log(changes);
            for (let result of changes.results) {
                const id = result.id;
                const change = result.changes[0];
                // Remove block number from event DB
                await this.db.remove(id, change.rev);
                // Update highest sync block with decremented block number
                await this.syncStatus.setHighestSyncBlock(this.dbName, --highestSyncBlock);
            }
        } catch (err) {
            console.log(err);
        }
    }
}
