import { AbstractSyncableDB } from './AbstractSyncableDB';
import { Augur, OrderCreatedLog } from 'augur-api';
import { DB } from './DB';
import { BaseDocument } from './AbstractDB';

interface OrderCreatedDocument extends BaseDocument, OrderCreatedLog { }

export class OrderCreated<TBigNumber> extends AbstractSyncableDB<TBigNumber> {
    constructor(dbController: DB<TBigNumber>) {
        super(dbController, "OrderCreated");
    }

    protected async getLogs(augur: Augur<TBigNumber>, startBlock: number, endBlock: number): Promise<Array<OrderCreatedLog>> {
        return await augur.events.getOrderCreatedLogs(startBlock, endBlock);
    }

    protected processLog(log: OrderCreatedLog): OrderCreatedDocument {
        if (!log.blockNumber) throw new Error(`Corrupt log: ${JSON.stringify(log)}`);
        const _id = `${log.blockNumber.toPrecision(21)}${log.logIndex}`;
        return Object.assign(
            { _id },
            log
        );
    }
}
