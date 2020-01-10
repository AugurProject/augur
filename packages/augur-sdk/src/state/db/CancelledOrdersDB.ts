import { DerivedDB } from './DerivedDB';
import { ParsedLog } from '@augurproject/types';
import { DB } from './DB';
import { Augur } from '../../Augur';
import { ZeroXOrders } from './ZeroXOrders';
import { CancelledOrderLog, CancelLog } from '../logs/types';

/**
 * DB to store current order states
 */
export class CancelledOrdersDB extends DerivedDB {
  constructor(db: DB, networkId: number, augur: Augur) {
    super(db, networkId, 'CancelledOrders', ['Cancel'], augur);
  }

  protected processDoc(log: ParsedLog): ParsedLog {
    const cancelLog: CancelLog = log as unknown as CancelLog;
    const {
      makerAssetData,
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
      orderType,
      kycToken
    } = ZeroXOrders.parseAssetData(makerAssetData);

    const cancelledOrderLog: CancelledOrderLog = {
      orderHash,
      senderAddress,
      makerAddress,
      feeRecipientAddress,
      market,
      price,
      outcome,
      orderType,
      kycToken,
      blockNumber,
    };
    return cancelledOrderLog as unknown as ParsedLog;
  }
}
