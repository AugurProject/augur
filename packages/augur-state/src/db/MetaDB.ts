import { AbstractDB } from './AbstractDB';
import { DB } from './DB';
import { SyncStatus } from './SyncStatus';
import * as _ from "lodash";

export interface SequenceIds {
    [dbName: string]: string 
}

/**
 * Associates block numbers with event DB sequence IDs.
 * Used for doing syncing/rolling back of derived DBs.
 */
export class MetaDB<TBigNumber> extends AbstractDB {
    private syncStatus: SyncStatus;

    constructor(dbController: DB<TBigNumber>, networkId: number) {
        super(networkId, networkId + "-BlockNumbersSequenceIds");
        this.syncStatus = dbController.syncStatus;
        this.db.createIndex({
            index: {
              fields: ['blockNumber']
            }
        });
    }

    public async addNewBlock(blockNumber: number, sequenceIds: SequenceIds) {
        await this.upsertDocument(
            this.networkId + "-" + blockNumber, 
            {
                blockNumber,
                sequenceIds: JSON.stringify(sequenceIds),
            }
        );
        await this.syncStatus.setHighestSyncBlock(this.dbName, blockNumber);
    }

    public async rollback(blockNumber: number): Promise<boolean> {
        // Remove each change since blockNumber
        const blocksToRemove = await this.db.find({
            selector: { blockNumber: { $gte: blockNumber } },
            fields: ['blockNumber', '_id', '_rev'],
        });
        console.log("\n\nBlocks to remove from " + this.dbName);
        console.log(blocksToRemove);
        let results = [];
        try {
            for (let doc of blocksToRemove.docs) {
                results.push(await this.db.remove(doc._id, doc._rev));
            }
            // Set highest sync block to block before blockNumber
            await this.syncStatus.setHighestSyncBlock(this.dbName, blockNumber - 1);
            return _.every(results, (response) => (<PouchDB.Core.Response>response).ok);
        } catch (err) {
            console.error(`ERROR in rollback: ${JSON.stringify(err)}`);
            return false;
        }
    }
}
