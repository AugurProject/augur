import { BigNumber } from 'bignumber.js';
import * as t from 'io-ts';
import { DB } from '../db/DB';
import { Getter } from './Router';
import { Address, DisputeWindowCreatedLog} from '../logs/types';
import {
  Augur,
  calculatePayoutNumeratorsValue, getOutcomeDescriptionFromOutcome,
  MALFORMED_OUTCOME,
  marketTypeToName
} from '../../index';

export interface DisputeWindow {
  address: Address;
  startTime: number;
  endTime: number;
  purchased: string;
  fees: string;
}

export interface NonForkingMigrationTotals {}
export interface MigrationTotals {
  marketId: string;
  outcomes: Outcome[];
}

interface Outcome {
  outcomeName: string;
  outcome: string; // non-scalar markets this is outcome id.
  amount: string; // atto-rep given to this outcome
  isMalformed: boolean;
  payoutNumerators: string[]; // not needed by UI, but 3rd parties might want it
  isInvalid: boolean; // for scalar markets
}

export class Universe {
  static getDisputeWindowParams = t.type({});
  static getForkMigrationTotalsParams = t.type({
    universe: t.string,
  });

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
      startTime: Number(startTime),
      endTime: Number(endTime),
      purchased: purchased.toString(),
      fees: fees.toString(),
    };
  }

  @Getter('getForkMigrationTotalsParams')
  static async getForkMigrationTotals(
    augur: Augur,
    db: DB,
    params: t.TypeOf<typeof Universe.getForkMigrationTotalsParams>
  ): Promise<MigrationTotals | NonForkingMigrationTotals> {
    const universeForkedLogs = await db.findUniverseForkedLogs({
      selector: {
        universe: params.universe,
      },
    });

    if (universeForkedLogs.length === 0) {
      return {};
    }

    const universe = universeForkedLogs[0];

    const forkingMarket = (await db.findMarkets({
      selector: {
        market: universe.forkingMarket,
      },
    }))[0];
    const marketTypeName = marketTypeToName(forkingMarket.marketType);
    const numTicks = Number(forkingMarket.numTicks).toString(10);
    const minPrice = Number(forkingMarket.prices[0]).toString(10);
    const maxPrice = Number(forkingMarket.prices[forkingMarket.prices.length - 1]).toString(10);

    const repTokenAddress = await (await augur.contracts.universeFromAddress(params.universe)).getReputationToken_();
    const repToken = augur.contracts.reputationTokenFromAddress(repTokenAddress, augur.networkId);
    const amount = (await repToken.totalSupply_()).toString();

    const children = await db.findUniverseCreatedLogs({
      selector: {
        parentUniverse: params.universe,
      },
    });

    const outcomes: Outcome[] = await Promise.all(children.map(async (child): Promise<Outcome> => {
      const payoutNumerators = child.payoutNumerators.map((hex) => Number(hex).toString(10));

      const outcome = calculatePayoutNumeratorsValue(maxPrice, minPrice, numTicks, marketTypeName, payoutNumerators);
      const isMalformed = outcome === MALFORMED_OUTCOME;

      return {
        outcomeName: isMalformed ? MALFORMED_OUTCOME : getOutcomeDescriptionFromOutcome(Number(outcome), forkingMarket),
        outcome,
        amount,
        isMalformed,
        payoutNumerators,
        isInvalid: (!isMalformed) && Number(payoutNumerators[0]) > 0,
      };
    }));

    return {
      marketId: universe.forkingMarket,
      outcomes,
    };
  }
}

async function predictDisputeWindow(augur: Augur, db: DB, universe: string): Promise<DisputeWindow> {
  const initial = false;
  const disputeRoundDurationSeconds = (await augur.contracts.universe.getDisputeRoundDurationInSeconds_(initial)).toNumber();
  const currentTime = await augur.getTimestamp();
  const previousDisputeWindowTime = currentTime.minus(disputeRoundDurationSeconds);
  const previousDisputeWindow = await getDisputeWindow(db, universe, previousDisputeWindowTime.toNumber());

  if (previousDisputeWindow !== null) { // Derive window from previous window
    return {
      address: '',
      startTime: Number(previousDisputeWindow.startTime) + disputeRoundDurationSeconds,
      endTime: Number(previousDisputeWindow.endTime) + disputeRoundDurationSeconds,
      purchased: '0',
      fees: '0',
    };
  } else { // Use a default for the clients
    return {
      address: '',
      startTime: 0,
      endTime: 0,
      purchased: '0',
      fees: '0',
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
