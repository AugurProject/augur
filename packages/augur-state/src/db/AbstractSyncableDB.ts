import { AbstractDB, BaseDocument } from './AbstractDB';
import { Augur, Log } from 'augur-api';
import { DB } from './DB';
import { SyncStatus } from './SyncStatus';
import * as _ from "lodash";

export abstract class AbstractSyncableDB<TBigNumber> extends AbstractDB {
    private syncStatus: SyncStatus;

    constructor(dbController: DB<TBigNumber>, dbName: string) {
        super(dbName);
        this.syncStatus = dbController.syncStatus;
        dbController.notifySyncableDBAdded(this);
    }

    public async sync(augur: Augur<TBigNumber>, chunkSize: number, blockStreamDelay: number): Promise<void> {
        let highestSyncedBlockNumber = await this.syncStatus.getHighestSyncBlock(this.dbName);
        const highestAvailableBlockNumber = await augur.provider.getBlockNumber();
        const goalBlock = highestAvailableBlockNumber - blockStreamDelay;
        while (highestSyncedBlockNumber < goalBlock) {
            console.log(`SYNCING ${this.dbName} up to ${highestSyncedBlockNumber}`);
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
                console.log(`SYNCING SUCCESS ${this.dbName} up to ${highestSyncedBlockNumber}`);
            }
        }
        // TODO start blockstream
      }
    
      protected abstract async getLogs(augur: Augur<TBigNumber>, startBlock: number, endBlock: number): Promise<Array<Log>>;

      protected abstract processLog(log: Log): BaseDocument;
}
