import { AbstractSyncableDB } from './AbstractSyncableDB';
import { Log, Augur } from 'augur-api';
import { DB } from './DB';
import { BaseDocument } from './AbstractDB';

export class UserShareBalances<TBigNumber> extends AbstractSyncableDB<TBigNumber> {
    constructor(dbController: DB<TBigNumber>) {
        super(dbController, "UserShareBalances");
    }

    protected async getLogs(augur: Augur<TBigNumber>, startBlock: number, endBlock: number): Promise<Array<Log>> {
        return await augur.events.getMarketCreatedLogs(startBlock, endBlock);
    }

    protected processLog(log: Log): BaseDocument {
        return { _id: ""};
    }

    // Methods specific to updating the UserShareBalances DB and querying the UserShareBalances DB
}
