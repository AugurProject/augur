import { DerivedDB } from './DerivedDB';
import { BaseDocument } from './AbstractDB';
import { Log } from '@augurproject/types';

/**
 * DB to store current order states
 */
export class CurrentOrdersDatabase extends DerivedDB {

    protected processDocument(doc: BaseDocument): BaseDocument {
        if (doc['addressData']) {
          doc['kycToken'] = doc['addressData'][0];
          doc['orderCreator'] = doc['addressData'][1];
          doc['orderFiller'] = doc['addressData'][2];
          delete doc['addressData'];
        }
        if (doc['uint256Data']) {
          doc['price'] = doc['uint256Data'][0];
          doc['amount'] = doc['uint256Data'][1];
          doc['outcome'] = doc['uint256Data'][2];
          doc['tokenRefund'] = doc['uint256Data'][3];
          doc['sharesRefund'] = doc['uint256Data'][4];
          doc['fees'] = doc['uint256Data'][5];
          doc['amountFilled'] = doc['uint256Data'][6];
          doc['timestamp'] = doc['uint256Data'][7];
          doc['sharesEscrowed'] = doc['uint256Data'][8];
          doc['tokensEscrowed'] = doc['uint256Data'][9];
          delete doc['uint256Data'];
        }
        return doc;
    }
}
