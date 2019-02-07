import { AbstractDB } from './AbstractDB';
import * as _ from "lodash";

// Associates block numbers with event DB update_seqs
export class MetaDB<TBigNumber> extends AbstractDB {
    public async addBlock(blockNumber: number, document: Object) {
        await this.upsertDocument(blockNumber.toString(), document);
    }

    public getBlockInfo(blockNumber: number) {
        // TODO Add query by block number
    }
}
