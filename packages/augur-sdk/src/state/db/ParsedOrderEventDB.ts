import { ParsedLog } from '@augurproject/types/build';
import { Augur } from '../../Augur';
import { DB } from './DB';
import { SyncableDB } from './SyncableDB';
import _ from 'lodash';

export class ParsedOrderEventDB extends SyncableDB {
  constructor(db: DB, networkId: number, augur: Augur) {
    super(augur, db, networkId, 'OrderEvent', 'ParsedOrderEvents');
  }

  async addNewBlock(
    blocknumber: number,
    logs: ParsedLog[]
  ): Promise<number> {
    return super.addNewBlock(blocknumber, this.processOrderEvent(logs));
  }

  private processOrderEvent(originalLogs: ParsedLog[]) {
    // Copy the objects.
    const logs = _.cloneDeep(originalLogs);

    for (let i = 0; i < logs.length; i++) {
      logs[i].orderCreator = logs[i].addressData[0];
      logs[i].orderFiller = logs[i].addressData[1];

      logs[i].price = logs[i].uint256Data[0];
      logs[i].amount = logs[i].uint256Data[1];
      logs[i].outcome = logs[i].uint256Data[2];
      logs[i].tokenRefund = logs[i].uint256Data[3];
      logs[i].sharesRefund = logs[i].uint256Data[4];
      logs[i].fees = logs[i].uint256Data[5];
      logs[i].amountFilled = logs[i].uint256Data[6];
      logs[i].timestamp = logs[i].uint256Data[7];
      logs[i].sharesEscrowed = logs[i].uint256Data[8];
      logs[i].tokensEscrowed = logs[i].uint256Data[9];

      delete logs[i].addressData;
      delete logs[i].uint256Data;
    }

    return logs;
  }
}
