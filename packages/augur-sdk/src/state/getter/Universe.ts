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
  static getDisputeWindowParams = t.type({});

  @Getter('getDisputeWindowParams')
  static async getDisputeWindow(augur: Augur, db: DB): Promise<DisputeWindow> {
    const universe = augur.addresses.Universe;

    const currentDisputeWindow = await getCurrentDisputeWindow(augur, db, universe);
    if (currentDisputeWindow === null) {
      return predictDisputeWindow(augur, db, universe);
    }

    const { disputeWindow, startTime, endTime } = currentDisputeWindow;
    const purchased = await getParticipationTokens(augur, disputeWindow);
    const fees = await getFees(augur, disputeWindow);
    return {
      address: disputeWindow,
      startTime,
      endTime,
      purchased,
      fees,
    };
  }
}

async function predictDisputeWindow(augur: Augur, db: DB, universe: string): Promise<DisputeWindow> {
  // TODO predict better
  // 1. It's a 7-day period so use the previous dispute window as an anchor
  // 2. If there was no previous dispute window then maybe base off of augur deploy block time?
  //    If this works at all then it might be better than doing #1 since it will work as well and under more circumstances.
  //    Update: This doesn't look viable so I'm adding #3.
  // 3. Lie. There having never been a dispute window happens only once and only briefly.
  //    The user flow makes it unlikely someone will see the dispute page when there isn't a dispute window anyway
  //    since you typically report before disputing and reporting creates a dispute window. Furthermore, it
  //    creates the future dispute window so there should be a strong buffer.

  // Plan:
  // 1. Use the previous dispute window to calculate the upcoming dispute window.
  // 2. Lie.

  const initial = false;
  const disputeRoundDurationSeconds = await augur.contracts.universe.getDisputeRoundDurationInSeconds_(initial);
  const currentTime = await augur.getTimestamp();
  const previousDisputeWindowTime = currentTime.minus(disputeRoundDurationSeconds);
  const previousDisputeWindow = await getDisputeWindow(db, universe, previousDisputeWindowTime.toNumber());

  if (previousDisputeWindow !== null) { // Derive window from previous window
    return {
      address: '',
      startTime: previousDisputeWindow.startTime + disputeRoundDurationSeconds,
      endTime: previousDisputeWindow.endTime + disputeRoundDurationSeconds,
      purchased: new BigNumber(0),
      fees: new BigNumber(0),
    };
  } else { // Use a default for the clients
    return {
      address: '',
      startTime: '0',
      endTime: `0x${currentTime.toString(16)}`,
      purchased: new BigNumber(0),
      fees: new BigNumber(0),
    };
  }
}

async function getCurrentDisputeWindow(augur: Augur, db: DB, universe: string): Promise<DisputeWindowCreatedLog|null> {
  const now = (await augur.getTimestamp()).toNumber();
  return getDisputeWindow(db, universe, now);
}

async function getDisputeWindow(db: DB, universe: string, time: number): Promise<DisputeWindowCreatedLog|null> {
  const hexTime = `0x${new BigNumber(time).toString(16)}`;
  const logs = await db.findDisputeWindowCreatedLogs({
    selector: {
      universe,
      initial: false, // we only want standard (7-day) dispute windows for the getDisputeWindow getter
      $and: [
        // dispute window starts at startTime and ends before endTime
        { startTime: { $lte: hexTime} },
        { endTime: { $gt: hexTime} },
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

async function getParticipationTokens(augur: Augur, disputeWindow: Address): Promise<BigNumber> {
  const disputeWindowContract = augur.contracts.disputeWindowFromAddress(disputeWindow);
  return disputeWindowContract.totalSupply_();
}

async function getFees(augur: Augur, disputeWindow: Address): Promise<BigNumber> {
  return augur.contracts.cash.balanceOf_(disputeWindow);
}
