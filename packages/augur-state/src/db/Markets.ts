import { AbstractSyncableDB } from './AbstractSyncableDB';
import { Augur, MarketCreatedLog } from 'augur-api';
import { DB } from './DB';
import { BaseDocument } from './AbstractDB';

interface MarketDocument extends BaseDocument, MarketCreatedLog { }

export class Markets<TBigNumber> extends AbstractSyncableDB<TBigNumber> {
    constructor(dbController: DB<TBigNumber>) {
        super(dbController, "Markets");
    }

    protected async getLogs(augur: Augur<TBigNumber>, startBlock: number, endBlock: number): Promise<Array<MarketCreatedLog>> {
        return await augur.events.getMarketCreatedLogs(startBlock, endBlock);
    }

    protected processLog(log: MarketCreatedLog): MarketDocument {
        if (!log.blockNumber) throw new Error(`Corrupt log: ${JSON.stringify(log)}`);
        const _id = `${log.blockNumber.toPrecision(21)}${log.logIndex}`;
        return Object.assign(
            { _id },
            log
        );
    }

    public async getMarketsData(): Promise<void> {
        // TODO
    }
}
