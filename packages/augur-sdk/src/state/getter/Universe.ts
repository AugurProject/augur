import { BigNumber } from 'bignumber.js';
import * as t from 'io-ts';
import { DB } from '../db/DB';
import { Getter } from './Router';
import {
  Address,
  DisputeWindowCreatedLog,
  MarketCreatedLog,
  TokenType,
  UniverseCreatedLog,
  UniverseForkedLog,
  MarketData
} from '../logs/types';
import {
  Augur,
  calculatePayoutNumeratorsValue,
  describeUniverseOutcome,
  GENESIS,
  marketTypeToName
} from '../../index';
import { NULL_ADDRESS } from './types';
import { ContractInterfaces } from '@augurproject/core';


export interface NonForkingMigrationTotals {}
export interface MigrationTotals {
  marketId: string;
  outcomes: MigrationOutcome[];
}

export interface MigrationOutcome {
  outcomeName: string;
  outcome: string; // non-scalar markets this is outcome id.
  amount: string; // atto-rep given to this outcome
  isMalformed: boolean;
  payoutNumerators: string[]; // not needed by UI, but 3rd parties might want it
  isInvalid: boolean; // for scalar markets
}

export interface UniverseDetails {
  id: string;
  parentUniverseId: string | null;
  creationTimestamp: number;
  outcomeName: string;
  usersRep: string;
  totalRepSupply: string;
  totalOpenInterest: string;
  numberOfMarkets: number;
  children: UniverseDetails[];
}

export class Universe {
  static getForkMigrationTotalsParams = t.type({
    universe: t.string,
  });
  static getUniverseChildrenParams = t.type({
    universe: t.string,
    account: t.string,
  });

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

    const marketId = universeForkedLog.forkingMarket;
    const forkingMarketLog = await getMarket(db, marketId);
    const children = await getUniverseChildrenCreationLogs(db, address);
    const outcomes = await getMigrationOutcomes(augur, forkingMarketLog, children);

    return {
      marketId,
      outcomes,
    };
  }

  @Getter('getUniverseChildrenParams')
  static async getUniverseChildren(
    augur: Augur,
    db: DB,
    params: t.TypeOf<typeof Universe.getUniverseChildrenParams>
  ): Promise<UniverseDetails|null> {
    const { universe, account } = params;

    const details = await getUniverseDetails(augur, db, universe, account);
    if (details === null) return null;

    const childrenUniverseCreatedLogs = await getUniverseChildrenCreationLogs(db, universe);
    details.children = await Promise.all(childrenUniverseCreatedLogs.map(async (child) => {
      return getUniverseDetails(augur, db, child.childUniverse, account);
    }));

    return details;
  }
}

async function getUniverseDetails(augur: Augur, db: DB, address: string, account: string): Promise<UniverseDetails> {
  const universe = await augur.contracts.universeFromAddress(address);
  const universeCreationLog = await getUniverseCreationLog(db, address);
  if (universeCreationLog === null) return null;

  const { parentUniverse } = universeCreationLog;

  let outcomeName: string;
  if (parentUniverse === NULL_ADDRESS) {
    outcomeName = GENESIS;
  } else {
    const universeForkedLog = await getUniverseForkedLog(db, universeCreationLog.parentUniverse);
    const forkingMarketLog = await getMarket(db, universeForkedLog.forkingMarket); // the market that created this universe
    outcomeName = getOutcomeNameFromLogs(universeCreationLog, forkingMarketLog);
  }

  const creationTimestamp = Number(universeCreationLog.creationTimestamp);
  const usersRep = (await getUserRep(db, universe, account)).toString();
  const totalRepSupply = (await getRepSupply(augur, universe)).toString();
  const totalOpenInterest = (await universe.getOpenInterestInAttoCash_()).toString();
  const numberOfMarkets = (await getMarketsForUniverse(db, address)).length;

  const children = []; // don't recurse

  return {
    id: address,
    parentUniverseId: parentUniverse,
    creationTimestamp,
    outcomeName,
    usersRep,
    totalRepSupply,
    totalOpenInterest,
    numberOfMarkets,
    children,
  };
}

