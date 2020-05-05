import * as _ from 'lodash';
import { Augur } from '../../Augur';
import Dexie from "dexie";
import { DB } from './DB';
import { AbstractTable, BaseDocument, ID } from './AbstractTable';
import { SyncStatus } from './SyncStatus';

export const STANDARD_PRIMARY_KEY = ["blockNumber", "logIndex"];

export const DELETE_KEY = "DELETION_KEY_MARKER";

const NUMBER_OF_BLOCKS_TO_KEEP = 10;

export class RollbackTable extends AbstractTable {

    protected augur: Augur;
    protected syncing: boolean;
    protected rollingBack: boolean;
    protected syncStatus: SyncStatus;
    protected isStandardRollback: boolean;
    protected rollbackTable: Dexie.Table<any, any>;

    protected constructor(networkId: number, augur: Augur, dbName: string, db: DB) {
        super(networkId, dbName, db.dexieDB);
        this.isStandardRollback = _.isEqual(this.idFields, STANDARD_PRIMARY_KEY);
        this.rollbackTable = db.dexieDB['Rollback'];
        this.syncing = false;
        this.syncStatus = db.syncStatus;
        this.augur = augur;
    }

    protected async bulkPutDocuments(documents: BaseDocument[], documentIds?: any[]): Promise<void> {
        if (!this.isStandardRollback && !this.syncing && documentIds) {
            const rollbackDocuments = [];
            const rollbackIds = [];
            let docIndex = 0;
            for (const document of documents) {
                const documentID = documentIds[docIndex];
                const rollbackID = [document.blockNumber, this.dbName, documentID];
                const curRollbackDoc = await this.rollbackTable.get(rollbackID);
                // If a previous doc exists for this blocknumber already we dont want to override it.
                if (!curRollbackDoc) {
                    let rollbackDocument = await this.table.get(documentID);
                    if (!rollbackDocument) rollbackDocument = { [DELETE_KEY]: true };
                    rollbackDocument['tableName'] = this.dbName;
                    rollbackDocument['rollbackBlockNumber'] = document.blockNumber;
                    rollbackDocument['primaryKey'] = documentID;
                    rollbackDocuments.push(rollbackDocument);
                    rollbackIds.push(rollbackID);
                }
                docIndex++;
            }
            await this.rollbackTable.bulkPut(rollbackDocuments, rollbackIds);

            const maxBlock =_.get(_.maxBy(documents, 'blockNumber'), 'blockNumber');
            await this.prune(maxBlock);
        }
        await super.bulkPutDocuments(documents);
    }

    async rollback(blockNumber: number): Promise<void> {
        // Remove each change from blockNumber onward
        this.rollingBack = true;
        if (this.isStandardRollback) {
            await this.standardRollback(blockNumber);
        } else {
            await this.rollupRollback(blockNumber);
        }
        await this.syncStatus.setHighestSyncBlock(this.dbName, --blockNumber, this.syncing);
        this.rollingBack = false;
    }

    async standardRollback(blockNumber: number): Promise<void> {
        const docsToRemove = await this.table.where("blockNumber").aboveOrEqual(blockNumber);
        const idsToRemove = await docsToRemove.primaryKeys();
        await this.table.bulkDelete(idsToRemove);
    }

    async rollupRollback(blockNumber: number): Promise<void> {
        const docsForReplacement = await this.rollbackTable.where('[tableName+rollbackBlockNumber]').between([
            this.dbName,
            blockNumber
        ],[
            this.dbName,
            Dexie.maxKey
        ],true,true).toArray();
        const docsToPut = [];
        const docsToDelete = [];
        const docsById = _.groupBy(docsForReplacement, "primaryKey");
        const lastDocs = _.map(docsById, (docs) => {
            return _.sortBy(docs, "rollbackBlockNumber")[0];
        });
        _.each(lastDocs, (doc) => {
            delete doc["tableName"];
            delete doc["rollbackBlockNumber"];
            if (doc[DELETE_KEY]) {
                delete doc[DELETE_KEY];
                docsToDelete.push(doc["primaryKey"]);
            } else {
                delete doc["primaryKey"];
                docsToPut.push(doc);
            }
        });
        await this.table.bulkPut(docsToPut);
        await this.table.bulkDelete(docsToDelete);
    }

    async prune(blockNumber: number) {
      if(!blockNumber) return;
      await this.rollbackTable.where('[tableName+rollbackBlockNumber]').between(
        [this.dbName, Dexie.minKey],
        [this.dbName, blockNumber - NUMBER_OF_BLOCKS_TO_KEEP]).delete();
    }
}
