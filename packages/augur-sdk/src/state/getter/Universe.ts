import { BigNumber } from 'bignumber.js';
import * as t from 'io-ts';
import { DB } from '../db/DB';
import { Getter } from './Router';
import {
  Address,
  DisputeWindowCreatedLog, MarketCreatedLog,
  UniverseCreatedLog,
  UniverseForkedLog
} from '../logs/types';
import {
  Augur,
  calculatePayoutNumeratorsValue, GENESIS, getOutcomeDescriptionFromOutcome,
  MALFORMED_OUTCOME,
  marketTypeToName
} from '../../index';
import { NULL_ADDRESS } from './types';
import { ContractInterfaces } from '@augurproject/core';

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

interface UniverseDetails {
  address: string;
  creationTimestamp: number;
  outcomeName: string;
  totalRepSupply: string;
  totalOpenInterest: string;
  numberOfMarkets: number;
  children: UniverseDetails[];
}

export class Universe {
  static getDisputeWindowParams = t.type({});
  static getForkMigrationTotalsParams = t.type({
    universe: t.string,
  });
  static getUniverseChildrenParams = t.type({
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
    const address = params.universe;
    const universeForkedLog = await getUniverseForkedLog(db, address);
    if (universeForkedLog === null) {
      return {};
    }

    const forkingMarketLog = await getMarket(db, universeForkedLog.forkingMarket);
    const children = await getUniverseChildrenCreationLogs(db, address);
    const outcomes = await getOutcomes(augur, forkingMarketLog, children);

    return {
      marketId: universeForkedLog.forkingMarket,
      outcomes,
    };
  }

  @Getter('getUniverseChildrenParams')
  static async getUniverseChildren(
    augur: Augur,
    db: DB,
    params: t.TypeOf<typeof Universe.getUniverseChildrenParams>
  ): Promise<UniverseDetails|null> {
    const address = params.universe;

    const details = await getUniverseDetails(augur, db, address);
    if (details === null) return null;

    const childrenUniverseCreatedLogs = await getUniverseChildrenCreationLogs(db, address);
    details.children = await Promise.all(childrenUniverseCreatedLogs.map(async (child) => {
      return getUniverseDetails(augur, db, child.childUniverse);
    }));

    return details;
  }
}

async function getUniverseDetails(augur: Augur, db: DB, address: string): Promise<UniverseDetails> {
  const universe = await augur.contracts.universeFromAddress(address);
  const universeCreationLog = await getUniverseCreationLog(db, address);
  if (universeCreationLog === null) return null;

  let outcomeName: string;
  if (universeCreationLog.parentUniverse === NULL_ADDRESS) {
    outcomeName = GENESIS;
  } else {
    // TODO this is the forking log of this universe...
    // but we need its parent's forking info
    const universeForkedLog = await getUniverseForkedLog(db, address);
    const forkingMarketLog = await getMarket(db, universeForkedLog.forkingMarket); // the market that created this universe
    outcomeName = getOutcomeName(universeCreationLog, universeForkedLog, forkingMarketLog);
  }

  const creationTimestamp = Number(universeCreationLog.creationTimestamp);
  const totalRepSupply = (await getRepSupply(augur, universe)).toString();
  const totalOpenInterest = (await universe.getOpenInterestInAttoCash_()).toString();
  const numberOfMarkets = (await getMarketsForUniverse(db, address)).length;

  const children = []; // don't recurse

  return {
    address,
    creationTimestamp,
    outcomeName,
    totalRepSupply,
    totalOpenInterest,
    numberOfMarkets,
    children,
  };
}

function getOutcomeName(
  universeCreationLog: UniverseCreatedLog,
  universeForkedLog: UniverseForkedLog,
  forkingMarketLog: MarketCreatedLog
): string {
  const { marketType, prices, numTicks } = forkingMarketLog;
  const outcome = calculatePayoutNumeratorsValue(
    prices[0],
    prices[1],
    numTicks,
    marketTypeToName(marketType),
    universeCreationLog.payoutNumerators.map((bn) => bn.toString())
  );
  if (outcome === MALFORMED_OUTCOME) {
    return MALFORMED_OUTCOME;
  } else {
    return getOutcomeDescriptionFromOutcome(Number(outcome), forkingMarketLog);
  }
}

async function getOutcomes(
  augur: Augur,
  forkingMarket: MarketCreatedLog,
  children: UniverseCreatedLog[]
): Promise<Outcome[]> {
  const marketTypeName = marketTypeToName(forkingMarket.marketType);
  const numTicks = Number(forkingMarket.numTicks).toString(10);
  const minPrice = Number(forkingMarket.prices[0]).toString(10);
  const maxPrice = Number(forkingMarket.prices[forkingMarket.prices.length - 1]).toString(10);

  return Promise.all(children.map(async (child): Promise<Outcome> => {
    const payoutNumerators = child.payoutNumerators.map((hex) => Number(hex).toString(10));

    const outcome = calculatePayoutNumeratorsValue(maxPrice, minPrice, numTicks, marketTypeName, payoutNumerators);
    const isMalformed = outcome === MALFORMED_OUTCOME;

    const childUniverse = augur.contracts.universeFromAddress(child.childUniverse);
    const amount = (await getRepSupply(augur, childUniverse)).toString();

    return {
      outcomeName: isMalformed ? MALFORMED_OUTCOME : getOutcomeDescriptionFromOutcome(Number(outcome), forkingMarket),
      outcome,
      amount,
      isMalformed,
      payoutNumerators,
      isInvalid: (!isMalformed) && Number(payoutNumerators[0]) > 0,
    };
  }));
}

async function getRepSupply(augur: Augur, universe: ContractInterfaces.Universe): Promise<BigNumber> {
  const repTokenAddress = await universe.getReputationToken_();
  const repToken = augur.contracts.reputationTokenFromAddress(repTokenAddress, augur.networkId);
  return repToken.totalSupply_();
}

async function getMarket(db: DB, address: string): Promise<MarketCreatedLog|null> {
  const marketCreatedLogs = await db.findMarkets({
    selector: {
      market: address,
    },
  });

  if (marketCreatedLogs.length === 0) {
    return null; // no such market
  }

  return marketCreatedLogs[0];
}

async function getMarketsForUniverse(db: DB, address: string): Promise<MarketCreatedLog[]> {
  return db.findMarkets({
    selector: {
      universe: address,
    },
  });

}

async function getUniverseCreationLog(db: DB, address: string): Promise<UniverseCreatedLog|null> {
  const universeCreatedLogs = await db.findUniverseCreatedLogs({
    selector: {
      childUniverse: address,
    },
  });

  if (universeCreatedLogs.length === 0) {
    return null; // no such universe
  }

  return universeCreatedLogs[0];
}

async function getUniverseForkedLog(db: DB, address: string): Promise<UniverseForkedLog|null> {
  const universeForkedLogs = await db.findUniverseForkedLogs({
    selector: {
      universe: address,
    },
  });

  if (universeForkedLogs.length === 0) {
    return null; // universe doesn't exist or hasn't forked
  }

  return universeForkedLogs[0];
}

async function getUniverseChildrenCreationLogs(db: DB, address: string): Promise<UniverseCreatedLog[]> {
  return db.findUniverseCreatedLogs({
    selector: {
      parentUniverse: address,
    },
  });
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
