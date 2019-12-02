import { DerivedDB } from './DerivedDB';
import { ParsedLog } from '@augurproject/types';

/**
 * DB to store current order states
 */
export class CurrentOrdersDatabase extends DerivedDB {

  protected processDoc(log: ParsedLog): ParsedLog {
    if (log['addressData']) {
      log['kycToken'] = log['addressData'][0];
      log['orderCreator'] = log['addressData'][1];
      log['orderFiller'] = log['addressData'][2];
      delete log['addressData'];
    }
    if (log['uint256Data']) {
      log['price'] = log['uint256Data'][0];
      log['amount'] = log['uint256Data'][1];
      log['outcome'] = log['uint256Data'][2];
      log['tokenRefund'] = log['uint256Data'][3];
      log['sharesRefund'] = log['uint256Data'][4];
      log['fees'] = log['uint256Data'][5];
      log['amountFilled'] = log['uint256Data'][6];
      log['timestamp'] = log['uint256Data'][7];
      log['sharesEscrowed'] = log['uint256Data'][8];
      log['tokensEscrowed'] = log['uint256Data'][9];
      delete log['uint256Data'];
    }
    log['open'] = log['amount'] != '0x00' ? 1 : 0;
    return log;
  }
}
