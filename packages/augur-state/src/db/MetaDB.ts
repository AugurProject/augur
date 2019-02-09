import { AbstractDB } from './AbstractDB';
import * as _ from "lodash";

// Associates block numbers with event DB sequence IDs
export class MetaDB<TBigNumber> extends AbstractDB {
    public async addBlock(blockNumber: number, document: Object) {
        await this.upsertDocument(blockNumber.toString(), document);
    }

    public async getBlockSequenceIds(blockNumber: number): Promise<any/*PouchDB.Find.FindResponse<{}>*/> {
        let queryObj = {
            selector: { blockNumber: blockNumber },
            fields: ['blockNumber', 'sequenceIds'],
        };
        return await this.db.find(queryObj);
    }

    public async rollback(blockNumber: number): Promise<void> {
        // Remove each change since blockNumber
        try {
            const blocksToRemove = await this.db.find({
                selector: { blockNumber: { $gte: blockNumber } },
                fields: ['blockNumber', '_id', '_rev'],
            });
            console.log("Blocks to remove from " + this.dbName);
            console.log(blocksToRemove);
            for (let doc of blocksToRemove.docs) {
                await this.db.remove(doc._id, doc._rev);
            }
        } catch (err) {
            console.log(err);
        }
    }
}