function getOutcomeNameFromLogs(
  universeCreationLog: UniverseCreatedLog,
  forkingMarketLog: MarketData
): string {
  const outcome = calculateOutcomeFromLogs(universeCreationLog, forkingMarketLog);
  return describeUniverseOutcome(outcome, forkingMarketLog);
}

function calculateOutcomeFromLogs(
  universeCreationLog: UniverseCreatedLog,
  forkingMarketLog: MarketData
) {
  const { marketType, prices, numTicks } = forkingMarketLog;
  return calculatePayoutNumeratorsValue(
    prices[0],
    prices[1],
    numTicks,
    marketTypeToName(marketType),
    universeCreationLog.payoutNumerators.map((bn) => bn.toString())
  );
}

async function getMigrationOutcomes(
  augur: Augur,
  forkingMarket: MarketData,
  children: UniverseCreatedLog[]
): Promise<MigrationOutcome[]> {
  const marketTypeName = marketTypeToName(forkingMarket.marketType);
  const numTicks = Number(forkingMarket.numTicks).toString(10);
  const minPrice = Number(forkingMarket.prices[0]).toString(10);
  const maxPrice = Number(forkingMarket.prices[forkingMarket.prices.length - 1]).toString(10);

  return Promise.all(children.map(async (child): Promise<MigrationOutcome> => {
    const childUniverse = augur.contracts.universeFromAddress(child.childUniverse);
    const payoutNumerators = child.payoutNumerators.map((hex) => Number(hex).toString(10));
    const outcome = calculatePayoutNumeratorsValue(maxPrice, minPrice, numTicks, marketTypeName, payoutNumerators);

    return {
      outcomeName: describeUniverseOutcome(outcome, forkingMarket),
      outcome: outcome.outcome,
      isMalformed: outcome.malformed,
      isInvalid: outcome.invalid,
      amount: (await getRepSupply(augur, childUniverse)).toFixed(),
      payoutNumerators,
    };
  }));
}

async function getUserRep(db: DB, universe: ContractInterfaces.Universe, account: string): Promise<BigNumber> {
  const tokenChangedLogs = await db.TokenBalanceChanged.where('[universe+owner+tokenType]').equals([
    universe.address,
    account,
    TokenType.ReputationToken
  ]).toArray();
  if (tokenChangedLogs.length === 0) {
    return new BigNumber(0);
  } else {
    // There will only ever be at most one log for a given token and only one REP token per universe.
    return new BigNumber(tokenChangedLogs[0].balance);
  }
}

async function getRepSupply(augur: Augur, universe: ContractInterfaces.Universe): Promise<BigNumber> {
  const repTokenAddress = await universe.getReputationToken_();
  const repToken = augur.contracts.reputationTokenFromAddress(repTokenAddress, augur.networkId);
  return repToken.totalSupply_();
}

async function getMarket(db: DB, address: string): Promise<MarketData|null> {
  return await db.Markets.get(address);
}

async function getMarketsForUniverse(db: DB, address: string): Promise<MarketData[]> {
  return db.Markets.where("universe").equals(address).toArray();
}

async function getUniverseCreationLog(db: DB, address: string): Promise<UniverseCreatedLog|null> {
  const universeCreatedLogs = await db.UniverseCreated.where("childUniverse").equals(address).toArray();

  if (universeCreatedLogs.length === 0) {
    return null; // no such universe
  }

  return universeCreatedLogs[0];
}

async function getUniverseForkedLog(db: DB, address: string): Promise<UniverseForkedLog|null> {
  const universeForkedLogs = await db.UniverseForked.where("universe").equals(address).toArray();

  if (universeForkedLogs.length === 0) {
    return null; // universe doesn't exist or hasn't forked
  }

  return universeForkedLogs[0];
}

async function getUniverseChildrenCreationLogs(db: DB, address: string): Promise<UniverseCreatedLog[]> {
  return db.UniverseCreated.where("parentUniverse").equals(address).toArray();
}
