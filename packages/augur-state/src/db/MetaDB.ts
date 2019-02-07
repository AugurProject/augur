import { AbstractDB, BaseDocument } from './AbstractDB';
import { Augur, Log, ParsedLog } from 'augur-api';
import { DB } from './DB';
import * as _ from "lodash";

// Links block numbers with event DB update_seqs
export class MetaDB<TBigNumber> extends AbstractDB {
    public async addBlock(blockNumber: number, document: Object) {
        await this.upsertDocument(blockNumber.toString(), document);
    }

    public getBlockInfo(blockNumber: number) {
        // TODO Add query by block number
    }
}
