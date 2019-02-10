import { AbstractDB } from './AbstractDB';
import * as _ from "lodash";

// Associates block numbers with event DB sequence IDs
export class MetaDB<TBigNumber> extends AbstractDB {
    public async addNewBlock(dbName: string, document: Object) {
        await this.upsertDocument(dbName, document);
    }

    // TODO Replace any
    public async getBlockSequenceIds(blockNumber: number): Promise<any/*PouchDB.Find.FindResponse<{}>*/> {
        return await this.db.find({
            selector: { blockNumber: { $gte: blockNumber } },
            fields: ['_id', 'blockNumber', 'sequenceId'],
        });
    }

    public async rollback(blockNumber: number): Promise<boolean> {
        // Remove each change since blockNumber
        const blocksToRemove = await this.db.find({
            selector: { blockNumber: { $gte: blockNumber } },
            fields: ['blockNumber', '_id', '_rev'],
        });
        console.log("Oldest block number to remove: ", blockNumber);
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
