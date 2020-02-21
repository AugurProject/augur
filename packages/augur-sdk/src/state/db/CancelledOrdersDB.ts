import { DerivedDB } from './DerivedDB';
import { ParsedLog } from '@augurproject/types';
import { DB } from './DB';
import { Augur } from '../../Augur';
import { ZeroXOrders } from './ZeroXOrders';
import { CancelledOrderLog, CancelLog, Address } from '../logs/types';

export interface CancelLogWithMakerAssetData extends CancelLog {
  parsedMakerAssetData: {
    market: Address;
    price: string;
    outcome: string;
    orderType: string;
  }
}
/**
 * DB to store current order states
 */
export class CancelledOrdersDB extends DerivedDB {
  constructor(db: DB, networkId: number, augur: Augur) {
    super(db, networkId, 'CancelledOrders', ['Cancel'], augur);
  }

  async handleMergeEvent (
    blocknumber: number,
    logs: ParsedLog[],
    syncing = false
  ): Promise<number> {
    // Filter
    logs = logs.map(log => {
      try {
        return Object.assign({}, log, {parsedMakerAssetData: ZeroXOrders.parseAssetData(log.makerAssetData).orderData});
      } catch(e) {
        return null;
      }
    }).filter(log => !!log);
    return super.handleMergeEvent(blocknumber, logs, syncing);
  }

  protected processDoc(log: ParsedLog): ParsedLog {
    const cancelLog: CancelLogWithMakerAssetData = log as unknown as CancelLogWithMakerAssetData;
    const {
      parsedMakerAssetData,
      orderHash,
      senderAddress,
      makerAddress,
      feeRecipientAddress,
      blockNumber,
    } = cancelLog;
    const {
      market,
      price,
      outcome,
      orderType
    } = parsedMakerAssetData;

    const cancelledOrderLog: CancelledOrderLog = {
      orderHash,
      senderAddress,
      makerAddress,
      feeRecipientAddress,
      market,
      price,
      outcome,
      orderType,
      blockNumber,
    };
    return cancelledOrderLog as unknown as ParsedLog;
  }
}
