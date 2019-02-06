import { AbstractDB, BaseDocument } from './AbstractDB';
import { Augur, Log, ParsedLog } from 'augur-api';
import { DB } from './DB';
import * as _ from "lodash";

export class MetaDB<TBigNumber> extends AbstractDB {
    public addBlock(blockNumber: number, document: Object) {
        this.upsertDocument(blockNumber.toString(), document);
    }

    public getBlockInfo(blockNumber: number) {
        // TODO Add query by block number
    }
}