import { AbstractDB } from './AbstractDB';
import { DB } from './DB';
import * as _ from "lodash";

export interface SequenceIds {
    [dbName: string]: string 
}

/**
 * Associates block numbers with event DB sequence IDs
 */
export class MetaDB<TBigNumber> extends AbstractDB {
    public async addNewBlock(blockNumber: number, sequenceIds: SequenceIds) {
        await this.upsertDocument(
            this.networkId + "-" + blockNumber, 
            {
                networkId: this.networkId,
                blockNumber,
                sequenceIds: JSON.stringify(sequenceIds),
            }
        );
    }

    public async getBlockSequenceIds(networkId: number, blockNumber: number): Promise<PouchDB.Find.FindResponse<{}>> {
        return await this.db.find(
            {
                selector: { 
                    networkId,
                    blockNumber: { $gte: blockNumber } 
                },
                fields: ['_id', 'networkId', 'blockNumber', 'sequenceIds'],
            }
        );
    }

    public async rollback(blockNumber: number): Promise<boolean> {
        // Remove each change since blockNumber
        const blocksToRemove = await this.db.find({
            selector: { 
                networkId: this.networkId,
                blockNumber: { $gte: blockNumber } },
            fields: ['blockNumber', '_id', '_rev'],
        });
        console.log("\n\nOldest block number to remove: ", blockNumber);
        console.log("Blocks to remove from " + this.dbName);
        console.log(blocksToRemove);
        let results = [];
        try {
            for (let doc of blocksToRemove.docs) {
                results.push(await this.db.remove(doc._id, doc._rev));
            }
            return _.every(results, (response) => (<PouchDB.Core.Response>response).ok);
        } catch (err) {
            console.error(`ERROR in rollback: ${JSON.stringify(err)}`);
            return false;
        }
    }
}
