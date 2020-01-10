import { DerivedDB } from './DerivedDB';
import { ParsedLog } from '@augurproject/types';
import { DB } from './DB';
import { Augur } from '../../Augur';
import { ZeroXOrders } from './ZeroXOrders'

/**
 * DB to store current order states
 */
export class CancelledOrdersDB extends DerivedDB {
  constructor(db: DB, networkId: number, augur: Augur) {
    super(db, networkId, 'CancelledOrders', ['Cancel'], augur);
  }

  protected processDoc(log: ParsedLog): ParsedLog {
    const { makerAssetData } = log;
    const assetData = ZeroXOrders.parseAssetData(makerAssetData);
    log['market'] = assetData.market;
    return log;
  }
}
