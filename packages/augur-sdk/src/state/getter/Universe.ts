import { BigNumber } from 'bignumber.js';
import { SearchResults } from 'flexsearch';
import { DB } from '../db/DB';
import { Getter } from './Router';
import {
  Address,
  Timestamp,
  DisputeWindowCreatedLog,
} from '../logs/types';

import {
  Augur,
} from '../../index';

import * as t from 'io-ts';

export interface DisputeWindow {
  address: Address;
  startTime: Timestamp;
  endTime: Timestamp;
  purchased: BigNumber;
  fees: BigNumber;
}

export class Universe {
  static getDisputeWindowParams = t.type({
    universe: t.string,
  });

  @Getter('getDisputeWindow')
  static async getDisputeWindow(
    augur: Augur,
    db: DB,
    params: t.TypeOf<typeof Universe.getDisputeWindowParams>
  ): Promise<DisputeWindow|null> {
    const currentDisputeWindow = await getCurrentDisputeWindow(db, params.universe);
    if (currentDisputeWindow === null) return null;
    const { disputeWindow, startTime, endTime } = currentDisputeWindow;

    const account = await augur.getAccount();
    const { purchased, fees } = await getDisputeWindowTokenPurchasesAndFees(db, account, disputeWindow);

    return {
      address: disputeWindow,
      startTime,
      endTime,
      purchased,
      fees,
    };
  }
}

async function getCurrentDisputeWindow(db: DB, universe: string): Promise<DisputeWindowCreatedLog|null> {
  const now = new Date().getTime(); // ms
  const logs = await db.findDisputeWindowCreatedLogs({
    selector: {
      universe,
      $and: [
        { startTime: { $lt: now} },
        { endTime: { $gt: now} },
      ],
    },
  });

  if (logs.length === 0) {
    return null;
  } else if (logs.length === 1) {
    return logs[0];
  } else {
    throw Error(`Unexpected bad state: ${logs.length} simultaneous dispute windows.`);
  }
}

async function getDisputeWindowTokenPurchasesAndFees(db: DB, account: string, disputeWindow: string) {
  const participationTokenRedemptionLogs = await db.findParticipationTokensRedeemedLogs({
    selector: {
      account,
      disputeWindow,
    },
  });

  return participationTokenRedemptionLogs.reduce((accumulator, log) => {
    accumulator.purchased.plus(new BigNumber(log.attoParticipationTokens));
    accumulator.fees.plus(new BigNumber(log.feePayoutShare));
    return accumulator;
  }, { purchased: new BigNumber(0), fees: new BigNumber(0) });
}
