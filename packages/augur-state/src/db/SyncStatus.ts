import { AbstractDB } from './AbstractDB';

interface SyncDocument {
    blockNumber: number;
}

export class SyncStatus extends AbstractDB {
    constructor() {
        super("SyncStatus");
    }

    public async setHighestSyncBlock(dbName: string, blockNumber: number): Promise<PouchDB.Core.Response> {
        const document: SyncDocument = { blockNumber };
        return await this.upsertDocument(dbName, document);
    }

    public async getHighestSyncBlock(dbName: string, uploadBlockNumber: number): Promise<number> {
        const document = await this.getDocument<SyncDocument>(dbName);
        if (document) return document.blockNumber;
        return uploadBlockNumber;
    }
}
